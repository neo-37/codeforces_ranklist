import { useState } from "react"
import "./Comment.css"
export function CommentForm({
 
  onSubmit,
  autoFocus = false,
  initialValue = "",
  setIsReplying
}) {
  const [message, setMessage] = useState(initialValue)

  function handleSubmit(e) {
    e.preventDefault()
    // setIsReplying((prev) => !prev)
    onSubmit(message).then(() => setMessage(""))
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="comment-form-row">
        <textarea
          autoFocus={autoFocus}
          value={message}
          onChange={e => setMessage(e.target.value)}
          className="message-input"
        />
        <button className="comment-btn" type="submit" >
         Post
        </button>
      </div>
      {/* <div className="error-msg">{error}</div> */}
    </form>
  )
}