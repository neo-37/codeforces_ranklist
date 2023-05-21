import { useState } from "react";

import favicon from "./cancel.png";

function Rank({ value, id, onSmash, isAdmin ,g_user}) {
  function toTitleCase(str) {
    return str
      .toLowerCase()
      .split(" ")
      .map(function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  }
  function set_color(rating) {
    if (rating < 1200) return "gray";
    else if (rating < 1400) return "#008000";
    else if (rating < 1600) return "#03a89e";
    else if (rating < 1900) return "blue";
    else if (rating < 2100) return "#a0a";
    else if (rating < 2300) return "#ff8c00";
    else if (rating < 2400) return "#ff8c00";
    else if (rating < 2600) return "#ff0000";
    else if (rating < 3000) return "#ff0000";
    else return "#ff0000"; //case for tourist
  }
  return (
    <tr style={{backgroundColor : (g_user?g_user.email:"")===value.email?'#DDEEFF':''}}>
      <th scope="row">{id + 1}</th>
      <td>
        <a
          href={"https://codeforces.com/profile/" + value.cf_handle}
          target="_blank"
          rel="noopener noreferrer"
          // for unrated user the stlye object is accessed conditionally,we could render the values conditionally but just to show this
          style={
            value.rating
              ? {
                  fontFamily: "helvetica neue,Helvetica,Arial,sans-serif",
                  fontWeight: "700",
                  fontSize : '0.9rem',
                  textDecoration: "none",
                  color: set_color(value.rating),
                }
              : {
                  fontFamily: "helvetica neue,Helvetica,Arial,sans-serif",
                  fontWeight: "400",
                  textDecoration: "none",
                  color: "black",
                }
          }
        >
          {!value.rating||(value.rating && value.rating < 3000) ? (
            value.cf_handle
          ) : (
            <>
             {/* we cna conditionally render just one element so an empty fragment will do the job*/}
              <span style={{color:"black"}}>
                {value.cf_handle[0]}
              </span>
              {value.cf_handle.substr(1,value.cf_handle.length-1)}
            </>
          )}
        </a>

      </td>
      <td>{value.name}</td>
      <td>{value.maxRating ? value.maxRating : "-"}</td>
      <td style={{minWidth:'205px'}}>{toTitleCase(value.rank ? value.rank : "-")}</td>
      <td colSpan="2" style={{ textAlign: "right", paddingRight: "1em" }}>
        {value.rating ? value.rating : "Unrated"}
      </td>
      <td style={{paddingTop:'2px'}}>
        <div
          className="btn-group"
          role="group"
          aria-label="Basic mixed styles example"
          style={{ marginLeft: "2rem" }}
        >
          {isAdmin ? (
            <button type="button" className="btn btn-sm" value={value.email}>
              <img
                src={favicon}
                alt="delete button"
                style={{
                  width: "1.8rem",
                  height: "1.8rem",
                }}
                onClick={onSmash}
              />
            </button>
          ) : (
            <></>
          )}
        </div>
      </td>
    </tr>
  );
}
export default Rank;
