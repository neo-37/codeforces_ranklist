import { useEffect, useState } from "react";
import axios from "axios";
import { BarLoader } from "react-spinners";
import { Link, useParams } from "react-router-dom";
import Blogs from "./Blogs";

function BlogPage({
  g_user,
  cf_user,
  setRenderBothBlogs,
  setBlogButtonText,
  setAuthorColor,
  isAdmin,
}) {
  const [articles, setarticles] = useState(null);

  const url = process.env.REACT_APP_API_URL;

  const retrieveArticleFromServer = () => {
    axios
      .get(`${url}/retrieve_article`, {
        params: { all_blogs_publish_status: true },
      })
      .then(({ data }) => {
       

        setarticles(data);
        // console.log("published article", published_articles);
      })
      .catch((err) => {
        console.log("receive article to server", err);
      });
  };

  useEffect(() => {
    retrieveArticleFromServer();
    setRenderBothBlogs(false);
    setBlogButtonText("My Blogs");
  }, []);

  return (
    <>
      {!articles ? (
        <BarLoader
          color="#fb5607"
          size={800}
          cssOverride={{
            marginTop: "25%",
            marginLeft: "45%",
            marginRight: "auto",
          }}
        />
      ) : (articles.length === 0 ? 
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "2rem",
          }}
        >
          <h1>No articles to view </h1>
        </div>
       : 
        <div style={{ marginTop: "2rem", paddingBottom: "2rem" }}>
          <Blogs articles={articles} isAdmin={isAdmin} />
        </div>
      )}
    </>
  );
}

export default BlogPage;
