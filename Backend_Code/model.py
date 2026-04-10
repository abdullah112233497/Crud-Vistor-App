# model.py
from database import  Base
from sqlalchemy import String, Integer , Column
class User(Base):
    __tablename__="users"
    id=Column(Integer, primary_key=True)
    name=Column(String)
    f_name=Column(String)
    age=Column(Integer)
    user_email=Column(String)
    password=Column(String)
 