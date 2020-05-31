import React from 'react';
import '../styles/AccountProfileHeader.css';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { Tooltip } from '@material-ui/core';
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default class AccountProfileHeader extends React.Component {
  state = {
    openDialog : false
    //determines whether success window is being displayed. 
    //Set to true when account does markToBeTransactedOrdersAsTransacted successfully
  };

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  markToBeTransactedOrdersAsTransacted = async () => {
    if (this.props.furthestStage != 3) {
      return null;
    }

    console.log("Completion triggered");
    const response = await fetch("/main/complete_account_orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({"account_id": this.props._id})
    });
    
    if (response.ok) {
      this.props.fetchAccountDataAndOrdersAndActivities();
      if(this._isMounted) {
        this.setState({ openDialog: true});
      }
    }
  }

  render() {
    let n = this.props.furthestStage;
    return(
      <>
        <span className="profile-name"> {this.props.name} </span>
        <span className="stage-indicator">
          <span className="received" style={ n>1 ? {backgroundColor:"green"} : n===1 ? {backgroundColor:"blue"} : {backgroundColor:"gray"}}>
            <span className="stage-name"> &nbsp; &nbsp; &nbsp; Received &nbsp; &nbsp; &nbsp; </span>
          </span>  

          <span className="finalized" style={ n>2 ? {backgroundColor:"green"} : n===2 ? {backgroundColor:"blue"} : {backgroundColor:"gray"} }> 
            <span className="stage-name"> &nbsp; &nbsp; Finalized &nbsp; &nbsp;  </span>
          </span>  

          <span className="to-be-transacted" style={ (n===3) ? {backgroundColor:"blue"} : {backgroundColor:"gray"} }>
            <span className="stage-name"> To-be-transacted </span>
          </span>  

          <span style={{ verticalAlign: "middle" }}>
            <Tooltip title="Successful transaction">
              <CheckCircleIcon 
                onClick={this.markToBeTransactedOrdersAsTransacted}
              />
            </Tooltip> 
          </span>
        </span> 

        <Dialog
          open={this.state.openDialog}
          onClose={ () => this.setState({openDialog: false}) }
        >
          <DialogTitle> Success </DialogTitle>
          <DialogContent>
            <DialogContentText>
              All to-be-transacted orders have been successfully marked transacted.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={ () => this.setState({openDialog: false}) } color="primary" autoFocus>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }  
}
