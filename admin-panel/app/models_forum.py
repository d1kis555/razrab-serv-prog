from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from app.database import BaseForum  # Импорт базового класса для форум-базы

class Post(BaseForum):
    __tablename__ = "posts"
    id = Column(Integer, primary_key=True)
    title = Column(String(100), nullable=False)
    content = Column(Text, nullable=False)
    status = Column(String(20), default="pending")
    author_id = Column(Integer)  # Ссылка на ID из админ-базы (без ForeignKey)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Отношения внутри форум-базы
    comments = relationship("Comment", back_populates="post")

class Comment(BaseForum):
    __tablename__ = "comments"
    id = Column(Integer, primary_key=True)
    content = Column(Text, nullable=False)
    status = Column(String(20), default="pending")
    toxicity_score = Column(Float)
    post_id = Column(Integer, ForeignKey("posts.id"))
    author_id = Column(Integer)  # Ссылка на ID из админ-базы (без ForeignKey)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Отношения внутри форум-базы
    post = relationship("Post", back_populates="comments")