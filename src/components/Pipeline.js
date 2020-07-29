/* This software is called SpearCRM and it is a customer relationship management software for stockbrokers.
Copyright (C) 2020  Amol Rane, Vedant Pimpley.
This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */
import React from 'react'
import Board from 'react-trello/dist'
import PipelineNewOrderDialogBox from './subcomponents/PipelineNewOrderDialogBox.js';
import SendIcon from '@material-ui/icons/Send';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import Button from "@material-ui/core/Button";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import AuthContext from './Other/AuthContext.js';
import { prepareGETOptions } from './Other/helper.js';
import './styles/Pipeline.css';

const API = process.env.REACT_APP_API;
export default class Pipeline extends React.Component {
  state = {
    fetchedOrders : [],
    openSpinner : false,
  };

  static contextType = AuthContext;

  componentDidMount() {
    this._isMounted = true;
    
    fetch(`${API}/main/show_all_orders`, prepareGETOptions(this.context))
    .then(response =>
      response.json().then(data => {
        if (this._isMounted) {
          this.setState({ fetchedOrders: data });
        }
      })
    );
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  updatePipelineAPICall = async () => {
    fetch(`${API}/main/show_all_orders`, prepareGETOptions(this.context))
    .then(response =>
      response.json().then(data => {
        if (this._isMounted) {
          this.setState({ fetchedOrders: data });
        }
      })
    );
  }

  updateSpinnerInPipeline = (bool) => {
    //we introduce delay when turning off spinner, but not when turning it on
    if (bool) {
      this.setState({ openSpinner: bool });
    } else {
      setTimeout(() => {
        if (this._isMounted) {
          this.setState({ openSpinner: bool });
        }
      }, 1000)
    }
  }

  //prepares the input for Board component
  //AND passes possibly new (uncached) company names to App.js
  transformOrdersToBoardData = () => {
    let orders = this.state.fetchedOrders;

    const board = {
      lanes: [
        {
          id: 1,
          title: 'Order Received',
          label: '',
          cards: []
        },
        {
          id: 2,
          title: 'Order Finalized',
          label: '',
          cards: []
        },
        {
          id: 3,
          title: 'Order To-be-transacted',
          label: '',
          cards: []
        },
        {
          id: 0,
          title: 'Order Transacted',
          label: '',
          style: { backgroundColor: '#81c784' },
          cards: []
        }
      ]
    };

    // formatting attributes to make a suitable input for Board component
    orders.forEach( (entry) => {
      entry.id = entry["_id"];
      entry.title = entry["company"];
      if ( (entry.trans_type).toLowerCase() === "sell" ) {
        entry.description = `Sell stocks for ${entry.name}`;
      }
      else {
        entry.description = `Buy stocks for ${entry.name}`;
      }
      
      if (entry.stage === 0) {
        entry.label = `${entry.no_of_shares} X Rs. ${entry.cost_of_share}`;
      }
      else {
        entry.label = `${entry.no_of_shares} X ${entry.cost_of_share}`;
      }
      entry.metadata = {account_id: entry.account_id}
    });

    board.lanes.forEach( (Lane) => {
      Lane.cards = orders.filter(entry => entry.stage === Lane.id);
    });

    
    let laneOneAndTwoCompanies = [];
    for (let i = 0; i < board.lanes.length; i++) {
      let Lane = board.lanes[i];
      Lane.cards = orders.filter(entry => entry.stage === Lane.id);

      //obtain names of companies in lane one and two.
      if (Lane.id === 1 || 2) {
        Lane.cards.forEach( card => {
          laneOneAndTwoCompanies.push(card.company);
        })
      }
    }

    //send company names to App.js, to cache their stockprice
    //only lanes one and two can have new orders
    this.props.receiveCompanyNamesDuringRuntime(laneOneAndTwoCompanies);

    return board;
  }

  updateCardStage = async (fromLaneId, toLaneId, cardId, index) => {
    if (fromLaneId === toLaneId){
      return null;
    }

    else if(     
      //these are the only permissible drag-and-drop transitions
         (fromLaneId === 1 && toLaneId === 2)
      || (fromLaneId === 2 && toLaneId === 3)
      || (fromLaneId === 3 && toLaneId === 0)
    ){

      this.updateSpinnerInPipeline(true);

      const newCardStage = {
        "_id" : cardId,
        "stage" : toLaneId,
        "company" : this.props.cache,
      };

      // third attribute company (actually means price)
      fetch(`${API}/main/order_stage_change`, {
        method: "POST",
        withCredentials: true,
        headers: {'Authorization' : 'Bearer ' + this.context, 'Content-Type': 'application/json'},
        body: JSON.stringify(newCardStage)
      })
      .then(response => {
        if (response.ok) {
          this.updatePipelineAPICall();
        }
        else if(response.ok === false && this._isMounted) {
          this.forceUpdate();
          throw new Error("Server error encountered");
        }
        else {
          throw new Error("Something went wrong");
        }
      })
      .catch( error => console.log(error) )
      .then( () => {if(this._isMounted) {this.updateSpinnerInPipeline(false)}})
    }
    
    else if(this._isMounted) {
      this.forceUpdate();
      alert("This kind of drag-and-drop is not allowed.")
    }
  }

  deleteCard = (cardId, laneId) => {
    if (laneId === 0) {
      this.forceUpdate();
      alert("Transacted orders cannot be deleted.");
    }
    else {
      this.updateSpinnerInPipeline(true);
      fetch(`${API}/main/delete_order/${cardId}`, prepareGETOptions(this.context))
      .then( () => this.updatePipelineAPICall() )
      .then( () => {
        if(this._isMounted) {
          this.updateSpinnerInPipeline(false)
        }
      });
    }
  }

  linkToAccountProfile = (cardId, metadata, laneId) => {
    this.props.history.push({
      pathname: "/accountprofile",
      state: {cid: metadata.account_id}
    });
  }

  markToBeTransactedOrdersAsTransacted = async () => {
    this.updateSpinnerInPipeline(true);

    let companyPrices = {company: this.props.cache};

    //POST the prices along with the request. The backend will use the stockprice data
    fetch(`${API}/main/complete_all_orders`, {
      method: "POST",
      withCredentials: true,
      headers: {'Authorization' : 'Bearer ' + this.context, 'Content-Type': 'application/json'},
      body: JSON.stringify(companyPrices)
    })
    .then( response => {
      if(response.ok) {
        response.text().then( data => {

          let str1 = "No companies to be transacted";
          let str2 = "Send correct company";

          if(data === str1) {
            throw new Error('No companies to be transacted');
          }
          else if (data === str2) {
            throw new Error('Send correct company');
          }
          else {
            fetch(`${API}/main/send_email_after_transaction`, {
              method: "POST",
              withCredentials: true,
              headers: {'Authorization' : 'Bearer ' + this.context, 'Content-Type': 'application/json'},
              body: data
            })
            .then(() => this.updatePipelineAPICall())
          }
        })
      }
      else {
        throw new Error('Something went wrong');
      }
    })
    .catch( error => console.log(error))
    .then( () => {if (this._isMounted) {this.updateSpinnerInPipeline(false)}})
  }

  //POSTs the stock prices of all companies to backend
  //backend then sees if the prices meet the conditions specified in the order price
  //if yes, it moves order from finalized to to-be-transacted
  //if no, it does not
  //if a to-be-transacted order NO LONGER meets the criteria, backend DOES NOT move it back to finalized
  convertEligibleFinalizedOrders = async () => {
    this.updateSpinnerInPipeline(true);

    let companyPrices = {company: this.props.cache};
    fetch(`${API}/main/convert_finalized_orders`, {
      method: "POST",
      withCredentials: true,
      headers: {'Authorization' : 'Bearer ' + this.context, 'Content-Type': 'application/json'},
      body: JSON.stringify(companyPrices)
    })
    .then(response => {
      if(response.ok) {
        this.updatePipelineAPICall();
      }
      else {
        throw new Error("Something went wrong");
      }
    })
    .catch( error => console.log(error))
    .then( () => { if(this._isMounted) {this.updateSpinnerInPipeline(false)} });
  }

  render() {
    return(
      <>
        <Board
          data={this.transformOrdersToBoardData()}
          onCardDelete={this.deleteCard}
          onCardMoveAcrossLanes={this.updateCardStage}
          onCardClick={this.linkToAccountProfile}
          collapsibleLanes
        />
        
        <div className="add-order-button"> 
          <PipelineNewOrderDialogBox 
            updatePipeline={this.updatePipelineAPICall} 
            updateSpinner = {this.updateSpinnerInPipeline}
          /> 
        </div>

        <div className="complete-orders-button">
          <Button
            variant="contained"
            color="primary"
            onClick={this.markToBeTransactedOrdersAsTransacted}
            startIcon={<SendIcon />}
            fullWidth
          >
            Mark Orders as transacted
          </Button>
        </div>

        <div className="pricecheck-orders-button">
          <Button
            variant="contained"
            color="primary"
            onClick={this.convertEligibleFinalizedOrders}
            startIcon={<ShowChartIcon />}
            fullWidth
          >
            Check share price & update
          </Button>
        </div>

        <Backdrop className="spinner-backdrop" open={this.state.openSpinner}>
          <CircularProgress color="primary" />
        </Backdrop>
      </>
    );
  }
}