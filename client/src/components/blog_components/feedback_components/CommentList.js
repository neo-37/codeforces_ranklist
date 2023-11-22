import { Comment } from "./Comment"

export function CommentList({ comments }) {
  return comments.map(comment => (
    <div key={comment._id} className="comment-stack">
      <Comment {...comment} />
    </div>
  ))
}