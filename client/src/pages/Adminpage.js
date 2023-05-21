import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminTable from "../components/AdminTable";

//THIS PAGE IS ONLY ACCESSIBLE IF YOU HAVE E-MAIL USER
function Adminpage(props) {
  const [vList, setvList] = useState([]);
  const [uvList, setuvList] = useState([]);
  const [rAdmins, setRAdmins] = useState([]);
  const url = process.env.REACT_APP_API_URL;
  const getuList = () => {
    setvList(
      props.list
        .map((value, index) => {
          return { value: index, isVerified: value.verified };
        })
        .filter((data) => {
          return data.isVerified;
        })
    );
  };
  const getuvList = () => {
    setuvList(
      props.list
        .map((value, index) => {
          return { value: index, isVerified: value.verified };
        })
        .filter((data) => {
          return !data.isVerified;
        })
    );
  };
  const onRemove = (e) => {
    //update in DB along with set props
    const rA = rAdmins;
    setRAdmins([]);
    axios
      .post(`${url}/remove_admins`, {
        email_list: props.list
          .filter((data, index) => {
            return rA.findIndex((value) => value == index) != -1;
          })
          .map((value) => (value = value.email)),
        email: props.g_user ? props.g_user.email : "",
      })
      .then((res) => {
        //work with response
        console.log(res.data.isAdmin);
        if (res.data.isAdmin) {
          props.setAdArr(
            props.list.filter((data, index) => {
              return rA.findIndex((value) => value == index) == -1;
            })
          );
          if (props.isAdmin == false) props.setAdmin(true);
        } else if (props.isAdmin) props.setAdmin(false);
      })
      .catch((err) => {
        // Handle error
        console.log(err);
      });
  };
  const onClick = (e) => {
    if (rAdmins.findIndex((value) => value == e.target.value) != -1)
      setRAdmins(rAdmins.filter((value) => value != e.target.value));
    else setRAdmins((prev) => [...prev, e.target.value]);
  };
  const addAdmin = (e) => {
    e.preventDefault();
    console.log("addAdmin", e.target.new_admin_email.value);
    const email = e.target.new_admin_email.value;
    e.target.new_admin_email.value = "";
    if (
      email.length > 0 &&
      props.list.findIndex((value) => value.email == email) == -1
    ) {
      console.log("there");

      // update in DB
      axios
        .post(`${url}/add_admin`, {
          add_email: email,
          email: props.g_user ? props.g_user.email : "",
        })
        .then((res) => {
          //work with response
          console.log(res.data.isAdmin);
          if (res.data.isAdmin) {
            props.setAdArr((prev) => [
              ...prev,
              {
                email: email,
                verified: false,
                name: "",
              },
            ]);
            if (props.isAdmin == false) props.setAdmin(true);
          } else if (props.isAdmin) props.setAdmin(false);
        })
        .catch((err) => {
          // Handle error
          console.log(err);
        });
    } else {
      console.log("admin_already present");
    }
  };
  useEffect(() => {
    getuList();
    getuvList();
    console.log("props");
    console.log(props.list);
  }, [props.list]);

  return (
    <>
      <div
        className="container-fluid"
        style={{ width: "70%", marginTop: "10px", " paddingBottom": "100px" }}
      >
        {/* diff style add admin form */}
        {/* <div align="right">
          <p style={{ marginRight: "200px", marginBottom: "0px" }}>
            Enter Admin's Email :
          </p>

          <form  onSubmit={addAdmin}>
            <div className="input-group mb-3 mt-2" style={{ width: "350px" }}>
              <input
                type="text"
                className="form-control"
                id="new_admin_email"
                placeholder="kodewreck.cse@kiit.ac.in"
                aria-label="Recipient's username"
                aria-describedby="button-addon2"
              />
              <button
                className="btn btn-success"
                type="submit"
              >
                Add
              </button>
            </div>
          </form>
        </div> */}

        <div style={{ display: "flex", marginTop: "1.5rem" }}>
          <form
            className="row g-3"
            onSubmit={addAdmin}
            style={{ marginLeft: "auto" }}
          >
            <div className="col-auto">
              <input
                type="text"
                className="form-control"
                id="new_admin_email"
                placeholder="kodewreck@kiit.ac.in"
              />
            </div>
            <div className="col-auto">
              <button
                type="submit"
                className="btn btn-success mb-3"
                style={{ width: "auto" }}
              >
                Add
              </button>
            </div>
          </form>
        </div>

        <h4>
          <u>Admins : </u>
        </h4>
        <AdminTable
          vList={vList}
          uvList={uvList}
          onClick={onClick}
          g_user={props.g_user}
          list={props.list}
        />
        <button
          type="button"
          className="btn btn-danger"
          style={{ marginTop: "10px" }}
          onClick={onRemove}
        >
          remove
        </button>
      </div>
    </>
  );
}
export default Adminpage;
