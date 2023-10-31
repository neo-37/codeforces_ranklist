import BlogCard from "../../components/blog_components/BlogCard";
import axios from "axios";
import { useState, useEffect } from "react";
import { BarLoader } from "react-spinners";
import BlogNavbar from "../../components/blog_components/BlogNavigation";
import Blogs from "../../components/blog_components/Blogs";

const MyBlogs = ({ g_user }) => {
  const [myarticles, setmyarticles] = useState([]);

  const url = process.env.REACT_APP_API_URL;

  const retrieveArticleFromServer = () => {
    axios
      .get(`${url}/retrieve_article`,{withCredentials:true})
      .then(({ data }) => {
        //in respose data holds array of article objects
        setmyarticles(data);
        console.log("retrieve article", data);
      })
      .catch((err) => {
        console.log("receive article to server", err);
      });
  };

  useEffect(() => {
    retrieveArticleFromServer();
  }, []);

  return (
    <>
      {myarticles.length === 0 ? (
        <BarLoader
          color="#fb5607"
          size={800}
          cssOverride={{
            marginTop: "25%",
            marginLeft: "45%",
            marginRight: "auto",
          }}
        />
      ) : (
        <div style={{ marginTop: "2rem" }}>
          <BlogNavbar blog_button_text={"All Blogs"} render_both_blog_buttons={true}/>
          <Blogs articles={myarticles}/>
        </div>
      )}
    </>
  );
};

export default MyBlogs;
