import Leaderboard from "../components/Leaderboard";
import Sideinfo from "../components/Sideinfo";

import { useState } from "react";
import "./Mainpage.css";

function Mainpage(props) {
  console.log("main page props", props);
  return (
    <>
      <div
        className="row"
        style={{ height: "100%", width: "100%", margin: "0", padding: "0" }}
      >
        <div
          className="column"
          style={{
            height: "100%",
            width: "78.5%",
            background: "white",
            overflowY: "scroll",
          }}
        >
          
            <Leaderboard {...props} />
          
        </div>
        <div
          className="column"
          style={{ height: "100%", width: "21.5%", background: "white" }}
        >
         
            <Sideinfo
              g_user={props.g_user}
              setGUser={props.setGUser}
              cf_user={props.cf_user}
              setCFUser={props.setCFUser}
              getArr={props.getArr}
              setArr={props.setArr}
              isAdmin={props.isAdmin}
            />
          
        </div>
      </div>
    </>
  );
}
export default Mainpage;
