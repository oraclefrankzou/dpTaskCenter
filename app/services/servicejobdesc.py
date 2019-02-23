from app import dbSession,logger
from app.model.jobDesc import JobDesc
from sqlalchemy import func,text
import app



#功能: 当前系统中可用的job操作
class ServiceJobDesc():
    def __init__(self):
        pass

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


    def getAll(self,params,page,limit):

        whereStr = " 1=1 "
        limitStr=""

        if ("jobName" in params.keys()):
            whereStr = whereStr + " and jobName=\'" + params["jobName"] + "\'"

        if ("jobParams" in params.keys()):
            whereStr = whereStr + " and jobParams=\'" + params["jobParams"] + "\'"

        if ("jobDesc" in params.keys()):
            whereStr = whereStr + " and jobDesc=\'" + params["jobDesc"] + "\'"

        if ((page != None) and (limit != None)):
            limitStr = " order by id desc limit " + str((int(page) - 1) * int(limit)) + " , " + str(limit)

        sqlStr = whereStr + limitStr
        try:
            jobDescs = dbSession.query(JobDesc).filter(text(sqlStr)).all()
            jobsDescTotal = dbSession.query(func.count(JobDesc.id)).filter(text(whereStr)).all()
            results = self.getResult(jobDescs , totalTmps=jobsDescTotal)
            dbSession.commit()
        except Exception as e:
            dbSession.rollback()
            app.logger.info("ERROR:ServiceJobDesc.getAll():" + e.args.__str__())

        return results
