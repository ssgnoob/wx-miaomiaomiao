let time=0
let touchDot=null
let interval=null
let app=getApp()
Component({
    properties: {
        userId:{
            type:String
        },
        phoneHeight:{
            type:String
        }
        },
    data:{
        type:'视频',
        videoList:[],
        textList:[],
        itemWidth:app.globalData.phoneWidth/2,
        index:0
    },
    attached:function () {

        let userId=this.data.userId
        let type=this.data.type
        getContent(this,type,userId)
        getText(this,type,userId)
       /* wx.downloadFile({
            url: 'https://www.onedayi.top/getVedioImg?id='+userId, //仅为示例，并非真实的资源
            success: function(res) {
                // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                if (res.statusCode === 200) {
                    wx.playVoice({
                        filePath: res.tempFilePath
                    })
                }
            }
        })*/
    },
    methods: {
        changeType:function(e){
            "use strict";
            /*e.target.dataset.value*/
            this.setData({
                type:e.detail.current===0?'视频':'文章'
            })
        },
        turnToPageUser:function(e) {

            wx.navigateTo({
                url:`../user/user?id=${e.target.dataset.id}`
            })
        },

        change:function (e) {
            console.log(e)
            this.setData({
                index:e.target.dataset.value=="视频"?0:1
            })
        },
            turnToVideoPage:function (e) {
                console.log(e)
            app.globalData.poster=e.target.dataset.src
                wx.navigateTo({
                    url: `../avideo/avideo?id=${e.target.dataset.id}`
                })
            },
        turnToThingPage:function (e) {
            wx.navigateTo({
                url: `../athing/athing?id=${e.target.dataset.id}`
            })
        },
        refresh:function (e) {
            console.log(e)
            let self=this
            if(e.detail.direction==='top' && e.target.offsetTop>30){
                wx.startPullDownRefresh({
                    success:function () {
                        getContent(self,0,self.data.userId)
                        getText(self,1,self.data.userId)
                        setTimeout(()=>{
                            "use strict";
                            wx.stopPullDownRefresh()
                        },2000)
                    }
                })
            }
        }
    }
})

function getContent(self,type,id) {
    wx.request({
        url: 'https://www.onedayi.top/getContent', //仅为示例，并非真实的接口地址
        data: {
           type:0,
            id:id
        },
        method:'POST',
        success: function(res) {
            if(res.data.errcode===0) {
                self.setData({
                    videoList: res.data.result
                })
                getVedioImg(self,self.data.videoList)
            }
        }
    })
}

function getVedioImg(self,videoList){
    "use strict";
    videoList.forEach((item,index)=>{
        Object.assign(item,{imgSrc:null})
        Object.assign(item,{userInfo:null})
        let imgSrc="videoList["+index+"].imgSrc"

        let fileName=item.src+'.png'

        self.setData({
            [imgSrc]:'https://www.onedayi.top/getVedioImg?fileName='+fileName
        })

            wx.request({
                url: 'https://www.onedayi.top/getUserInfo',
                data: {
                    openId: item.userId
                },
                method: 'POST',
                success: function (res) {
                    //res.data.result
                    let info = res.data.result[0]
                    info.nickName = decodeURI(info.nickName)
                    let userInfo = "videoList[" + index + "].userInfo"
                    self.setData({
                        [userInfo]: info
                    })

                }
            })

    })

}


function getText(self,type,id) {
    wx.request({
        url: 'https://www.onedayi.top/getContent', //仅为示例，并非真实的接口地址
        data: {
            type:1,
            id:id
        },
        method:'POST',
        success: function(res) {

            if(res.data.errcode===0) {
                let info=res.data.result
                info.forEach(item=>{
                    "use strict";
                    let date=new Date(item.createdOn)
                    item.createdOn=date.getMonth()+1+'月'+date.getDate()+"日"
                })

                self.setData({
                    textList:info
                })
                getTextImg(self,self.data.textList)

            }
        }
    })
}

function getTextImg(self,textList) {
    console.log(textList)
    textList.forEach((item,index)=>{
        "use strict";
        Object.assign(item,{textImgSrc:[]})
        if(item.src!==''){
            let imgArr=[]
            let arr=item.src.split('!')
            arr.forEach((item2,index2)=>{
                let imgSrc='textList['+index+'].textImgSrc['+index2+']'
                self.setData({
                    [imgSrc]: 'https://www.onedayi.top/getTextImg?fileName='+item2
                })
            }
        )}
            wx.request({
                url: 'https://www.onedayi.top/getUserInfo',
                data: {
                    openId: item.userId
                },
                method: 'POST',
                success: function (res) {
                    //res.data.result
                    let info = res.data.result[0]
                    info.nickName = decodeURI(info.nickName)
                    info.content = decodeURI(info.content)

                    let userInfo = "textList[" + index + "].userInfo"
                    self.setData({
                        [userInfo]: info
                    })
                    app.globalData.tempUsersInfo.push(info)
                }
            })

    })


   /* textList.forEach((item,index)=>{
        "use strict";
        Object.assign(item,{textImgSrc:[]})
        if(item.src!==''){
            let imgArr=[]
            let arr=item.src.split('!')
                arr.forEach((item2,index2)=>{
                    console.log(item2)
                    wx.downloadFile({
                        url:'https://www.onedayi.top/getTextImg?fileName='+item2,
                        success:function (res) {
                            let imgSrc='textList['+index+'].textImgSrc['+index2+']'
                            self.setData({
                               [imgSrc]: res.tempFilePath
                            })

                        },
                        fail:function (res) {
                            console.log(res)
                        }
                    })
                })


        }


})*/


}