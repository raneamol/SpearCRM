import React from 'react';
import EditableField from './EditableField.js'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import '../styles/FieldsContainer.css'
import {convertIsoDateToDateString} from "../Dashboard.js"

export default class FieldsContainer2 extends React.Component {
  render() {
    let fieldsBasedOnParentComponent = null;
    
    if (this.props.lead === 1) {
      fieldsBasedOnParentComponent = (
        <ListItem>
          <EditableField 
            name="lead_source" 
            fieldName="Lead Source" 
            fieldData={this.props.fields.lead_source} 
            onChange={this.props.handleChange} 
            onSubmit={this.props.onSubmit}
          />
        </ListItem>
      );
    }
    else {
      fieldsBasedOnParentComponent = (
        <>
          <ListItem>
            <div className="noneditable-field-component">
              <p> Account turnover till date </p>
              <div> Rs. {parseInt(this.props.accountTurnover.turnover)} </div>
            </div>  
          </ListItem>
          <Divider />

          {/* Last Contacted value is immutable */}
          <ListItem>
            <div className="noneditable-field-component">
              <p> Last Contacted </p>
              <div> {convertIsoDateToDateString(this.props.fields.last_contact)} </div>
            </div>  
          </ListItem>
        </>
      );
    }

    return(
      <div>
        <h2 style={{ textAlign: "center"}}> Fields 2</h2>
          <List>
            <ListItem>
              <EditableField 
                name="dob" 
                fieldName="Date of Birth" 
                fieldData={this.props.fields.dob} 
                onChange={this.props.handleChange} 
                onSubmit={this.props.onSubmit}
              />
            </ListItem>
            <Divider />

            <ListItem>
              <EditableField 
                name="job_type" 
                fieldName="Job type" 
                fieldData={this.props.fields.job_type} 
                onChange={this.props.handleChange} 
                onSubmit={this.props.onSubmit}
              />
            </ListItem>
            <Divider />

            <ListItem>
              <EditableField 
                name="marital_status" 
                fieldName="Marital Status" 
                fieldData={this.props.fields.marital_status} 
                onChange={this.props.handleChange} 
                onSubmit={this.props.onSubmit}
              />
            </ListItem>
            <Divider />

            <ListItem>
              <EditableField 
                name="email" 
                fieldName="Email" 
                fieldData={this.props.fields.email} 
                onChange={this.props.handleChange} 
                onSubmit={this.props.onSubmit}
              />
            </ListItem>
            <Divider />

            <ListItem>
              <EditableField 
                name="phone_number" 
                fieldName="Phone Number" 
                fieldData={this.props.fields.phone_number} 
                onChange={this.props.handleChange} 
                onSubmit={this.props.onSubmit}
              />
            </ListItem>
            <Divider />

            {fieldsBasedOnParentComponent}
            <Divider />

          </List>
      </div>
    );
  }  
}