
from sqlalchemy import Column,String,Integer,DATE,DateTime
from sqlalchemy.ext.declarative import declarative_base
import datetime
import time
import app

#存放定时任务的建模
Base=declarative_base()
class CronJob(Base):
    __tablename__="t_job"
    id = Column(Integer, primary_key=True)
    jobName = Column(String(512))
    jobId = Column(String(1000))
    triggerType = Column(String(500))
    triggerParam = Column(String(500))
    nextRunTime = Column(DateTime)
    jobParams = Column(String(1000))
    targetHost=Column(String(1000))
    func=Column(String(512))
    jobStatus = Column(String(512))



    def __init__(self,jobName,triggerType,triggerParam,targetHost,jobId=None,nextRunTime=None,jobParams=None,func=None,jobStatus=None):
        self.jobName=jobName
        self.jobId=jobId
        self.triggerType = triggerType
        self.triggerParam=triggerParam
        self.targetHost=targetHost
        self.nextRunTime=nextRunTime
        self.jobParams=jobParams
        self.func=func
        self.jobStatus=jobStatus

    #返回当前定时任务的josn表达式
    def to_json(self):

            data = {}
            data["id"] = self.id
            data["jobName"] = self.jobName
            data["jobId"] = self.jobId
            data["triggerType"] = self.triggerType
            data["triggerParam"] = self.triggerParam
            data["targetHost"]=self.targetHost
            data["func"] = self.func
            data["jobParams"] = self.jobParams


            #从真正的jobStore取得job的信息，得到下次运行时间和job状态
            try :
                job = app.dpScheduler.get_job(job_id=self.jobId)
                self.nextRunTime=job.next_run_time
                self.jobStatus=job.__unicode__()
            except Exception as e:
                self.nextRunTime=None
                app.logger.info("ERROR:CronJob():to_json(): "+e.args.__str__())

            #对下次运行时间进行处理
            if self.nextRunTime is not None:
                 data["nextRunTime"] = self.nextRunTime.strftime("%Y-%m-%d %H:%M:%S")
            else:
                data["nextRunTime"] =""

            #对job运行状态进行处理
            if self.nextRunTime  is not None:

                data["jobStatus"] = "RUNNING"
            else:
                data["jobStatus"] = "STOP"


            return data

