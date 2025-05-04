from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_forum_db, get_admin_db
from app.models_forum import Post, Comment
from app.models_admin import User
from app.schemas import PostCreate, PostOut, CommentCreate, CommentOut
from app.routers.auth import get_current_user
from app.utilities import check_toxicity
from app.utils.reputation import update_reputation
router = APIRouter(prefix="/forum", tags=["Forum"])


@router.post("/posts", response_model=PostOut, status_code=status.HTTP_201_CREATED)
def create_post(
        post: PostCreate,
        forum_db: Session = Depends(get_forum_db),
        admin_db: Session = Depends(get_admin_db),
        current_user: User = Depends(get_current_user)
):
    is_toxic, score = check_toxicity(post.content)

    new_post = Post(
        title=post.title,
        content=post.content,
        author_id=current_user.id,
        status="approved" if not is_toxic else "pending"
    )

    if is_toxic:
        update_reputation(current_user, -10, admin_db, "toxic_post")

    forum_db.add(new_post)
    forum_db.commit()
    forum_db.refresh(new_post)
    return new_post


@router.post("/posts/{post_id}/comments", response_model=CommentOut, status_code=201)
def create_comment(
        post_id: int,
        comment: CommentCreate,
        forum_db: Session = Depends(get_forum_db),
        admin_db: Session = Depends(get_admin_db),
        current_user: User = Depends(get_current_user)
):
    post = forum_db.query(Post).get(post_id)
    if not post:
        raise HTTPException(404, "Post not found")

    is_toxic, score = check_toxicity(comment.content)

    new_comment = Comment(
        content=comment.content,
        post_id=post_id,
        author_id=current_user.id,
        status="approved" if not is_toxic else "pending",
        toxicity_score=score
    )

    if is_toxic:
        update_reputation(current_user, -5, admin_db, "toxic_comment")

    forum_db.add(new_comment)
    forum_db.commit()
    forum_db.refresh(new_comment)
    return new_comment