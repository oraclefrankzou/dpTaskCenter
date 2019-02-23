from app import dbSession
from app.model.task import MainTask as Task
from sqlalchemy import func,text
import app

class ServiceTaskQuery():
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


    def getAll(self,page,limit):
        whereStr=" 1=1 "
        limitStr = ""
        if ((page != None) and (limit != None)):
            limitStr = " order by taskBeginTime desc limit " + str((int(page) - 1) * int(limit)) + " , " + str(limit)

        sqlStr = whereStr + limitStr
        try:
            tasks = dbSession.query(Task).filter(text(sqlStr)).all()
            tasksTotal = dbSession.query(func.count(Task.id)).filter().all()
            results = self.getResult(tasks, totalTmps=tasksTotal)
            dbSession.rollback()
        except Exception as e:
            dbSession.rollback()
            app.logger.info(e.args.__str__())

        return results

