import React from 'react'
import '../styles/ManualLogger.css'
import { Button } from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import TextField from "@material-ui/core/TextField";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';

export default class ManualLogger extends React.Component {
  componentDidMount() {
    console.log(this.props);
  }

  componentDidUpdate() {
    console.log(this.props);
  }

  render(){
    return(
      <div className="manual-logger">

        {/* type input */}
        <div className="togglebutton">
          <ToggleButtonGroup
            value={this.props.draftType}
            exclusive
            onChange={this.props.onToggle}
            aria-label="toggling"
          >
            <ToggleButton value="past">
              <div> &nbsp; Log past activity</div>
            </ToggleButton>
            <ToggleButton value="future">
              <div> &nbsp; Schedule future activity or TODO</div>
            </ToggleButton>
          </ToggleButtonGroup>
        </div>

        {/* title input */}
        <div style={{ width: 400}}>
          <TextField
            autoFocus
            margin="dense"
            id="activityTitle"
            label="Title"
            type="text"
            variant="outlined"
            value={this.props.draftTitle}
            onChange={this.props.handleChangeInTitle}
            fullWidth
          />
        </div>

        <div style={{ width: 400}}>
          {/* body input */}
          <TextField
            autoFocus
            margin="dense"
            id="activityBody"
            label="Body"
            type="text"
            variant="outlined"
            value={this.props.draftBody}
            onChange={this.props.handleChangeInBody}
            fullWidth
          />
        </div>

        {/* date input */}
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            variant="inline"
            //'%Y-%m-%dT%H:%M:%S.%fZ'
            format="MM/dd/yyyy"
            id="date-picker-inline"
            label="Birth date"
            value={this.props.draftDate}
            onChange={this.props.handleChangeInDate}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
            disablePast = {this.props.draftType=="future"}
            disableFuture = {this.props.draftType=="past"}
          />
        </MuiPickersUtilsProvider>
        
        <div> <Button variant="contained" color="primary" onClick={this.props.postNewActivity} disableElevation> Add Activity </Button> </div>
      </div>
    );
  }
}