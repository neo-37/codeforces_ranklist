import { useEffect } from "react";
import axios from "axios";
import { Comment } from "./Comment"

export function CommentList({ comments,setComments,cf_user,replies,setReplies}) {
 

  const url = process.env.REACT_APP_API_URL;
  
  async function deleteComment(_id) {
    axios
    .post(`${url}/delete_cr`,{_id:_id})//getting the reply array
    .then(() => {
    
     console.log('comment deleted')
    })
    .catch((err) => {
      console.log("comment delete", err);
    });
  }

  const handleDeleteComment = async (commentId) => {
    
    await deleteComment(commentId);
    const updatedCommentList = comments.filter(comment => comment._id !== commentId);
    console.log('comments after delete',updatedCommentList)
    setComments(updatedCommentList);
    
  };

  const handleDeleteReply = async (replyId) => {
    
    await deleteComment(replyId);
    const updatedRepliesList = replies.filter(reply => reply._id !== replyId);
    console.log('comments after delete',updatedRepliesList)
    setReplies(updatedRepliesList);
    
  };

  useEffect(()=>{console.log("list check",comments,replies)},[])
  //only way to do this if can't do multiple maps in single ternary
  return(
  <>
  {comments&&
   comments.map(comment => (
    <div key={comment._id} className="comment-stack">
      <Comment {...comment} cf_user={cf_user} onCommentDelete={() =>{handleDeleteComment(comment._id)}} setComments={setComments}/>
    </div>))}
    
    {replies&&
     replies.map(reply => (
      <div key={reply._id} className="comment-stack">
        <Comment {...reply} cf_user={cf_user} onCommentDelete={() =>{handleDeleteReply(reply._id)}} setReplies={setReplies}/>
      </div>))}
  </>
  )
}