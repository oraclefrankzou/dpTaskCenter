from flask import Blueprint

taskQueryApiBlueprint=Blueprint("taskQueryApi",__name__);

from app.api.taskQueryApi import taskqueryapi