 Ext.onReady(function(){

             Ext.QuickTips.init();
             //定义消息框显示秒数(0-9)秒
             displaySeconds=5;
             //定义登录处理函数
             var loginFunc=function(){
                  //Ext.get("promptText").dom.innerHTML="<span style=''>&nbsp</span>";
                 if (!loginForm.getForm().isValid()) {
                 displayLoginWin("lime","输入不合法");

                 return;
                };
             var username=loginForm.getForm().findField("username").getValue();
             var password=loginForm.getForm().findField("password").getValue();
             Ext.Ajax.request({
                 method:"POST",
                 url:"login",
                 params:["username="+username+"&password="+password],
                 success:function(response){
                     window.location="main";
                 },
                 failure:function(response){
                      var jsondata = Ext.decode(response.responseText);
                     displayLoginWin("lime",jsondata.msg)
                 }
             });

            }
             //定义登录处理函数ends

             //登录form
             var loginForm=new Ext.form.FormPanel({
                 anchorSize:"100%,100%",

                 defaults:{
                    xtype:"textfield",labelWidth:70, allowBlank:false
                 },

                 items:[
                        {xtype:"tbtext",html:"<h2>GY数据库运维平台</h2>",style:"margin-left:60px"},
                        {xtype:"textfield",cls:"loginFieldLabel",fieldLabel:"用户名",name:"username",style:"margin-left:32px;margin-top:40px",blankText:"用户名不能为空"},
                        {xtype:"textfield",cls:"loginFieldLabel",fieldLabel:"密&nbsp&nbsp&nbsp码",name:"password",inputType:"password",style:"margin-left:32px;margin-top:25px",blankText:"密码不能为空"},
                        {xtype:"label",html:"<a href='javascript:void(0);' id='forgetpassworda'>忘记密码?</a>",style:"margin-left:200px;margin-top:20px",id:"forgetpassword"},
                        {xtype:"slider",labelWidth:0,value:0,width:245,style:"margin-left:32px;margin-top:20px",maxValue:60,useTips:false,
                             listeners:{
                                  beforechange :function(slider,newValue,oldvalue,thumb){
                                       if (newValue>=48){
                                            try{
                                                Ext.getCmp("loginBtn").setDisabled(false);
                                                console.log(thumb.el.isDisable(false))
                                            }catch(err){
                                                return false;
                                            }
                                       } else{
                                            Ext.getCmp("loginBtn").setDisabled(true);
                                       }
                               }
                             }



                        },
                        {xtype:"button",id:"loginBtn",height:30,width:244,text:"登&nbsp&nbsp录",style:"margin-left:32px;margin-top:30px;margin-bottom:8px",disabled:true,handler:loginFunc}
                 ],
             });
            ////登录form ends






             var fs=new Ext.form.FieldSet({
                 title:"",
                 width:330,
                 height:320,
                 style:{background:'white'},
                 items:[loginForm]
             });



             var panel=new Ext.panel.Panel({
                 style:"margin-left:40%;margin-top:7%;background:'red'",
                 bodyStyle:{background:'#F5F5F5'},

                 items:[fs]
             });

             //主页面布局
             var viewPort=new Ext.Viewport({
                 layout:"fit",
                  style:{background:'#F5F5F5'},
                 items:[panel]
             });

             //忘记密码框
             var forgetPassword=function(){
                 Ext.Msg.alert("忘记密码","请联系相关人员!");

            }
            Ext.get('forgetpassworda').on('click',forgetPassword);
           //忘记密码框ends



     //消息弹出框
displayLoginWin=function(color,msg) {
    //如果消息弹出框不存在，那么就要新建一个
    if (!Ext.getCmp("promptWin")){
        {
            var promptLoginWin = new Ext.Window({
                title: "",
                id: "promptLoginWin",
                layout: "fit",
                width: 200,
                height: 50,
                x: document.body.clientWidth / 2-document.body.clientWidth / 11,
                y: 4,
                border: false,
                bodyBorder:false,
                closable: true,
                header: false,
                draggable:false,
                resizable:false,
                items: [
                    {html: "", id: "promptLogintext", style: "margin-top:15px;margin-left:5px"}
                ]
            });
        }
    } else{
        var promptLoginWin=promptwin=Ext.getCmp("promptLoginWin");
    }

    //显示消息框
    promptLoginWin.setBodyStyle("background-color", color);
    promptLoginWin.show();
    Ext.get("promptLogintext").dom.innerHTML = "温馨提示:" + msg + ".(" + displaySeconds + "秒)";
}
//信息弹出框ends


//定时器任务,更新消息框计时和关闭框
var taskLogin={
     run:function(){
         var timeInterval=Ext.get("promptLogintext").dom.innerHTML;
         if (parseInt(timeInterval.substr(-3,1))>0){
             Ext.get("promptLogintext").dom.innerHTML=timeInterval.substr(0,timeInterval.length-3)+(timeInterval.substr(-3,1)-1)+"秒)";
         };
         if (parseInt(timeInterval.substr(-3,1))==0)
         {
             Ext.get("promptLogintext").dom.innerHTML='';
             var promptLoginwin=Ext.getCmp("promptLoginWin");
             promptLoginwin.close();
         }
     },

     interval:1000
};
Ext.TaskManager.start(taskLogin);
 //消息弹出窗口ends
 });

