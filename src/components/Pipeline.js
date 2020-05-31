import React from 'react'
import Board from 'react-trello/dist'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  withRouter
} from "react-router-dom";
import PipelineNewOrderDialogBox from './subcomponents/PipelineNewOrderDialogBox.js';
import SendIcon from '@material-ui/icons/Send';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import Button from "@material-ui/core/Button";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import './styles/Pipeline.css';

export default class Pipeline extends React.Component {
  state = {
    fetchedOrders : [],
    openSpinner : false,
  };

  componentDidMount() {
    this._isMounted = true;

    fetch("/main/show_all_orders").then(response =>
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

  updatePipelineAPICall = () => {
    console.log("Update triggered");
    fetch("/main/show_all_orders").then(response =>
      response.json().then(data => {
        if (this._isMounted) {
          this.setState({ fetchedOrders: data });
        }
      })
    );
  }

  transformOrdersToBoardData = (orders) => {
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
          cards: []
        }
      ]
    };

    // formatting attributes to make a suitable input for Board component
    orders.forEach( (entry) => {
      entry.id = entry["_id"];
      entry.stage = entry["stage"];
      entry.title = entry["company"];
      if ( (entry.trans_type).toLowerCase() == "sell" ) {
        entry.description = `Sell stocks for ${entry.name}`;
      }
      else {
        entry.description = `Buy stocks for ${entry.name}`;
      }
      entry.label = `${entry.no_of_shares} X ${entry.cost_of_share}`;
      entry.metadata = {account_id: entry.account_id}
    });

    board.lanes.forEach( (Lane) => {
      Lane.cards = orders.filter(entry => entry.stage === Lane.id);
    });

    return board;
  }

  updateCardStage = async (fromLaneId, toLaneId, cardId, index) => {
    //these are the only permissible drag-and-drop transitions
    if (fromLaneId === toLaneId){
      return null;
    }
    else if(     fromLaneId === 1 && toLaneId === 2
              || fromLaneId === 2 && toLaneId === 3
              || fromLaneId === 3 && toLaneId === 0){
      const newCardStage = {
        "_id" : cardId,
        "stage" : toLaneId
      };

      const response = await fetch("/main/order_stage_change", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newCardStage)
      });
      
      if (response.ok) {
        this.updatePipelineAPICall();
      } 
      else if(response.ok === false && this._isMounted) {
        this.forceUpdate();
        alert("Server error encountered");
      }
    }
    else if(this._isMounted) {
      this.forceUpdate();
      alert("This kind of drag-and-drop is not allowed.")
    }
  }

  deleteCard = (cardId, laneId) => {
    fetch(`main/delete_order/${cardId}`).then( () => {this.updatePipelineAPICall()} );
  }

  linkToAccountProfile = (cardId, metadata, laneId) => {
    this.props.history.push({
      pathname: "/accountprofile",
      state: {cid: metadata.account_id}
    });
  }

  markToBeTransactedOrdersAsTransacted = () => {
    this.setState({ openSpinner: true});
    fetch("/main/complete_all_orders")
    .then( () => {
      if(this._isMounted) {
        this.setState({ openSpinner: false});
      }
      this.updatePipelineAPICall();     
    });
  }

  //compares price constraint of order in finalized stage against actual current stock price
  //may move an order to to-be-transacted stage accordingly
  priceCheckFinalizedOrders = () => {
    this.setState({ openSpinner: true});
    fetch("/main/convert_finalized_orders")
    .then( () => {
      if(this._isMounted) {
        this.setState({ openSpinner: false});
      }
      this.updatePipelineAPICall(); 
    });  
  }
  
  render() {
    return(
      <>
        <Board
          data={this.transformOrdersToBoardData(this.state.fetchedOrders)}
          onCardDelete={this.deleteCard}
          onCardMoveAcrossLanes={this.updateCardStage}
          onCardClick={this.linkToAccountProfile}
          collapsibleLanes
        />
        
        <div className="add-order-button"> 
          <PipelineNewOrderDialogBox updatePipeline={this.updatePipelineAPICall} /> 
        </div>

        <div className="complete-orders-button">
          <Button
            variant="contained"
            color="primary"
            onClick={this.markToBeTransactedOrdersAsTransacted}
            startIcon={<SendIcon />}
          >
            Mark Orders as transacted
          </Button>
        </div>

        <div className="pricecheck-orders-button">
          <Button
            variant="contained"
            color="primary"
            onClick={this.priceCheckFinalizedOrders}
            startIcon={<ShowChartIcon />}
          >
            Check share price & update
          </Button>

          <Backdrop className="spinner-backdrop" open={this.state.openSpinner}>
            <CircularProgress color="inherit" />
          </Backdrop>
        </div>


      </>
    );
  }
}