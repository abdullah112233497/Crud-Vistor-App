import jwt 
from datetime import datetime, timedelta
import bcrypt

Token_secret="iam_abdullah_qaisar"
ALGORITHM="HS256"
Expiry_time=30

def pw_hash(plain_pw):
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(plain_pw.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def create_token(data:dict):
    to_encode=data.copy()
    time_expiry=datetime.utcnow()+timedelta(minutes=Expiry_time)
    to_encode.update({'exp':time_expiry})
    token_jwt=jwt.encode(to_encode,Token_secret,algorithm=ALGORITHM)
    return token_jwt

def verify_token(plain_pw,hash_pw):
    try:
        return bcrypt.checkpw(plain_pw.encode('utf-8'), hash_pw.encode('utf-8'))
    except Exception:
        return False

def decode_token(token: str):
    try:
        payload = jwt.decode(token, Token_secret, algorithms=[ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return None