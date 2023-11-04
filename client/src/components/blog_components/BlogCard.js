import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect ,useState} from "react";

const BlogCard = ({ article, g_user, isAdmin }) => {
  const [localArticle, setLocalArticle] = useState(article); // Use local state

  const navigate = useNavigate();
  let child_route = article.unique_key;
  const handleReadClick = () => {
    
    navigate(child_route.replace(/ /g, "-"), { state: article });
  };
  const handleReviewClick = () => {
    navigate(child_route.replace(/ /g, "-"), { state: article });
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

  const retractArticle = () => {
    // Update the local article state
    const updatedArticle = { ...localArticle, review_status: 0 };
    setLocalArticle(updatedArticle);

    // Send the updated article to the server
    sendArticleToServer(updatedArticle);
  };

  console.log("blog card", g_user, "article", article, isAdmin);
  return (
    <div className="card col" style={{ maxWidth: "20rem", minWidth: "18rem" }}>
      <img
        src="https://picsum.photos/200"
        className="rounded float-start"
        alt="..."
      />
      <div className="card-body">
        <h5 className="card-title">{article.title}</h5>
        <p className="card-text" style={{ color: "" }}>
          #dp
        </p>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            className="btn btn-success"
            onClick={isAdmin ? handleReadClick : handleReviewClick}
          >
            {isAdmin ? "Review" : "Read"}
          </button>
          {!isAdmin && g_user && g_user.email === article.email ? (
            <div className="btn-group" >
              <button
                type="button"
                className="btn btn-info dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Action
              </button>
              <ul className="dropdown-menu" style={{backgroundColor:"#212529"}}>
                <li >
                  <button className="dropdown-item" style={{color:"#DEE2E6"}} onClick={handleEditClick}>
                    {localArticle.review_status===-1?"Edit To Publish":"Edit"}
                  </button>
                </li>
                {article.review_status>=0?
                <>
                <li>
                  <hr className="dropdown-divider" />
                </li>
               
                <li>
                  <button className="dropdown-item" style={{color:"#DEE2E6"}} onClick={localArticle.review_status>=1?retractArticle:makeReviewRequest}>
                    {
                      localArticle.review_status>=1?"Retract Article":"Request Publish"
                    }
                  </button>
                </li>
                </>
                :<></>
                }
              </ul>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
