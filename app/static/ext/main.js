

Ext.onReady(function(){
           Ext.QuickTips.init();
           //定义消息框显示秒数(0-9)秒
           displaySeconds=5;

           var tabPanel=new Ext.TabPanel({
               frame: true,
               closeAction:'hide',
               title:false,
               listeners: {
                   beforeremove: function (panel,item) {
                       item.hide();
                       item.tab.hide();
                       return false;
                   }
               }
           });
           //任务查询功能实现
           var taskQuery=function(){

               if (tabPanel.child("#taskQuery")==null) {
                 var tab=tabPanel.add(
                        taskQueryWin
                 );
                 tabPanel.setActiveTab(tab);}

               else
                        tabPanel.child("#taskQuery").tab.show();
                        tabPanel.setActiveTab(tabPanel.child('#jobQuery'));
                        tabPanel.setActiveTab(tabPanel.child("#jobPut"));
                        tabPanel.setActiveTab(tabPanel.child('#taskQuery'));

           };

           //任务查询
           var jobQuery=function(){

                   if (tabPanel.child('#jobQuery')==null) {
                      var tab=tabPanel.add(
                          jobQueryWin
                      );
                     tabPanel.setActiveTab(tab);}

                   else
                        tabPanel.child("#jobQuery").tab.show();
                        tabPanel.setActiveTab(tabPanel.child('#taskQuery'));
                        tabPanel.setActiveTab(tabPanel.child("#jobPut"));
                        tabPanel.setActiveTab(tabPanel.child("#jobQuery"));


           };

           //任务新增
           var jobPut=function(){

                   if (tabPanel.child('#jobPut')==null) {
                      var tab=tabPanel.add(
                          jobPutWin
                      );
                     tabPanel.setActiveTab(tab);}

                   else
                        tabPanel.child("#jobPut").tab.show();
                        tabPanel.setActiveTab(tabPanel.child('#taskQuery'));
                        tabPanel.setActiveTab(tabPanel.child("#jobQuery"));
                        tabPanel.setActiveTab(tabPanel.child("#jobPut"));

           };

              //恢复设置功能
           var restoreSetting=function(){

                   if (tabPanel.child('#restoreSetting')==null) {
                      var tab=tabPanel.add(
                          restoreSettingWin
                      );
                     tabPanel.setActiveTab(tab);}

                   else
                         tabPanel.child("#restoreSetting").tab.show();
                        tabPanel.setActiveTab(tabPanel.child("#backupSetting"));
                        tabPanel.setActiveTab(tabPanel.child('#restoreQuery'));
                        tabPanel.setActiveTab(tabPanel.child('#reportQuery'));
                        tabPanel.setActiveTab(tabPanel.child('#restoreSetting'));
                        tabPanel.setActiveTab(tabPanel.child('#backupSetting'));
                        tabPanel.setActiveTab(tabPanel.child('#serverInformation'));
                        tabPanel.setActiveTab(tabPanel.child('#restoreSetting'));
           };

             //备份设置功能
           var backupSetting=function(){

                   if (tabPanel.child('#backupSetting')==null) {
                      var tab=tabPanel.add(
                         backupSettingWin
                      );
                     tabPanel.setActiveTab(tab);}

                   else
                        tabPanel.child("#backupSetting").tab.show();
                        tabPanel.setActiveTab(tabPanel.child("#backupSetting"));
                        tabPanel.setActiveTab(tabPanel.child('#restoreQuery'));
                        tabPanel.setActiveTab(tabPanel.child('#reportQuery'));
                        tabPanel.setActiveTab(tabPanel.child('#restoreSetting'));
                        tabPanel.setActiveTab(tabPanel.child('#backupSetting'));
                        tabPanel.setActiveTab(tabPanel.child('#serverInformation'));
                        tabPanel.setActiveTab(tabPanel.child('#backupSetting'));
           };

           //主从信息
           var standbySetting=function(){

                   if (tabPanel.child('#standbySetting')==null) {
                      var tab=tabPanel.add(
                         standbySettingWin
                      );
                     tabPanel.setActiveTab(tab);}

                   else
                        tabPanel.child("#standbySetting").tab.show();
                        tabPanel.setActiveTab(tabPanel.child("#backupQuery"));
                        tabPanel.setActiveTab(tabPanel.child('#restoreQuery'));
                        tabPanel.setActiveTab(tabPanel.child('#reportQuery'));
                        tabPanel.setActiveTab(tabPanel.child('#restoreSetting'));
                        tabPanel.setActiveTab(tabPanel.child('#backupSetting'));
                        tabPanel.setActiveTab(tabPanel.child('#serverInformation'));
                        tabPanel.setActiveTab(tabPanel.child('#standbySetting'));
           };

              //服务器信息
           var serverInformation=function(){

                   if (tabPanel.child('#serverInformation')==null) {
                      var tab=tabPanel.add(
                         serverInformationWin
                      );
                     tabPanel.setActiveTab(tab);}

                   else
                        tabPanel.child("#serverInformation").tab.show();
                        tabPanel.setActiveTab(tabPanel.child("#backupQuery"));
                        tabPanel.setActiveTab(tabPanel.child('#restoreQuery'));
                        tabPanel.setActiveTab(tabPanel.child('#reportQuery'));
                        tabPanel.setActiveTab(tabPanel.child('#restoreSetting'));
                        tabPanel.setActiveTab(tabPanel.child('#backupSetting'));
                        tabPanel.setActiveTab(tabPanel.child('#standbySetting'));
                        tabPanel.setActiveTab(tabPanel.child('#serverInformation'));
           };



         //左侧菜单功能区
        var treeStore=Ext.create("Ext.data.TreeStore",{
                proxy:{
                    type:"ajax",
                    url:"/api/mainMenu/getMainMenu",
                    reader:{
                      type:"json"
                    },
                }
            });

         var treePanel=Ext.create("Ext.tree.TreePanel",
                {
                    store:treeStore,
                    rootVisible:false,
                    lines:false,
                    width: 170,
                    cls: "treeLargeFont",
                    region:"west",
                    split:{width:3,style: {background:"#2A3E5E"}},
                    autoHeight:true,
                    listeners:{
                        "itemclick":function (node,e) {

                           if (e.data.menuCmd){
                              if (e.data.menuCmd=='taskQuery')
                              { taskQuery()}

                              if (e.data.menuCmd=='jobQuery')
                              { jobQuery()}

                              if (e.data.menuCmd=='jobPut')
                              { jobPut()}


                           }
                        },

                        "beforeitemcollapse":function(node){

                             node.data.iconCls="fa fa-folder";
                        },

                        "beforeitemexpand":function(node){

                             node.data.iconCls="fa fa-folder-open";

                        }
                    }

                }
            );
         //左侧菜单功能区ends

        //顶部导航条
nav=new Ext.Toolbar({
              height:60,
              itemId:"navId",
              style:{background:"#2A3E5E"}
          });
        nav.add({text:"",style:'background-image:url(static/resources/logo.png);background-repeat: no-repeat;width:44px;height:44px'});
        //nav.add("<image src='' ' >");
        nav.add({xtype:"tbtext",html:"<h2 style='color: white'>  GY运维任务中心 <sub>V0.10</sub></h2>",  style:"",border:false});
        nav.add("->");

         //当前登录用户功能
        Ext.define("Username", {
             extend: "Ext.data.Model",
             fields: [
                 {name: "data", type: "string"},
                 {name: "msg", type: "string"},
                 {name: "success", type: "string"},
             ]
         });
        var username=new Ext.data.Store({
                            proxy:{
                                    method:"GET",
                                    type:"ajax",
                                    url:"currentUser",
                                    success:function(response){},
                                    reader:{type:"json"}
                            },
                            model:"Username"
         });
         username.load({callback:function () {
                 var usernameTask=new Ext.util.DelayedTask(function(){nav.insert(3,("<label style='color: white'>当前登录用户: <b>"+username.getAt(0).get("data")+"</b></label>"));});
                 usernameTask.delay(1000);

             }});
         //console.log(username.getCount());
         //当前登录用户功能ends

         //密码修改功能
         nav.add(
             {html:"<label class='navtextclass' style='color: white'>修改密码</label>",xtype:"button",style:{background:"#2A3E5E"},border:false,handler:function(){
                 var passwordForm=new Ext.form.FormPanel({
                      height:130,
                      allowBlank:false,
                      defaults:{
                             xtype:"textfield",labelWidth:70,
                         },
                      items:[
                       {fieldLabel:"输入密码",style:"margin-left:2%;margin-top:4%",name:"password",inputType:"password"},
                       {fieldLabel:"重复密码",style:"margin-left:2%;margin-top:4%",name:"repeatpassword",inputType:"password"},
                       {text:"确定",xtype:"button",style:"margin-top:5%;margin-left:50%;margin-buttom:3%",width:70,
                       //处理登录
                          handler:function(){
                          if (!passwordForm.getForm().isValid()) {
                            displayWin("lime","输入不合法");
                            return
                        };
                          var repeatpassword=passwordForm.getForm().findField("repeatpassword").getValue();
                          var password=passwordForm.getForm().findField("password").getValue();
                          if (repeatpassword!=password) {
                            displayWin("yellow ","密码输入不一致");
                            return
                        }
                          Ext.Ajax.request({
                            method:"POST",
                            url:"changepassword",
                            params:["password="+password+"&repeatpassword="+repeatpassword],
                            success:function(response){
                                var jsondata = Ext.decode(response.responseText);
                                Ext.Msg.alert("信息",jsondata.msg,function(){
                                       Ext.Ajax.request({
                                          method:"POST",
                                          url:"logout",
                                          success:function(response){
                                          window.location="login";
                                        }});
                                });

                            },
                            failure:function(response){

                                 var jsondata = Ext.decode(response.responseText);
                                 displayWin("red",jsondata.msg);

                            }
                          });
                          }
                       }
                      ]
                });

                 //loginwindow开始
                 var changepasswordWindow=new Ext.window.Window({
                 title:"修改密码",
                 width:280,
                 //initCenter : false,
                 draggable:false,
                 resizable:false,
                 x: document.body.clientWidth/2,
                 y: 300,
                 modal:true,
                 items:[passwordForm]
                 });
               //changepasswordWindow.setPosition(600,200);
               changepasswordWindow.show();
               // loginwindow结束
              }}
         );
        //密码更改功能ends

         //退出功能
         nav.add(
             {html:"<label class='navtextclass' style='color: white'>退出</label>",xtype:"button",style:{background:"#2A3E5E"},border:false,handler:function(){
                  Ext.Ajax.request({
                            method:"POST",
                            url:"logout",
                            success:function(response){
                                window.location="login";
                            }})

             }}
         );

        //底部菜单功能
         var footer=new Ext.Toolbar({
             height:30,
             html:Ext.Date.format(new Date(),'Y')+' © '+"GY集团,版权所有! 开发和维护者:63",style:{background:"#000",color:"white"}
         });


        //主页面布局
         var mainLayout=new Ext.Viewport({
               layout:"border",

              items:[
                   {region:"north",items:[nav]},
                  {region:"south",items:[footer]},
                  {region:"center",items:[tabPanel], bodyStyle: {background: '#ffc'}},
                  treePanel]
          });


       Ext.getBody().unmask("loading......");

//消息弹出框
displayWin=function(color,msg) {
    //如果消息弹出框不存在，那么就要新建一个
    if (!Ext.getCmp("promptWin")){
        {
            var promptWin = new Ext.Window({
                title: "",
                id: "promptWin",
                layout: "fit",
                width: 200,
                height: 50,
                x: document.body.clientWidth / 2,
                y: 4,
                border: false,
                bodyBorder:false,
                closable: true,
                header: false,
                draggable:false,
                resizable:false,
                items: [
                    {html: "", id: "prompttext", style: "margin-top:15px;margin-left:5px"}
                ]
            });
        }
    } else{
        var promptWin=promptwin=Ext.getCmp("promptWin");
    }

    //显示消息框
    promptWin.setBodyStyle("background-color", color);
    promptWin.show();
    Ext.get("prompttext").dom.innerHTML = "温馨提示:" + msg + ".(" + displaySeconds + "秒)";
}
//信息弹出框ends


//定时器任务,更新消息框计时和关闭框
var task={
     run:function(){
         var timeInterval=Ext.get("prompttext").dom.innerHTML;
         if (parseInt(timeInterval.substr(-3,1))>0){
             Ext.get("prompttext").dom.innerHTML=timeInterval.substr(0,timeInterval.length-3)+(timeInterval.substr(-3,1)-1)+"秒)";
         };
         if (parseInt(timeInterval.substr(-3,1))==0)
         {
             Ext.get("prompttext").dom.innerHTML='';
             var promptwin=Ext.getCmp("promptWin");
             promptwin.close();
         }
     },

     interval:1000
};
Ext.TaskManager.start(task);
 //消息弹出窗口ends

 });

