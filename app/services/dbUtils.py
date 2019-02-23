from settings import Settings
import pymysql
from app import app
import time


##数据库操作类(t_report)
class DbUtils():

    def __init__(self):
         self.getConn()

    ##初始化数据库连接
    def getConn(self):

        try:
            self.conMysql = pymysql.connect(
                host=Settings.DBHOST,
                port=int(Settings.DBPORT),
                user=Settings.DBUSER,
                password=Settings.DBPASSWORD,
                charset="utf8",
                db=Settings.DBNAME
            )
        except Exception as e:
            app.logger.info(e.args.__str__())

    # 关闭数据库连接
    def closeConn(self):

        try:
            self.conMysql.close()
        except Exception as e:
            app.logger.info(e.args.__str__())

    # 执行sql,并返回结果
    def exeSQL(self, sqlStr):
        datas=[]
        curMysql = self.conMysql.cursor()
        try:
            curMysql.execute(sqlStr)
            datas=curMysql.fetchall()

        except Exception as e:
            app.logger.info(e.args.__str__())
        return datas
