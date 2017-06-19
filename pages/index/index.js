//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userName:"",
    title: 'TODOLIST',
    today: '返回今天',
    tomorrow: "规划明天", 
    name: '姓名',
    nameINput:"请输入你的姓名",
    task:"任务",
    taskText:"今天想做什么呢？", 
    takkInput:"",
    time:'',   
    userInfo: {},
    taskArray:[],
    items: [{ checked: false,name:"check"}],
    subZt:false,
    subText:"提交",
    sublog: "记录查看",
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {    
    console.log('onLoad')
    var that = this;
    var date=new Date();
    var dateString = date.getFullYear() + "-" + (date.getMonth()+1)+"-"+date.getDate();
    that.setData({
      time: dateString
    })

    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userName: userInfo.nickName
      })
    })   
    console.log('onLoad');
  },

  //用户输入完成
  onkeydowns: function (e) {
    var data = e.detail.value;
  
    if(data){

      var date = new Date();
      var taskArray = this.data.taskArray;
      taskArray.push({id: date.getTime(), text:data, status: false, progress: 0 });  

      //数据改变后，使用setData更新页面数据
      this.setData({
        taskArray: taskArray,
        taskInput: "",
        subZt:true
      })             
    }
  },
  //输入姓名 失去焦点后
  userNameInput:function(e){
    
    this.setData({
      userName: e.detail.value
    })
  },
  //删除事件
  delData:function(e){
    var taskArray = this.data.taskArray;
    for (var key in taskArray){
      if (taskArray[key].id == e.target.id){
        taskArray.splice(key,1);
        
        this.setData({
          taskArray: taskArray,
          subZt:(taskArray==0)?false:true
        })
        break;
      }
    }
  },
  //选择框选择事件
  checkboxTap:function(e){
    var value = e.detail.value[0];
    var taskArray = this.data.taskArray;

    for (var key in taskArray){
      if (taskArray[key].id == e.target.id){
        if(value){
          taskArray[key].status = true;
          taskArray[key].progress=100;
        }else{
          taskArray[key].status = false;
          taskArray[key].progress = 0;
        }
        break;
      }
     
    }
    this.setData({
      taskArray: taskArray
    })
  },
  
  //改变进度值
  proessFun:function(e){
    var value = e.detail.value;
    var taskArray = this.data.taskArray;

    for (var key in taskArray) {
      if (taskArray[key].id == e.target.id) {
        if (value!="unfinded") {
          taskArray[key].progress = value;
          taskArray[key].status=(value==100)?true:false;
        }
        break;
      }
    }
    this.setData({
      taskArray: taskArray
    })
  },
  //数据提交
  subData:function(){
    var that=this;
    var param={
      name: this.data.userName,
      time: this.data.time,
      todolist: this.data.taskArray
    };
    this.setData({
      subText:"提交中...",
    })
    wx.request({
      url: 'https://minisite.hocodo.com/node/save', 
      data: param,
      method:"post",
      header: { 'content-type': 'application/json' },
      success: function (res) {
        that.setData({
          subText: "提交",
        })        
      }
    })
  },
  tomorrowclick: function (e) {
    this.timeFun();
  },  
  todayclick:function(e){    
    this.timeFun('tomorrow');
  },
  timeFun:function(e){
    var tomorrow = (e ==undefined)?86400000:0;
    var text = (e ==undefined)?"返回今天":"规划明天";
    var date = new Date();
    var secend = date.getTime() + tomorrow;
    var dateDay = new Date(secend);
    var time = dateDay.getFullYear() + "-" + (dateDay.getMonth()+1) + "-" + dateDay.getDate();
    this.setData({
      time: time,
      tomorrow: text
    })
  }

})


