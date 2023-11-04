import BlogCard from "./BlogCard";

const Blogs=({articles,g_user,isAdmin})=>{
    

    return (
        <div className="container" >
        <div className="row gy-5 ">
          {/* map is required because it return an array whereas forEach doesn't */}
          {articles.map((article, index) => {
            return <BlogCard article={article} key={index} g_user={g_user} isAdmin={isAdmin}/>;
          })}
        </div>
      </div>
    )
}

export default Blogs