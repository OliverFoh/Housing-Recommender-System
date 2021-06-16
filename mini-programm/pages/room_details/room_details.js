// pages/room_details/room_details.js
const URL = getApp().globalData.URL
var QQMapWX = require('../../lib/qqmap-wx-jssdk.js');
const qqmapsdk = new QQMapWX({
  key: '7QTBZ-ISUKD-NPK47-PBICF-VTMTF-XSBTC'
});
Page({

  /**
   * 页面的初始数据
   */
  data: {
      redirectSource:'',
      room:1,
      roomId:'',
      roomIndex:'',   //该房源在roomList中的索引值
      city:'',
      currentId:0,
      currentImage:0,
      recommendList:[],
      btnText:'收藏房源',
      marker:[],
      poi:{},
      latitude:39.992592,
      longitude:116.366989,
      hasMarkers:false,
      spinShow:true,
      loadingCount:2,
      appliance:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      //确定页面跳转来源
      this.setData({
        redirectSource:options.redirectPage
      })
      if(options.redirectPage=='user_like'){    //若是从user_like跳转过来则更改button文字并设置loadingCount值
          this.setData({
            btnText:'取消收藏'
          })
          this.data.loadingCount=1
      }
      if(options.redirectPage=='history'){    //若是从history跳转过来则设置loadingCount值
        this.data.loadingCount=1
    }
      //this.data.redirectSource=options.redirectPage
      this.data.roomId=options.mid
      this.data.city=options.city
      this.data.roomIndex=options.index
      console.log('索引位置为：')
      console.log(this.data.roomIndex)

      //加载猜你喜欢的房源
      if(options.redirectPage==='index'){      //从首页跳转进来才会加载猜你喜欢的内容
        this.getRecomendRoom()
      }
      

      //加载房源详细信息
      this.getRoomDetailInfo(options.mid)

  },
  isHideSpin:function(){      //判断完成了几个请求，是否隐藏spin
    console.log('当前loadingCount值为：'+this.data.loadingCount)
      if(this.data.loadingCount===0){
        this.setData({
          spinShow:false
        })
      }else{
        this.data.loadingCount--    //请求数减1
      }
  },
  /**
   * 获取房源详情信息
   * @param {roomId} id 
   */
  getRoomDetailInfo:function(id){
    var that=this
    wx.request({
      url: URL+"/room/getRoomById/"+id,
    header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data)
        //获取房源信息map
        that.getRoomLocationPoi(res.data.city+res.data.district+'区'+res.data.community)
        that.setData({
            imageList:res.data.image,
            room:res.data
        })
        //that.room=res.data
        that.isHideSpin()
      }
    })
    
  },
  //获取房源推荐列表
  getRecomendRoom:function(){
    var that=this
    wx.request({
      url:URL+"/room/getRecommendList",
    header: {
        'content-type': 'application/json' // 默认值
      },
      data:{
        city:that.data.city,
        roomId:that.data.roomId
      },
      success (res) {
        console.log(res.data)
        that.setData({
            recommendList:res.data
        })
        //that.room=res.data
        that.isHideSpin()
      }
    })
  },
  /**
   * 按钮场景判断
   */
  btnFunc:function(){
    if(this.data.btnText=='收藏房源'){    //为收藏房源按钮时执行收藏房源功能
        this.addFav()
    }else{      //为取消收藏时执行取消操作
        this.cancelUserLike()
    }
  },
  //添加房源到个人收藏
  addFav:function(){
    var that=this
    wx.request({
      url:URL+"/user/userLike",
      method:"POST",
      header: {"Content-Type": "application/x-www-form-urlencoded"},
      data:{
        openId:wx.getStorageSync('openId'),
        roomId:that.data.roomId
    },
      success (res) {
        console.log(res.data)
        if(res.data==true){
          wx.showToast({
            title: '收藏成功',
          })
        }else{
          wx.showToast({
            title: '房源已收藏',
          })
        }
      }
    })
  },
  /**
   * 取消该房源收藏
   */
  cancelUserLike:function(){
    var that=this
    wx.showModal({
      cancelColor: 'cancelColor',
      title: '提示',
      content: '确定取消收藏吗？',
      success (res) {
          if (res.confirm) {
            wx.request({
              url:URL+"/user/cancelUserLike",
              method:"POST",
              header: {"Content-Type":"application/x-www-form-urlencoded"},
              data:{
                roomId:that.data.roomId,
                openId:wx.getStorageSync('openId'),
              },
              success (res) {
                console.log(res.data)
                if(res.data==true){
                  // let pages=getCurrentPages()
                  // let prePages=pages[pages.length-2]
                  // prePages.data.deleteIndex=that.data.index
                  wx.setStorageSync('deleteIndex', that.data.index)
                  wx.showToast({
                    title: '已取消收藏',
                    success(){
                      wx.navigateBack({
                        // success: function() {
                        //   prePages.onLoad(); // 执行前一个页面的onLoad方法
                        //   }                 
                      })
                    }
                  })
                  
                }else{
                  wx.showToast({
                    title: '取消失败',
                  })
                }
              }
            })
          } else if (res.cancel) {
             
          }
      }
  })
    
  },
  //联系房东
  contact:function(e){
      wx.showModal({
        title:'提示',
        content:'功能未开放'
      })
  },
    //跳转到详情页面
    toDetailPage:function(e){
      console.log(e)
      wx.navigateTo({
        url: '/pages/room_details/room_details?redirectPage='+'index'+'&mid='+e.currentTarget.dataset.id+'&city='+e.currentTarget.dataset.city,
      })
  },
  /**
   * 加载房源地图信息
   * @param {address} address 
   */
  getRoomLocationPoi(address) {
    var that = this;
    //调用地址解析接口
    qqmapsdk.geocoder({
      //获取地址信息
      address: address, //地址参数，例：固定地址，address: '北京市海淀区彩和坊路海淀西大街74号'
      success: function(res) {//成功后的回调
        console.log(res);
        var res = res.result;
        var latitude = res.location.lat;
        var longitude = res.location.lng;
        that.setData({
            latitude:latitude,
            longitude:longitude
        })
        //根据地址解析在地图上标记解析地址位置
        var markers=[]
        markers.push({
          id: 0,
          title: res.title,
          latitude: latitude,
          longitude: longitude,
          iconPath: '../../icons/location.png',//图标路径
          width: 30,
          height: 30,
          // callout: { //可根据需求是否展示经纬度
          //   content: latitude + ',' + longitude,
          //   color: '#000',
          //   display: 'ALWAYS'
          // }
        })
        that.setData({ // 获取返回结果，放到markers及poi中，并在地图展示
          markers:markers,
          poi: { //根据自己data数据设置相应的地图中心坐标变量名称
            latitude: latitude,
            longitude: longitude
          },
          hasMarkers:true
        });
        that.isHideSpin()
      },
      fail: function(error) {
        console.error(error);
      },
      complete: function(res) {
        console.log(res);
      }
    })
},
 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})