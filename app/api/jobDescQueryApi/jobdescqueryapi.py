from flask import jsonify,request
from  app.services.utils import getRequestParams
from app.api.jobDescQueryApi import jobDescQueryApiBlueprint
from app import dbSession
from app.services.servicejobdesc import ServiceJobDesc
import app


#返回当前系统中所有的job_name
@jobDescQueryApiBlueprint.route("/api/jobDescQueryApi/getJobDesc")
def getJobDesc():
    baseInfo = {}
    serviceJobDesc=ServiceJobDesc()
    try:
         page = request.args.get("page")
    except Exception as e:
         page =None

    try:
         limit = request.args.get("limit")
    except Exception as e:
         limit =None

    params = getRequestParams(request)
    try:
        baseInfo["success"]=True
        baseInfo["msg"]="dataReturnSuccess"
        results=serviceJobDesc.getAll(params=params,page=page,limit=limit)
        return jsonify(dict(list(baseInfo.items())+list(results.items()))),200
    except Exception as e:
        baseInfo["success"] = False
        baseInfo["msg"] = "dataReturnFailure"
        app.logger.info("ERROR:jobdescqueryapi.getJobDesc():"+e.args.__str__())
        return jsonify(dict(list(baseInfo.items()))),403



