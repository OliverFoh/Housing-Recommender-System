const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      roomList:[],
      deleteIndex:null
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.source==='user_like'){    //跳转到用户收藏页面
      this.getUserLikeList(app.globalData.openId)
    }else if(options.source==='history'){
      this.getUserHistory()             //跳转到用户浏览历史
    }
      
  },
  /**
   * 加载用户收藏数据
   * @param {} openId 
   */
  getUserLikeList:function(openId){
    var that=this
      wx.request({
        url: app.globalData.URL+'/user/userLike',
        method:"GET",
        header: {
          'content-type': 'application/json' // 默认值
        },
        data:{
          'openId':app.globalData.openId
        },
        success (res) {
          console.log(res.data)
          that.setData({
            roomList:res.data
          })
        }
      })
  },
  
  toDetailPage:function(e){
    console.log(e)
    wx.navigateTo({
      url: '/pages/room_details/room_details?redirectPage='+'user_like'+'&mid='+e.currentTarget.dataset.id+'&index='+e.currentTarget.dataset.index,
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
    console.log('进入页面重新显示函数')
    console.log(wx.getStorageSync('deleteIndex'))
    this.data.deleteIndex=wx.getStorageSync('deleteIndex')
      if(this.data.deleteIndex!=null){
        console.log('触发删除操作')
        this.data.roomList.splice(this.data.deleteIndex,1)
        this.setData({
          roomList:this.data.roomList
        })
        wx.setStorageSync('deleteIndex', null)
      }
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