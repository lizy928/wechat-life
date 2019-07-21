//app.js
App({
  onLaunch: function () {

    var that = this;

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log("code :"+res.code)

        that.getWxUserInfo(res.code);

      }
    });

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    });
    // 加载主题
    var _systhemes = wx.getStorageSync('systhemes');
    if (!_systhemes) {
      wx.request({
        url: 'http://chengyu.tooao.cn/MBook/Getthemes',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res.data);
          wx.setStorage({
            key: "systhemes",
            data: res.data.message,
            success: function (res) {
              console.log('缓存(themes)成功')
            }
          });
        }
      });
    }    
  },

  siteInfo: require("siteinfo.js"),
  globalData: {
    userInfo: null,
    apiurl: "http://chengyu.tooao.cn/",
    openId: ""
  },

  getWxUserInfo:function(code){

    var that = this;
    //查询openId等信息
    wx.request({
      url: 'http://localhost:9000/life-user/api/user/getWxUserInfo?code='+code, 
      header: {
        'content-type': 'application/json',
        'token': 'test-token'
      },
      success: function (res) {
        console.log("获取到用户的openId:" + res.data.data.openId);
        console.log(res.data.data)
        if (res.data.code == 0) {
          that.setData({
            openId: res.data.data.openId
          });
        }
      },
      fail: function (res) {
        console.log("请求失败")
      }
    });
  }

})