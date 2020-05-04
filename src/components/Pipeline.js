import React from 'react'
import Board from 'react-trello/dist'

//draggable is false for all orders in lane Lane 4 - archived orders

export default class Pipeline extends React.Component {
  state = {
    fetchedOrders : [],
  };

  componentDidMount() {
    fetch("/main/show_all_orders").then(response =>
      response.json().then(data => {
        this.setState({ fetchedOrders: data });
      })
    );
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
          title: 'Negotiating order',
          label: '',
          cards: []
        },
        {
          id: 2,
          title: 'Finalized order',
          label: '',
          cards: []
        },
        {
          id: 3,
          title: 'Transacted order',
          label: '',
          cards: []
        },
        {
          id: 0,
          title: 'Archived order',
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
      //TODO: Add account name
      if (entry.trans_type = "Sell") {
        entry.description = `Sell account's stocks`;
      }
      else {
        entry.description = `Buy stocks for account`;
      }
      entry.label = `${entry.no_of_shares} X $${entry.cost_of_share}`;
    });

    // populating board with formatted orders
      //old way below can still be edited, hardcoded in for better performance
      //board.lanes[entry.stage].cards.push(entry);

    board.lanes.forEach( (Lane) => {
      Lane.cards = orders.filter(entry => entry.stage === Lane.id);
    });

    return board;
  }

  updateCardStage = async (fromLaneId, toLaneId, cardId, index) => {
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

  deleteCard = async (cardId, laneId) => {
    console.log(cardId);
    fetch(`main/delete_order/${cardId}`).then(response =>
      response.json().then(data => {
        if (data==="Order Deleted"){
          this.updatePipelineAPICall();
        }
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
          collapsibleLanes
        />
      </>
    );
  }
}