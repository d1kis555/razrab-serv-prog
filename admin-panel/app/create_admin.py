from app.database import BaseAdmin, engine

BaseAdmin.metadata.create_all(bind=engine)