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
import Button from "@material-ui/core/Button";
import './styles/Pipeline.css';

export default class Pipeline extends React.Component {
  state = {
    fetchedOrders : [],
  };

  componentDidMount() {
    fetch("/main/show_all_orders").then(response =>
      response.json().then(data => {
        this.setState({ fetchedOrders: data });
        console.log(this.state.fetchedOrders);
      })
    );
  }

  componentDidUpdate() {
    console.log(this.state.fetchedOrders);
  }

  updatePipelineAPICall() {
    fetch("/main/show_all_orders").then(response =>
      response.json().then(data => {
        this.setState({ fetchedOrders: data });
      })
    );
  }

  transformOrdersToBoardData = (orders) => {
    const board = {
      lanes: [
        {
          id: 1,
          title: 'Order Initiated',
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
      entry.label = `${entry.no_of_shares} X $${entry.cost_of_share}`;
      entry.metadata = {account_id: entry.account_id}
    });

    board.lanes.forEach( (Lane) => {
      Lane.cards = orders.filter(entry => entry.stage === Lane.id);
    });

    return board;
  }

  updateCardStage = async (fromLaneId, toLaneId, cardId, index) => {
    //these are the only permissible drag-and-drop transitions
    if (   fromLaneId === 1 && toLaneId === 2
        || fromLaneId === 2 && toLaneId === 3
        || fromLaneId === 3 && toLaneId === 0){
      const newCardStage = {
        "_id" : cardId,
        "stage" : toLaneId
      };

      console.log(newCardStage);

      const response = await fetch("/main/order_stage_change", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newCardStage)
      });
      
      if (response.ok) {
        console.log("response worked!");
        console.log(response);
        this.updatePipelineAPICall();
      } 
    }
    else {
      this.forceUpdate();
      alert("This kind of drag-and-drop is not allowed.")
    }
  }

  deleteCard = (cardId, laneId) => {
    console.log(cardId);
    fetch(`main/delete_order/${cardId}`).then(response =>
      response.json().then(data => {
        // if (data==="Order Deleted"){
          this.updatePipelineAPICall();
        //}
      })
    );
  }

  linkToAccountProfile = (cardId, metadata, laneId) => {
    console.log(`metadata is ${metadata.account_id}`);
    this.props.history.push({
      pathname: "/accountprofile",
      state: {cid: metadata.account_id}
    });
  }

  markToBeTransactedOrdersAsTransacted = () => {
    fetch("/main/complete_all_orders").then(response =>
      response.json().then(data => {
        console.log(data);
        this.updatePipelineAPICall();
      })
    );
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
            onClick={ () => {this.markToBeTransactedOrdersAsTransacted()} }
            startIcon={<SendIcon />}
          >
            Mark Orders as transacted
          </Button>
        </div>
      </>
    );
  }
}