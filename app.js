//app.js
App({
  onLaunch: function () {
   /* // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)*/



    function getUnRead(id) {
        wx.request({
            url:'https://www.onedayi.top/getUnRead?id='+id,
            success:function (res) {
                let num=res.data.result[0]['COUNT(*)']
                if(num!==0) {
                    wx.setTabBarBadge({
                        index: 1,
                        text: res.data.result[0]['COUNT(*)'].toString()
                    })
                }
            }
        })
    }

      let self=this;
    // 登录
      function login () {
          return new Promise ( function (resolve, reject) {
              wx.login({
                  success: res => {
                      // 发送 res.code 到后台换取 openId, sessionKey, unionId
                      if (res.code) {
                          //发起网络请求
                          wx.request({
                              url: 'https://www.onedayi.top/onLogin',
                              data: {
                                  code: res.code
                              },
                              success:res=> {
                                  self.globalData.openId=JSON.parse(res.data).openid
                                  resolve()
                              }
                          })
                      } else {
                          console.log('登录失败！' + res.errMsg)
                          reject(res.errMsg)
                      }
                  }
              })
          } )
      }

      // 获取用户信息
      function getInfo() {
          return new Promise ( function (resolve, reject) {
              wx.getSetting({
                  success: res => {
                      if (res.authSetting['scope.userInfo']) {
                          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                          wx.getUserInfo({
                              success: res => {
                                  // 可以将 res 发送给后台解码出 unionId
                                  self.globalData.userInfo = res.rawData
                                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                                  // 所以此处加入 callback 以防止这种情况
                                  if (self.userInfoReadyCallback) {
                                      self.userInfoReadyCallback(res)
                                  }
                                  resolve()
                              }
                          })
                      }
                      else {
                          wx.authorize({
                              scope: 'scope.userInfo',
                              success() {
                                  wx.getUserInfo({
                                      success: res => {
                                          // 可以将 res 发送给后台解码出 unionId
                                          console.log(res)
                                          self.globalData.userInfo = res

                                          // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                                          // 所以此处加入 callback 以防止这种情况
                                          if (self.userInfoReadyCallback) {
                                              self.userInfoReadyCallback(res)
                                          }
                                          resolve()
                                      }

                                  })
                              }
                          })
                      }

                  },
                  fail:res=>{
                      "use strict";
                      reject(res)
                  }
              })
          })
      }

      Promise.all([login(),getInfo()]).then(()=>{

          let userInfo=JSON.parse(self.globalData.userInfo)

          userInfo['openId']=self.globalData.openId
          self.globalData.tempUsersInfo.push(userInfo)
          console.log(userInfo)
          userInfo.nickName=encodeURI(userInfo.nickName)

          wx.request({
              url: 'https://www.onedayi.top/users', //仅为示例，并非真实的接口地址
              method:'POST',
              data: {
                  openId: self.globalData.openId,
                  userInfo:userInfo
              },
              dataType:'json',
              success: function(res) {
                 self.globalData.isLogin=true
                  getUnRead(self.globalData.openId)
              },
              fail:function (res) {
                  console.log(res)
                  wx.showToast({
                      title: '登陆失败...',
                      duration: 2000
                  })
              }
          })
      }).catch((data)=>{
          "use strict";
          wx.showToast({
              title: '登陆失败...',
              duration: 2000
          })
      })

  },
    onShow:function () {

    },

  globalData: {
    userInfo: null,
      openId:null,
      isLogin:false,
      poster:null,
      tempUsersInfo:[]
  }
})





