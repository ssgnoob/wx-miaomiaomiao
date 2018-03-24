

let app=getApp()
Page({
    data: {
        commentListId:null,
        showInput:true,
        showORhide:'Hide',
        phoneHeight:0,
        imgSrc:'',
        videoInfo:null,
        videoPath:'',
        videoAuthor:null,
        danmuList:[],
        inputType:'评论',
        inputLength:50,
        inputContent:'',
        currentTime:'',
        commentList:[],
    },
        bindPickerChange:function(e){
            "use strict";
            console.log(e)
            if(e.detail.value==1)
                  this.setData({
                      inputType:['评论','弹幕'][e.detail.value],
                      inputLength:20
                  })
            else
                this.setData({
                    inputType:['评论','弹幕'][e.detail.value],
                    inputLength:50
                })
    },
    sendSomething:function (e) {
       let val=e.detail.value
        this.setData({
            inputContent:''
        })
        sendCommitorDanmu(this,val)
    }
    ,
    changeCurrentTime:function (e) {
        this.setData({
            currentTime:e.detail.currentTime
        })
    }
    ,
    hideInput:function () {
        this.setData({
            showInput:!this.data.showInput,
            showORhide:this.data.showInput?'Show':'Hide'
        })
    }
    ,
    onLoad:function (option) {
        this.setData({
            imgSrc:app.globalData.poster,
            phoneHeight:app.globalData.phoneHeight,
            commentListId:option.id
        })

        let id=option.id;
        let self=this
        wx.request({
            url:'https://www.onedayi.top/getVideo?id='+id,
            success:function (res) {
                let info=res.data.result[0]
                info.content=decodeURI(info.content)
                let date=new Date(info.createdOn)
                info.createdOn=date.getMonth()+1+'月'+date.getDate()+"日"
               self.setData({
                   videoInfo:info
               })
                let info2='videoInfo.src'
                self.setData({
                    [info2]:'https://www.onedayi.top/getVideoItem?name='+self.data.videoInfo.src+'&id='+self.data.videoInfo.id
                })
                //getVideoItem(self)
                getUserInfo(self)
            }
        })
    }
})

/*function getVideoItem(self) {
    let fileName=self.data.videoInfo.src;
    console.log('https://www.onedayi.top/getVideoItem?name='+fileName+'&id='+self.data.videoInfo.id)
    wx.downloadFile({
        url: 'https://www.onedayi.top/getVideoItem?name='+fileName+'&id='+self.data.videoInfo.id, //仅为示例，并非真实的资源
        success: function(res) {
            // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
            if (res.statusCode === 200) {
             let filePath=res.tempFilePath
                self.setData({
                    videoPath:filePath
                })

            }
        }
    })
}*/

function getUserInfo(self) {
    let userId=self.data.videoInfo.userId
        wx.request({
            url: 'https://www.onedayi.top/getUserInfo',
            data: {
                openId: userId
            },
            method: 'POST',
            success: function (res) {
                //console.log(res)
                let info = res.data.result[0]
                info.nickName = decodeURI(info.nickName)
                self.setData({
                    videoAuthor: info
                })
            }
        })

}

function sendCommitorDanmu(self,val) {
    let thingsId=self.data.videoInfo.id
    let userId=app.globalData.openId
    let toWhom=self.data.videoInfo.userId
    if(self.data.inputType==='评论'){
        wx.request({
            url:'https://www.onedayi.top/sendCommit',
            data:{
                thingsId,
                userId,
                toWhom,
                toId:0,
                val:encodeURI(val)
            },
            method:'POST',
            success:function (res) {
                if(res.data.errcode===0) {
                    self.setData({
                        commentList: res.data.result
                    })
                    self.selectComponent('#commentList').__proto__.refreshComment(self.selectComponent('#commentList'));
                }
            }
        })
    }else{

        wx.request({
            url:'https://www.onedayi.top/sendDanmu',
            data:{
                thingsId,
                userId,
                time:self.data.currentTime===''?'0':self.data.currentTime,
                val
            },
            method:'POST',
            success:function (res) {
                if(res.data.errcode===0)
                    self.setData({
                        danmuList:res.data.result
                    })
            }
        })


    }

}