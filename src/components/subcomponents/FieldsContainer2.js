import React from 'react';
import EditableField from './EditableField.js'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import '../styles/FieldsContainer.css'

export default class FieldsContainer2 extends React.Component {
  componentDidMount() {
    console.log(this.props.fields);
  }

  render() {
    let fieldsBasedOnParentComponent = null;
    
    if (this.props.lead === 0) {
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
            <EditableField 
              name="demat_accno" 
              fieldName="Demat Account Number" 
              fieldData={this.props.fields.demat_accno} 
              onChange={this.props.handleChange} 
              onSubmit={this.props.onSubmit}
            />
          </ListItem>
          <Divider />
          
          <ListItem>
            <EditableField 
              name="trading_accno" 
              fieldName="Trading Account Number" 
              fieldData={this.props.fields.trading_accno} 
              onChange={this.props.handleChange} 
              onSubmit={this.props.onSubmit}
            />
          </ListItem>

          {/* Last Contacted value is immutable */}
          <ListItem>
            <div className="noneditable-field-component">
              <p> Last Contacted </p>
              <div> {this.props.fields.last_contact} </div>;
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

          </List>
      </div>
    );
  }  
}