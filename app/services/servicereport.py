from app import   dbSession

from sqlalchemy import text,func
import app


#提供对t_report相关操作的服务

class ServiceReport():

    #对结果进行处理，返回符合要求的格式
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

    #根据ip或是backupDate查询结果
    def getByIpByDate(self,params,page=None,limit=None):
        results={}
        whereStr=" 1=1 "

        if ("ip" in params.keys()):
            whereStr = whereStr + " and  ip=\'" + params["ip"] + "\'"

        if ("reportDate" in params.keys()):
            whereStr = whereStr + " and  reportDate=\'" + params["reportDate"] + "\'"

        if ((page != None) and (limit != None)):
            limitStr = " order by ip limit " + str((int(page) - 1) * int(limit)) + " , " + str(limit)

        sqlStr =  whereStr + limitStr
        try:
           backups=dbSession.query(Report).filter(text(sqlStr)).all()
           backupsTotal=dbSession.query(func.count(Report.id)).filter(text(whereStr)).all()
           results = self.getResult(backups, totalTmps=backupsTotal)
           dbSession.rollback()
        except Exception as e:
            dbSession.rollback()
            app.logger.info(e.args.__str__())



        return  results

    #用来何存对像
    def saveReport(self,report):
        try:
            dbSession.add(report)
            dbSession.commit()
            return  1
        except Exception as e:
            dbSession.rollback()
            app.logger.info(e.args.__str__())
            return  0
