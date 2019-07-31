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
      
          that.globalData.code = res.code

          that.getOpenId(res.code);
      }
    });
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            lang: "zh_CN",
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log("userinfo:" + res.userInfo.nickName)
              wx.setStorageSync('userInfo',res.userInfo)
              this.getSystemInfo();
              
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
    };
        
  },

  onReady: function () {
    var that = this;
    // 页面渲染完成
    this.saveUserInfo();
    console.log("页面渲染完成")

  },

  siteInfo: require("siteinfo.js"),
  globalData: {
    userInfo: null,
    apiurl: "http://chengyu.tooao.cn/",
    openId: "",
    code: "",
    systemInfo: null
  },

  getOpenId:function(code){
    var that = this;
    //var code = that.globalData.code;
    
    //查询openId等信息
    wx.request({
      url: 'http://localhost:9000/life-user/api/user/getWxUserInfo?code=' + code,
      header: {
        'content-type': 'application/json',
        'token': 'test-token'
      },
      success: function (res) {
        console.log("获取到用户的openId:" + res.data.data.openId);
        console.log(res.data.data)
        if (res.data.code == 0) {
            that.globalData.openId = res.data.data.openId
          console.log("global data openId:" + that.globalData.openId);

          that.getUserInfo();
        }
      },
      fail: function (res) {
        console.log("请求失败getWxUserInfo")
      }
    });

  },
  getSystemInfo: function() {
    wx.getSystemInfo({
      success: res => {

        console.log("获取到的系统信息：" + res.version)

        wx.setStorageSync('systemInfo', res)

      },
      fail: res => {
        console.log("获取系统信息失败")
      },


    });
  },

  getUserInfo: function(){
    var that = this;
    var openId = that.globalData.openId;
    //查询用户信息
    wx.request({
      url: 'http://localhost:9000/life-user/api/user?openId=' + openId,
      header: {
        'content-type': 'application/json',
        'token': 'test-token'
      },
      success: function (res) {
        console.log(res.data.data)
        if (res.data.code == 0) {
          if (res.data.data == null){
            that.saveUserInfo();
          }
          console.log("user" + res.data.data)
        }
      },
      fail: function (res) {
        console.log("请求失败")
      }
    });
  },

//保存用户信息
  saveUserInfo: function(){
    var that = this;
    var userInfo = wx.getStorageSync('userInfo');
    var systemInfo = wx.getStorageSync('systemInfo');

    var openId = that.globalData.openId;

    console.log("get from stroge"+openId)
    var data = {}
    //封装用户信息
    data.openId = openId;
    data.nickName = userInfo.nickName;
    data.avatarUrl = userInfo.avatarUrl;
    data.gender = userInfo.gender;
    data.province = userInfo.province;
    data.city = userInfo.city;
    data.country = userInfo.country;
    data.language = userInfo.language;
    data.channel = 'wxmp';

    data.brand = systemInfo.brand;
    data.model = systemInfo.model;
    data.wxLanguage = systemInfo.language;
    data.system = systemInfo.system;
    data.platform = systemInfo.platform;

    console.log("data:" + that.globalData.openId);
    wx.request({
      url: 'http://localhost:9000/life-user/api/user', //仅为示例，并非真实的接口地址
      data: data, method: "POST",
      header: {
        'content-type': 'application/json',
        'token': 'test-token'
      },
      success: function (res) {
        wx.showToast({
          title: '添加成功',
          icon: 'success',
        });
      }
    });
  }
})