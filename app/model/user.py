
from  werkzeug.security import  generate_password_hash,check_password_hash
from flask_login import UserMixin
from time import time
from app import login
import app
from sqlalchemy import Column,String,create_engine,Integer
from sqlalchemy.orm.session import sessionmaker
from sqlalchemy.orm import scoped_session
from sqlalchemy.ext.declarative import declarative_base

Base=declarative_base()




class User(Base,UserMixin):
     __tablename__="t_user"
     id=Column(Integer,primary_key=True)
     username=Column(String(64))
     password=Column(String(128))


     def __init__(self,username,password,email=None,status=0):
         self.username=username
         self.password=generate_password_hash(password)

     @staticmethod
     def generate_password_hash_user(password):
         return  generate_password_hash(password)

     def check_password(self,password):
           return check_password_hash(self.password,password)


     def to_dict(self):
         data={
             "username":self.username,
              "password":self.password,
              "id":      self.id
         }

         return data



@login.user_loader
def load_user(id):
    try:
      return  app.dbSession.query(User).filter(User.id==id)[0]
    except Exception as e:
        return  None