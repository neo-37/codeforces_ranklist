import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function NavBar(props) {
  const url = process.env.REACT_APP_API_URL;
  const googleAuth = () => {
    window.open(`${url}/auth/google/callback`, "_self");
  };
  const googleAuthOut = () => {
    window.open(`${url}/logout`, "_self");
  };

  const getGUser = async () => {
    try {
      const { data } = await axios.get(`${url}/user_g_info`, {
        withCredentials: true,
      });
      console.log("new guser", data.user);
      props.setGUser(data.user);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getGUser();
  }, []);

  return (
    <>
      <nav
        className="navbar navbar-dark bg-dark fixed-top"
        style={{ padding: "0" }}
      >
        <div className="container-fluid">
          <h1
            className="navbar-brand"
            style={{ fontFamily: "Oswald, sans-serif", fontSize: "35px" }}
          >
            CodersNexus
          </h1>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasDarkNavbar"
            aria-controls="offcanvasDarkNavbar"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div
            className="offcanvas offcanvas-end text-bg-dark"
            tabIndex={-1}
            id="offcanvasDarkNavbar"
            aria-labelledby="offcanvasDarkNavbarLabel"
            style={{ maxWidth: "22%" }}
          >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasDarkNavbarLabel">
                Menu
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="offcanvas"
                aria-label="Close" //just acts like alternate name in image tag
              />
            </div>

            <div className="offcanvas-body">
              {/* google phot and email */}
              {/* add css for media query in this */}
              {props.g_user ? (
                <>
                  <div className="column">
                    <img
                      src={props.g_user.picture}
                      alt="User pic"
                      referrerPolicy="no-referrer" //use with google content url else sometimes the img doesn't load
                      style={{
                        height: "80px",
                        width: "80px",
                        borderRadius: "50%",

                        // these three essetial for centering
                        display: "block",
                        marginLeft: "auto",
                        marginRight: "auto",
                      }}
                    ></img>
                  </div>
                  <div
                    className="column"
                    style={{
                      marginTop: "5%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "17px",
                        marginBottom: "0",
                        display: "block",
                        marginLeft: "auto",
                        marginRight: "auto",
                      }}
                    >
                      {props.g_user.name}
                    </p>
                    <p
                      style={{
                        fontSize: "13px",
                        marginTop: "0",
                        display: "block",
                        marginLeft: "auto",
                        marginRight: "auto",
                      }}
                    >
                      {props.g_user.email}
                    </p>
                  </div>
                </>
              ) : (
                <></>
              )}

              <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                <li className="nav-item" data-bs-dismiss="offcanvas">
                  <Link to="/" className="nav-link">
                    Leaderboard
                  </Link>
                </li>
                <li className="nav-item" data-bs-dismiss="offcanvas">
                  <Link to="/blogs" className="nav-link">
                    Educational Blogs
                  </Link>
                </li>
                <li className="nav-item" data-bs-dismiss="offcanvas">
                  <a
                    className="nav-link"
                    href="https://kodewreckpractice.contest.codeforces.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Kodewreck Practice
                  </a>
                </li>
                {/* empty fragment is need here are conditional rendering is expecting a component or similar but we are again giving condition */}
                {props.g_user ? (
                  <>
                    {props.isAdmin ? (
                      <>
                      <li className="nav-item" data-bs-dismiss="offcanvas">
                        <Link to="/admin" className="nav-link">
                          Admin Page
                        </Link>
                      </li>
                      <li className="nav-item" data-bs-dismiss="offcanvas">
                        <Link to="/admin/review_blogs" className="nav-link">
                          Review Blogs
                        </Link>
                      </li>
                      </>

                    ) : (
                      <></>
                    )}
                    {/* do not use null,can use something like an empty elemnt */}
                    <li className="nav-item">
                      <button
                        className="nav-link"
                        onClick={googleAuthOut}
                        type="button"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close" //just acts like alternate name in image tag
                      >
                        Log Out
                      </button>
                    </li>
                  </>
                ) : (
                  <li className="nav-item">
                    <button
                      className="nav-link"
                      onClick={googleAuth}
                      type="button"
                      data-bs-dismiss="offcanvas"
                      aria-label="Close" //just acts like alternate name in image tag
                    >
                      Login
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
export default NavBar;
