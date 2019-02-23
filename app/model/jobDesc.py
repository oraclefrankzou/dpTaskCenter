
from sqlalchemy import Column,String,Integer,DATE,DateTime
from sqlalchemy.ext.declarative import declarative_base
import datetime
import time
import app

#当前系统中可以使用的任务建模
Base=declarative_base()
class JobDesc(Base):
    __tablename__="t_job_desc"
    id = Column(Integer, primary_key=True)
    jobName = Column(String(512))
    jobParams = Column(String(2000))
    jobDesc=Column(String(2000))



    def __init__(self,jobName,jobParams=None,jobDesc=None):
        self.jobName=jobName
        self.jobParams=jobParams
        self.jobDesc=jobDesc

    #返回当前定时任务的josn表达式
    def to_json(self):

            data = {}
            data["id"] = self.id
            data["jobName"] = self.jobName
            data["jobParams"] = self.jobParams
            data["jobDesc"] = self.jobDesc
            return data

