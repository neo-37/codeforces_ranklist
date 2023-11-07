import BlogCard from "./BlogCard";
import axios from "axios";
const Blogs=({articles,g_user,isAdmin,setmyarticles})=>{
    const url = process.env.REACT_APP_API_URL;


  const handleDeleteClick = (article) => {
    axios.post(`${url}/delete_article`,{unique_key:article.unique_key}).then((response) => {
      console.log("article deleted", response);
       setmyarticles(articles.filter((data) => data.unique_key !== article.unique_key));
    })
    .catch((err) => {
      console.log("delete article from server", err);
    });
  }

    return (
        <div className="container" >
        <div className="row gy-5 ">
          {/* map is required because it return an array whereas forEach doesn't */}
          {articles.map((article, index) => {
            return <BlogCard article={article} handleDeleteClick={handleDeleteClick}  key={index} g_user={g_user} isAdmin={isAdmin}/>;
          })}
        </div>
      </div>
    )
}

export default Blogs