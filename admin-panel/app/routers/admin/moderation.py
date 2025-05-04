from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_admin_db, get_forum_db  # Оставьте абсолютный импорт
from app.models_admin import Admin, User, Report
from app.models_forum import Post, Comment
from app.schemas import PostOut, CommentOut, ReportOut
from app.routers.auth import get_current_admin
from app.utils.reputation import update_reputation  # Измененный импорт

router = APIRouter(prefix="/admin/moderation", tags=["Moderation"])
templates = Jinja2Templates(directory="templates")
@router.get("/dashboard")
async def moderation_dashboard(
    request: Request,
    admin_db: Session = Depends(get_admin_db),
    forum_db: Session = Depends(get_forum_db),
    admin: Admin = Depends(get_current_admin)
):
    pending_posts = forum_db.query(Post).filter(Post.status == "pending").all()
    pending_comments = forum_db.query(Comment).filter(Comment.status == "pending").all()
    pending_reports = admin_db.query(Report).filter(Report.status == "pending").all()

    return templates.TemplateResponse("moderation.html", {
        "request": request,
        "posts": pending_posts,
        "comments": pending_comments,
        "reports": pending_reports
    })

@router.get("/posts", response_model=list[PostOut])
def get_pending_posts(
    admin: Admin = Depends(get_current_admin),
    forum_db: Session = Depends(get_forum_db)
):
    return forum_db.query(Post).filter(Post.status == "pending").all()

@router.post("/posts/{post_id}")
def moderate_post(
    post_id: int,
    action: str,
    admin: Admin = Depends(get_current_admin),
    forum_db: Session = Depends(get_forum_db),
    admin_db: Session = Depends(get_admin_db)
):
    post = forum_db.query(Post).get(post_id)
    if not post:
        raise HTTPException(404, "Post not found")

    user = admin_db.query(User).get(post.author_id)
    if not user:
        raise HTTPException(404, "User not found")

    if action == "delete":
        update_reputation(user, -20, admin_db, "post_deleted")
        forum_db.delete(post)
    elif action == "approve":
        post.status = "approved"
    else:
        raise HTTPException(400, "Invalid action")

    forum_db.commit()
    return {"message": f"Post {action} successfully"}

@router.get("/comments", response_model=list[CommentOut])
def get_pending_comments(
    admin: Admin = Depends(get_current_admin),
    forum_db: Session = Depends(get_forum_db)
):
    return forum_db.query(Comment).filter(Comment.status == "pending").all()

@router.post("/comments/{comment_id}")
def moderate_comment(
    comment_id: int,
    action: str,
    admin: Admin = Depends(get_current_admin),
    forum_db: Session = Depends(get_forum_db),
    admin_db: Session = Depends(get_admin_db)
):
    comment = forum_db.query(Comment).get(comment_id)
    if not comment:
        raise HTTPException(404, "Comment not found")

    user = admin_db.query(User).get(comment.author_id)
    if not user:
        raise HTTPException(404, "User not found")

    if action == "delete":
        update_reputation(user, -15, admin_db, "comment_deleted")
        forum_db.delete(comment)
    elif action == "approve":
        comment.status = "approved"
    else:
        raise HTTPException(400, "Invalid action")

    forum_db.commit()
    return {"message": f"Comment {action} successfully"}