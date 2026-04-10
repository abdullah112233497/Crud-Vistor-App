# main.py

from fastapi import FastAPI, Depends,HTTPException
from fastapi.middleware.cors import CORSMiddleware

from typing import Optional
from sqlalchemy.orm import Session # ORM Session import karein
from pydantic import BaseModel
from model import User,Base
from database import engine
from database import SessionLocal
app = FastAPI() # 'API' capital karein 

# CORS middleware - allows Next.js frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Yeh line database mein tables create karti hai
# Isse pehle models ka import hona zaroori hai
Base.metadata.create_all(bind=engine)
def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
     db.close()
class User_structure(BaseModel):

    name: str
    f_name:str
    age:int
    password:str
    user_email:str

class Single_Update(BaseModel):

    name: Optional[str]=None
    f_name:Optional[str]=None
    age:Optional[int]=None
    password:Optional[str]=None
    user_email:Optional[str]=None
@app.get("/")
def home():
    return {"Message": "Home page"}
@app.get("/users")
def get_users(db:Session=Depends(get_db)):
    users=db.query(User).all()
    if not users:
        raise HTTPException(status_code=404, detail="No users found")
    return {"Users in DB":users}
@app.post("/add_user")
def add_user(user:User_structure,db:Session=Depends(get_db)):
    new_user=User(
        name=user.name,
        f_name=user.f_name,
        age=user.age,
        password=user.password,
        user_email=user.user_email
    )
    if not new_user:
        raise HTTPException(status_code=404,detail="User not Added")
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"Message":"User added successfully", "User":new_user}  
@app.get("/get_user/{id}")
def get_user(id:int, db:Session=Depends(get_db)):
    user=db.query(User).filter(User.id==id).first()
    if not user:
        raise HTTPException(status_code=404,detail="User not found")
    return {"User":user}
@app.delete("/delete_user/{id}")
def delete_user(id:int, db:Session=Depends(get_db)):
    user=db.query(User).filter(User.id==id).first()
    db.delete(user)
    db.commit()
    return {"Deleted":user}
@app.put("/user_update/{id}")
def user_update(id:int, user_updated:User_structure,db:Session=Depends(get_db)):
    user=db.query(User).filter(User.id==id).first()
    if not user:
        raise HTTPException(status_code=404,detail="User not found")
    user.name=user_updated.name
    user.f_name=user_updated.f_name
    user.age=user_updated.age
    user.password=user_updated.password
    user.user_email=user_updated.user_email
    
    db.commit()
    db.refresh(user)
    return{"Updated User":user}
    

# Patch Endpoint:
@app.patch("/single_update/{id}")
def single_update(id: int, update_body: Single_Update, db: Session = Depends(get_db)):
    # 1. Fetch the existing user from the database
    user_in_db = db.query(User).filter(User.id == id).first()

    if not user_in_db:
        raise HTTPException(status_code=404, detail="User not found")

    # 2. Convert the Pydantic model to a dictionary
    # exclude_unset=True ensures we ONLY get the fields the user sent in the request
    update_data = update_body.model_dump(exclude_unset=True)

    # 3. Dynamically update only the provided fields
    for key, value in update_data.items():
        setattr(user_in_db, key, value)

    # 4. Save changes
    db.commit()
    db.refresh(user_in_db)

    return {"Message": "User updated successfully", "User": user_in_db}