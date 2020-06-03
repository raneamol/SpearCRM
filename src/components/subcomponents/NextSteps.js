import React from 'react'
import '../styles/PrettyList.css'
import {convertIsoDateToDateString} from "../Dashboard.js"
import CloseIcon from '@material-ui/icons/Close';
import StarRateIcon from '@material-ui/icons/StarRate';

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
        props.updateAccountDataAndOrdersAndActivities();
      }
      //isAiActivity is 1 for activities generated through automation. 
      //Deleting an AI generated activity might involve deletion of corresponding order and updating activity data
      //props.lead indicates the grandparent page. prop.lead===0 being true means AccountProfile is the grandparent.
      else {
        props.updateActivities();
      }
      //User generated activities can be deleted without updating orders and activities.
      //an AI generated activity can cause wider changes than user generated activity upon transition.
    }
  }

  const deleteActivity = (activityId, isAiActivity) => {
		fetch(`/main/delete_activity/${activityId}`)
		.then( () => {
      if (isAiActivity) {
        props.updateAccountDataAndOrdersAndActivities();
      }
      //isAiActivity is 1 for activities generated through automation
      else {
        props.updateActivities();
      }
    });
	}

  return(
    <> 
      {console.log(props.activitiesList)}
      <h2> Next Steps </h2>
      <div className="pretty-list">
        
        <ul className="experiences">
          {props.activitiesList.map( (element, i) => {
            return (
              <li className="blue" key={i}>

                {element.ai_activity ?
                  <div className='ai-tag'>
                    <span className='ai-tag-star-icon'> 
                      <StarRateIcon />   
                    </span>
                    <span>
                      AI Generated
                    </span>
                  </div>
                  :
                  null
                }

                <input 
                  className="largerCheckbox" 
                  type="checkbox" 
                  checked={false}
                  onClick={() => {transitionActivity(element._id, element.ai_activity)}}
                />

                <div className="where"> 
                  {element.title} 
                </div>

                <span className="when"> 
                  {convertIsoDateToDateString(element.date)} 
                </span>

                <span  className="cross" onClick={() => {deleteActivity(element._id, element.ai_activity)}}> <CloseIcon /> </span>

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