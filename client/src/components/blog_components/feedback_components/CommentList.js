import { Comment } from "./Comment"

export function CommentList({ comments,cf_user }) {
  return comments.map(comment => (
    <div key={comment._id} className="comment-stack">
      <Comment {...comment} cf_user={cf_user} />
    </div>
  ))
}