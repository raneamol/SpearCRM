/* This software is called SpearCRM and it is a customer relationship management software for stockbrokers.
Copyright (C) 2020  Amol Rane, Vedant Pimpley.
This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */
import React from 'react';
import EditableField from './EditableField.js'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import '../styles/FieldsContainer.css'

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
          <Divider />
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