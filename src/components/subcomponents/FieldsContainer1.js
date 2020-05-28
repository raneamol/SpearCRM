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