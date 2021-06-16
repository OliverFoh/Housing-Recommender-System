// pages/history/history.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum:1,
    pageSize:5,
    totalPages:1,
    roomList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.getUserHistory()
  },
  /**
   * 加载用户浏览记录
   */
  getUserHistory:function(){
    var that=this
    if(this.data.pageNum>this.data.totalPages){     //到底啦
        wx.showToast({
          title: '到底啦',
        })
    }else{        //数据未请求完，继续加载数据
      wx.request({
        url: app.globalData.URL+'/user/getUserHistory',
        method:"POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded' 
        },
        data:{
          'openId':app.globalData.openId,
          'pageNum':that.data.pageNum++,
          'pageSize':that.data.pageSize
        },
        success (res) {
          console.log(res.data)
          that.setData({
            roomList:that.data.roomList.concat(res.data.content)
          })
          if(res.data.pageNum===1){     //当为第一次请求时记录总共的查询结果个数
              that.data.totalPages=res.data.totalPages
          }
        }
      })
    }
  },
  toDetailPage:function(e){
    console.log(e)
    wx.navigateTo({
      url: '/pages/room_details/room_details?redirectPage='+'history'+'&mid='+e.currentTarget.dataset.id,
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
      this.getUserHistory()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})