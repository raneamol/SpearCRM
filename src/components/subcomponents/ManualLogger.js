/* This software is called SpearCRM and it is a customer relationship management software for stockbrokers.
Copyright (C) 2020  Amol Rane, Vedant Pimpley.
This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */
import React, {useState, useEffect} from 'react'
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
              <div> &nbsp; Log past interactions</div>
            </ToggleButton>
            <ToggleButton value="future">
              <div> &nbsp; Schedule future task or TODO</div>
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
        <div className="activity-date-picker">
          <MaterialUIPickers 
            draftDate={this.props.draftDate} 
            draftType={this.props.draftType} 
            handleChangeInDate={this.props.handleChangeInDate}
          />
        </div>

        <div className="activity-submit-button">
          <Button variant="contained" color="primary" onClick={this.props.postNewActivity} disableElevation> Add Activity </Button>
        </div>
      </div>
    );
  }
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
        //'%Y-%m-%dT%H:%M:%S.%fZ'
        format="MM/dd/yyyy"
        id="date-picker-inline"
        label="Date"
        value={props.draftDate}
        onChange={props.handleChangeInDate}
        KeyboardButtonProps={{
          'aria-label': 'change date',
        }}
        disablePast = {props.draftType==="future"}
        disableFuture = {props.draftType==="past"}
        minDate={props.draftType === "future" ? minDate : null}
      />
    </MuiPickersUtilsProvider>
  );
}

//the options for each date picker are different on each component.
//Do not copy paste without reading.