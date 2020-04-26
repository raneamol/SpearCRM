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

  render() {
    let n = 1;
    return(
      <>
        <span className="profile-name"> John Brown </span>
        <span className="stage-indicator">
          <span className="stage1" style={ n>=2 ? {backgroundColor:"green"} : n===1 ? {backgroundColor:"blue"} : {backgroundColor:"gray"} }>
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
              <CheckCircleIcon />
            </Tooltip> 
          </span>
        </span> 
      </>
    );
  }  
}
