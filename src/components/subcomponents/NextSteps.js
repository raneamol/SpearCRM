import React, {useEffect} from 'react'
import '../styles/PrettyList.css'
import {convertIsoDateToDateString} from "../Dashboard.js"


export default function NextSteps(props) {
  const transitionActivity = async (activityId) => {
    const activityToTransition = {
      "_id" : activityId,
      "activity_type" : "past"
    };

    const response = await fetch("/main/change_activity_type", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(activityToTransition)
    });

    if (response.ok) {
      console.log("response worked!");
      console.log(response);
      if (props.lead === 1) {props.updateActivityTracker()}
      else {
        props.updateActivityTracker()
        .then( () => props.updateAccountProfile() );
        //using .then is possible since updateActivityTracker is defined as an async function
        //parent component is updated, then grandparent component is updated
      }
    }
  }

  return(
    <> 
      <h2> Next Steps </h2>
      <div className="pretty-list">
        
        <ul className="experiences">
          {props.activitiesList.map( (element, i) => {
            return (
              <li className="blue" key={i}>
                <input className="largerCheckbox" type="checkbox" onClick={() => {transitionActivity(element._id)}}/>
                <div className="where"> {element.title} </div>
                <div className="when"> {convertIsoDateToDateString(element.date)} </div>
                <p className="description"> {element.body} </p>
             </li>
            );
          })
          }
        </ul>
      </div>
    </>
  );
}