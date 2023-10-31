import BlogCard from "./BlogCard";

const Blogs=({articles})=>{
    

    return (
        <div className="container">
        <div className="row gy-5 ">
          {/* map is required because it return an array whereas forEach doesn't */}
          {articles.map((article, index) => {
            return <BlogCard article={article} key={index} />;
          })}
        </div>
      </div>
    )
}

export default Blogs