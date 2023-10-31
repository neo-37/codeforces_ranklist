import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import Mainpage from "./pages/Mainpage";
import Adminpage from "./pages/AdminPage";
import UnauthorizedAccess from "./components/UnauthorizedAccess";
import UrlNotFound from "./components/UrlNotFound";
import axios from "axios";
import { RingLoader, BeatLoader } from "react-spinners";
import AllBlogsPage from "./pages/BlogPages/AllBlogsPage"
import EditorPage from "./pages/BlogPages/TextEditorPage";
import MyBlogsPage from "./pages/BlogPages/MyBlogsPage";

function App() {
  const [arr, setArr] = useState([]);
  const [g_user, setGUser] = useState(null); //contains name,picture,email
  const [cf_user, setCFUser] = useState(null);
  const [adArr, setAdArr] = useState([]);
  const [isAdmin, setAdmin] = useState(false);
  const [canShowRing, setCanShowRing] = useState(true);
  const [canShowBeat, setCanShowBeat] = useState(true);

  const url = process.env.REACT_APP_API_URL;

  const getArr = async () => {
    axios
      .get(`${url}/user_list`)
      .then((res) => {
        setArr(res.data);
        setCanShowRing(false);
        console.log("user list fetched form user_list rt", res.data);
      })
      .catch((err) => {
        // Handle error
        console.log(err);
      });
  };
  const getCFuser = async () => {
    try {
      const { data } = await axios.get(`${url}/is_linked`, {
        withCredentials: true,
      });
      setCFUser(data.user);
      console.log("CF user is");
      console.log(data.user);
    } catch (err) {
      console.log(err);
    }
  };
  const getAdArr = () => {
    axios
      .get(`${url}/all_admins`)
      .then((res) => {
        setAdArr(res.data);
        setCanShowBeat(false);
        console.log("admins");
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getIsAdmin = async () => {
    try {
      const { data } = await axios.get(`${url}/is_admin`, {
        withCredentials: true,
      });
      console.log("Are you Admin?", data);
      setAdmin(data);
    } catch (err) {
      console.log(err);
    }
  };

  // Set Time out

  useEffect(() => {
    getArr();
    getCFuser();
    getAdArr();
    getIsAdmin();
    // const timer = setTimeout(() => setCanShow(false), 400);
    // return () => clearTimeout(timer);
  }, [g_user]);

  return (
    <div
      className="column"
      style={{ height: "100vh", width: "100vw", boxSizing: "border-box" }}
    >
      <Router>
        {/* any component should be inside this router tag only */}
        <div
          className="row"
          style={{ height: "8.7%", margin: "0", padding: "0" }}
        >
          <NavBar g_user={g_user} setGUser={setGUser} isAdmin={isAdmin} />
        </div>

        <div
          className="row"
          style={{ height: "92%", margin: "0", padding: "0" }}
        >
          {/* it is not allowed to use anything other than route inside routes */}
          <Routes>
            {/* "*" will match any URL that doesn't match any of the other routes in your application,but not in descendant routes*/}
            <Route path="*" element={<UrlNotFound />} />

            <Route
              path="/"
              element={
                canShowRing ? (
                  <RingLoader
                    color="#fb5607"
                    size={200}
                    cssOverride={{
                      marginTop: "15%",
                      marginLeft: "45%",
                      marginRight: "auto",
                    }}
                  />
                ) : (
                  <Mainpage
                    list={arr}
                    g_user={g_user}
                    setGUser={setGUser}
                    cf_user={cf_user}
                    setCFUser={setCFUser}
                    getArr={getArr}
                    setArr={setArr}
                    isAdmin={isAdmin}
                  />
                )
              }
            />

            <Route
              path="/admin"
              element={
                canShowBeat ? (
                  <BeatLoader
                    color="orange"
                    size={30}
                    cssOverride={{
                      marginTop: "15%",
                      marginLeft: "45%",
                      marginRight: "auto",

                      //borderColor: "red",
                    }}
                  />
                ) : isAdmin ? (
                  <Adminpage
                    list={adArr}
                    setAdArr={setAdArr}
                    g_user={g_user}
                    isAdmin={isAdmin}
                    setAdmin={setAdmin}
                  />
                ) : (
                  <UnauthorizedAccess />
                )
              }
            />

            <Route
              path="/blogs/*" // * is imp if we want to create more children routes
              element={//could create a new component for that returned routes but no need
                <Routes>
                  {/* just like we handled non matching in the ancestor */}

                  <Route path="*" element={<UrlNotFound />} />

                  <Route path="/" element={<AllBlogsPage g_user={g_user} cf_user={cf_user}/>}></Route>
                  <Route
                    path="/create-article"
                    element={<EditorPage g_user={g_user} cf_user={cf_user} />}
                  />
                  <Route path="/my-blogs" element={<MyBlogsPage g_user={g_user} cf_user={cf_user}/>}></Route>
                </Routes>
              }
            ></Route>
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
