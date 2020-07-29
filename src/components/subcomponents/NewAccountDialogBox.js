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
import AuthContext from '../Other/AuthContext.js';

const API = process.env.REACT_APP_API;
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

  static contextType = AuthContext;

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

    fetch(`${API}/main/create_account`, {
      method: "POST",
      withCredentials: true,
      headers: {'Authorization' : 'Bearer ' + this.context, 'Content-Type': 'application/json'},
      body: JSON.stringify(newProfile)
    })
    .then( response => {
      if (response.ok && this._isMounted) {
        this.setState({ open:false });
        this.props.updateAccounts();
      }
    })
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
                  <MenuItem value={"high school"}>High School</MenuItem>
                  <MenuItem value={"University"}>University</MenuItem>
                  <MenuItem value={"Professional Course"}>Professional Course</MenuItem>
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
                  <MenuItem value={"Services"}>Services</MenuItem>
                  <MenuItem value={"Self-Employed"}>Self-employed</MenuItem>
                  <MenuItem value={"Student"}>Student</MenuItem>
                  <MenuItem value={"Retired"}>Retired</MenuItem>
                  <MenuItem value={"Entrepreneur"}>Entrepreneur</MenuItem>
                  <MenuItem value={"Blue-collar"}>Blue-collar</MenuItem>
                  <MenuItem value={"Management"}>Management</MenuItem>
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
          fullWidth
        />
    </MuiPickersUtilsProvider>
  );
}