Ext.define("ReportRecord",{
            extend: "Ext.data.Model",
            fields:[
                {name:"id",type:"int"},
                {name:"ip",type:"string"},
                {name:"reportDate",type:"string"},
                {name:"tableName",type:"string"},
                {name:"size",type:"string"},
                     ]
            }
        );


reportStore=new Ext.data.Store({
             pageSize:20,
             itemId:"reportStore",
             proxy:{
                type:"ajax",
                method:"GET",
                url:"/api/queryReportDataApi",
                reader:{
                    type:"json",
                    totalProperty:"total",
                    rootProperty:"results",
                },
             },
             model:"ReportRecord",
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
                     var reportDate =jobPutForm.getForm().findField("reportDate").getValue();
                      var ip = jobPutForm.getForm().findField("ip").getValue();
                        if ((ip).length == 0) {
                            ip = "null"
                        };
                        if (!(reportDate)) {
                            reportDate = "null";
                        };
                    reportStore.proxy.extraParams=({
                           reportDate:reportDate,
                           ip:ip
                    });

                }


             },

        });

          //$store.load();
//定义表格展示栏位
var reportColumns=[
            {header:"IP地址",dataIndex:"ip"},
            {header:"报表日期",dataIndex:"reportDate"},
            {header:"表名字",dataIndex:"tableName",autoSizeColumn : true},
            {header:"数量",dataIndex:"size"}
        ]

 //定义分页工具条和结果展示表格
 reportQueryPagingToolbar= new Ext.PagingToolbar({
                            store:reportStore,
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

 reportQueryPagingToolbar.hide();

 //定义结果展示表格

        var reportGrid=new Ext.grid.GridPanel({
            title:" ",
            border:false,
            columns:reportColumns,
            store:reportStore,
            loadMask:true,
            forceFit:true,
            stripeRows:true,
            border:false,
            columnLines:true,
            itemId:"reportQuery",
            bbar: reportQueryPagingToolbar,
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
jobPutForm=new Ext.form.FormPanel({
            //height:33,
            frame:true,
            //layout:"column",
            fieldDefaults:{
                labelWidth:70,
            },
            defaultType:"textfield",
            items:[{xtype: "hidden", name: "id",columnWidth:.1},
                {fieldLabel: "任务类型", xtype: "textfield", name: "jobName",allowBlank:false,blankText:"不能为空"},
                {fieldLabel: "任务参数", xtype: "textfield", name: "jobParams",allowBlank:false,blankText:"不能为空"},
                {fieldLabel: "调度参数", xtype: "textfield", name: "trigger",allowBlank:false,blankText:"不能为空"},
                {fieldLabel: "运行主机", xtype: "textfield", name: "targetHost",allowBlank:false,blankText:"不能为空"},
                {
                    xtype: "button",
                    columnWidth:.1,
                    margin:"0 0 0 7",
                    name: "ok",
                    text: "提交",
                    buttonAlign: "center",
                      handler: function () {
                        if (!jobPutForm.getForm().isValid()) {
                            displayWin("lime","输入不合法");
                            return
                        }
                        var jobName = jobPutForm.getForm().findField("jobName").getValue();
                        var jobParams = jobPutForm.getForm().findField("jobParams").getValue();
                        var trigger = jobPutForm.getForm().findField("trigger").getValue();
                        var targetHost = jobPutForm.getForm().findField("targetHost").getValue();

                        Ext.Ajax.request({
                            url:"/api/taskQueryApi/putCronTask",
                            method:"POST",
                            headers:{
                                 'Content-Type': 'application/json'
                            },
                            params :{jobName:jobName,jobParams:jobParams,trigger:trigger,targetHost:targetHost},
                            jsonData: true,
                            success:function (response) {
                                  console.log(targetHost);
                            },
                            failure:function (response) {

                            }
                        })

                    }
                },
                  //清空按钮
                {xtype:"button", columnWidth:.1,
                    margin:"0 0 0 7",
                    name: "clearReportQuery",
                    text: "清空",
                    buttonAlign: "center",
                    handler:function(){
                      jobPutForm.getForm().reset();
                      //reportQueryPagingToolbar.setPage=0;

                    }
                }
                //清空按钮ends
                ],






        });

var jobPutWin=new Ext.Panel({
               title: "任务新增",
               id:"jobPut",
               itemId:"jobPut",
               layout:"anchor",
               closable:true,
               items:[
                 jobPutForm,
               ]
});


//定义页面布局.///
