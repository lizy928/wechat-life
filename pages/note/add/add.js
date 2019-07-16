Page({
  data: {
    focus: false
  },
  focus: function (e) {
    this.setData({
      focus: true
    })
  },
  blur: function (e) {
    var detail = e.detail.value;
    if (detail) {
      this.setData({
        focus: true
      })
    } else {
      this.setData({
        focus: false
      })
    }
  }
})