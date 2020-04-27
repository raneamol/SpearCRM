import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {data} from "../Accounts"

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';


export default function NewTaskDialogBox(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if ( props.cid.startsWith("A") ){
    return (
      <div>
        <Button variant="outlined" color="primary" onClick={handleClickOpen}>
          + Add New Order
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
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
            />

            <TextField
              autoFocus
              margin="dense"
              id="no_of_shares"
              label="No. of shares"
              type="number"
              fullWidth
            />

            <TextField
              autoFocus
              margin="dense"
              id="cost_of_share"
              label="Cost of one share"
              type="number"
              fullWidth
            />

          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleClose} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
  else {
    return null;
  }

}