let app=getApp()
Page({
    data: {
        info:null,
        phoneHeight:null,
        userId:null
    },
    onLoad:function (option) {
        this.setData({
            info:JSON.parse(app.globalData.userInfo),
            phoneHeight:app.globalData.phoneHeight-100,
            userId:option.id
        })
    }
})
