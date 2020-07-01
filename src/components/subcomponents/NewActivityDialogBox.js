import React, { useState, useEffect, useContext} from "react";
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
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import AuthContext from '../Other/AuthContext.js';

const API = process.env.REACT_APP_API;
export default function NewActivityDialogBox(props) {
  const [activityTitle, setActivityTitle] = useState("");
  const [activityBody, setActivityBody] = useState("");
  const [activityDate, setActivityDate] = useState(new Date().toJSON().slice(0,10));
  const [selectedCustomerId, setSelectedCustomerId] = useState(0);

  const [open, setOpen] = useState(false);
  const [radioValue, setRadioValue] = useState("lead");

  const authToken = useContext(AuthContext);

  useEffect( () => {
    let d = new Date();
    d.setDate(d.getDate() + 1)
    setActivityDate(d);
  }, []);
  //updates date to a permissible value (tomorrow onwards)

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const postNewActivity = async () => {
    props.setOpenSpinnerInHome(true);

    const newActivity = {
      "user_id": selectedCustomerId,
      "title": activityTitle,
      "body": activityBody,
      "date": new Date( Date.parse(activityDate) ),
      "activity_type": "future",
    };
    
    fetch(`${API}/main/create_activity`, {
      method: "POST",
      withCredentials: true,
      headers: {'Authorization' : 'Bearer ' + authToken, 'Content-Type': 'application/json'},
      body: JSON.stringify(newActivity)
    })
    .then(response => {
      if (response.ok) {
        setActivityBody("");
        setActivityTitle("");
        props.updateHome();
      }
      else {
        throw new Error("Something went wrong");
      }
    })
    .catch( error => console.log(error))
    .then( () => props.setOpenSpinnerInHome(false))
  }

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen} >
        +
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
      >

        <DialogTitle>Add New Task</DialogTitle>

        <DialogContent>

          <FormControl component="fieldset">
            <FormLabel component="legend">Customer Type</FormLabel>
            <RadioGroup name="gender1" value={radioValue} onChange={ event => setRadioValue(event.target.value)} >
              <FormControlLabel value="lead" control={<Radio />} label="Lead" />
              <FormControlLabel value="account" control={<Radio />} label="Account" />
            </RadioGroup>
          </FormControl>

          <FormControl 
            variant="outlined" 
            fullWidth
            style = {{ marginTop: 5, marginBottom: 10}}
          >
            <InputLabel>Lead/Account</InputLabel>
            <Select
              value={selectedCustomerId}
              onChange={(event) => setSelectedCustomerId(event.target.value)}
              label="Lead/Account"
              name="selectCustomer"
            >
              {(radioValue==="lead" ? props.leadSelectOptions : props.accountSelectOptions )}
            </Select>
          </FormControl>

          <MaterialUIPickers 
            date={activityDate} 
            handleChangeInDate={ event => setActivityDate(event) } 
          />

          <TextField
            autoFocus
            margin="dense"
            id="activityTitle"
            label="Title"
            type="text"
            fullWidth
            onChange={ event => setActivityTitle(event.target.value) }
            variant="outlined"
          />

          <TextField
            autoFocus
            margin="dense"
            id="activityBody"
            label="Body"
            type="text"
            fullWidth
            onChange={ event => setActivityBody(event.target.value) }
            variant="outlined"
          />

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={() => {postNewActivity(); setOpen(false)}} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function MaterialUIPickers(props) {
  const [minDate, setMinDate] = useState(new Date().toJSON().slice(0,10));

  useEffect( () => {
    let d = new Date();
    d.setDate(d.getDate() + 1)
    setMinDate(d);
  }, []);

    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          variant="inline"
          format="MM/dd/yyyy"
          id="date"
          value={props.date}
          onChange={props.handleChangeInDate}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
          label="Task Date"
          disablePast
          minDate={minDate}
          fullWidth
        />
      </MuiPickersUtilsProvider>
    );
}