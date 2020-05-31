import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import AddIcon from '@material-ui/icons/Add';

import '../styles/NewOrderDialogBox.css'


export default class PipelineNewOrderDialogBox extends React.Component{
  state = {
    open: false,
    company: "",
    trans_type: "",
    no_of_shares: 0,
    cost_of_share: 0,
    selectOptions : [], //value is only set on first load
    account_id : 0,
  };

  componentDidMount() {
    this._isMounted = true;

    fetch("/main/get_all_account_names").then(response =>
      response.json().then(data => {
        let menuItems = [<MenuItem value="" key={0}> <em>None</em> </MenuItem>] ;
        data.forEach( (entry, i) => {
          menuItems.push(<MenuItem value={entry._id} key={i+1}> {entry.name} </MenuItem>);
        //existing None MenuItem has key=0, these entries have key=i+1
        });
        
        if (this._isMounted) {
          this.setState({ selectOptions: menuItems });
        }
      })
    );
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleOpen = () => {
    this.setState({ open:true });
  };

  handleClose = () => {
    this.setState({ open:false });
  };

  handleChange = (event) => {
    this.setState({
      [event.target.id || event.target.name] : event.target.value
      //takes the first truthy value
      //textField inputs generate synthetic event and use event.target.id
      //dropdown inputs generate normal event and use event.target.name
    });
  }

  postNewOrder = async () => {
    const newOrder = this.state;
    newOrder.stage = 2;
    newOrder.no_of_shares = parseInt(this.state.no_of_shares);
    delete newOrder.open;
    delete newOrder.selectOptions;
    const response = await fetch("/main/create_order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newOrder)
    });
    
    if (response.ok && this._isMounted) {
      this.setState({ open:false });
      this.props.updatePipeline();
    }
  }
  
  render() {
    return (
      <>
        <span>
          <Button 
            className="add-new-order-button" 
            variant="contained" 
            color="primary" 
            onClick={this.handleOpen}
            startIcon={<AddIcon />}
          >
            Add New Order
          </Button>
        </span>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Add New Order</DialogTitle>
          <DialogContent>


            <FormControl variant="outlined" fullWidth>
              <InputLabel>Account</InputLabel>
              <Select
                value={this.state.account_id}
                onChange={this.handleChange}
                label="Account"
                name="account_id"
              >
                {this.state.selectOptions}
              </Select>
            </FormControl>

            <FormControl variant="outlined" fullWidth>
              <InputLabel>Transaction Type</InputLabel>
              <Select
                value={this.state.trans_type}
                onChange={this.handleChange}
                label="Transaction Type"
                name="trans_type"
              >
                <MenuItem value=""> <em>None</em> </MenuItem>
                <MenuItem value={"buy"}>Buy</MenuItem>
                <MenuItem value={"sell"}>Sell</MenuItem>
              </Select>
            </FormControl>

            <TextField
              autoFocus
              margin="dense"
              id="company"
              label="Company"
              type="text"
              fullWidth
              onChange={this.handleChange}
              helperText="Enter valid security ID or symbol of the company."
            />

            <TextField
              autoFocus
              margin="dense"
              id="no_of_shares"
              label="No. of shares"
              type="number"
              fullWidth
              onChange={this.handleChange}
            />

            <TextField
              autoFocus
              margin="dense"
              id="cost_of_share"
              label="Cost of one share"
              helperText="Leave this empty if you wish to transact regardless of the stock price."
              type="text"
              fullWidth
              onChange={this.handleChange}
            />

          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.postNewOrder} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}