import React, {useContext} from 'react'
import '../styles/PrettyList.css'
import {convertIsoDateToDateString} from "../Other/helper.js"
import StarRateIcon from '@material-ui/icons/StarRate';
import CancelIcon from '@material-ui/icons/Cancel';
import AuthContext from '../Other/AuthContext.js';
import { prepareGETOptions } from '../Other/helper.js';

const API = process.env.REACT_APP_API;

export default function NextSteps(props) {
  const authToken = useContext(AuthContext);

  const transitionActivity = async (activityId, isAiActivity) => {
    props.updateSpinner(true);
    const activityToTransition = {
      "_id" : activityId,
      "activity_type" : "past",
      "company" : props.cache,
    };

    fetch(`${API}/main/change_activity_type`, {
      method: "POST",
      withCredentials: true,
      headers: {'Authorization' : 'Bearer ' + authToken, 'Content-Type': 'application/json'},
      body: JSON.stringify(activityToTransition)
    })
    .then(response => {
      if(response.ok) {
        if (isAiActivity && props.lead === 0) {
          props.updateAccountDataAndOrdersAndActivities()
        }
        //isAiActivity is 1 for activities generated through automation. 
        //Deleting an AI generated activity might involve deletion of corresponding order and updating activity data
        //props.lead indicates the grandparent page. prop.lead===0 being true means AccountProfile is the grandparent.
        else {
          props.updateActivities()
        }
        //User generated activities can be deleted without updating orders and activities.
        //an AI generated activity can cause wider changes than user generated activity upon transition.
      }
      else {
        throw new Error("Something went wrong");
      }
    })
    .catch( error => console.log(error))
    .then(() => props.updateSpinner(false));
  }

  const deleteActivity = (activityId, isAiActivity) => {
    props.updateSpinner(true);
		fetch(`${API}/main/delete_activity/${activityId}`, prepareGETOptions(authToken))
		.then( () => {
      if (isAiActivity) {
        props.updateAccountDataAndOrdersAndActivities()
        .then( () => props.updateSpinner(false));
      }
      //isAiActivity is 1 for activities generated through automation
      else {
        props.updateActivities()
        .then( () => props.updateSpinner(false));
      }
    });
	}

  return(
    <> 
      <h2> Next Steps </h2>
      <div className="pretty-list">
        
        <ul className="experiences">
          {props.activitiesList.sort( (a,b) => new Date(b.date) - new Date(a.date) ) //sort by most recent
          .map( (element, i) => {
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

                <span className="delete-icon" onClick={() => {deleteActivity(element._id, element.ai_activity)}}> <CancelIcon /> </span>

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