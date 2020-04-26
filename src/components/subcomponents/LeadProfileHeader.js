import React from 'react';
import '../styles/LeadProfileHeader.css';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { Tooltip } from '@material-ui/core';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import {Link} from 'react-router-dom';

export default class LeadProfileHeader extends React.Component {
  state = {
    open: false,
    submitted: false,
  }

  handleClickOpen = () => {
    if (this.props.leadStatus == "contacted") {
      this.setState({ open:true });
    }
  };

  handleClose = () => {
    this.setState({ open:false });
  };

  handleModalClose = () => {
    this.setState({ submitted:false });
  }

  redirectorModalInput = () => {
    this.setState({ open:false });
    this.setState({ submitted: true });
  };

  render() {
    return(
      <>
        <span className="profile-name"> John Brown </span>
        <span className="stage-indicator">
          <span 
           className="stage1" 
           onClick={this.props.onClick} 
           id="uncontacted"
           style={ this.props.leadStatus==="contacted" ? {backgroundColor:"forestgreen"} : {backgroundColor:"blue"} }
          >
            <span id="uncontacted" className="stage-name"> Uncontacted </span>
          </span>  

          <span 
           className="stage2" 
           onClick={this.props.onClick} 
           id="contacted"
           style={ this.props.leadStatus==="contacted" ? {backgroundColor:"blue"} : {backgroundColor:"gray"} }
          > 
            <span id="contacted" className="stage-name"> Contacted </span>
          </span>  

          <span style={{ verticalAlign: "middle" }}>
            <Tooltip title="Lead created account">
              <CheckCircleIcon onClick={this.handleClickOpen} />
            </Tooltip>
          </span>
        </span> 

        {/* Form dialog */}

        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Lead converts to Account holder</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="demat"
              label="Demat Account No."
              type="text"
              variant="outlined"
            />
          </DialogContent>
          <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.redirectorModalInput} color="primary">
            {/* TODO: Validate the input somehow */}
            Confirm
          </Button>
        </DialogActions>
        </Dialog>

        <Dialog
          open={this.state.submitted}
          onClose={this.handleModalClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title"> Redirect </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Proceed to new Account Profile or return to Leads page?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Link to={{pathname:'./leads'}}>
              <Button onClick={this.handleModalClose} color="primary">
                Return
              </Button>
            </Link>
            <Link to={{pathname:'./AccountProfile', state:{ uid:this.props.uid }}}>
              {/* TODO: Correct the logic to redirect with correct account id */}
              <Button onClick={this.handleModalClose} color="primary" autoFocus>
                Proceed
              </Button>
            </Link>
          </DialogActions>
        </Dialog>
      </>
    );
  }  
}