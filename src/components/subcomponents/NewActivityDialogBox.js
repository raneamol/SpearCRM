import React, { useState, useEffect, useRef } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Autocomplete from "@material-ui/lab/Autocomplete";
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

export default function NewActivityDialogBox(props) {
  //manual logger related hooks
  const [activityTitle, setActivityTitle] = useState("");
  const [activityBody, setActivityBody] = useState("");
  const [activityDate, setActivityDate] = useState(new Date().toJSON().slice(0,10));
  const [selectedCustomerId, setSelectedCustomerId] = useState(0);

  const [open, setOpen] = useState(false);
  const [radioValue, setRadioValue] = useState("lead");
  const [leadSelectOptions, setLeadSelectOptions] = useState([]);
  const [accountSelectOptions, setAccountSelectOptions] = useState([]);

  const _isMounted = useRef(true);
  useEffect( () => {
    Promise.all( [fetch(`/main/get_all_account_names`), fetch(`/main/get_all_lead_names`)] )
    .then(values => {

      //using if condition here to avoid unnecessary computation if component is unmounted
      if (_isMounted.current) {
        let leadsMenuItems = [<MenuItem value="" key={0}> <em>None</em> </MenuItem>];
        let accountsMenuItems = [<MenuItem value="" key={0}> <em>None</em> </MenuItem>];

        //sort and format account names
        values[0].json().then(accounts => {
          accounts = accounts.sort(function(a,b){ 
            var x = a.name < b.name? -1:1; 
            return x; 
          });

          accounts.forEach( (account, i) => {
            accountsMenuItems.push([<MenuItem value={account._id} key={i+1}> {account.name} </MenuItem>])
            //existing null MenuItem has key=0, these entries have key=i+1
          });
        });

        //sort and format lead names
        values[1].json().then(leads => {
          leads = leads.sort(function(a,b){ 
            var x = a.name < b.name? -1:1; 
            return x; 
          });

          leads.forEach( (lead, i) => {
            leadsMenuItems.push([<MenuItem value={lead._id} key={i+1}> {lead.name} </MenuItem>])
            //existing None MenuItem has key=0, these entries have key=i+1
          });
        });

        if (_isMounted.current) {
          setLeadSelectOptions(leadsMenuItems);
          setAccountSelectOptions(accountsMenuItems);
        }
      }

      return () => {
        _isMounted.current = false;
      }
    });
  }, []);

  useEffect( () => {
    let d = new Date();
    d.setDate(d.getDate() + 1)
    if (_isMounted.current) {
      setActivityDate(d);
    }
  }, []);
  //updates date to a permissible value (tomorrow onwards)

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const postNewActivity = async () => {
    const newActivity = {
      "user_id": selectedCustomerId,
      "title": activityTitle,
      "body": activityBody,
      "date": new Date( Date.parse(activityDate) ),
      "activity_type": "future",
    };
    const response = await fetch("/main/create_activity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newActivity)
    });
    
    if (response.ok && _isMounted.current) {
      setActivityBody("");
      setActivityTitle("");
      props.updateDashboard();
    }
  }

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
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
          >
            <InputLabel>Lead/Account</InputLabel>
            <Select
              value={selectedCustomerId}
              onChange={(event) => setSelectedCustomerId(event.target.value)}
              label="Lead/Account"
              name="selectCustomer"
            >
              {(radioValue==="lead" ? leadSelectOptions : accountSelectOptions )}
            </Select>
          </FormControl>

          <MaterialUIPickers date={activityDate} handleChangeInDate={ event => setActivityDate(event) } />

          <TextField
            autoFocus
            margin="dense"
            id="activityTitle"
            label="Title"
            type="text"
            fullWidth
            onChange={ event => setActivityTitle(event.target.value) }
          />

          <TextField
            autoFocus
            margin="dense"
            id="activityBody"
            label="Body"
            type="text"
            fullWidth
            onChange={ event => setActivityBody(event.target.value) }
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
          label="Birth date"
          value={props.date}
          onChange={props.handleChangeInDate}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
          label="Task Date"
          disablePast
          minDate={minDate}
        />
      </MuiPickersUtilsProvider>
    );
}