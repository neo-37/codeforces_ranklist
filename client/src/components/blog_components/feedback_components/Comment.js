import { IconBtn } from "./IconBtn";
import { FaEdit, FaHeart, FaRegHeart, FaReply, FaTrash } from "react-icons/fa";

import { CommentList } from "./CommentList";
import { CommentForm } from "./CommentForm";
import { useEffect, useState } from "react";
import  axios  from "axios";

export function Comment({
  _id,
  content,
  user,//cf_handle of commentor
  createdAt,
  updatedAt,
  like_count,
  liked_by_me,
  article_unique_key,
  cf_user,
  onCommentDelete,
  setComments
}) {
  const [areChildrenHidden, setAreChildrenHidden] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [likeCount,setLikeCount]=useState(like_count)
  const [likedByMe,setLikedByMe]=useState(liked_by_me)

  const [replies,setReplies]=useState(null)

  const url = process.env.REACT_APP_API_URL;

  async function onReply(message) {
    axios
      .post(`${url}/create_reply`, {
        parent_id: _id,
        unique_key: article_unique_key,
        content: message,
        user: user,
      })
      .then(({data}) => {
        console.log(" onReply", data);
setReplies([...replies,data])
       
      })
      .catch((err) => {
        console.log("onReply", err);
      });
  }

  const retrieveRepliesFromServer =() => {
    axios
      .get(`${url}/retrieve_replies`,{params:{parent_id:_id}})//getting the reply array
      .then(({ data }) => {
       setReplies(data);
       console.log('retrieve replies',data)
      })
      .catch((err) => {
        console.log("retrieve replies", err);
      });
  };


  function onCommentUpdate(message) {
    
  }

  
  function onToggleCommentLike() {
    if(user===cf_user.cf_handle)
    {
      setLikedByMe((prev)=>!prev)//the state change doesn't take effect immediately
      // axios
      // .post(`${url}/current_user_like`,{_id:_id,likedByMe:!likedByMe})//getting the reply array
      // .then(({ data }) => {
      //  console.log('retrieve replies',data)
      // })
      // .catch((err) => {
      //   console.log("retrieve replies", err);
      // });

      if(likedByMe===true){
        setLikeCount((prevCount) => prevCount - 1)
      }
      else
      setLikeCount((prevCount) => prevCount + 1)
    }
    else
    setLikeCount(likeCount+1)
  }

  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  useEffect(()=>{

retrieveRepliesFromServer();
  },[])

  return (
    <>
      <div  className="comment">
        <div className="header">
          <span className="name">{user}</span>
          <span className="date">
            {createdAt&&dateFormatter.format(Date.parse(createdAt))}
          </span>
        </div>
        {isEditing ? (
          <CommentForm
            autoFocus
            initialValue={content}
            onSubmit={onCommentUpdate}
          
          />
        ) : (
          <div className="message">{content}</div>
        )}
        
        <div className="footer">
          <IconBtn
            onClick={onToggleCommentLike}
            Icon={likedByMe? FaHeart : FaRegHeart}
            aria-label={likedByMe ? "Unlike" : "Like"}
          >
            {likeCount}
          </IconBtn>
          <IconBtn
            onClick={() => setIsReplying((prev) => !prev)}
            isActive={isReplying}
            Icon={FaReply}
            aria-label={isReplying ? "Cancel Reply" : "Reply"}
          />
          {cf_user.cf_handle === user && (
            <>
              <IconBtn
                onClick={() => setIsEditing(prev => !prev)}
                isActive={isEditing}
                Icon={FaEdit}
                aria-label={isEditing ? "Cancel Edit" : "Edit"}
              />
              
            </>
          )}

          <IconBtn
               
                onClick={onCommentDelete}
                Icon={FaTrash}
                aria-label="Delete"
                color="danger"
              />
        </div>
        
      </div>
      {isReplying && (
        <div className="mt-1 ml-3">
          <CommentForm autoFocus onSubmit={onReply} setIsReplying={setIsReplying}/>
        </div>
      )}
      {replies?.length > 0 && (
        <>
          <div
            className={`nested-comments-stack`}
          >
            <button
              className="collapse-line"
              aria-label="Hide Replies"
              onClick={() => {setAreChildrenHidden(true)}}
            />
            <div className={`nested-comments ${
              areChildrenHidden ? "hide" : ""
            }`}>
             <CommentList replies={replies} cf_user={cf_user} setReplies={setReplies}/>
            </div>
          </div>
          <button
            className={`btn mt-1 ${!areChildrenHidden ? "hide" : ""}`}
            onClick={() => setAreChildrenHidden(false)}
          >
            Show Replies
          </button>
        </>
      )}
    </>
  );
}
