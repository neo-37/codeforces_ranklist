const BlogCard = ({ article, g_user }) => {
  console.log("blog card", g_user);
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
          <button className="btn btn-success">Read</button>
          {g_user && g_user.email===article.email ? <button className="btn btn-primary">Edit</button> : <></>}
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
