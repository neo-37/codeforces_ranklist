import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
} from "react-router-dom";
import React, { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import MainPage from "./pages/MainPage";
import AdminPage from "./pages/AdminPage";
import UnauthorizedAccess from "./components/UnauthorizedAccess";
import UrlNotFound from "./components/UrlNotFound";
import axios from "axios";
import { RingLoader, BeatLoader } from "react-spinners";
import AllBlogs from "./components/blog_components/AllBlogs";
import Editor from "./components/blog_components/TextEditor";
import MyBlogs from "./components/blog_components/MyBlogs";
import BlogNavPage from "./pages/BlogNavigationPage";
import DisplayArticle from "./components/blog_components/DisplayArticle";
import ReviewBlogs from "./components/blog_components/ReviewBlogs";

function App() {
  const [arr, setArr] = useState([]);
  const [g_user, setGUser] = useState(null); //contains name,picture,email
  const [cf_user, setCFUser] = useState(null);
  const [adArr, setAdArr] = useState([]);
  const [isAdmin, setAdmin] = useState(false);
  const [canShowRing, setCanShowRing] = useState(true);
  const [canShowBeat, setCanShowBeat] = useState(true);

  const [renderBothBlogs, setRenderBothBlogs] = useState(false);
  const [blogButtonText, setBlogButtonText] = useState("My Blogs");

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


  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route
        path="/"
        element={
          <div
            style={{ height: "100vh", width: "100vw", boxSizing: "border-box" }}
          >
            <div style={{ height: "8%", margin: "0", padding: "0" }}>
              <NavBar g_user={g_user} setGUser={setGUser} isAdmin={isAdmin} />
            </div>
            {/* <div  style={{ height: "92%", margin: "0", padding: "0" }}> */}
            <Outlet />
            {/* </div> */}
          </div>
        }
        errorElement={
          <div
            style={{ height: "100vh", width: "100vw", boxSizing: "border-box" }}
          >
            <div style={{ height: "8%", margin: "0", padding: "0" }}>
              <NavBar g_user={g_user} setGUser={setGUser} isAdmin={isAdmin} />
            </div>
            <div style={{ height: "92%", margin: "0", padding: "0" }}>
              <UrlNotFound />
            </div>
          </div>
        }
      >
        <Route
          path=""
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
              <MainPage
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
          path="admin"
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
              <Outlet />
            ) : (
              <UnauthorizedAccess />
            )
          }
        >
          <Route
            path=""
            element={
              <AdminPage
                list={adArr}
                setAdArr={setAdArr}
                g_user={g_user}
                isAdmin={isAdmin}
                setAdmin={setAdmin}
              />
            }
          />
          <Route path="review_blogs" element={<Outlet/>}>

            <Route
              path=""
              element={
                <ReviewBlogs
                  g_user={g_user}
                  cf_user={cf_user}
                  isAdmin={isAdmin}
                  
                />
              }
/>
              <Route 
              path=":review_article_id"
              element={<DisplayArticle
                  setRenderBothBlogs={setRenderBothBlogs}
                  setBlogButtonText={setBlogButtonText}
             
                  isAdmin={isAdmin}
                />}
              />
            
          </Route>
        </Route>

        <Route
          path="blogs"
          element={
           
            <>
             {g_user?
              <div style={{ marginTop: "2rem" }}>
                <BlogNavPage
                  render_both_blog_buttons={renderBothBlogs}
                  blog_button_text={blogButtonText}
                  
                />
              </div>:<></>}

              <Outlet />
            </>
            
          }
        >
          <Route
            path=""
            element={
              <AllBlogs
                g_user={g_user}
                cf_user={cf_user}
                setRenderBothBlogs={setRenderBothBlogs}
                setBlogButtonText={setBlogButtonText}
      
              />
            }
          />
          <Route
            path="create-article"
            element={
              <div style={{ margin: "1rem 4rem" }}>
                <Editor
                  g_user={g_user}
                  cf_user={cf_user}
                  setRenderBothBlogs={setRenderBothBlogs}
                  setBlogButtonText={setBlogButtonText}
                />
              </div>
            }
          />
          <Route
            path="my-blogs"
            element={
              <>
                <Outlet />
              </>
            }
          >
            <Route
              path=""
              element={
                <MyBlogs
                  g_user={g_user}
                  cf_user={cf_user}
                  setRenderBothBlogs={setRenderBothBlogs}
                  setBlogButtonText={setBlogButtonText}
                  
                />
              }
            />
            <Route
              path=":article_id"
              element={
                <DisplayArticle
                  setRenderBothBlogs={setRenderBothBlogs}
                  setBlogButtonText={setBlogButtonText}
                 
                />
              }
            />
          </Route>

          <Route
            path=":article_id"
            element={
              <DisplayArticle
                setRenderBothBlogs={setRenderBothBlogs}
                setBlogButtonText={setBlogButtonText}
           
              />
            }
          />
        </Route>
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
