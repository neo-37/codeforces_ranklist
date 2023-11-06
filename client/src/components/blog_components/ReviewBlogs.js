import axios from "axios";
import { useState, useEffect } from "react";
import { BarLoader } from "react-spinners";

import Blogs from "../../components/blog_components/Blogs";

const ReviewBlogs = ({ g_user, isAdmin }) => {
  const [reviewArticles, setreviewArticles] = useState(null);

  const url = process.env.REACT_APP_API_URL;

  const retrieveArticleFromServer = () => {
    axios
      .get(`${url}/retrieve_article`)
      .then(({ data }) => {
        //in respose data holds array of article objects
        const under_review_articles = data.filter(
          (article) => article.review_status > 0
        );
        setreviewArticles(under_review_articles);
        console.log("retrieve article", data);
      })
      .catch((err) => {
        console.log("receive article to server", err);
      });
  };

  useEffect(() => {
    retrieveArticleFromServer();
    console.log("effect", reviewArticles);
  }, []);

  return (
    <>
      {reviewArticles == null ? (
        <></>
      ) : reviewArticles.length === 0 ? (
        
        <div style={{display:"flex",justifyContent:"center", marginTop: "2rem" }}>
          <h1>No articles to review </h1>
          </div>
        
      ) : (
        <div style={{ marginTop: "2rem" }}>
          <Blogs articles={reviewArticles} g_user={g_user} isAdmin={isAdmin} />
        </div>
      )}
    </>
  );
};

export default ReviewBlogs;
