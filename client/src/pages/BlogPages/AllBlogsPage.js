import { useEffect, useState } from "react";
import axios from "axios";
import MyBlogs from "./MyBlogsPage";
import BlogCard from "../../components/blog_components/BlogCard";
import { BarLoader } from "react-spinners";
import { Link } from "react-router-dom";
import Blogs from "../../components/blog_components/Blogs";
import BlogNavbar from "../../components/blog_components/BlogNavigation";

function BlogPage({ g_user, cf_user }) {
  const [articles, setarticles] = useState([]);


  const url = process.env.REACT_APP_API_URL;

  const retrieveArticleFromServer = () => {
    axios
      .get(`${url}/retrieve_article`)
      .then(({ data }) => {
        //in respose data holds array of article objects
        setarticles(data);
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
      {articles.length === 0 ? (
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
          <BlogNavbar blog_button_text={"My Blogs"} render_both_blog_buttons={false}/>

         <Blogs articles={articles}/>
        </div>
      )}
    </>
  );
}

export default BlogPage;
