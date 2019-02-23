Ext.define("TaskRecord",{
            extend: "Ext.data.Model",
            fields:[
                {name:"id",type:"int"},
                {name:"taskName",type:"string"},
                {name:"taskId",type:"string"},
                {name:"taskStatus",type:"string"},
                {name:"taskBeginTime",type:"string"},
                {name:"taskEndTime",type:"string"},
                {name:"taskResult",type:"string"},
                     ]
            }
        );


taskStore=new Ext.data.Store({
             pageSize:20,
             autoLoad:false,
             proxy:{
                type:"ajax",
                method:"GET",
                url:"/api/taskQueryApi/getTaskQuery",
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

                     if (!successful){
                         displayWin("red","服务器返回失败");
                     }

               },
                "beforeload":function(){
                     var backupDate = taskForm.getForm().findField("backupDate").getValue();
                        var ip = taskForm.getForm().findField("ip").getValue();
                        //taskForm.getForm().reset();
                        if ((ip).length == 0) {
                            ip = "null"
                        };
                        if (!(backupDate)) {
                            backupDate = "null";
                        };
                    taskStore.proxy.extraParams=({
                           backupDate:backupDate,
                           ip:ip
                    });

                }
             },
             model:"TaskRecord",
        });


//定义表格展示栏位
taskColumns=[
            {header:"任务名称",dataIndex:"taskName"},
            {header:"任务ID",dataIndex:"taskId"},
            {header:"任务状态",dataIndex:"taskStatus"},
            {header:"开始时间",dataIndex:"taskBeginTime"},
            {header:"结束时间",dataIndex:"taskEndTime"},
             {header:"任务结果",dataIndex:"taskResult"}
        ]


 //定义分页工具条和结果展示表格
taskQueryPagingToolbar= new Ext.PagingToolbar({
                            store:taskStore,
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

taskQueryPagingToolbar.hide();
//定义结果展示表格
var taskGrid=new Ext.grid.GridPanel({
            title:" ",
            border:false,
            columns:taskColumns,
            store:taskStore,
            loadMask:true,
            forceFit:true,
            stripeRows:true,
            border:false,
            itemId:"taskQuery",
            columnLines:true,
            bbar:taskQueryPagingToolbar,
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
taskForm=new Ext.form.FormPanel({
            height:33,
            frame:true,
            layout:"column",
            fieldDefaults:{
                labelWidth:70,
            },
            defaultType:"textfield",
            items:[{xtype: "hidden", name: "id",columnWidth:.1},
                {fieldLabel: "IP地址", xtype: "textfield", name: "ip",columnWidth:.2},
                {fieldLabel: "备份日期", xtype: "datefield", name: "backupDate", columnWidth:.2,margin:"0 0 0 7"},
                //{xtype: "label", id:"prompttext",columnWidth:.1},
                {
                    xtype: "button",
                    columnWidth:.1,
                    name: "ok",
                    text: "查询",
                    buttonAlign: "center",
                    margin:"0 0 0 7",
                    handler: function () {
                        if (!taskForm.getForm().isValid()) {
                            displayWin("lime","输入不合法");
                            return
                        }
                       ////var backupDate = taskForm.getForm().findField("backupDate").getValue();
                       //var ip = taskForm.getForm().findField("ip").getValue();
                       ////taskForm.getForm().reset();
                       //if ((ip).length == 0) {
                       //    ip = "null"
                       //};
                       //if (!(backupDate)) {
                       //    backupDate = "null";
                       //};

                       // taskQueryPagingToolbar.tore=taskStore,
                        taskQueryPagingToolbar.moveFirst();
                        taskStore.proxy.extraParams=({
                          // //backupDate:backupDate,
                          // ip:ip
                        });


                        taskQueryPagingToolbar.show();
                        //taskStore.load();
                    }
                },
                //清空按钮
                {xtype:"button", columnWidth:.1,
                    margin:"0 0 0 7",
                    name: "clearBackupQuery",
                    text: "清空",
                    buttonAlign: "center",
                    handler:function(){
                      taskForm.getForm().reset();
                      //restoreGridPagingToolbar.moveFirst();

                    }
                }
                //清空按钮ends

                ],


        });

var taskQueryWin=new Ext.Panel({
               title: "任务查询",
               id:"taskQuery",
               itemId:"taskQuery",
               layout:"anchor",
               closable:true,

               items:[
                 taskForm,taskGrid
               ]
});

//定义页面布局.///

