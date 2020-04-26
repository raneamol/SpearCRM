import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import {data} from '../Accounts.js';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

export default function NewTaskDialogBox() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        + New Profile
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add New Customer</DialogTitle>
        <DialogContent>
          {console.log(data.title)}

          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            variant="outlined"
            fullWidth
          />

          <div className='age-inputs'>
            <TextField
              autoFocus
              margin="dense"
              id="age"
              label="Age"
              type="number"
              variant="outlined"
            />
            <span> &nbsp; &nbsp; </span>
            <MaterialUIPickers />
          </div>

          <TextField
            autoFocus
            margin="dense"
            id="job"
            label="Job"
            type="text"
            variant="outlined"
            fullWidth
          />

          <TextField
            autoFocus
            margin="dense"
            id="phoneNumber"
            label="Phone Number"
            type="number"
            variant="outlined"
            fullWidth
          />

          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
          />

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function MaterialUIPickers() {
  const [selectedDate, setSelectedDate] = React.useState(new Date().toJSON().slice(0,10));

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          variant="inline"
          format="MM/dd/yyyy"
          id="date-picker-inline"
          label="Birth date"
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
    </MuiPickersUtilsProvider>
  );
}