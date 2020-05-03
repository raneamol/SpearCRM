import React from 'react';
import '../styles/AccountProfileHeader.css';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { Tooltip } from '@material-ui/core';

export default class AccountProfileHeader extends React.Component {
  archiveTransactedOrders = async () => {
    if (this.props.furthestStage != 3) {return null;}
    const _id = this.props._id;
    const response = await fetch("/main/complete_orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(_id)
    });
    
    if (response.ok) {
      console.log("response worked!");
      console.log(response);
      this.props.updateAccountProfile();
    }
  }

  render() {
    let n = this.props.furthestStage;
    return(
      <>
        <span className="profile-name"> {this.props.name} </span>
        <span className="stage-indicator">
          <span className="negotiating" style={ n>=2 ? {backgroundColor:"green"} : n==1 ? {backgroundColor:"blue"} : {backgroundColor:"gray"}}>
            <span className="stage-name"> Negotiating </span>
          </span>  

          <span className="finalized" style={ n==3 ? {backgroundColor:"green"} : n===2 ? {backgroundColor:"blue"} : {backgroundColor:"gray"} }> 
            <span className="stage-name"> Finalized </span>
          </span>  

          <span className="transacted" style={ (n==3) ? {backgroundColor:"blue"} : {backgroundColor:"gray"} }>
            <span className="stage-name"> Transacted </span>
          </span>  

          <span style={{ verticalAlign: "middle" }}>
            <Tooltip title="Successful transaction">
              <CheckCircleIcon onClick={this.archiveTransactedOrders}/>
            </Tooltip> 
          </span>
        </span> 
      </>
    );
  }  
}
