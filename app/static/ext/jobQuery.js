//修改一个任务ends


Ext.define("jobRecord",{
            extend: "Ext.data.Model",
            fields:[
                {name:"id",type:"int"},
                {name:"jobName",type:"string"},
                {name:"jobId",type:"string"},
                {name:"func",type:"string"},
                {name:"triggerType",type:"string"},
                {name:"triggerParam",type:"string"},
                {name:"nextRunTime",type:"string"},
                {name:"jobParams",type:"string"},
                {name:"targetHost",type:"string"},
            ]
       });



//jobNameStore, 用来返回所有当前系统中的jobName信息
jobNameStore=new Ext.data.Store({
           proxy: {
               url: "/api/jobDescQueryApi/getJobDesc",
               method: "GET",
               type: "ajax",
               reader: {
                   type: "json",
                   totalProperty: "total",
                   rootProperty: "results"
               },
           }

})


//jobNameStore, 用来返回所有当前系统中的jobName信息ends

//删除一个任务
var deleteJob=function(jobId,jobName){
    Ext.override(Ext.MessageBox, {
                  buttonText: { yes: "确定", no: "取消" }
                  });
    Ext.Msg.confirm("确认删除","任务名称:"+jobName+",任务ID:"+jobId,function(btn){


                   if ((btn)==("yes")) {
                       Ext.Ajax.request({
                                             type:"ajax",
                                             method:"GET",
                                             url:"/api/taskQueryApi/deleteCronTask",
                                             params:["jobId="+jobId],
                                             success:function(response){
                                                displayWin("lime","任务删除成功");
                                                jobStore.load();
                                             },
                                             failure:function(response){
                                                displayWin("red","任务删除失败");
                                             },
                       });
                   }
               });

}
//删除一个任务ends


//暂停一个任务
var pauseJob=function(jobId,jobName){
    Ext.override(Ext.MessageBox, {
                  buttonText: { yes: "确定", no: "取消" }
                  });
    Ext.Msg.confirm("确认暂停","任务名称:"+jobName+",任务ID:"+jobId,function(btn){


                   if ((btn)==("yes")) {

                       Ext.Ajax.request({

                                             type:"ajax",
                                             method:"GET",
                                             url:"/api/taskQueryApi/pauseCronTask",
                                             params:["jobId="+jobId],
                                             success:function(response){
                                                 displayWin("lime","任务停用成功");
                                                 jobStore.load();
                                                 //document.getElementById("resumeJobBtn"+jobId).disabled=false;
                                                // document.getElementById("pauseJobBtn"+jobId).disabled=true;

                                             },
                                             failure:function(response){
                                                displayWin("red","任务停用失败");
                                             },

                       });
                   }
               });

}
//暂停一个任务ends

//恢复一个任务
var resumeJob=function(jobId,jobName){

                       Ext.Ajax.request({

                                             type:"ajax",
                                             method:"GET",
                                             url:"/api/taskQueryApi/resumeCronTask",
                                             params:["jobId="+jobId],
                                             success:function(response){
                                                displayWin("lime","任务启动成功");
                                                jobStore.load();
                                                //document.getElementById("resumeJobBtn"+jobId).disabled=true;
                                                 //document.getElementById("pauseJobBtn"+jobId).disabled=false;
                                             },
                                             failure:function(response){
                                                displayWin("red","任务启动失败");
                                             },

                       });


}
//恢复一个任务ends


//修改一个任务
var updateJob=function(jobId){
                      jobName="";
                      jobParamsStore=new Ext.data.Store({
                                      proxy:{
                                     method:"GET",
                                     type:"ajax",
                                     url:"/api/taskQueryApi/getCronTaskByJobId",
                                     params:{jobId:jobId},
                                     reader:{type:"json", totalProperty:"total", rootProperty:"results"}
                                      },
                                      model:"jobRecord"
                       });
                      jobParamsStore.proxy.extraParams=({
                            jobId:jobId,
                        });
                      jobParamsStore.load({callback:function ()
                                                 {
                                                     jobName=jobParamsStore.getAt(0).data.jobName;
                                                     jobId=jobParamsStore.getAt(0).data.jobId;
                                                     triggerType=jobParamsStore.getAt(0).data.triggerType;
                                                     triggerParam=jobParamsStore.getAt(0).data.triggerParam;
                                                     targetHost=jobParamsStore.getAt(0).data.targetHost;
                                                     jobParams=jobParamsStore.getAt(0).data.jobParams;
                                                      updateJobForm=new Ext.form.FormPanel({
                                                             width:350,
                                                            fieldDefaults: {
                                                             labelWidth: 70,
                                                            width: 320,
                                                            } ,
                                 items:[
                                     {html:"任务名称:&nbsp&nbsp&nbsp&nbsp&nbsp"+jobName,margin: "6 0 10 0"},
                                     {xtype:"hiddenfield" ,name:"jobName",value:jobName},
                                     {html:"任务ID:&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"+jobId,margin: "6 0 10 0"},
                                     {xtype:"hiddenfield" ,name:"jobId",value:jobId},
                                     {xtype:"combobox",fieldLabel:"调度类型",name:"triggerType",allowBlank:false,blankText:"触发类型不能为空",
                                                                  editable:false,
                                                                  displayField: 'triggerTypeName',
                                                                  valueField: 'triggerTypeValue',
                                                                  store:new Ext.data.ArrayStore({
                                                                      fields:["triggerTypeName","triggerTypeValue"],
                                                                      data:[
                                                                          ["INTERVAL","Interval"],
                                                                          ["CRON","Cron"]
                                                                       ]
                                                                  }),
                                     },
                                     {xtype:"textfield",fieldLabel:"调度参数",name:"triggerParam",value:triggerParam,allowBlank:false,blankText:"触发条件不能为空"},
                                     {xtype:"textfield",fieldLabel:"运行主机",name:"targetHost",value:targetHost},



                                     {xtype:"textfield",fieldLabel:"运行参数",name:"jobParams",value:jobParams},

                                     //updateJobFormSubmit
                                     {xtype:"button",width:75,margin:"8 0 15 95",id:"updateJobFormSubmit",text:"提 交",handler:function(){
                                          var jobName=updateJobForm.getForm().findField("jobName").getValue();
                                          var jobId=updateJobForm.getForm().findField("jobId").getValue();
                                          var triggerType=updateJobForm.getForm().findField("triggerType").getValue();
                                          var triggerParam=updateJobForm.getForm().findField("triggerParam").getValue();
                                          var targetHost=updateJobForm.getForm().findField("targetHost").getValue();
                                          var jobParams=updateJobForm.getForm().findField("jobParams").getValue();
                                          if (!updateJobForm.getForm().isValid()) {
                                            displayWin("lime","输入不合法");
                                            return
                                          };

                                          Ext.Ajax.request({
                                              method:"POST",
                                              url:"/api/taskQueryApi/updateCronTask",
                                              headers:{
                                                  "Content-Type":"application/json"},
                                              jsonData: true,
                                              params:{jobId:jobId,jobName:jobName,jobParams:jobParams,triggerType:triggerType, triggerParam: triggerParam,targetHost:targetHost},
                                              success:function (reponse) {
                                                  displayWin("lime","任务修改成功");
                                                  jobStore.load();

                                              },

                                              failure:function (response) {
                                                    var reponseData=Ext.decode(response.responseText);
                                                                          if (reponseData.msg=="jobParamTypeError"){
                                                                              displayWin("red","任务修改失败,调度参数类型错误");
                                                                          }
                                                                          else {
                                                                              displayWin("red", "任务修改失败");
                                                                          }

                                              }


                                          });
                                          updateJobWin.close();
                                     }},
                                     //updateJobFormSubmit ends

                                      //updateJobFormSubmit
                                     {xtype:"button",margin:"8 0 15 20",width:75,id:"updateJobFormCancel",text:"取 消",handler:function(){
                                          updateJobWin.close();
                                     }},
                                     //updateJobFormSubmit ends
                                 ]
                      });

                      var updateJobWin=new Ext.window.Window({
                           title:"修改任务",
                           modal:true,
                           //draggable:false,
                           id:"updateJobWin",
                           resizable:false,
                           x: document.body.clientWidth/2-100,
                           y: 250,
                           items:[updateJobForm]
                       });

                     updateJobWin.show();
}


                                                 }
                                             );


 }


jobStore=new Ext.data.Store({
             pageSize:20,
             autoLoad:false,
             proxy:{
                type:"ajax",
                method:"GET",
                url:"/api/taskQueryApi/getCronTask",
                reader:{
                    type:"json",
                    totalProperty:"total",
                    rootProperty:"results",
                },
             },
             listeners:{
                 "load":function(response,records,successful){
                     if ((successful)&& (response.data.items.length==0)){
                         displayWin("lime","没有数据");

                     };


                      for (var i=0;i<records.length;i++)
                      {
                          if (records[i].data.jobStatus=="RUNNING"){
                              Ext.get("resumeJobBtn"+records[i].data.jobId).dom.disabled=true;
                          };

                           if (records[i].data.jobStatus=="STOP"){
                              Ext.get("pauseJobBtn"+records[i].data.jobId).dom.disabled=true;
                          };

                      };

                     if (!successful){
                         displayWin("red","服务器返回失败");
                     }

                 },
                 "beforeload":function(){


                }
             },
             model:"jobRecord",
        });


//定义表格展示栏位
jobColumns=[
            {header:"任务名称",dataIndex:"jobName"},
            {header:"任务ID",dataIndex:"jobId",width:230},
            {header:"任务功能",dataIndex:"func"},
            {header:"调度类型",dataIndex:"triggerType"},
             {header:"调度参数",dataIndex:"triggerParam"},
             {header:"任务状态",dataIndex:"jobStatus"},
            {header:"下次运行",dataIndex:"nextRunTime",width: 145},
             {header:"运行主机",dataIndex:"targetHost"},
             {header:"运行参数",dataIndex:"jobParams"},
              {header:"操作",dataIndex:"",width: 190,renderer:function(record,cellMetadata,re,rowindex,colindex,store1){
                  return  "<button class='x-btn-default-resume'  id='resumeJobBtn"+re.data["jobId"]+"'   type='button'  onclick='resumeJob(\""+re.data["jobId"]+'\",\"'+re.data["jobName"]+"\")' >启 用</button>"+
                          "<input class='x-btn-default-update' id='updateJobBtn"+re.data["jobId"]+"'  type='button' value='修 改' onclick='updateJob(\""+re.data["jobId"]+"\")' >"+
                          "<input class='x-btn-default-stop'   id='pauseJobBtn"+re.data["jobId"]+"' name='pauseJobBtn'  type='button' value='停 用' onclick='pauseJob(\""+re.data["jobId"]+'\",\"'+re.data["jobName"]+"\")' >"+
                          "<input class='x-btn-default-delete' id='deleteJobBtn'  type='button' value='删 除' onclick='deleteJob(\""+re.data["jobId"]+'\",\"'+re.data["jobName"]+"\")' >"


                  }
              }
        ]


 //定义分页工具条和结果展示表格
jobQueryPagingToolbar= new Ext.PagingToolbar({
                            store:jobStore,
                            lastText:"最后一页",
                            firstText:"第一页",
                            nextText:"下一页",
                            refreshText:"刷新",
                            prevText:"上一页",
                            displayMsg:'显示 {0} - {1} ,总条数 {2}',
                            afterPageText:"页,共 {0} 页",
                            beforePageText:"第",
                            emptyMsg:"没有数据显示",
                            displayInfo:true


 });

jobQueryPagingToolbar.hide();
//定义结果展示表格
var jobGrid=new Ext.grid.GridPanel({
            title:" ",
            border:false,
            columns:jobColumns,
            store:jobStore,
            loadMask:true,
            forceFit:true,
            stripeRows:true,
            border:false,
            itemId:"jobQuery",
            columnLines:true,
            bbar:jobQueryPagingToolbar,
            viewConfig : {
            listeners : {
              refresh : function (dataview) {
              Ext.each(dataview.panel.columns, function (column) {
              if (column.autoSizeColumn === true)
             column.autoSize();
              })
              }
            }
           }
 });




 //定义查询form
jobForm=new Ext.form.FormPanel({
            height:33,
            frame:true,
            layout:"column",
            fieldDefaults:{
                labelWidth:60,
            },
            defaultType:"textfield",
            items:[{xtype: "hidden", name: "id",columnWidth:.1},
                {fieldLabel: "任务名称", xtype: "textfield", name: "jobName",width:170},
                {fieldLabel: "任务ID", xtype: "textfield", name: "jobId", width:320,margin:"0 0 0 7"},
                {fieldLabel: "运行主机", xtype: "textfield", name: "targetHost", width:170,margin:"0 0 0 7"},
                {fieldLabel: "任务状态", xtype: "textfield", name: "jobStatus", width:170,margin:"0 0 0 7"},
                //{xtype: "label", id:"prompttext",columnWidth:.1},
                {
                    xtype: "button",
                    width:80,
                    name: "ok",
                    text: "查 询",
                    buttonAlign: "center",
                    margin:"0 0 0 7",
                    handler: function () {
                        if (!jobForm.getForm().isValid()) {
                            displayWin("lime","输入不合法");
                            return
                        }
                       var jobName = jobForm.getForm().findField("jobName").getValue();
                       var jobId = jobForm.getForm().findField("jobId").getValue();
                       var targetHost = jobForm.getForm().findField("targetHost").getValue();
                       var jobStatus = jobForm.getForm().findField("jobStatus").getValue();
                       ////jobForm.getForm().reset();
                       // jobQueryPagingToolbar.tore=taskStore,
                        // jobQueryPagingToolbar.moveFirst();
                        jobStore.proxy.extraParams=({
                            jobName:jobName,
                            jobId:jobId,
                            targetHost:targetHost,
                            jobStatus:jobStatus
                        });

                        jobQueryPagingToolbar.show();
                        jobStore.load();
                    }
                },
                //清空按钮
                {xtype:"button", width:80,
                    margin:"0 0 0 7",
                    name: "clearJobQuery",
                    text: "清 空",
                    buttonAlign: "center",
                    handler:function(){
                      jobForm.getForm().reset();
                      //restoreGridPagingToolbar.moveFirst();

                    }
                },

                //增加任务
                {xtype:"button", width:80,buttonAlign: "center", margin:"0 0 0 7",id:"addJobForm",text:"增 加 ",handler:function(){
                                      addJobForm=new Ext.form.FormPanel({
                                                 width:350,
                                                 fieldDefaults:{
                                                 labelWidth:70,
                                                 width:320,},
                                                 items:[
                                                      {xtype:"combobox",fieldLabel:"任务名称",name:"jobName",allowBlank:false,
                                                            editable:false,
                                                            displayField: 'jobName',
                                                            valueField: 'jobName',
                                                            store:jobNameStore

                                                      },
                                                      {xtype:"combobox",fieldLabel:"调度类型",name:"triggerType",allowBlank:false,
                                                             editable:false,
                                                             displayField: 'triggerTypeName',
                                                             valueField: 'triggerTypeValue',
                                                             store:new Ext.data.ArrayStore({
                                                                 fields:["triggerTypeName","triggerTypeValue"],
                                                                 data:[
                                                                     ["INTERVAL","Interval"],
                                                                     ["CRON","Cron"]
                                                                  ]
                                                             }),
                                                      },

                                                      {xtype:"textfield",fieldLabel:"调度参数",name:"triggerParam",allowBlank:false,blankText:"调度参数不能为空"},
                                                      {xtype:"textfield",fieldLabel:"运行主机",name:"targetHost"},
                                                      {xtype:"textfield",fieldLabel:"运行参数",name:"jobParams"},
                                                      //addJobFormSubmit
                                                      {xtype:"button",width:75,margin:"8 0 15 95",id:"addJobFormSubmit",text:"提 交",handler:function(){
                                                             var jobName=addJobForm.getForm().findField("jobName").getValue();
                                                             var triggerType=addJobForm.getForm().findField("triggerType").getValue();
                                                             var triggerParam=addJobForm.getForm().findField("triggerParam").getValue();
                                                             var targetHost=addJobForm.getForm().findField("targetHost").getValue();
                                                             var jobParams=addJobForm.getForm().findField("jobParams").getValue();
                                                             if (!addJobForm.getForm().isValid()) {
                                                                 displayWin("lime","输入不合法");
                                                                 return;
                                                             };

                                                             Ext.Ajax.request({
                                                                method:"POST",
                                                                url:"/api/taskQueryApi/putCronTask",
                                                                headers:{
                                                                     "Content-Type":"application/json"},
                                                                jsonData: true,
                                                                params:{jobName:jobName,jobParams:jobParams,triggerType:triggerType, triggerParam: triggerParam,targetHost:targetHost},
                                                                success:function (reponse) {
                                                                     displayWin("lime","任务增加成功");
                                                                     jobQueryPagingToolbar.show();
                                                                     jobQueryPagingToolbar.doRefresh();

                                                                 },

                                                                failure:function (response) {
                                                                     var reponseData=Ext.decode(response.responseText);
                                                                     if (reponseData.msg=="jobParamTypeError"){
                                                                         displayWin("red","任务增加失败,调度参数类型错误");
                                                                     }
                                                                     else {
                                                                         displayWin("red", "任务增加失败");
                                                                     }
                                                                }


                                                             });
                                                             addJobWin.close();

                                                       }},
                                                      //addJobFormSubmit ends
                                                      //addJobFormCancel
                                                     {xtype:"button",margin:"8 0 15 20",width:75,id:"addJobFormCancel",text:"取 消",handler:function(){
                                                         addJobWin.close();
                                                     }},
                                                    //updateJobFormCancel ends
                                                  ]
                                      });
                                      var addJobWin=new Ext.window.Window({
                                           title:"新增任务",
                                           modal:true,
                                           id:"addJobWin",
                                           resizable:false,
                                           x: document.body.clientWidth/2-100,
                                           y: 220,
                                           items:[addJobForm]
                                       });
                                      addJobWin.show();

                }},
                //增加任务ends


                //清空按钮ends

                ],


        });

var jobQueryWin=new Ext.Panel({
               title: "定时任务",
               id:"jobQuery",
               itemId:"jobQuery",
               layout:"anchor",
               closable:true,

               items:[
                 jobForm,jobGrid
               ]
});

//定义页面布局.///

