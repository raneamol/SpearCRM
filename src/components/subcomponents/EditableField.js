import React from 'react'
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import '../styles/EditableField.css'

export default class EditableField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isBeingEdited: false,
    };
  }

  alternateViews = () => {
    this.setState({
      isBeingEdited: !this.state.isBeingEdited
    });
  }

  postFieldsAndAlternateViews = () => {
    this.props.onSubmit();
    this.setState({
      isBeingEdited: false
    });
  }

  render() {

    let fieldDataComponent = <div style={{ paddingTop: 8 }}> {this.props.fieldData} </div>;
    let editButton = <button className="DataEditButton" onClick={this.alternateViews}> <EditIcon /> </button>;

    // if field is a date field, it is dealt with differently than a text field.
    if (this.props.name === "dob"){
      let birthDate = new Date(this.props.fieldData);
      fieldDataComponent = (
        <div style={{ paddingTop: 8 }}> {birthDate.toDateString()} </div>
      );
    }

    if(this.state.isBeingEdited) {
      if (this.props.name === "dob"){
        fieldDataComponent = (
          <DatePicker 
            date={this.props.fieldData} 
            handleChange={this.props.onChange} 
          />
        );
      }
      else{
        fieldDataComponent = (
          <input 
            type="text" 
            name={this.props.name} 
            defaultValue={this.props.fieldData} 
            onChange={this.props.onChange}
          />
        );
      }

      editButton = <button className="DataEditButton" onClick={this.postFieldsAndAlternateViews} > <CheckIcon /> </button>;
    }

    return(
      <div className="editable-field-component">
        <p> {this.props.fieldName} </p>
        <div className="inline-section-editable-fields">
          {fieldDataComponent}
          {editButton}
        </div>
      </div>  
    );
  }
}


function DatePicker(props) {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          variant="inline"
          format="MM/dd/yyyy"
          id="dob"
          label=""
          value={props.date}
          onChange={props.handleChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
    </MuiPickersUtilsProvider>
  );
}