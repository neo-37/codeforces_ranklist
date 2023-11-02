import { useNavigate } from "react-router-dom";


const BlogCard = ({ article, g_user }) => {
  const navigate=useNavigate();
  let child_route=article.unique_key;
  const handleBlogCardClick=()=>{
    
    
  navigate(child_route.replace(/ /g, "-"),{state:article});
  }

  const handleEditClick=()=>{
    navigate('../create-article',{state:article});
  }
  console.log("blog card", g_user,"article",article);
  return (
    <div
      className="card col"
      style={{ maxWidth: "20rem", minWidth: "18rem" }}
    >
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
          <button className="btn btn-success" onClick={handleBlogCardClick}>Read</button>
          {g_user && g_user.email===article.email ? <button className="btn btn-primary" onClick={handleEditClick}>Edit</button> : <></>}
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
