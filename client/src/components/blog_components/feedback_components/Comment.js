import { IconBtn } from "./IconBtn";
import { FaEdit, FaHeart, FaRegHeart, FaReply, FaTrash } from "react-icons/fa";

import { CommentList } from "./CommentList";
import { CommentForm } from "./CommentForm";
import { useEffect, useState } from "react";
import  axios  from "axios";

export function Comment({
  _id,
  content,
  user,
  createdAt,
  updatedAt,
  like_count,
  liked_by_me,
  article_unique_key,
}) {
  const [areChildrenHidden, setAreChildrenHidden] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

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


  function onCommentUpdate(message) {}

  function onCommentDelete() {}

  function onToggleCommentLike() {}

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
        {/* {isEditing ? (
          <CommentForm
            autoFocus
            initialValue={message}
            onSubmit={onCommentUpdate}
          
          />
        ) : (
          <div className="message">{message}</div>
        )} */}
        <div className="message">{content}</div>
        <div className="footer">
          <IconBtn
            onClick={onToggleCommentLike}
            // disabled={toggleCommentLikeFn.loading}
            Icon={liked_by_me ? FaHeart : FaRegHeart}
            aria-label={liked_by_me ? "Unlike" : "Like"}
          >
            {like_count}
          </IconBtn>
          <IconBtn
            onClick={() => setIsReplying((prev) => !prev)}
            isActive={isReplying}
            Icon={FaReply}
            aria-label={isReplying ? "Cancel Reply" : "Reply"}
          />
          {/* {user.id === currentUser.id && (
            <>
              <IconBtn
                onClick={() => setIsEditing(prev => !prev)}
                isActive={isEditing}
                Icon={FaEdit}
                aria-label={isEditing ? "Cancel Edit" : "Edit"}
              />
              <IconBtn
                disabled={deleteCommentFn.loading}
                onClick={onCommentDelete}
                Icon={FaTrash}
                aria-label="Delete"
                color="danger"
              />
            </>
          )} */}
        </div>
        {/* {deleteCommentFn.error && (
          <div className="error-msg mt-1">{deleteCommentFn.error}</div>
        )} */}
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
             <CommentList comments={replies} />
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
