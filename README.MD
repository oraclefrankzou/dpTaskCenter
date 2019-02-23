功能:

   提供了一个统一的定时任务分发器

主要的技术:
 前端:extjs 6.0
 后端: python 3,flask框架,sqlalchemy,celery,ansible,apscheduler

描述:

  传统上每台服务器定时去执行cron job,通过本平台，我们可以由服务器
统一来调度cron任务运行，通过服务器可以不断扩展新的任务，只需进行简
单的开发即可进行自定义ansible任务;

.
界面:

![image](https://github.com/oraclefrankzou/dpTaskCenter/blob/master/images/20190223164045.jpg)