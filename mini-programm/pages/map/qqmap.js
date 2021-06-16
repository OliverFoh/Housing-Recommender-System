// pages/map/qqmap.js
// 引入SDK核心类
var QQMapWX = require('../../lib/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({
    data:{
      markers:[1],
      poi:{},
      latitude:39.982915,
      longitude:116.307015
    },
    onLoad: function () {
        // 实例化API核心类
        qqmapsdk = new QQMapWX({
            key: '7QTBZ-ISUKD-NPK47-PBICF-VTMTF-XSBTC'
        });
    },
    onShow: function () {
    //     // 调用接口
    //     qqmapsdk.search({
    //         keyword: '酒店',
    //         success: function (res) {
    //             console.log(res);
    //         },
    //         fail: function (res) {
    //             console.log(res);
    //         },
    //     complete: function (res) {
    //         console.log(res);
    //     }
    //  });
  },
  formSubmit(e) {
    var _this = this;
    //调用地址解析接口
    qqmapsdk.geocoder({
      //获取表单传入地址
      address: e.detail.value.geocoder, //地址参数，例：固定地址，address: '北京市海淀区彩和坊路海淀西大街74号'
      success: function(res) {//成功后的回调
        console.log(res);
        var res = res.result;
        var latitude = res.location.lat;
        var longitude = res.location.lng;
        _this.setData({
          latitude:latitude,
          longitude:longitude
        })
        console.log('经纬度为'+_this.data.latitude+'\t'+_this.data.longitude)
        //根据地址解析在地图上标记解析地址位置
        var markers=[]
        markers.push({
          id: 0,
          title: res.title,
          latitude: latitude,
          longitude: longitude,
          iconPath: '../../icons/location.png',//图标路径
          width: 20,
          height: 20,
          callout: { //可根据需求是否展示经纬度
            content: latitude + ',' + longitude,
            color: '#000',
            display: 'ALWAYS'
          }
        })
        _this.setData({ // 获取返回结果，放到markers及poi中，并在地图展示
          // markers: [{
          //   id: 0,
          //   title: res.title,
          //   latitude: latitude,
          //   longitude: longitude,
          //   //iconPath: './resources/placeholder.png',//图标路径
          //   width: 20,
          //   height: 20,
          //   callout: { //可根据需求是否展示经纬度
          //     content: latitude + ',' + longitude,
          //     color: '#000',
          //     display: 'ALWAYS'
          //   }
          // }],
          markers:markers,
          poi: { //根据自己data数据设置相应的地图中心坐标变量名称
            latitude: latitude,
            longitude: longitude
          }
        });
      },
      fail: function(error) {
        console.error(error);
      },
      complete: function(res) {
        console.log(res);
      }
    })
}
})