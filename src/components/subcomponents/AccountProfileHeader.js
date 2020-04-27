import React from 'react';
import '../styles/AccountProfileHeader.css';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { Tooltip } from '@material-ui/core';

export default class AccountProfileHeader extends React.Component {
  onTickClick() {
    //if (n==3)
    //turn all 3 into green background
    //wait for 2-3 seconds
    //set n==0 in the backend, turning the background for all 3 into white
    return null;
  }

  archiveTransactedOrders = async () => {
    const usr_id = this.props.usr_id_json;
    const response = await fetch("/main/complete_orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(usr_id)
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
          <span className="stage1" style={ (n>=2 && n!= 4) ? {backgroundColor:"green"} : n===1 ? {backgroundColor:"blue"} : {backgroundColor:"gray"} }>
            <span className="stage-name"> Negotiating </span>
          </span>  

          <span className="stage2" style={ n===3 ? {backgroundColor:"green"} : n===2 ? {backgroundColor:"blue"} : {backgroundColor:"gray"} }> 
            <span className="stage-name"> Finalized </span>
          </span>  

          <span className="stage3" style={ n===3 ? {backgroundColor:"blue"} : {backgroundColor:"gray"} }>
            <span className="stage-name"> Transacted </span>
          </span>  

          <span style={{ verticalAlign: "middle" }}>
            <Tooltip title="Successful transaction">
              <CheckCircleIcon  onClick={this.archiveTransactedOrders}/>
            </Tooltip> 
          </span>
        </span> 
      </>
    );
  }  
}
