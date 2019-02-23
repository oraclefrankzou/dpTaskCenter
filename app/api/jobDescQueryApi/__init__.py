from flask import Blueprint

jobDescQueryApiBlueprint=Blueprint("jobDescQueryApi",__name__)

from app.api.jobDescQueryApi import jobdescqueryapi