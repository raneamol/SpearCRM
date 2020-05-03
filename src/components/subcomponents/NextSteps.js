import React from 'react'
import '../styles/PrettyList.css'

export default function NextSteps(props) {
  const transitionActivity = () => {
    
  }

  return(
    <> 
      <h2> Next Steps </h2>
      <div className="pretty-list">
        
        <ul className="experiences">
          {props.activitiesList.map( (element, i) => {
            return (
              <li className="blue" key={i}>
                <input className="largerCheckbox" type="checkbox" onClick={this.transitionActivity}/>
                <div className="where"> {element.title} </div>
                <div className="when"> {element.date} </div>
                <p className="description"> {element.body} </p>
             </li>
            );
          })
          }
        </ul>
      </div>
    </>
  )
}