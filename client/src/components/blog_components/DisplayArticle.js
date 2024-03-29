import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import htmlParser from "html-react-parser";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import CfHandleColor from "../multipurpose_components/CfHandleColor";
import { CommentForm } from "./feedback_components/CommentForm";
import { CommentList } from "./feedback_components/CommentList";

function DisplayArticle({
  setRenderBothBlogs,
  setBlogButtonText,
  isAdmin,
  cf_user,
}) {
  const [curHtml, setCurHtml] = useState(<></>);
  const [article, setarticle] = useState(null);
  const [comments, setComments] = useState(null);

  const navigate = useNavigate();
  let { review_article_id, article_id, published_article_id } = useParams();

  const db_valid_article_id = (
    article_id
      ? article_id
      : review_article_id
      ? review_article_id
      : published_article_id
  ).replace(/-/g, " ");

  console.log(
    "display article params",
    article_id,
    review_article_id,
    published_article_id
  );

  const url = process.env.REACT_APP_API_URL;

  const retrieveArticleFromServer = () => {
    axios
      .get(`${url}/retrieve_article`, {
        params: published_article_id
          ? { published_key: db_valid_article_id }
          : { key: db_valid_article_id },
      })
      .then(({ data }) => {
        console.log("display test", data);
        //in respose data holds array of article objects
        if (
          review_article_id &&
          data[0].review_status !== 1 &&
          data[0].publish_status === true
        ) {
          axios
            .get(`${url}/retrieve_article`, {
              params: { published_key: db_valid_article_id },
            })
            .then(({ data }) => {
              setarticle(data[0]);
            })
            .catch((err) => {
              console.log("receive article to server2", err);
            });
        } else setarticle(data[0]);
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
  //handle the case when a version has been published and we reject the new edit, then it should be visible in the review section as published
  const rejectArticle = async () => {
    // setarticle({...article,review_status : -1});//this won't work due to async effect of useState, so even when the function is sync in nature its effect won't show immediately, we will have to handle the side effects in useEffect
    article.review_status = -1;

    const temp_article = { ...article, reject: true };
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
        unpublish: true,
      })
      .then(async (response) => {
        //the value will be null,won't be updated,title and mail are needed as we are making the key again everytime we save
        const updatedArticle = {
          title: article.title,
          email: article.email,
          publish_status: false,
          review_status: 0,
        };
        await sendArticleToServer(updatedArticle);
        navigate("..");
      })
      .catch((err) => {
        console.log("unpublish article fn err", err);
      });
  };
  const [cfcolor, setCfcolor] = useState(null);

  const get_cf_handle_details = () => {
    axios
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

  const onCommentCreate = async (message) => {
    axios
      .post(`${url}/create_comment`, {
        unique_key: article.unique_key,
        content: message,
        user: cf_user.cf_handle,
      })
      .then(async ({ data }) => {
        console.log(" onCommentCreate", data);
        // await retrieveCommentsFromServer()
        
        setComments([...comments, data]);
      })
      .catch((err) => {
        console.log("onCommentCreate", err);
      });
  };
  const retrieveCommentsFromServer = async () => {
    axios
      .get(`${url}/retrieve_comments`, {
        params: { unique_key: db_valid_article_id },
      })
      .then(({ data }) => {
        setComments(data);
        console.log("retrieve comments", data);
      })
      .catch((err) => {
        console.log("retrieve comments", err);
      });
  };

  useEffect(() => {
    if (article) {
      if (
        isAdmin &&
        article.review_status <= 0 &&
        article.publish_status === false
      )
        navigate("..");
      else {
        setCurHtml(htmlParser(article.article_html));
        get_cf_handle_details();
      }
    }
  }, [article]);

  useEffect(() => {
    setRenderBothBlogs(true);
    setBlogButtonText("My Blogs");

    retrieveArticleFromServer(db_valid_article_id);
    retrieveCommentsFromServer(db_valid_article_id);

    console.log("review article id", db_valid_article_id, article);
  }, []);

  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

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
      ) : (
        <>
          <div
            style={{
              marginLeft: "8rem",
              marginRight: "8rem",
              paddingBottom: "2rem",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <h1 className=" fst-italic pb-2 border-bottom">
                {article.title}
              </h1>
            </div>
            <div
              className=""
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <div style={{ marginLeft: "auto" }}>
                <h4>
                  By{" "}
                  {cfcolor ? <CfHandleColor value={cfcolor} /> : article.author}
                </h4>
                <p>
               {dateFormatter.format(Date.parse(article.date))}
                 
                </p>
              </div>
            </div>

            <div>
              <article className="blog-post">{curHtml}</article>
            </div>
          </div>
          <div
            className="container"
            style={{
              alignItems: "center",
              paddingBottom: "2rem",
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
          {cf_user && (
          <div className=" comment-container">
            <h3 className=" comments-title">Comments</h3>
           
              <div className="comment-area">
                <CommentForm onsubmit={onCommentCreate} />
                {comments != null && comments.length > 0 && (
                  <div className="mt-4">
                    <CommentList comments={comments} cf_user={cf_user} setComments={setComments}/>
                  </div>
                )}
              </div>
            
          </div>
          )
          }
        </>
      )}
    </>
  );
}

export default DisplayArticle;
