/* This software is called SpearCRM and it is a customer relationship management software for stockbrokers.
Copyright (C) 2020  Amol Rane, Vedant Pimpley.
This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */
import { withStyles } from "@material-ui/core/styles";
import { Tooltip } from '@material-ui/core';
const stocksAPI = process.env.REACT_APP_STOCKS_KEY;

//Javascript Set operations
export const setDifference = (setA, setB) => {
  let _difference = new Set(setA)
  for (let elem of setB) {
      _difference.delete(elem)
  }
  return _difference
}

export const setUnion = (setA, setB) => {
  let _union = new Set(setA)
  for (let elem of setB) {
      _union.add(elem)
  }
  return _union
}

export const getPrice = async(company) => {
  //notice the URL formatting here: .NS appended and toUpperCase applied
  let promise = fetch(`https://finnhub.io/api/v1/quote?symbol=${company.toUpperCase()}.NS&token=${stocksAPI}`);

   //returns company's price
  let price = await promise.then( response => response.json().then( data => data.c ) ).catch( err => null );
  let output = { company: company, price: price };
  return(output);
}

export const prepareGETOptions = (token) => {
  return {
    method:"GET", 
    withCredentials: true,
    headers: {'Authorization': 'Bearer '+ token, 'Content-Type': 'application/json'},
    // credentials: 'include',
  }
}
//for post requests, the options have been written manually for each POST request

export const convertIsoDateToDateString = (isoDate) => {
	let tempDateObj = new Date(isoDate);
	return tempDateObj.toDateString();
};

export const LargeTooltip = withStyles({
  tooltip: {
    fontSize: "12px"
  }
})(Tooltip);