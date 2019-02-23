from app import dbSession
from app.model.job import CronJob
from sqlalchemy import func,text
import app

class ServiceJob():

    # 对结果进行处理，返回符合要求的格式
    def getResult(self, resultsTmps, totalTmps):
        datas = []
        results = {}
        if len(resultsTmps) == 0:
            results["results"] = 0
        else:
            for resultsTmp in resultsTmps:
                datas.append(resultsTmp.to_json())
            results["results"] = datas

        if len(totalTmps) == 0:
            results["total"] = 0
        else:
            results["total"] = totalTmps[0][0]
        return results

    #返回数据库中当前的调度cron信息
    def getAll(self,params,page,limit):
        whereStr=" 1=1 "
        limitStr = ""

        if ("jobName" in params.keys()):
             whereStr=whereStr+" and jobName=\'"+params["jobName"]+"\'"

        if ("jobId" in params.keys()):
             whereStr=whereStr+" and jobId=\'"+params["jobId"]+"\'"

        if ("targetHost" in params.keys()):
             whereStr=whereStr+" and targetHost=\'"+params["targetHost"]+"\'"

        if ("jobStatus" in params.keys()):
             whereStr=whereStr+" and jobStatus=\'"+params["jobStatus"]+"\'"

        if ((page != None) and (limit != None)):
            limitStr = " order by id desc limit " + str((int(page) - 1) * int(limit)) + " , " + str(limit)

        sqlStr = whereStr + limitStr
        try:
            jobs = dbSession.query(CronJob).filter(text(sqlStr)).all()
            jobsTotal = dbSession.query(func.count(CronJob.id)).filter(text(whereStr)).all()
            results = self.getResult(jobs, totalTmps=jobsTotal)
            dbSession.commit()
        except Exception as e:
            dbSession.rollback()
            app.logger.info("ERROR:ServiceJob.getAll():"+e.args.__str__())

        return results

    # 根据jobId返回一个job
    def getByJobId(self,jobId):
        job=None
        try:
            job = dbSession.query(CronJob).filter(CronJob.jobId==jobId).first()
            dbSession.commit()

        except Exception as e:
            dbSession.rollback()
            app.logger.info("ERROR:ServiceJob.getByJobId():" + e.args.__str__()+":"+jobId)

        return  job


    #新增一个job，存放到数据库中
    def putJob(self,job):
        try:
            dbSession.add(job)
            dbSession.commit()
        except Exception as e:
            app.logger.info("ERROR:ServiceJob.putJob():"+e.args.__str__())


    #删除一个job
    def deleteJob(self,jobId):
        try:
            dbSession.query(CronJob).filter(CronJob.jobId==jobId).delete()
            dbSession.commit()
        except Exception as e:
            dbSession.rollback()
            app.logger.info("ERROR:ServiceJob.deleteJob():" + e.args.__str__()+jobId)
