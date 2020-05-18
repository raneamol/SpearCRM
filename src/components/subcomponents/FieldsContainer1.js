import React from 'react';
import EditableField from './EditableField.js'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';

export default class FieldsContainer1 extends React.Component { 
  componentDidMount() {
    console.log(this.props.fields);
  }

  render() {
    console.log(this.props);
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
          </List>
      </div> 
    );
  }  
}