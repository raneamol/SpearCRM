import React, {useEffect} from 'react'
import '../styles/PrettyList.css'
import {convertIsoDateToDateString} from "../Dashboard.js"


export default function NextSteps(props) {

  const transitionActivity = async (activityId, isAiActivity) => {
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
      if (isAiActivity && props.lead === 0) {
        props.fetchAccountDataAndOrdersAndActivities();
      }
      //isAiActivity is 1 for activities generated through automation. 
      //Deleting an AI generated activity might involve deletion of corresponding order and updating activity data
      //props.lead indicates the grandparent page. prop.lead===0 being true means AccountProfile is the grandparent.
      else {
        props.fetchActivities();
      }
      //User generated activities can be deleted without updating orders and activities.
      //an AI generated activity can cause wider changes than user generated activity upon transition.
    }
  }

  const deleteActivity = (activityId, isAiActivity) => {
		fetch(`/main/delete_activity/${activityId}`)
		.then( () => {
      if (isAiActivity) {
        props.fetchAccountDataAndOrdersAndActivities();
      }
      //isAiActivity is 1 for activities generated through automation
      else {
        props.fetchActivities();
      }
    });
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
                  checked={false}
                  onClick={() => {transitionActivity(element._id, element.ai_activity)}}
                />

                <div className="where"> 
                  {element.title} 
                </div>

                <span onClick={() => {deleteActivity(element._id, element.ai_activity)}}> &times; </span>

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