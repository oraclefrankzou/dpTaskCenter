from app.api.mainMenuApi import mainMenuApiBlueprint
from app import dbSession
from flask import request,jsonify
from app.model.mainMenu import MainMenu
from flask_login import login_required
from app import app

#根据前端提交的查询，返回功能菜单
@mainMenuApiBlueprint.route("/api/mainMenu/getMainMenu")
def getMainMenu():
    datas=[]
    id=request.args.get("node");

    if id=='root':
            menus = dbSession.query(MainMenu).filter(MainMenu.parentId==0).all()
    else:
            menus=dbSession.query(MainMenu).filter(MainMenu.parentId==id).all()
    for item in menus:
            datas.append(item.to_json())
    try:
       dbSession.rollback()
    except Exception as e:
        app.logger.info(e.args.__str__())
        dbSession.rollback()

    return  jsonify(datas)




