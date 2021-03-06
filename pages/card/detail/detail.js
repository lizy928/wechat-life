//获取应用实例
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var obj = this;
    wx.request({
      url: 'http://localhost:9000/life-mbook/api/account/listAccount?userId=1', //仅为示例，并非真实的接口地址
      data: { user: app.globalData.openid },
      header: { 'content-type': 'application/json',
      'token':'sfesf'
       },
      success: function (res) {
        console.log(res.data);
        obj.setData({
          list: res.data.message
        })
      }
    });
  },

  // 页面方法
  addcard: function () {
    // wx.navigateTo({
    //   url: '/pages/card/add/add?id=0'
    // });
    wx.navigateTo({
      url: '../../card/item/item'
    });
  },

  // 卡片详情
  carddetail: function (e) {
    wx.navigateTo({
      url: '../../card/add/add?id=' + e.currentTarget.dataset.id + "&carditem=" + e.currentTarget.dataset.carditem
    });
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
    // 显示顶部刷新图标  
    wx.showNavigationBarLoading();
    var obj = this;
    wx.request({
      url: app.siteInfo.apiurl + 'mbook/getlist', //仅为示例，并非真实的接口地址
      data: { user: app.globalData.openid },
      header: { 'content-type': 'application/json' },
      success: function (res) {
        console.log(res.data);
        obj.setData({
          list: res.data.message
        });
        // 隐藏导航栏加载框  
        wx.hideNavigationBarLoading();
        // 停止下拉动作  
        wx.stopPullDownRefresh();
      }
    });
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