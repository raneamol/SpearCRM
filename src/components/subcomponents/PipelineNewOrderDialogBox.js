/* This software is called SpearCRM and it is a customer relationship management software for stockbrokers.
Copyright (C) 2020  Amol Rane, Vedant Pimpley.
This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */
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
import '../styles/NewOrderDialogBox.css';
import AuthContext from '../Other/AuthContext.js';
import { prepareGETOptions } from '../Other/helper.js';

const API = process.env.REACT_APP_API;
export default class PipelineNewOrderDialogBox extends React.Component{
  state = {
    open: false,
    company: "",
    trans_type: "",
    no_of_shares: 0,
    cost_of_share: 0,
    account_id : 0,
  };

  static contextType = AuthContext;

  //value is only set on first load
  //is made a class property due to bug where selectOptions alone is deleted after successful order addition
  selectOptions = [];

  componentDidMount() {
    this._isMounted = true;

    fetch(`${API}/main/get_all_account_names`, prepareGETOptions(this.context) )
    .then(response =>
      response.json().then(data => {
        let menuItems = [<MenuItem value="" key={0}> <em>None</em> </MenuItem>] ;
        data.forEach( (entry, i) => {
          menuItems.push(<MenuItem value={entry._id} key={i+1}> {entry.name} </MenuItem>);
        //existing None MenuItem has key=0, these entries have key=i+1
        });
        
        if (this._isMounted) {
          this.selectOptions = menuItems;
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
    this.props.updateSpinner(true);

    const newOrder = this.state;
    newOrder.stage = 2;
    newOrder.no_of_shares = parseInt(this.state.no_of_shares);
    delete newOrder.open;
    this.setState({ account_id: 0});
    this.setState({ trans_type: ""});

    fetch(`${API}/main/create_order`, {
      method: "POST",
      withCredentials: true,
      headers: {'Authorization' : 'Bearer ' + this.context, 'Content-Type': 'application/json'},
      body: JSON.stringify(newOrder)
    })
    .then(response => {
      if (response.ok && this._isMounted) {
        this.props.updatePipeline();          
      }
      else {
        throw new Error("Something went wrong");
      }
    })
    .catch( error => console.log(error))
    .then( () => {
      if (this._isMounted) {
        this.setState({ open:false }); 
        this.props.updateSpinner(false); 
      }
    });
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


            <FormControl 
              variant="outlined" 
              style={{ marginBottom: 10 }}  
              fullWidth
            >
              <InputLabel>Account</InputLabel>
              <Select
                value={this.state.account_id}
                onChange={this.handleChange}
                label="Account"
                name="account_id"
              >
                {this.selectOptions}
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
              variant="outlined"
            />

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