import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

const BlogCard = ({ article, g_user, isAdmin, handleDeleteClick }) => {
  const [localArticle, setLocalArticle] = useState(article); // Use local state

  const navigate = useNavigate();
  let child_route = article.unique_key;

  //gotta endcode the route else for characters like ? in the end it won't be accessible in params in the target component
  const handleReadClick = () => {
    navigate(encodeURIComponent(child_route.replace(/ /g, "-")), {
      state: article,
    });
  };
  const handleReviewClick = () => {
    navigate(encodeURIComponent(child_route.replace(/ /g, "-")), {
      state: article,
    });
  };
  const handleEditClick = () => {
    navigate("../create-article", { state: article });
  };

  const url = process.env.REACT_APP_API_URL;

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

  const makeReviewRequest = () => {
    // Update the local article state
    const updatedArticle = { ...localArticle, review_status: 1 };
    setLocalArticle(updatedArticle);

    // Send the updated article to the server
    sendArticleToServer(updatedArticle);
  };

  const retractPublishRequest = () => {
    // Update the local article state
    const updatedArticle = { ...localArticle, review_status: 0 };
    setLocalArticle(updatedArticle);

    // Send the updated article to the server
    sendArticleToServer(updatedArticle);
  };

  //removed article from published articles
  const retractPublishedArticle = () => {
    axios
      .post(`${url}/delete_article`, {
        unique_key: localArticle.unique_key,
        retract: true,
      })
      .then((response) => {

    const updatedArticle = { ...localArticle, publish_status: false ,review_status:0};
    setLocalArticle(updatedArticle);

    sendArticleToServer(updatedArticle);
        console.log("article published retracted", response);
      })
      .catch((err) => {
        console.log("retract article from server", err);
      });
  };

  const revertArticleToLatestPublisedVersion = () => {
    axios
      .get(`${url}/retrieve_article`,{params: {
        published_key: localArticle.unique_key,
      }})
      .then(({data}) => {
        console.log('test',data)
        if(data.length)
        {
        
        const updatedArticle = { ...localArticle,html_string:data[0].article_html,title:data[0].title,ops_array:data[0].ops_array,review_status:2 };
        setLocalArticle(updatedArticle);
        sendArticleToServer(updatedArticle);
        }
      })
      .catch((err) => {
        console.log("retract article from server", err);
      });
  };
  return (
    //making div clickable will envelope all buttons in it and they will be rendered useless
    <div className="card col" style={{ maxWidth: "20rem", minWidth: "18rem" }}>
      <img
        src="https://picsum.photos/200"
        className="rounded float-start"
        alt="..."
      />
      <div className="card-body">
        <h5
          onClick={isAdmin ? handleReviewClick : handleReadClick}
          className="card-title"
          style={{ textDecoration: "underline", cursor: "pointer" }}
        >
          {article.title}
        </h5>
        <p className="card-text" style={{ color: "" }}>
          #dp
        </p>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            className={
              localArticle.review_status === 1
                ? "btn btn-warning"
                : localArticle.review_status === 2
                ? "btn btn-success"
                : localArticle.review_status === -1
                ? "btn btn-danger"
                : "btn btn-primary"
            }
            onClick={isAdmin ? handleReviewClick : handleReadClick}
          >
            {isAdmin
              ? (localArticle.review_status === 1
                ? "Review"
                : "Published")
              : "Read"}
          </button>
          {!isAdmin && g_user && g_user.email === localArticle.email ? (
            <div className="btn-group">
              <button
                type="button"
                className={!localArticle.publish_status?"btn btn-info dropdown-toggle":"btn btn-success dropdown-toggle"}
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Action
              </button>
              <ul
                className="dropdown-menu"
                style={{ backgroundColor: "#212529" }}
              >
                <li>
                  <button
                    className="dropdown-item"
                    style={{ color: "#DEE2E6" }}
                    onClick={handleEditClick}
                  >
                    {localArticle.review_status === -1
                      ? "Edit To Publish"
                      : "Edit"}
                  </button>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    style={{ color: "#DEE2E6" }}
                    onClick={() => {
                      handleDeleteClick(article);
                    }}
                  >
                    Delete Article
                  </button>
                </li>
                {[0, 1].includes(localArticle.review_status) ? (
                  <>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>

                    <li>
                      <button
                        className="dropdown-item"
                        style={{ color: "#DEE2E6" }}
                        onClick={
                          localArticle.review_status === 1
                            ? retractPublishRequest
                            : makeReviewRequest
                        }
                      >
                        {localArticle.review_status === 1
                          ? "Retract Publish Request"
                          : "Request Publish"}
                      </button>
                    </li>
                  </>
                ) : null}

                {localArticle.publish_status === true ? (
                  <>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>

                    <li>
                      <button
                        className="dropdown-item"
                        style={{ color: "#DEE2E6" }}
                        onClick={retractPublishedArticle}
                      >
                        Retract Article
                      </button>
                    </li>

                    {localArticle.review_status !== 2 ? (
                      <>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>

                        <li>
                          <button
                            className="dropdown-item"
                            style={{ color: "#DEE2E6" }}
                            onClick={revertArticleToLatestPublisedVersion}
                          >
                            Revert To Lastest Published Version
                          </button>
                        </li>
                      </>
                    ) : null}
                  </>
                ) : null}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
