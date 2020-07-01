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
import '../styles/NewOrderDialogBox.css'
import AuthContext from '../Other/AuthContext.js';

const API = process.env.REACT_APP_API;
export default class NewOrderDialogBox extends React.Component{
  state = {
    open: false,
    company: "",
    trans_type: "",
    no_of_shares: 0,
    cost_of_share: "",
  };

  static contextType = AuthContext;

  componentDidMount() {
    this._isMounted = true;
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
    newOrder.account_id = this.props.account_id;
    newOrder.no_of_shares = parseInt(this.state.no_of_shares);
    delete newOrder.open;

    fetch(`${API}/main/create_order`, {
      method: "POST",
      withCredentials: true,
      headers: {'Authorization' : 'Bearer ' + this.context, 'Content-Type': 'application/json'},
      body: JSON.stringify(newOrder)
    })
    .then(response => {
      if (response.ok) {
        if (this._isMounted) { this.setState({ open:false }) }
        this.props.updateAccountDataAndOrders();
      }
    })
    .catch( error => console.log(error));
  }
  
  render() {
    return (
      <>
        <span>
          <Button className="add-new-order-button" variant="outlined" color="primary" onClick={this.handleOpen}>
            + Add New Order
          </Button>
        </span>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Add New Order</DialogTitle>
          <DialogContent>

            <TextField
              autoFocus
              margin="dense"
              id="company"
              label="Company"
              type="text"
              fullWidth
              onChange={this.handleChange}
              variant="outlined"
              helperText="Enter valid security ID or symbol of the company."
            />

            <FormControl 
              variant="outlined" 
              style= {{ marginTop: 5}}
              fullWidth
            >
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
              id="no_of_shares"
              label="No. of shares"
              type="number"
              fullWidth
              onChange={this.handleChange}
              variant="outlined"
            />

            <TextField
              autoFocus
              margin="dense"
              id="cost_of_share"
              label="Desired Price"
              helperText="Leave this empty if you wish to transact regardless of the stock price."
              type="text"
              fullWidth
              onChange={this.handleChange}
              variant="outlined"
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