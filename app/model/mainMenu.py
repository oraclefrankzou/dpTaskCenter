

from sqlalchemy import Column,String,create_engine,Integer
from sqlalchemy.orm.session import sessionmaker
from sqlalchemy.orm import scoped_session
from sqlalchemy.ext.declarative import declarative_base
Base=declarative_base()
#左侧菜单功能

class MainMenu(Base):
    __tablename__="t_menu"
    id =Column(Integer,primary_key=True)
    menuText=Column(String(512))
    parentId=Column(Integer)
    iconCls=Column(String(512))
    leaf = Column(Integer)
    menuCmd =Column(String(512))

    def to_json(self):
        return ({
           "id":self.id,
           "text":self.menuText,
           "parentId":self.parentId,
            "iconCls": self.iconCls,
            "leaf":self.leaf,
            "menuCmd":self.menuCmd

        })