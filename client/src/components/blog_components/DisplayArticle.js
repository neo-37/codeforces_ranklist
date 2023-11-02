import { useEffect,useState } from "react";
import { useLocation } from "react-router-dom";
import htmlParser from "html-react-parser";

function DisplayArticle({ setRenderBothBlogs, setBlogButtonText }) {

  const [curHmtl, setCurHtml] = useState(<></>);
  const { state } = useLocation();
  console.log("display article", state);
  const article = state;

  useEffect(() => {
    setRenderBothBlogs(true);
    setBlogButtonText("My Blogs");

    if (article) {
      setCurHtml(htmlParser(article.article_html));
    }
  }, []);
  return (
    <div  style={{ marginTop:"4rem",marginLeft: "8rem", marginRight: "8rem" ,paddingBottom:"4rem"}}>
      <h3 className="pb-4 mb-4 fst-italic border-bottom">From the Firehose</h3>

      <article className="blog-post">
        {curHmtl}
       
      </article>
    </div>
  );
}

export default DisplayArticle;
