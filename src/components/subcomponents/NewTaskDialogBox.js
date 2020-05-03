import React from "react";
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


const data = [
  {
    key: '1',
    name: 'John Brown',
    company: '3C Electronics',
    type: 'Small Business',
    city: 'New York',
    phoneNumber: '9090909090',
    email: 'johnbrown@gmail.com',
  },
  {
    key: '2',
    name: 'Jane Brown',
    company: 'GE Electronics',
    type: 'Small Business',
    city: 'New York',
    phoneNumber: '9090909090',
    email: 'johnbrown@gmail.com',
  },
  {
    key: '3',
    name: 'Jacob Chang',
    company: '3C Electronics',
    type: 'Small Business',
    city: 'Atlanta',
    phoneNumber: '8989897690',
    email: 'johnbrown@gmail.com',
  },
  {
    key: '4',
    name: 'Mufutau',
    company: 'Microsoft',
    type: 'Small Business',
    city: 'Mulhouse',
    phoneNumber: "05514847692",
    email: 'purus@vulputateposuerevulputate.ca',
  },
  {
    key: '5',
    name: 'Edward',
    company: 'Lavasoft',
    type: 'Individual',
    city: 'Bucaramanga',
    phoneNumber: "01419184513",
    email: 'purus@vulputateposuerevulputate.ca',
  },
  {
    key: '6',
    name: 'Kirestin',
    company: 'Chami',
    type: 'Individual',
    city: 'Loughborough',
    phoneNumber: "0107648840",
    email: 'ipsum.primis.in@nuncac.ca',
  },
  {
    key: '7',
    name: 'Jena',
    company: 'Yahoo',
    type: 'Individual',
    city: 'Nampa',
    phoneNumber: "02522615459",
    email: 'at.fringilla@parturientmontesnascetur.ca',
  },
  {
    key: '8',
    name: 'Penelope',
    company: 'Google',
    type: 'Individual',
    city: 'Lonzee',
    phoneNumber: "010498810",
    email: 'felis.eget@Maurisquis.com',
  },
  {
    key: '9',
    name: 'Ima',
    company: 'Chami',
    type: 'Enterprise',
    city: 'Abaetetuba',
    phoneNumber: "05672046522",
    email: 'Nam.tempor@molestie.co.uk',
  },
  {
    key: '10',
    name: 'Joelle',
    company: 'Altavista',
    type: 'Enterprise',
    city: 'Tomsk',
    phoneNumber: "0117571720",
    email: 'consectetuer@tinciduntaliquamarcu.org'
  },
  {
    key: '11',
    name: 'Cole',
    company: 'Sibelius',
    type: 'Enterprise',
    city: 'Los Angeles',
    phoneNumber: "07624959303",
    email: 'convallis@In.ca',
  },
  {
    key: '12',
    name: 'Cyrus',
    company: 'Lavasoft',
    type: 'Enterprise',
    city: 'Delhi',
    phoneNumber: "05510801111",
    email: 'tellus@sodalesMauris.com',
  },
  {
    key: '13',
    name:"Thaddeus",
		company: "Lavasoft",
    type: 'Mid-market',
    city:"Kędzierzyn-Koźle",
		email:"Donec.feugiat.metus@Aliquamfringillacursus.ca",
		phoneNumber: "07649975638",
  },
  {
    key: '14',
    name:"Blythe",
		company: "Yahoo",
    type: 'Mid-market',
		city:"Wechelderzande",
		email:"turpis.vitae@magna.org",
		phoneNumber: "08788483517",
  },
  {
    key: '15',
    name:"Salim",
	  company: "Chami",
    type: 'Mid-market',
		city: "West Jakarta",
		email:"metus.facilisis.lorem@Sedeget.net",
		phoneNumber:"0800730152",
  },
  {
    key: '16',
    name:"Ishmael",
		company: "Apple Systems",
    type: 'Mid-market',
		city:"Porto Cesareo",
		email:"eu.turpis@ipsumprimis.edu",
		phoneNumber:"05598364190",
  },
  
]; 


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
        +
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add New Task</DialogTitle>
        <DialogContent>
        <Autocomplete
          options={data}
          getOptionLabel={data => data.name}
          style={{ width: 300 }}
          renderInput={params => (
            <TextField {...params} label="Lead/Account" variant="outlined" />
          )}
        />

          <MaterialUIPickers />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Task"
            type="email"
            fullWidth
          />

          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Details"
            type="email"
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
          disableToolbar
          variant="inline"
          format="MM/dd/yyyy"
          margin="normal"
          id="date-picker-inline"
          label="Task Date"
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
    </MuiPickersUtilsProvider>
  );
}