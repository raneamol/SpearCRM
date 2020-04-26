import React from 'react'
import '../styles/EditableField.css'

export default class EditableField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isBeingEdited: false,
    };
  }

  componentDidMount() {
    console.log(`State is ${this.state.isBeingEdited}`)
  }

  componentDidUpdate() {
    console.log(`State is ${this.state.isBeingEdited}`);
    console.log(`Received prop data is ${this.props.fieldData}`);
  }

  render() {
    let fieldDataComponent = <div> {this.props.fieldData} </div>;
    let editButton = <button className="DataEditButton" onClick={this.alternateViews.bind(this)} > &#9999; </button>;
    if(this.state.isBeingEdited) {
      fieldDataComponent = <input type="text" name={this.props.name} defaultValue={this.props.fieldData} onChange={this.props.onChange}/>;
      editButton = <button className="DataEditButton" onClick={this.alternateViews.bind(this)} > &#10003; </button>;
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

  alternateViews() {
    this.setState({
      isBeingEdited: !this.state.isBeingEdited
    });
  }
}