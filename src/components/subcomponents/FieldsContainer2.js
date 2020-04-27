import React from 'react';
import EditableField from './EditableField.js'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';

export default class FieldsContainer2 extends React.Component {
  render() {
    return(
      <div>
        <h2 style={{ textAlign: "center"}}> Fields 2</h2>
          <List>
            <ListItem>
              <EditableField name="last_contact" fieldName="Last Contact" fieldData={this.props.fields.last_contact} onChange={this.handleChange} onSubmit={this.postFields}/>
            </ListItem>
            <Divider />
            <ListItem>
              <EditableField name="trading_accno" fieldName="Trading Account No." fieldData={this.props.fields.trading_accno} onChange={this.handleChange} onSubmit={this.postFields}/>
            </ListItem>
            <Divider />
            <ListItem>
              <EditableField name="job_type" fieldName="Job type" fieldData={this.props.fields.job_type} onChange={this.handleChange} onSubmit={this.postFields}/>
            </ListItem>
            <Divider />
            <ListItem>
              <EditableField name="marital_status" fieldName="Marital Status" fieldData={this.props.fields.marital_status} onChange={this.handleChange} onSubmit={this.postFields}/>
            </ListItem>
            <Divider />
            <ListItem>
              <EditableField name="email" fieldName="Email" fieldData={this.props.fields.email} onChange={this.handleChange} onSubmit={this.postFields}/>
            </ListItem>
            <Divider />
            <ListItem>
              <EditableField name="phone_number" this fieldName="Phone Number" fieldData={this.props.fields.phone_number} onChange={this.handleChange} onSubmit={this.postFields}/>
            </ListItem>
            <Divider />
          </List>
      </div>
    );
  }  

  postFields = async () => {
    let allFields = this.props.fields;
    allFields["last_contact"] = this.state.last_contact;
    allFields["trading_accno"] = this.state.trading_accno;
    allFields["job_type"] = this.state.job_type;
    allFields["marital_status"] = this.state.marital_status;
    allFields["email"] = this.state.email;
    allFields["phone_number"] = this.state.phone_number;
    const response = await fetch("/main/edit_account", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(allFields)
    });
    
    if (response.ok) {
      console.log("response worked!");
      console.log(response);
      this.props.updateAccountProfile();
    }
    //POST current state with usr_id
    //overwrite received props object with state variables of same name
    //post the resulting object
  }

  handleChange = e => {
    console.log(`handleChange ${e.target.name}`);
    this.setState({
      [e.target.name] : e.target.value
    });
  }

  componentDidMount() {
    console.log(this.props.fields);
  }

  componentDidUpdate() {
    console.log(this.state);
  }
}