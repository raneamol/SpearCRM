/* This software is called SpearCRM and it is a customer relationship management software for stockbrokers.
Copyright (C) 2020  Amol Rane, Vedant Pimpley.
This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */
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