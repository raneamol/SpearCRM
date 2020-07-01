import React from 'react'
import '../styles/PrettyList.css'
import {convertIsoDateToDateString} from "../Other/helper.js"
import CloseIcon from '@material-ui/icons/Close';
import StarRateIcon from '@material-ui/icons/StarRate';


export default function PastActivity(props) {
  return(
    <> 
      <h2> Previous Tasks</h2>
      <div className="pretty-list">
        <ul className="experiences">
          {props.activitiesList.sort( (a,b) => new Date(b.date) - new Date(a.date) ) //sort by most recent
          .map( (element, i) => {
            let cross = null;
            let ai_tag = null;
            if (element.elapsed) {
              cross= <CloseIcon />
            }
            if (element.ai_activity) {
              ai_tag = (
                <div className='ai-tag'>
                  <span className='ai-tag-star-icon'> 
                    <StarRateIcon />   
                  </span>
                  <span>
                    AI-Recommended
                  </span>
                </div>
              );
            }
            
            return (
              <>
                <li className="blue" key={i}>
                  {ai_tag}
                  <span className="activity-failed-cross"> {cross} </span>
                  <span className="where"> {element.title} </span>
                  <span className="when"> {convertIsoDateToDateString(element.date)} </span>
                  <p className="description"> {element.body} </p>
                </li>
              </>
            );
          })}
        </ul>
      </div>
    </>
  )
}