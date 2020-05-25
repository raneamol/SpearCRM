import React, {useEffect} from 'react'
import '../styles/PrettyList.css'
import {convertIsoDateToDateString} from "../Dashboard.js"


export default function NextSteps(props) {

  const transitionActivity = async (activityId, ai_activity_bool) => {
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
      //change the calls ifparent is LeadProfile
      if (ai_activity_bool) {
        props.fetchAccountDataAndOrdersAndActivities();
      }
      else {
        props.fetchActivities();
      }
      //an AI generated activity can cause wider changes than user generated activity upon transition.
      //the above code reflects the difference in the API calls made as a response to the transition
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
                <input 
                  className="largerCheckbox" 
                  type="checkbox" 
                  onClick={() => {transitionActivity(element._id, element.ai_activity)}}
                />

                <div className="where"> 
                  {element.title} 
                </div>

                <div className="when"> 
                  {convertIsoDateToDateString(element.date)} 
                </div>

                <p className="description"> 
                  {element.body} 
                </p>
             </li>
            );
          })
          }
        </ul>
      </div>
    </>
  );
}