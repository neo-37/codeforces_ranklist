import { useEffect,useState } from "react";
import { useLocation,Link, useNavigate } from "react-router-dom";
import htmlParser from "html-react-parser";
import axios from "axios";

function DisplayArticle({ setRenderBothBlogs, setBlogButtonText ,isAdmin}) {

  const [curHmtl, setCurHtml] = useState(<></>);
  const { state } = useLocation();

  const navigate=useNavigate();
  console.log("display article", state);
  const article = state;

  const url = process.env.REACT_APP_API_URL;
  console.log(article);
  const sendArticleToServer = async (article_data) => {
    axios
      .post(`${url}/save_article`, article_data)
      .then((response) => {
        console.log("article sent", response);
      })
      .catch((err) => {
        console.log("send article to server", err);
      });
  };

 const rejectArticle=()=>{
    article.review_status=-1;
sendArticleToServer(article);
 }

 const publishArticle=()=>{
    article.review_status=2;
sendArticleToServer(article);
 }

 const checkArticle=()=>
 {
    if(article.review_status>=1)
    return true;
return false;
 }
  useEffect(() => {
    if(checkArticle()===false)
    {
navigate("..")
    }
    setRenderBothBlogs(true);
    setBlogButtonText("My Blogs");

    if (article) {
      setCurHtml(htmlParser(article.article_html));
    }
  }, []);
  return (
    <>
    <div  style={{ marginTop:"4rem",marginLeft: "8rem", marginRight: "8rem" ,paddingBottom:"2rem"}}>
    
      <h3 className="pb-4 mb-4 fst-italic border-bottom">By {article.author}</h3>

      <article className="blog-post">
        {curHmtl}
       
      </article>

    </div>


    <div
      className="container"
      style={{
        alignItems: "center",
        padding:"0rem 8rem 3rem 4rem",
        borderRadius: "5px",
        //margin issues are due to border box property of main div,but it is also essential for leaderboard
      }}
    >
    {isAdmin?
      <div className="hstack gap-5" >
        
          <Link
           to=".."
            className="p-2  btn"
            style={{ color: "black", backgroundColor: "red" }}
            onClick={rejectArticle}
          >
            Reject
          </Link>
        

        <Link
           to=".."
          onClick={publishArticle}
          className="p-2 ms-auto btn btn-success"
          style={{ color: "black "}}
        >
         Publish
        </Link>     
      </div>:<></>
    }
    </div>
    
    </>
  );
}

export default DisplayArticle;
