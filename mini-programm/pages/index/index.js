// index.js
// 获取应用实例
const URL = getApp().globalData.URL
const back_top_icon = 'data:image/png;base64,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'
const buttons = [{
  label: 'back_top',
  icon: back_top_icon,
}]
Page({
    data: {
    buttons,
    city:'北京',
    rentalMethod:null,
    price:null,
    decorateType:null,
    houseType:null,
    ori:null,
    pageNum:0,
    totalPage:null,
    pageSize:5,
    totalSize:null,
    roomList:[],
    floorStatus:false,
     items: [{
        type: 'radio',
        label: '城市',
        value: 'city',
        checked: true,
        children: [{
                label: '北京',
                value: 'beijing',
                checked: true, // 默认选中
            },
            {
                label: '上海',
                value: 'shanghai',
            },
            {
                label: '广州',
                value: 'guangzhou',
            },
            {
                label: '深圳',
                value: 'shenzhen',
            },
            {
                label: '西安',
                value: 'xian',
            },
        ],
        groups: ['001'],
    },
    {
        type: 'radio',
        label: '租赁方式',
        value: 'rental_method',
        children: [{
                label: '合租',
                value: 'hezu',
               
            },
            {
                label: '整租',
                value: 'zhengzu',
            },
        ],
        groups: ['002'],
    },
    {
        type: 'sort',
        label: '价格',
        value: 'price',
        groups: ['003'],
    },
    {
        type: 'filter',
        label: '筛选',
        value: 'filter',
        //checked: true,
        children: [{
                type: 'radio',
                label: '装修类型',
                value: 'decorate_type',
                children: [{
                        label: '精装修',
                        value: 'jing_zhuang',
                        //checked: true, // 默认选中
                    },
                    {
                        label: '豪华装修',
                        value: 'hao_hua',
                    },
                    {
                        label: '简单装修',
                        value: 'jian_zhuang',
                    }
                ],
            },
            {
                type: 'radio',
                label: '住宅类型',
                value: 'house_type',
                children: [{
                        label: '普通住宅',
                        value: 'simple_house',
                        //checked: true, // 默认选中
                    },
                    {
                        label: '公寓',
                        value: 'department',
                    },
                    {
                        label: '别墅',
                        value: 'cottage',
                    },
                ],
            },
            {
                type: 'radio',
                label: '房屋朝向',
                value: 'ori',
                children: [{
                        label: '朝南',
                        value: 'south',
                        //checked: true, // 默认选中
                    },
                    {
                        label: '朝北',
                        value: 'north',
                    },
                    {
                        label: '东南',
                        value: 'east_south',
                    },
                    {
                        label: '西北',
                        value: 'west_north',
                    },
                ],
            },
        ],
        groups: ['001', '002', '003'],
    },
    ],
    },
     // 实时监听滚动条当前位置
  onPageScroll: function (e) {
    if (e.scrollTop > 100) {
      this.setData({
        floorStatus: true
      });
    } else {
      this.setData({
        floorStatus: false
      });
    }
  },

  //回到顶部
  goTop: function (e) {  // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
    onChange(e) {
        //console.log(e.detail)
        const { checkedItems, items, checkedValues } = e.detail
        const params = {}

        //console.log(checkedItems, items, checkedValues)

        checkedItems.forEach((n) => {
            if (n.checked) {
                if (n.value === 'city') {
                    const selected = n.children.filter((n) => n.checked).map((n) => n.label).join(' ')
                    params.sort = n.value
                    params.order = selected
                    this.data.city=params.order
                } else if (n.value === 'rental_method') {
                    const selected = n.children.filter((n) => n.checked).map((n) => n.label).join(' ')
                    params.sort = n.value
                    params.order = selected
                    this.data.rentalMethod=params.order
                } else if (n.value === 'price') { 
                    params.sort = n.value
                    params.order=n.sort ===1 ? 'asc' : 'desc'
                    this.data.price=params.order
                } else if (n.value === 'filter') {
                    n.children.filter((n) => n.selected).forEach((n) => {
                        if (n.value === 'decorate_type') {
                            const selected = n.children.filter((n) => n.checked).map((n) => n.label).join(' ')
                            params.decorate_type = selected
                            this.data.decorateType=params.decorate_type 
                        } else if (n.value === 'house_type') {
                            const selected = n.children.filter((n) => n.checked).map((n) => n.label).join(' ')
                            params.house_type = selected
                            this.data.houseType=params.house_type
                            
                        }else if (n.value === 'ori') {
                            const selected = n.children.filter((n) => n.checked).map((n) => n.label).join(' ')
                            params.ori = selected
                            console.log(params.ori)
                            this.data.ori=params.ori
                        }
                    })
                }
            }
        })
        console.log('param参数为：')
        console.log('params：', params)
        console.log('data参数为：')
        console.log(this.data.city+this.data.rentalMethod+this.data.price+this.data.decorateType+this.data.houseType+this.data.ori)
        this.setData({
            roomList:[]
        })
        this.getRoomData()

       // this.getRepos(params)
    },
    onOpen(e) {
        this.setData({ opened: true })
    },
    onClose(e) {
        this.setData({ opened: false })
    },
    /**
     * 阻止触摸移动
     */
    noop() {},
    onLoad() {

        this.getRoomData();
    },
    /**
     * 根据筛选条件加载房源
     */
    getRoomData(){
        wx.showLoading({
          title: '加载中',
        })
        var that=this
        wx.request({
            url:URL+"/room/getFilterRoom", 
            method:"POST",
            data:{
                city:that.data.city,
                rentalMethod:that.data.rentalMethod,
                price:that.data.price,
                decorateType:that.data.decorateType,
                houseType:that.data.houseType,
                ori:that.data.ori,
                pageNum:that.data.pageNum,
                pageSize:that.data.pageSize
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded' 
            },
            success (res) {
              console.log(res.data)
              wx.hideLoading()
              that.setData({
                  roomList:that.data.roomList.concat(res.data.content)
              })
            }

          })
    },
    getUserInfo(e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
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
     * 下拉刷新
     */
    onPullDownRefresh:function(){
        this.getRoomData()
    },
    onReachBottom:function(){
        //if(this.data.pageNum)
        this.data.pageNum++;
        this.getRoomData()
    },
    //搜索栏提交监听
    onSearchConfirm:function(e){
        wx.showLoading({
          title: '查找中',
        })
        var value=e.detail.value
        console.log(value)
        console.log('搜索值为：'+value)
        wx.navigateTo({
          url: '/pages/search_result/search_result?mid='+value,
        })
    }
})


