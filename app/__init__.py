from flask import Flask
import logging
from settings import Settings
from flask_login import LoginManager,logout_user
from datetime import timedelta
from sqlalchemy import Column,String,create_engine,Integer
from sqlalchemy.orm.session import sessionmaker
from sqlalchemy.orm import scoped_session
from sqlalchemy.ext.declarative import declarative_base
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.jobstores.sqlalchemy import SQLAlchemyJobStore
from app.model.dpsqlalchemyjobstore import DpSQLAlchemyJobStore
from settings import Settings
import pymysql



app=Flask(__name__)

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"]=False
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=Settings.SESSION_TIMEOUT)
app.secret_key=Settings.SECRET_KEY
app.config['SQLALCHEMY_DATABASE_URI']="mysql+pymysql://"+Settings.DBUSER+":"+Settings.DBPASSWORD+"@"+Settings.DBHOST+":"+str(Settings.DBPORT)+"/"+Settings.DBNAME+"?charset=utf8"

##login

#login=LoginManager(app)

#为应用定义日志配置
logging.basicConfig(level=Settings.LOGGING_LEVEL,format="%(asctime)s-%(levelname)s-%(module)s-%(funcName)s- %(lineno)d:%(message)s  ",filename=Settings.LOGGING_FILE)

logger=logging.getLogger()


##flask sqlalchemy配置

engine=create_engine( "mysql+pymysql://"+Settings.DBUSER+":"+Settings.DBPASSWORD+"@"+Settings.DBHOST+":"+str(Settings.DBPORT)+"/"+Settings.DBNAME+"?charset=utf8",echo=True,pool_pre_ping=True,pool_recycle=30)
session_factory=sessionmaker(bind=engine)
dbSession=scoped_session(session_factory)




jobstores = {  'default': DpSQLAlchemyJobStore(url="mysql+pymysql://"+Settings.DBUSER+":"+Settings.DBPASSWORD+"@" \
                                              +Settings.DBHOST+":"+str(Settings.DBPORT)+"/"+Settings.DBNAME+"?charset=utf8mb4",\
                                               tablename='t_apscheduler_jobs') }

dpScheduler=BackgroundScheduler(jobstores=jobstores,misfire_grace_time=129600)

##定时任务处理器要启动


dpScheduler.start()



##注册jobDescQueryApiBlueprint
from app.api.jobDescQueryApi import jobDescQueryApiBlueprint

app.register_blueprint(jobDescQueryApiBlueprint)


#任务查询
from app.api.taskQueryApi import taskQueryApiBlueprint

app.register_blueprint(taskQueryApiBlueprint)



##注单功能单菜
from app.api.mainMenuApi import mainMenuApiBlueprint
app.register_blueprint(mainMenuApiBlueprint)


