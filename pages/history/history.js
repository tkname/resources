//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userName: "",
    time:"",
    header:"TODOLIST汇总信息",
    list:"",
    clickNumText:0,
    re:"情况",
    id:"",
    listStak:"",
    name:"",
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this;
    var date = new Date();
    var dateString = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    that.setData({
      time: dateString
    })
    this.request();

    // //调用应用实例的方法获取全局数据
    // app.getUserInfo(function (userInfo) {
    //   //更新数据
    //   that.setData({
    //     userName: userInfo.nickName
    //   })
    // })
    console.log('onLoad');
  },
  //时间点击处理
  datePickerBindchange:function(e){
    var arr = e.detail.value.split("-");
    var month=(arr[1]<10)?arr[1].slice(1):arr[1];
    var date = (arr[2] < 10) ? arr[2].slice(1) : arr[2];
    var time=arr[0]+"-"+month+"-"+date;
    this.setData({
      time: time
    })    
    this.request();
  },
  //数据处理
  request:function(){   
    var that=this;
    wx.request({
     url: 'https://minisite.hocodo.com/node/day?time='+this.data.time,
     method:"get",
    //  header: { 'content-type': 'application/json' },
     success: function (res) {
      var zt=false;
      var arrLeng = res.data.data.length;
      if (res.data.code==1){
        that.setData({
          list: (arrLeng>0)?res.data.data:"",
          name: (arrLeng > 0)?res.data.data[0].name:"",
          listStak: (arrLeng > 0)?JSON.parse(res.data.data[0].todo):""
        })
       }else{
         console.log("error")       
       }

       
     },
     error:function(res){

     }     
   }) 
  },
  //导航处理
  clickNum:function(e){
    var value = e.target.id;
    var id = e.currentTarget.dataset.id;
    this.setData({
      id:id,
      clickNumText:value
    })
    var list = this.data.list;
  
    for(var key in list){
      if(id==list[key].id){
        var json = JSON.parse(list[key].todo);
        var typeSring = typeof (json); 
        this.setData({
          listStak: (typeSring=='object')?JSON.parse(list[key].todo):"",
          name:list[key].name
        })
        break;
      }
    }

  },

})


