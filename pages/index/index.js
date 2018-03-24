

let app=getApp()



Page({
    data: {

        inputText:'',
        toSearch:false,
        inputFocus:false,
        phoneHeight:null
    },

    search:function(e){
        "use strict";
        this.setData({
            toSearch:true,
            inputFocus:true
        })
    },
    searchContent:function (e) {
        let content=e.detail.value;
        this.setData({
            inputText:''
        })
    },
    cancelSearch:function (e) {
        this.setData({
            inputText:'',
            toSearch:false
        })
        console.log(e)
    },
    addSomething:function (e) {
            wx.showActionSheet({
            itemList: ['短视频', '图文'],
            success: function(res) {
               if(res.tapIndex===0)
                   //getNewVideo()
                   wx.navigateTo({
                       url: '../input/input?isVideo=1'
                   })
               else if(res.tapIndex===1)
                   wx.navigateTo({
                       url: '../input/input'
                   })
            },
            fail: function(res) {
                console.log(res.errMsg)
            }
            })
    },

    onLoad:function(){
        "use strict";
        let self=this
        wx.getSystemInfo({
            success: function(res) {
                console.log(res)
                /* console.log(res.windowWidth)
                 console.log(res.windowHeight)*/
                app.globalData.phoneWidth=res.windowWidth;
                app.globalData.phoneHeight=res.windowHeight;
                self.setData({
                    phoneHeight:res.windowHeight-65
                })
            }
        })
    }
})
