import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

export default class NewTaskDialogBox extends React.Component{
  state = {
    open: false,
    city: "",
    company: "",
    country: "",
    dob: new Date().toJSON(),
    education: "",
    email: "",
    job_type: "",
    lead_source: "",
    name: "",
    state: "",
    phone_number: "",
    marital_status: "",
    status: "",
  }

  componentDidUpdate() {
    console.log(this.state);
  }

  handleChange = (event) => {
    this.setState({
      [event.target.id] : event.target.value
    });
  }

  handleChangeInDate = (event) => {
    this.setState({ dob: event });
  }

  handleClickOpen = () => {
    this.setState({ open: true});
  }

  handleClose = () => {
    this.setState({ open: false});
  }

  postNewLead = async () => {
    const newLead = this.state;
    delete newLead["open"];
    const response = await fetch("/main/create_lead", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newLead)
    });
    
    if (response.ok) {
      console.log("response worked!");
      console.log(response);
      this.setState({ open:false });
      this.props.updateLeads();
    }
  }

  render() {
    return (
      <div>
        <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
          + New Lead
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Add New Lead</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Name"
              type="text"
              variant="outlined"
              fullWidth
              onChange={this.handleChange}
            />

            <TextField
              autoFocus
              margin="dense"
              id="company"
              label="Company"
              type="text"
              variant="outlined"
              fullWidth
              onChange={this.handleChange}
            />

            <TextField
              autoFocus
              margin="dense"
              id="city"
              label="City"
              type="text"
              variant="outlined"
              fullWidth
              onChange={this.handleChange}
            />

            <TextField
              autoFocus
              margin="dense"
              id="state"
              label="State"
              type="text"
              variant="outlined"
              fullWidth
              onChange={this.handleChange}
            />

            <TextField
              autoFocus
              margin="dense"
              id="country"
              label="Country"
              type="text"
              variant="outlined"
              fullWidth
              onChange={this.handleChange}
            />

            <TextField
              autoFocus
              margin="dense"
              id="email"
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              onChange={this.handleChange}
            />

            <TextField
              autoFocus
              margin="dense"
              id="phone_number"
              label="Phone Number"
              type="number"
              variant="outlined"
              fullWidth
              onChange={this.handleChange}
            />

            <MaterialUIPickers date={this.state.dob} handleChangeInDate={this.handleChangeInDate} />

            <TextField
              autoFocus
              margin="dense"
              id="education"
              label="Education"
              type="text"
              variant="outlined"
              fullWidth
              onChange={this.handleChange}
            />

            <TextField
              autoFocus
              margin="dense"
              id="job_type"
              label="Job Type"
              type="text"
              variant="outlined"
              fullWidth
              onChange={this.handleChange}
            />

            <TextField
              autoFocus
              margin="dense"
              id="marital_status"
              label="Marital Status"
              type="text"
              variant="outlined"
              fullWidth
              onChange={this.handleChange}
            />

            <TextField
              autoFocus
              margin="dense"
              id="lead_source"
              label="Lead Source"
              type="text"
              variant="outlined"
              fullWidth
              onChange={this.handleChange}
            />

            <TextField
              autoFocus
              margin="dense"
              id="status"
              label="Lead Status (Open/Contacted)"
              type="text"
              variant="outlined"
              fullWidth
              onChange={this.handleChange}
            />

            {/* TODO: Use a Select field, not a text field for lead status */}

          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.postNewLead} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

function MaterialUIPickers(props) {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          variant="inline"
          format="MM/dd/yyyy"
          id="date"
          label="Birth date"
          value={props.date}
          onChange={props.handleChangeInDate}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
    </MuiPickersUtilsProvider>
  );
}