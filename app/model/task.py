
from sqlalchemy import Column,String,Integer,DATE,DateTime
from sqlalchemy.ext.declarative import declarative_base
import datetime
import time

#存放任务的建模
Base=declarative_base()
class MainTask(Base):
    __tablename__="t_task"
    id = Column(Integer, primary_key=True)
    taskName = Column(String(512))
    taskId = Column(String(1000))
    taskStatus = Column(String(100))
    taskBeginTime = Column(DateTime)
    taskEndTime = Column(DateTime)
    taskResult = Column(String(1000))

    def __init__(self,taskName,taskId,taskStatus,taskBeginTime,taskEndTime,taskResult=None):
        self.taskName=taskName
        self.taskId=taskId
        self.taskStatus=taskStatus
        self.taskBeginTime=taskBeginTime
        self.taskEndTime=taskEndTime
        self.taskResult=taskResult

    def to_json(self):

            data = {}
            data["id"] = self.id
            data["taskName"] = self.taskName
            data["taskId"] = self.taskId
            data["taskStatus"] = self.taskStatus
            data["taskBeginTime"] = self.taskBeginTime.strftime("%Y-%m-%d %H:%M:%S")
            if self.taskEndTime is not None:
                 data["taskEndTime"] = self.taskEndTime.strftime("%Y-%m-%d %H:%M:%S")
            else:
                data["taskEndTime"] =""

            data["taskResult"] = self.taskResult
            return data

