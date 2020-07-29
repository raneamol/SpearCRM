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
import Collapse from '@material-ui/core/Collapse';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormGroup from '@material-ui/core/FormGroup';
import Switch from '@material-ui/core/Switch';
import Checkbox from '@material-ui/core/Checkbox';
import AuthContext from '../Other/AuthContext.js';

const API = process.env.REACT_APP_API;

export default class NewLeadDialogBox extends React.Component{
  state = {
    open: false,
    city: "",
    company: "",
    country: "",
    dob: new Date(),
    education: "",
    email: "",
    job_type: "",
    lead_source: "",
    name: "",
    state: "",
    phone_number: "",
    marital_status: "",
    status: "",
    showMlFields: false,
    ml_doNotEmail : 0,
    ml_filledRegistrationForm : 0,
    ml_fromWebsite : 0,
    ml_unemployed : 0,
    ml_isBusy : 0,
    ml_phoneReachableFrequently : 0,
    ml_willRevert : 0,
    ml_phoneReachable : 0,
    ml_leadQualityUncertainty : 0,
    ml_poorLeadQuality : 0,
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

  handleChangeInMlFields = (event) => {
    this.setState({
      [event.target.name] : event.target.checked ? 1 : 0
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
    delete newLead.open;
    delete newLead.showMlFields;

    fetch(`${API}/main/create_lead`, {
      method: "POST",
      withCredentials: true,
      headers: {'Authorization' : 'Bearer ' + this.context, 'Content-Type': 'application/json'},
      body: JSON.stringify(newLead)
    })
    .then(response => {
      if (response.ok && this._isMounted) {
        this.setState({ open:false });
        this.props.updateLeads();
      }
    })
    .catch( error => console.log(error))
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
                  <MenuItem value={"Divorced"}>Divorced</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div style={{ paddingTop: 10 }}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel>Lead Status</InputLabel>
                <Select
                  value={this.state.status}
                  onChange={this.handleChange}
                  label="Lead Status"
                  name="status"
                >
                  <MenuItem value=""> <em>None</em> </MenuItem>
                  <MenuItem value={"Uncontacted"}>Uncontacted</MenuItem>
                  <MenuItem value={"Contacted"}>Contacted</MenuItem>
                </Select>
              </FormControl>
            </div>

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

            <FormControlLabel
              control={<Switch checked={this.state.showMlFields} onChange={() => {this.setState({ showMlFields: !this.state.showMlFields })}}/>}
              label="Add additional details"
            />
            
            <div>
              <FormControl component="fieldset" >
                <Collapse in={this.state.showMlFields}>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox checked={this.state.ml_doNotEmail} onChange={this.handleChangeInMlFields} name="ml_doNotEmail" />}
                    label="Do not email"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={this.state.ml_filledRegistrationForm} onChange={this.handleChangeInMlFields} name="ml_filledRegistrationForm" />}
                    label="Filled Registration Form"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={this.state.ml_fromWebsite} onChange={this.handleChangeInMlFields} name="ml_fromWebsite" />}
                    label="Redirected from website"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={this.state.ml_unemployed} onChange={this.handleChangeInMlFields} name="ml_unemployed" />}
                    label="Unemployed"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={this.state.ml_isBusy} onChange={this.handleChangeInMlFields} name="ml_isBusy" />}
                    label="Is generally busy"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={this.state.ml_phoneReachableFrequently} onChange={this.handleChangeInMlFields} name="ml_phoneReachableFrequently" />}
                    label="Phone is generally reachable"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={this.state.ml_willRevert} onChange={this.handleChangeInMlFields} name="ml_willRevert" />}
                    label="Lead will revert upon contact"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={this.state.ml_phoneReachable} onChange={this.handleChangeInMlFields} name="ml_phoneReachable" />}
                    label="Reachable over phone at all"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={this.state.ml_leadQualityUncertainty} onChange={this.handleChangeInMlFields} name="ml_leadQualityUncertainty" />}
                    label="Uncertain lead quality"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={this.state.ml_poorLeadQuality} onChange={this.handleChangeInMlFields} name="ml_poorLeadQuality" />}
                    label="Poor lead quality"
                  />
                </FormGroup>
                </Collapse>
                <FormHelperText> You can leave fields unchecked </FormHelperText>
              </FormControl>
            </div>

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
          fullWidth
        />
    </MuiPickersUtilsProvider>
  );
}