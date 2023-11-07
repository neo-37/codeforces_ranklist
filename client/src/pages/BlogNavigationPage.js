import { Link } from "react-router-dom";

const BlogNavbar = ({ blog_button_text, render_both_blog_buttons }) => {
  return (
    <>
      <div
        className="container"
        style={{
          alignItems: "center",
          backgroundColor: "#D2B4DE",
          borderRadius: "5px",
          marginBottom: "1rem",
        }}
      >
        <div className="hstack gap-5">
          {render_both_blog_buttons ? (
            <Link
              to={
                blog_button_text === "All Blogs"
                  ? "/blogs/create-article"
                  : "/blogs"
              }
              className="p-2  btn btn-success"
              style={{ color: "black " }}
            >
              {blog_button_text === "All Blogs"
                ? "Create Article"
                : "All Blogs"}
            </Link>
          ) : (
            <></>
          )}

          <Link
            to={blog_button_text === "My Blogs" ? "/blogs/my-blogs" : "/blogs"}
            className="p-2 ms-auto btn"
            style={{ color: "black ", backgroundColor: "#0093FF " }}
          >
            {blog_button_text}
          </Link>

         
        </div>
      </div>
    </>
  );
};

export default BlogNavbar;
