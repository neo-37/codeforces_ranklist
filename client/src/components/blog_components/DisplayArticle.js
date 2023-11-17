import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate, useParams } from "react-router-dom";
import htmlParser from "html-react-parser";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import CfHandleColor from "../multipurpose_components/CfHandleColor";
import UrlNotFound from "../UrlNotFound";

function DisplayArticle({ setRenderBothBlogs, setBlogButtonText, isAdmin }) {
  const [curHmtl, setCurHtml] = useState(<></>);
  const [article, setarticle] = useState(null);

  const navigate = useNavigate();
  let { review_article_id, article_id, published_article_id } = useParams();

  const db_valid_article_id = (
    article_id
      ? article_id
      : review_article_id
      ? review_article_id
      : published_article_id
  ).replace(/-/g, " ");

  console.log("display article", article_id, review_article_id);

  const url = process.env.REACT_APP_API_URL;

  const retrieveArticleFromServer = () => {
    axios
      .get(`${url}/retrieve_article`, {
        params: published_article_id
          ? { published_key: db_valid_article_id }
          : { key: db_valid_article_id },
      })
      .then(({ data }) => {
        //in respose data holds array of article objects
        setarticle(data[0]);
        console.log("retrieve article", data[0]);
      })
      .catch((err) => {
        console.log("receive article to server", err);
      });
  };

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

  //#
  //handle the case when a version has been published and we reject the new edit, then it should be visibled in the review section as published
  //also on rejection in such case,the new edit is taking effect in published article
  const rejectArticle = async () => {
    // setarticle({...article,review_status : -1});//this won't work due to async effect of useState, so even when the function is sync in nature its effect won't show immediately, we will have to handle the side effects in useEffect
    article.review_status = -1;

    const temp_article={...article,reject:true}
    await sendArticleToServer(temp_article);
    navigate(".."); //doing navigation here instead of converting a button to link allows for the target component to fetch the data after the changes have taken effect
  };

  const publishArticle = async () => {
    article.review_status = 2;
    article.publish_status = true;
    console.log("dp now", article);
    await sendArticleToServer(article);
    navigate("..");
  };
  const unpublishArticle = () => {
    axios
      .post(`${url}/delete_article`, {
        unique_key: article.unique_key,
        retract: true,
      })
      .then(async (response) => {
        const updatedArticle = {
          ...article,
          publish_status: false,
          review_status: 0,
        };

        await sendArticleToServer(updatedArticle);
        navigate("..");
        console.log("article published retracted", response);
      })
      .catch((err) => {
        console.log("retract article from server", err);
      });
  };
  const [cfcolor, setCfcolor] = useState(null);

  const get_cf_handle_details = async () => {
    await axios
      .get(`${url}/cf_handle_details`, {
        params: { cf_handle: article.author },
      })
      .then(({ data }) => {
        setCfcolor({
          cf_handle: data.handle,
          rating: data.rating,
          display_article: true,
        });
      })
      .catch((err) => {
        console.log("get cf handle details DisplayArticle", err);
      });
  };

  useEffect(() => {
    if (article) {
      if (isAdmin && article.review_status <= 0) navigate("..");
      else setCurHtml(htmlParser(article.article_html));
      get_cf_handle_details();
    }
  }, [article]);

  useEffect(() => {
    // //to not review article which has been retracted
    // if (review_article_id && isAdmin && checkArticle() === false) {
    //   navigate("..");
    // }

    setRenderBothBlogs(true);
    setBlogButtonText("My Blogs");

    retrieveArticleFromServer(db_valid_article_id);

    console.log("review article id", db_valid_article_id, article);
  }, []);

  return (
    <>
      {!article ? (
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
      ) :(
        <>
          <div
            style={{
              marginTop: "4rem",
              marginLeft: "8rem",
              marginRight: "8rem",
              paddingBottom: "2rem",
            }}
          >
            <h3 className="pb-4 mb-4 fst-italic border-bottom">
              By {cfcolor ? <CfHandleColor value={cfcolor} /> : article.author}
            </h3>

            <article className="blog-post">{curHmtl}</article>
          </div>

          <div
            className="container"
            style={{
              alignItems: "center",
              padding: "0rem 8rem 3rem 4rem",
              borderRadius: "5px",
              //margin issues are due to border box property of main div,but it is also essential for leaderboard
            }}
          >
            {isAdmin ? (
              <div className="hstack gap-5">
                <button
                  // to=".."
                  className="p-2  btn"
                  style={{ color: "black", backgroundColor: "red" }}
                  onClick={
                    article.review_status === 1
                      ? rejectArticle
                      : unpublishArticle
                  }
                >
                  {article.review_status === 1 ? "Reject" : "Unpublish"}
                </button>
                {article.review_status === 1 ? (
                  <button
                    // to=".."
                    onClick={publishArticle}
                    className="p-2 ms-auto btn btn-success"
                    style={{ color: "black " }}
                  >
                    Publish
                  </button>
                ) : (
                  <></>
                )}
              </div>
            ) : (
              <></>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default DisplayArticle;
