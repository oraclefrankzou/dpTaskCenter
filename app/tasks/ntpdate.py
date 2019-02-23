
from celerytask import celeryTask
import time
from app.services.serviceansible import ServiceAnsible
import yaml


def ntpDate(params):
     #提供对时服务
     funcParams=yaml.load(params["jobParams"])
     celerytask= celeryTask.delay(module="shell",args="ntpdate "+funcParams["server"],params=params)
     taskResult = celeryTask.AsyncResult(celerytask.task_id)
     while True:
          time.sleep(1)
          if taskResult.result is not None:
               print(taskResult.result)
               return  taskResult.result


