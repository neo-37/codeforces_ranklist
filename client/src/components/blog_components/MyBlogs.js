import BlogCard from "../../components/blog_components/BlogCard";
import axios from "axios";
import { useState, useEffect } from "react";
import { BarLoader } from "react-spinners";

import Blogs from "../../components/blog_components/Blogs";

const MyBlogs = ({ g_user, setRenderBothBlogs, setBlogButtonText }) => {
  const [myarticles, setmyarticles] = useState(null);

  const url = process.env.REACT_APP_API_URL;

  const retrieveArticleFromServer = () => {
    axios
      .get(`${url}/retrieve_article`, { withCredentials: true })
      .then(({ data }) => {
        //in respose data holds array of article objects
        setmyarticles(data);
        console.log("myBlogs", data);
      })
      .catch((err) => {
        console.log("myBlogs", err);
      });
  };

  useEffect(() => {
    retrieveArticleFromServer();
    setRenderBothBlogs(true);
    setBlogButtonText("All Blogs");
  }, []);
  // const { blog_component } = useParams();
  // console.log(blog_component);
  return (
    <>
      {myarticles==null ? (
        <BarLoader
          color="#fb5607"
          size={800}
          cssOverride={{
            marginTop: "25%",
            marginLeft: "45%",
            marginRight: "auto",
          }}
        />
        
      ) : myarticles.length === 0 ? (
        <div style={{display:"flex",justifyContent:"center", marginTop: "2rem" }}>
        <h1>No articles present</h1>
        </div>
      ) : (
        <div style={{ marginTop: "2rem" }}>
          <Blogs articles={myarticles} g_user={g_user} setmyarticles={setmyarticles}/>
        </div>
      )}
    </>
  );
};

export default MyBlogs;
