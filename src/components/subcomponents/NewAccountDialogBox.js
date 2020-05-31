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
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';


export default class NewAccountDialogBox extends React.Component{
  state = {
    open: false,
    city: "",
    company: "",
    country: "",
    demat_accno: 0,
    dob: new Date(),
    education: "",
    email: "",
    job_type: "",
    last_contact: new Date(),
    latest_order_stage: 0,
    name: "",
    state: "",
    phone_number: "",
    marital_status: "",
    trading_accno: 0,
    contact_comm_type : "Email",
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }


  handleChange = (event) => {
    this.setState({
      [event.target.id || event.target.name] : event.target.value
      //takes the first truthy value
      //textField inputs generate synthetic event and use event.target.id
      //dropdown inputs generate normal event use event.target.name
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

  postNewProfile = async () => {
    const newProfile = this.state;
    delete newProfile.open;
    //date and last_contact are sent as date objects
    //all other fields are sent as strings

    const response = await fetch("/main/create_account", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newProfile)
    });
    
    if (response.ok && this._isMounted) {
      this.setState({ open:false });
      this.props.updateAccounts();
    }
  }

  render() {
    return (
      <div>
        <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
          + New Account
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Add New Profile</DialogTitle>
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
              type="text"
              variant="outlined"
              fullWidth
              onChange={this.handleChange}
            />

            <MaterialUIPickers date={this.state.dob} handleChangeInDate={this.handleChangeInDate} />

            <div style={{ paddingTop: 10 }}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel>Education</InputLabel>
                <Select
                  value={this.state.education}
                  onChange={this.handleChange}
                  label="Education"
                  name="education"
                >
                  <MenuItem value=""> <em>None</em> </MenuItem>
                  <MenuItem value={"high school"}>High school</MenuItem>
                  <MenuItem value={"college"}>College</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div style={{ paddingTop: 10 }}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel>Job Type</InputLabel>
                <Select
                  value={this.state.job_type}
                  onChange={this.handleChange}
                  label="Job Type"
                  name="job_type"
                >
                  <MenuItem value=""> <em>None</em> </MenuItem>
                  <MenuItem value={"services"}>Services</MenuItem>
                  <MenuItem value={"other"}>Other</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div style={{ paddingTop: 10 }}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel>Marital Status</InputLabel>
                <Select
                  value={this.state.marital_status}
                  onChange={this.handleChange}
                  label="Marital Status"
                  name="marital_status"
                >
                  <MenuItem value=""> <em>None</em> </MenuItem>
                  <MenuItem value={"Married"}>Married</MenuItem>
                  <MenuItem value={"Unmarried"}>Unmarried</MenuItem>
                </Select>
              </FormControl>
            </div>

            <TextField
              autoFocus
              margin="dense"
              id="trading_accno"
              label="Trading Account No."
              type="number"
              variant="outlined"
              fullWidth
              onChange={this.handleChange}
            />

            <TextField
              autoFocus
              margin="dense"
              id="demat_accno"
              label="Demat Account No."
              type="number"
              variant="outlined"
              fullWidth
              onChange={this.handleChange}
            />

          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.postNewProfile} color="primary">
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