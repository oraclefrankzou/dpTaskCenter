import logging

#python应用程序的配置，增加配置的时候要注意和上下对齐

class Settings:
     #flask(web)应用侦听IP
     HOST="0.0.0.0"

     #会话超时时间，单位分钟
     SESSION_TIMEOUT=180

     ##flask(web)运行端口
     PORT=5006

     ##MySQL服务器ip
     DBHOST="127.0.0.1"

     #Mysql服务器端口
     DBPORT=3306

     ##mysql服务器用户名
     DBUSER="root"

     ##mysql密码
     DBPASSWORD="root"

     ##mysql数据库名称
     DBNAME="db2"

     SECRET_KEY="rLxsunVLQeBRGLruLzjk"

     ##存放redis
     REDIS_HOST="10.0.0.3:6379"

     #定义日志级别和日志文件路径
     LOGGING_LEVEL = logging.INFO
     LOGGING_FILE = "app/logs/dp.log"