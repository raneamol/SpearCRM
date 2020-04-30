import React from 'react'
import Board from 'react-trello/dist'

//draggable is false for all orders in lane Lane 4 - archived orders
//[{"_id": {"$oid": "5ea593ecd98710bdcd066182"}, "company": "Google", "no_of_shares": 40, "cost_of_share": 20, "stage": 0,
//"account_id": "5ea58fbc63e50fc607cf6a12", "trans_type": "sell"}]
const data = {
  lanes: [
    {
      id: 'lane1',
      title: 'Negotiating order',
      label: '2/2',
      cards: [
        {id: 'Card1', title: 'PharmaCo', description: 'MSFT', label: '$150000'},
        {id: 'Card4', title: 'PharmaCo', description: 'MSFT', label: '$150000'},
        {id: 'Card5', title: 'PharmaCo', description: 'MSFT', label: '$150000'},
        {id: 'Card2', title: 'BrowserStack', description: 'AMZN', label: '$10000'},
        {id: 'Card3', title: 'RBI', description: 'YesBank', label: '$1'},
      ]
    },
    {
      id: 'lane2',
      title: 'Finalized order',
      label: '0/0',
      cards: [
        {id: 'Card4', title: 'ZohoCRM', description: 'SalesForce', label: '$50000'},
        {id: 'Card5', title: 'Godrej', description: 'Timberlands', label: '$3000'},
      ]
    },
    {
      id: 'lane3',
      title: 'Transacted order',
      label: '0/0',
      cards: [
        {id: 'Card6', title: 'Indira Computers', description: 'Gaurav Textiles', label: '$4000'},
        {id: 'Card7', title: 'CompuSoft', description: 'WeWork', label: '$9000'},
      ]
    }
  ]
}
//var jsonStr = '{"theTeam":[{"teamId":"1","status":"pending"},{"teamId":"2","status":"member"},{"teamId":"3","status":"member"}]}'
//var obj = JSON.parse(jsonStr);
//obj['theTeam'].push({"teamId":"4","status":"pending"});
//jsonStr = JSON.stringify(obj);




const tempTest = () => {
  
}

const initialData = {
  lanes: [
    {
      id: '1',
      title: 'Negotiating order',
      label: '',
      cards: [
        {id: 'Card1', title: 'PharmaCo', description: 'MSFT', label: '$150000'},
        {id: 'Card4', title: 'PharmaCo', description: 'MSFT', label: '$150000'},
        {id: 'Card5', title: 'PharmaCo', description: 'MSFT', label: '$150000'},
        {id: 'Card2', title: 'BrowserStack', description: 'AMZN', label: '$10000'},
        {id: 'Card3', title: 'RBI', description: 'YesBank', label: '$1'},
      ]
    },
    {
      id: '2',
      title: 'Finalized order',
      label: '',
      cards: [
        {id: 'Card4', title: 'ZohoCRM', description: 'SalesForce', label: '$50000'},
        {id: 'Card5', title: 'Godrej', description: 'Timberlands', label: '$3000'},
      ]
    },
    {
      id: '3',
      title: 'Transacted order',
      label: '',
      cards: [
        {id: 'Card6', title: 'Indira Computers', description: 'Gaurav Textiles', label: '$4000'},
        {id: 'Card7', title: 'CompuSoft', description: 'WeWork', label: '$9000'},
      ]
    }
  ]
}


export default class Pipeline extends React.Component {
  state = {fetchedData:{}};
  componentDidMount = () => {
    fetch("/main/show_all_orders").then(response =>
      response.json().then(data => {
        data.forEach( (entry) => {
          entry["_id"] = entry["_id"]["$oid"];
        });
        this.setState({ fetchedData: data });
        console.log(data);
      })
    );
  }   



  render() {
    return <Board 
             data={data} 
             onDataChange = {() => this.state}
           />
  }
}
