import { useState } from "react";

import favicon from "./cancel.png";
import CfHandleColor from "./multipurpose_components/CfHandleColor";

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

  return (
    <tr style={{backgroundColor : (g_user?g_user.email:"")===value.email?'#DDEEFF':''}}>
      <th scope="row">{id + 1}</th>
      <td>
      <CfHandleColor value={value} />
      

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
