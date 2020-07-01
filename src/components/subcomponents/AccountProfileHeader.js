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
import AuthContext from '../Other/AuthContext.js';

const API = process.env.REACT_APP_API;
export default class AccountProfileHeader extends React.Component {
  state = {
    openDialog : false
    //determines whether success window is being displayed. 
    //Set to true when account does markToBeTransactedOrdersAsTransacted successfully
  };

  static contextType = AuthContext;
  
  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  markToBeTransactedOrdersAsTransacted = async () => {
    if (this.props.furthestStage !== 3) {
      return null;
    }

    this.props.updateSpinner(true);

    let postContents = {"account_id": this.props._id, "company": this.props.cache};
    
    fetch(`${API}/main/complete_account_orders`, {
      method: "POST",
      withCredentials: true,
      headers: {'Authorization' : 'Bearer ' + this.context, 'Content-Type': 'application/json'},
      body: JSON.stringify(postContents)
    })
    .then( response => {
      if (response.ok) {
        response.text().then( data => {
          let str1 = "No companies to be transacted";
          let str2 = "Send correct company";

          if(data === str1) {
            throw new Error("No companies to be transacted");
          }
          else if (data === str2) {
            throw new Error("Send correct company");
          }
          else {
            fetch(`${API}/main/send_email_after_transaction`, {
              method: "POST",
              withCredentials: true,
              headers: {'Authorization' : 'Bearer ' + this.context, 'Content-Type': 'application/json'},
              body: data
            })
            .then(() => 
              this.props.updateAccountDataAndOrdersAndActivities()
            )
            .then(() => {
              if(this._isMounted) { this.setState({ openDialog: true}) }
            });
          }
        })
      }
      else {
        throw new Error("Something went wrong");
      }
    })
    .catch( error => console.log(error))
    .then( () => {if (this._isMounted) {this.props.updateSpinner(false)}});
  }

  render() {
    let n = this.props.furthestStage;
    return(
      <>
        <span className="profile-name"> {this.props.name} </span>
        <span className="stage-indicator">
          <span className="received" style={ n>1 ? {backgroundColor:"#4caf50"} : n===1 ? {backgroundColor:"#1976d2"} : {backgroundColor:"gray"}}>
            <span className="stage-name"> &nbsp; &nbsp; &nbsp; Received &nbsp; &nbsp; &nbsp; </span>
          </span>  

          <span className="finalized" style={ n>2 ? {backgroundColor:"#4caf50"} : n===2 ? {backgroundColor:"#1976d2"} : {backgroundColor:"gray"} }> 
            <span className="stage-name"> &nbsp; &nbsp; Finalized &nbsp; &nbsp;  </span>
          </span>  

          <span className="to-be-transacted" style={ (n===3) ? {backgroundColor:"#4caf50"} : {backgroundColor:"gray"} }>
            <span className="stage-name"> To-be-transacted </span>
          </span>  

          <span style={{ verticalAlign: "middle", cursor: "pointer" }}>
            <Tooltip title="Mark To-be-transacted orders as Transacted" arrow>
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
