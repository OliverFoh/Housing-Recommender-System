// pages/search_result/search_result.js
const URL = getApp().globalData.URL
Page({

  /**
   * 页面的初始数据
   */
  data: {
      roomList:[],
      queryString:'',
      pageNum:0,
      pageSize:5,
      totalPages:'',
      hasResults:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log('传到结果的值为：'+options.mid)
      this.data.queryString=options.mid
      this.queryRoomsByString(options.mid)
  },
  /**
     * 模糊检索房源信息
     * @param {*} queryString 
     */
  queryRoomsByString:function(queryString){
    var that=this;
    wx.request({
        url:URL+"/room/searchByQueryStr", 
        method:"POST",
        data:{
            query:queryString,
            pageNum:++that.data.pageNum,
            pageSize:5
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' 
        },
        success (res) {
            if(res.data.totalPages===0){
              that.setData({
                hasResults:false
              })
            }
            console.log('查询到的结果为：')
            console.log(res.data)
            wx.hideLoading()
            that.setData({
                roomList:that.data.roomList.concat(res.data.content)
            })
            that.data.totalPages=res.data.totalPages
            

        }

      })
  },
  //跳转到详情页面
  toDetailPage:function(e){
    console.log(e)
    wx.navigateTo({
      url: '/pages/room_details/room_details?redirectPage='+'index'+'&mid='+e.currentTarget.dataset.id+'&city='+e.currentTarget.dataset.city,
    })
    this.logInHistory(e.currentTarget.dataset.id)     //存储浏览记录

},
     /**
   * 打点存储浏览记录
   * @param {*} e 
   */
  logInHistory:function(roomId){
    var that=this
    wx.request({
        url:URL+"/user/logInHistory",
        method:"POST",
        header: {
            'content-type': 'application/x-www-form-urlencoded' 
        },
        data:{
            roomId:roomId,
            openId:wx.getStorageSync('openId')
        },
        success (res) {
            
            console.log('存储浏览记录'+res.data)
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
    console.log('下拉加载数据')
    if(this.data.pageNum<this.data.totalPages){     //当前页码小于总页码
      console.log('进入请求数据')
      this.queryRoomsByString(this.data.queryString)
    }else{
      console.log('到达最后一页')
      wx.showToast({
        title: '数据加载完毕',
        icon:'none'
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})