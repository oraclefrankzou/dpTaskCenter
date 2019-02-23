
from app.api.taskQueryApi import taskQueryApiBlueprint
from app.model.task import MainTask
from app.model.job import CronJob
from app.services.servicetaskquery import ServiceTaskQuery
from app.services.servicejob import ServiceJob
from flask import request,jsonify
from app.services.utils import getRequestParams
from apscheduler.triggers.interval import IntervalTrigger
from apscheduler.triggers.cron import CronTrigger
import app
import datetime
from app.tasks import *


@taskQueryApiBlueprint.route("/api/taskQueryApi/getTaskQuery",methods=["POST","GET"])

def getTaskQuery():
    serviceTaskQuery=ServiceTaskQuery()
    baseInfo={}
    results={}
    # 操作人
    #operationName = current_user.username
    #得到分页查询参数
    page = request.args.get("page")
    limit = request.args.get("limit")
    #得到其他查询参数
    #params=getRequestParams(request)
#
    #if ("reportDate" not in params.keys() and  "ip" not in params.keys()):
    #    params["reportDate"] =time.strftime("%Y-%m-%d",time.localtime())
#
    #if  ("reportDate"  in params.keys() and "ip" in params.keys()):
    #    reportDateStr = time.strptime(request.args.get("reportDate")[0:10], "%Y-%m-%d")
    #    params["reportDate"]=time.strftime("%Y-%m-%d", reportDateStr)


    #app.logger.info("操作人:"+operationName+" 数据查询参数: "+params.__str__())

    ##构造返回结果json
    try:
        results=serviceTaskQuery.getAll(page,limit)
        baseInfo["success"]=True
        baseInfo["msg"] = "data return sucess"
        return jsonify(dict(list(baseInfo.items())+list(results.items()))),200
    except Exception as e:
        baseInfo["success"] = False
        baseInfo["msg"] = e.args.__str__()
        app.logger.info(e.args.__str__())
        return jsonify(dict(list(baseInfo.items()) + list(results.items()))), 403

    return jsonify(results)



#得到当前已调度的任务清单
@taskQueryApiBlueprint.route("/api/taskQueryApi/getCronTask",methods=["POST","GET"])
def getCronTask():
    baseInfo={}
    page = request.args.get("page")
    limit = request.args.get("limit")
    params = getRequestParams(request)
    serviceJob=ServiceJob()


    try:
        results = serviceJob.getAll(params,page,limit)
        baseInfo["success"] = True
        baseInfo["msg"] = "dataReturnSuccess"
        return jsonify(dict(list(baseInfo.items()) + list(results.items()))), 200
    except Exception as e:
        baseInfo["success"] = False
        baseInfo["msg"] = "dataReturnFailure"
        app.logger.info(e.args.__str__())
        return jsonify(dict(list(baseInfo.items()) + list(results.items()))), 403


@taskQueryApiBlueprint.route("/api/taskQueryApi/getCronTaskByJobId",methods=["POST","GET"])
def getCronTaskByJobId():
    baseInfo={}
    params = getRequestParams(request)
    serviceJob=ServiceJob()

    try:
        results = serviceJob.getAll(params,page=None,limit=None)
        baseInfo["success"] = True
        baseInfo["msg"] = "dataReturnSuccess"
        return jsonify(dict(list(baseInfo.items()) + list(results.items()))), 200
    except Exception as e:
        baseInfo["success"] = False
        baseInfo["msg"] = "dataReturnFailure"
        app.logger.info(e.args.__str__())
        return jsonify(dict(list(baseInfo.items()) + list(results.items()))), 403




#新增一个调度任务
@taskQueryApiBlueprint.route("/api/taskQueryApi/putCronTask",methods=["POST","GET"])
def putCronTask():
      params=getRequestParams(request=request)
      if params["triggerType"]=="Interval":
          try:
               trigger = IntervalTrigger(seconds=int(params["triggerParam"]))
          except Exception as e:
              return jsonify({"success": False, "msg": "jobParamTypeError"}), 305

      if params["triggerType"]=="Cron":
          triggerParams=params["triggerParam"].split("#")
          try:
               trigger = CronTrigger(minute=triggerParams[0],hour=triggerParams[1],
                                day=triggerParams[2],month=triggerParams[3],day_of_week=triggerParams[4])
          except Exception as e:
              app.logger.info("ERROR:taskqueryapi:putCronTask()"+e.args.__str__())
              return jsonify({"success": False, "msg": "jobParamTypeError"}), 305

      try:

          job = CronJob(jobName=params["jobName"], triggerType=params["triggerType"],
                        triggerParam=params["triggerParam"],jobParams=params["jobParams"],
                        targetHost=params["targetHost"],func=params["jobName"])
          cronJob = app.dpScheduler.add_job(eval(job.jobName), trigger=trigger,args=[dict([["host",params["targetHost"]],["jobParams",params["jobParams"]],])])
          job.jobId=cronJob.id
          serviceJob = ServiceJob()
          serviceJob.putJob(job=job)
          return jsonify({"success":True,"msg":"cronJobAddSuccessful"})
      except Exception as e:
          app.logger.info("ERROR:putCronTask:"+e.args.__str__())
          return jsonify({"success": False, "msg": "cronJobAddFailure"}),305


#删除一个任务调度

@taskQueryApiBlueprint.route("/api/taskQueryApi/deleteCronTask",methods=["POST","GET"])
def deleteCronTask():
      params=getRequestParams(request=request)
      try:
         app.dpScheduler.remove_job(params["jobId"])
         serviceJob = ServiceJob()
         serviceJob.deleteJob(jobId=params["jobId"])
         return jsonify({"success":True,"msg":"cronJobDeleteSuccessful"})
      except Exception as e:
          app.logger.info("ERROR:deleteCronTask:"+e.args.__str__())
          return jsonify({"success": False, "msg": "cronJobdeleteFailure"}),305


#暂停一个任务调度

@taskQueryApiBlueprint.route("/api/taskQueryApi/pauseCronTask",methods=["POST","GET"])
def pauseCronTask():
      params=getRequestParams(request=request)

      try:
          app.dpScheduler.pause_job(params["jobId"])
          job= app.dpScheduler.get_job(params["jobId"])
          serviceJob = ServiceJob()
          cronJob=serviceJob.getByJobId(params["jobId"])
          cronJob.jobStatus=job.__unicode__()
          cronJob.nextRunTime=""
          serviceJob.putJob(job=cronJob)

          return jsonify({"success":True,"msg":"cronJobPauseSuccessful"})
      except Exception as e:
          app.logger.info("ERROR:pauseCronTask:"+e.args.__str__())
          return jsonify({"success": False, "msg": "cronJobPasueFailure"}),305

#恢复一个任务调度
@taskQueryApiBlueprint.route("/api/taskQueryApi/resumeCronTask",methods=["POST","GET"])
def resumeCronTask():
      params=getRequestParams(request=request)
      try:
          app.dpScheduler.resume_job(job_id=params["jobId"])
          job= app.dpScheduler.get_job(params["jobId"])
          serviceJob = ServiceJob()
          cronJob=serviceJob.getByJobId(params["jobId"])
          cronJob.jobStatus=job.__unicode__()
          cronJob.nextRunTime=job.next_run_time
          serviceJob.putJob(job=cronJob)
          return jsonify({"success":True,"msg":"cronJobResumeSuccessful"})
      except Exception as e:
          app.logger.info("ERROR:pauseCronTask:"+e.args.__str__())
          return jsonify({"success": False, "msg": "cronJobResumeFailure"}),305


#修改一个任务调度
@taskQueryApiBlueprint.route("/api/taskQueryApi/updateCronTask",methods=["POST","GET"])
def updateCronTask():
      params=getRequestParams(request=request)

      if params["triggerType"]=="Interval":
          try:
               trigger = IntervalTrigger(seconds=int(params["triggerParam"]))
          except Exception as e:
              app.logger.info("ERROR:taskqueryapi:updateCronTask()" + e.args.__str__())
              return jsonify({"success": False, "msg": "jobParamTypeError"}), 305

      if params["triggerType"]=="Cron":
          triggerParams=params["triggerParam"].split("#")

          try:
               trigger = CronTrigger(minute=triggerParams[0],hour=triggerParams[1],
                                day=triggerParams[2],month=triggerParams[3],day_of_week=triggerParams[4])
          except Exception as e:
              app.logger.info("ERROR:taskqueryapi:updateCronTask()"+e.args.__str__())
              return jsonify({"success": False, "msg": "jobParamTypeError"}), 305
      try:
          app.dpScheduler.modify_job(job_id=params["jobId"],trigger=trigger,next_run_time=None,args=[dict([["host",params["targetHost"]],["jobParams",params["jobParams"]],])])
          app.dpScheduler.resume_job(job_id=params["jobId"])
          job= app.dpScheduler.get_job(params["jobId"])
          serviceJob = ServiceJob()
          cronJob=serviceJob.getByJobId(params["jobId"])
          cronJob.triggerType=params["triggerType"]
          cronJob.triggerParam = params["triggerParam"]
          cronJob.jobParams=params["jobParams"]
          cronJob.targetHost=params["targetHost"]
          cronJob.jobStatus=job.__unicode__()
          cronJob.nextRunTime=job.next_run_time
          serviceJob.putJob(job=cronJob)
          return jsonify({"success":True,"msg":"cronJobUpdateSuccessful"})
      except Exception as e:
          app.logger.info("ERROR:pauseCronTask:"+e.args.__str__())
          return jsonify({"success": False, "msg": "cronJobUpdateFailure"}),305

