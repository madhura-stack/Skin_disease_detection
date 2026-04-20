from sqlalchemy import Column, String, Float, DateTime, Text
from datetime import datetime
from database import Base


class History(Base):

    __tablename__ = "history"

    id = Column(String, primary_key=True, index=True)

    disease = Column(String)

    confidence = Column(Float)

    risk = Column(String)

    image = Column(Text)

    timestamp = Column(
        DateTime,
        default=datetime.utcnow
    )