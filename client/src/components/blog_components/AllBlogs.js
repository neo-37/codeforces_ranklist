import { useEffect, useState } from "react";
import axios from "axios";
import { BarLoader } from "react-spinners";
import { Link ,useParams} from "react-router-dom";
import Blogs from "./Blogs";

function BlogPage({ g_user, cf_user ,setRenderBothBlogs, setBlogButtonText,setAuthorColor,isAdmin}) {
  const [articles, setarticles] = useState([]);


  const url = process.env.REACT_APP_API_URL;

  const retrieveArticleFromServer = () => {
    axios
      .get(`${url}/retrieve_article`)
      .then(({ data }) => {
        //in respose data holds array of article objects
        const published_articles = data.filter(
          (article) => article.review_status === 2
        );
        setarticles(published_articles);
        console.log("published article", published_articles);
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
const {trial}=useParams()
console.log(trial)
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
        <div style={{ marginTop: "2rem" ,paddingBottom:"2rem"}}>
         <Blogs articles={articles} isAdmin={isAdmin}/>
        </div>
      )}
    </>
  );
}

export default BlogPage;
