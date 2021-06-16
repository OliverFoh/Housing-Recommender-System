// app.js

App({
    globalData:{
        URL:"http://localhost:80/api",
        openId:''
    },
    onLaunch() {
        if(!wx.getStorageSync('openId')){      //openid为空时进行登录获取openid
              // 登录
            wx.login({
                success: res => {
                    //发送 res.code 到后台换取 openId, sessionKey, unionId
                    if (res.code) {
                        //发起网络请求
                        wx.request({
                        url: getApp().globalData.URL+'/user/login',
                        data: {
                            code: res.code
                        },
                        success (res) {
                            getApp().globalData.openId=res.data
                            console.log("openId为："+res.data)
                            wx.setStorageSync('openId',res.data)
                        }
                        })
                    } else {
                        console.log('登录失败！' + res.errMsg)
                    }
                }
            })
            // 获取用户信息
            wx.getSetting({
                success: res => {
                    if (res.authSetting['scope.userInfo']) {
                        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                        wx.getUserInfo({
                            success: res => {
                                // 可以将 res 发送给后台解码出 unionId
                                this.globalData.userInfo = res.userInfo
                                console.log("haha")
                                console.log(res.userInfo)
                                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                                // 所以此处加入 callback 以防止这种情况
                                if (this.userInfoReadyCallback) {
                                    this.userInfoReadyCallback(res)
                                }
                            }
                        })
                    }else{
                        console.log("未授权")
                    }
                }
            })

        }else{      //openid不为空时从缓存获取后直接赋值给全局变量
            console.log("登陆过，不为空")
            this.globalData.openId=wx.getStorageSync('openId')
        }
    },
    /**
     * 封装request请求
     * @param {*} requestMapping 
     * @param {*} data 
     * @param {*} requestWay 
     * @param {*} contentType 
     */
    request:function(requestMapping, data, requestWay, contentType) {
        wx.showLoading({
          title: '请稍后',
        })
        return new Promise(function(resolve, reject) {
          console.log('请求中。。。。。')
          wx.request({
            url: '自己的服务器地址' + requestMapping,
            data: data,
            header: {
              'content-type': contentType // 默认值
            },
            timeout: 3000,
            method: requestWay,
            success(res) {
              //console.log(res)
              if (res.data.success == false || res.data.statusCode == 404) {
                reject(res)
              } else {
                resolve(res)
              }
            },
            fail: (e) => {  
              wx.showToast({
                title: '连接失败',
                icon: 'none'
              })},
            complete: () => {
              wx.hideLoading()
            }
          })
        })
      },
    /**
     * 获取用户的openid
     * @param {app} app 
     * @param {} that 
     */
    getOpenId:function(app, that){
    return new Promise(function (resolve, reject) {
          wx.login({
            success: function (yes) {
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
              var requestMapping = '/testopenid'
              var data = {
                code: yes.code
              }
              var requestWay = 'GET'
              var contentType = 'application/json'
              var p =request(requestMapping, data, requestWay, contentType)
              p.then(res => {
                //console.log(res) 做一些后续操作
                app.globalData.openId = res.data;
                      resolve(res)
              }).catch(e => {
                reject(e)  
              })
            },
            fail(e) {
              console.log(e)
            }
          })  
    })
  }
})
