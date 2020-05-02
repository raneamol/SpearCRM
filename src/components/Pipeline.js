import React from 'react'
import Board from 'react-trello/dist'

//draggable is false for all orders in lane Lane 4 - archived orders

export default class Pipeline extends React.Component {
  state = {
    fetchedOrders : [],
  };

  componentDidMount() {
    //API Call to get orders. Here repr. by sampleAPIData
    const sampleAPIData = [
      {"_id": {"$oid": "5ea593ecd98710bdcd066182"}, "account_name": "Jake Paul", "company": "Google", "no_of_shares": 40, "cost_of_share": 20, "stage": 1,
      "account_id": "5ea58fbc63e50fc607cf6a12", "trans_type": "sell"},
      {"_id": {"$oid": "5ea593f6d98710bdcd066183"}, 
      "company": "Google", "no_of_shares": 40, "account_name": "Jeff Paul", "cost_of_share": 20, "stage": 2, "account_id": "5ea58fbc63e50fc607cf6a12",
      "trans_type": "sell"},
    ];
    this.setState({ fetchedOrders: sampleAPIData });
  }

  updatePipelineAPICall() {
    //API Call to get orders. Here repr. by sampleAPIData
    const sampleAPIData = [
      {"_id": {"$oid": "5ea593ecd98710bdcd066182"}, "account_name": "Jake Paul", "company": "Google", "no_of_shares": 40, "cost_of_share": 20, "stage": 1,
      "account_id": "5ea58fbc63e50fc607cf6a12", "trans_type": "sell"},
      {"_id": {"$oid": "5ea593f6d98710bdcd066183"}, 
      "company": "Google", "no_of_shares": 40, "account_name": "Jeff Paul", "cost_of_share": 20, "stage": 2, "account_id": "5ea58fbc63e50fc607cf6a12",
      "trans_type": "sell"}
    ];
    this.setState({ fetchedOrders: sampleAPIData });
  }

  transformOrdersToBoardData = (orders) => {
    const board = {
      lanes: [
        {
          id: 1,
          title: 'Negotiating order',
          label: '1',
          cards: []
        },
        {
          id: 2,
          title: 'Finalized order',
          label: '2',
          cards: []
        },
        {
          id: 3,
          title: 'Transacted order',
          label: '3',
          cards: []
        },
        {
          id: 0,
          title: 'Archived order',
          label: '4',
          cards: []
        }
      ]
    };

    // formatting attributes to make a suitable input for Board component
    orders.forEach( (entry) => {
      entry.id = entry["_id"]["$oid"];
      entry.stage = entry["stage"];
      entry.title = entry["account_name"];
      if (entry.trans_type = "sell") {
        entry.description = `Sell: ${entry["company"]}`;
      }
      else {
        entry.description = `Buy: ${entry["company"]}`;
      }
      entry.label = `${entry.no_of_shares} X $${entry.cost_of_share}`;
    });

    // populating board with formatted orders
    orders.forEach( (entry) => {
      board.lanes[entry.stage-1].cards.push(entry);
    });

    return board;
  }

  updateCardStage = async (fromLaneId, toLaneId, cardId, index) => {
    const newCardStage = {
      "order_id" : cardId,
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
        if (data==="order deleted"){
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
        />
      </>
    );
  }
}