# main.py

from fastapi import FastAPI, Depends, HTTPException, status, Response, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from typing import Optional
from sqlalchemy.orm import Session # ORM Session import karein
from pydantic import BaseModel
from model import User,Base
from database import engine
from database import SessionLocal
import auth
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
class Create_token(BaseModel):
    access_token: str
    token_type: str

@app.get("/")
def home():
    return {"Message": "Home page"}
def get_current_user(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    if token.startswith("Bearer "):
        token = token.split(" ")[1]
        
    payload = auth.decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
        
    user_email = payload.get("sub")
    if not user_email:
        raise HTTPException(status_code=401, detail="Invalid token payload")
        
    user = db.query(User).filter(User.user_email == user_email).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
        
    return user

@app.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {"User": current_user}

@app.post("/logout")
def logout(response: Response):
    response.delete_cookie(key="access_token", samesite="lax")
    return {"Message": "Logged out successfully"}

@app.get("/users")
def get_users(db:Session=Depends(get_db), current_user: User = Depends(get_current_user)):
    users=db.query(User).all()
    if not users:
        raise HTTPException(status_code=404, detail="No users found")
    return {"Users in DB":users}
#Login endpoint:::
@app.post("/login", response_model=Create_token)
def login_users(response: Response, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user_exist = db.query(User).filter(User.user_email == form_data.username).first()
    if not user_exist or not auth.verify_token(form_data.password, user_exist.hash_pw):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_token(data={"sub": user_exist.user_email})
    
    # Store token in HttpOnly cookie
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        max_age=1800, # 30 minutes
        expires=1800,
        samesite="lax"
    )
    
    return {"access_token": access_token, "token_type": "bearer"}
@app.post("/add_user")
def add_user(user: User_structure, db: Session = Depends(get_db)):
    user_exist = db.query(User).filter(User.user_email == user.user_email).first()
    if user_exist:
        raise HTTPException(status_code=400, detail="Email already exists.")
    
    hashed_password = auth.pw_hash(user.password)
    new_user = User(
        name=user.name,
        f_name=user.f_name,
        age=user.age,
        user_email=user.user_email,
        hash_pw=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"Message": "User added successfully", "User": new_user}
@app.get("/get_user/{id}")
def get_user(id:int, db:Session=Depends(get_db), current_user: User = Depends(get_current_user)):
    user=db.query(User).filter(User.id==id).first()
    if not user:
        raise HTTPException(status_code=404,detail="User not found")
    return {"User":user}
@app.delete("/delete_user/{id}")
def delete_user(id:int, db:Session=Depends(get_db), current_user: User = Depends(get_current_user)):
    user=db.query(User).filter(User.id==id).first()
    db.delete(user)
    db.commit()
    return {"Deleted":user}
@app.put("/user_update/{id}")
def user_update(id:int, user_updated:Single_Update, db:Session=Depends(get_db), current_user: User = Depends(get_current_user)):
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Visitor not found")
    
    # Update only the fields that were provided in the request
    if user_updated.name is not None: user.name = user_updated.name
    if user_updated.f_name is not None: user.f_name = user_updated.f_name
    if user_updated.age is not None: user.age = user_updated.age
    if user_updated.password is not None: user.password = user_updated.password
    if user_updated.user_email is not None: user.user_email = user_updated.user_email
    
    db.commit()
    db.refresh(user)
    return {"Updated Visitor": user}
    

# Patch Endpoint:
@app.patch("/single_update/{id}")
def single_update(id: int, update_body: Single_Update, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
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