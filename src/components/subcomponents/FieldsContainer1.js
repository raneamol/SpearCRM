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

export default class FieldsContainer1 extends React.Component { 
  render() {
    let fieldsBasedOnParentComponent = null;
    
    if (this.props.lead === 1) {
      fieldsBasedOnParentComponent =  null;
    }
    else {
      fieldsBasedOnParentComponent = (
        <>
          <ListItem>
            <div className="noneditable-field-component">
              <p> Account turnover till date </p>
              <div style={{ paddingTop: 8 }}> Rs. {parseInt(this.props.accountTurnover.turnover)} </div>
            </div>  
          </ListItem>
          <Divider />
        </>
      );
    }

    return(
      <div>
         <h2 style={{ textAlign: "center"}}> Fields 1</h2>
          <List>
            <ListItem>
              <EditableField 
                name="name" 
                fieldName="Name" 
                fieldData={this.props.fields.name} 
                onChange={this.props.handleChange} 
                onSubmit={this.props.onSubmit}
              />
            </ListItem>
            <Divider />

            <ListItem>
              <EditableField
                name="company"
                fieldName="Company"
                fieldData={this.props.fields.company}
                onChange={this.props.handleChange}
                onSubmit={this.props.onSubmit}
              />
            </ListItem>
            <Divider />

            <ListItem>
              <EditableField 
                name="education" 
                fieldName="Education" 
                fieldData={this.props.fields.education} 
                onChange={this.props.handleChange}  
                onSubmit={this.props.onSubmit}
              />
            </ListItem>
            <Divider />

            <ListItem>
              <EditableField 
                name="city" 
                fieldName="City" 
                fieldData={this.props.fields.city} 
                onChange={this.props.handleChange} 
                onSubmit={this.props.onSubmit}
              />
            </ListItem>
            <Divider />
            
            <ListItem>
              <EditableField 
                name="state" 
                fieldName="State" 
                fieldData={this.props.fields.state} 
                onChange={this.props.handleChange} 
                onSubmit={this.props.onSubmit}
              />
            </ListItem>
            <Divider />

            <ListItem>
              <EditableField 
                name="country" 
                fieldName="Country" 
                fieldData={this.props.fields.country} 
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