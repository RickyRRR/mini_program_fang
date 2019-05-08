//app.js
App({
  onLaunch: function () {

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

      var openId = wx.getStorageSync('openid')

      if(openId){
         console.log('welcome...')
          /*wx.getUserInfo({
              success: function (res) {
                console.log(res.userInfo)
                  /!*that.setData({
                      nickName: res.u  serInfo.nickName,
                      avatarUrl: res.userInfo.avatarUrl,
                  })*!/
              },
              fail: function () {
                  // fail
                  console.log("获取失败！")
              },
              complete: function () {
                  // complete
                  console.log("获取用户信息完成！")
              }
          })*/
      }else {
          // 登录
          wx.login({
              success: res => {
                  // 发送 res.code 到后台换取 openId, sessionKey, unionId
                  console.log(res.code)
                  if (res.code) {
                      //发起网络请求
                      wx.request({
                          url: 'https://www.peapocket.com/minilogin',
                          //url: 'https://api.weixin.qq.com/sns/jscode2session?appid='+this.globalData.appid+'&secret='+this.globalData.secret+'&js_code='+res.code+'&grant_type=authorization_code',
                          data: {
                              code: res.code
                          },

                          success(v){
                              var openid = v.data.openid;
                              wx.setStorageSync('openid', openid);//存储openid
                              console.log(v)
                          }
                      })
                  } else {
                      console.log('登录失败！' + res.errMsg)
                  }


              }
          })
      }
    // 获取用户信息
    wx.getSetting({
      success: res => {
          console.log(res)
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
    })
  },
  globalData: {

    userInfo: null
  }
})