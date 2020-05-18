import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import '../styles/NewOrderDialogBox.css'


export default class NewTaskDialogBox extends React.Component{
  state = {
    open: false,
    company: "",
    trans_type: "",
    no_of_shares: 0,
    cost_of_share: 0,
  };

  handleOpen = () => {
    this.setState({ open:true });
  };

  handleClose = () => {
    this.setState({ open:false });
  };

  handleChange = (event) => {
    this.setState({
      [event.target.id] : event.target.value
    });
  }

  postNewOrder = async () => {
    const newOrder = this.state;
    newOrder.stage = 1;
    newOrder.account_id = this.props.account_id;
    delete newOrder["open"];
    console.log(newOrder);
    const response = await fetch("/main/create_order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newOrder)
    });
    
    if (response.ok) {
      console.log("response worked!");
      console.log(response);
      this.setState({ open:false });

      this.props.updateActivityTracker()
      .then(() => this.props.updateAccountProfile())
      .catch("Error in updating ActivityTracker or AccountProfile after new Order addition");
    }
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

        {/* {
            "company" : "Google",
            "no_of_shares" : 40,
            "cost_of_share" : 20,
            "stage" : 3,
            "usr_id" : "A_12342069"
        } */}

            <TextField
              autoFocus
              margin="dense"
              id="company"
              label="Company"
              type="text"
              fullWidth
              onChange={this.handleChange}
            />

            <TextField
              autoFocus
              margin="dense"
              id="trans_type"
              label="Transaction type (buy/sell)"
              type="text"
              fullWidth
              onChange={this.handleChange}
            />

            {/* <Select
              id="trans_type"
              value={this.state.trans_type}
              onChange={this.handleChange}
              inputProps={{ readOnly: true }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={"Buy"}>Buy</MenuItem>
              <MenuItem value={"Sell"}>Sell</MenuItem>
            </Select> */}

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
              type="number"
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