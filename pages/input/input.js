
let app=getApp()

Page({
    data:{
        focus:true,
        content:'',
        count:0,
        imgArr:[],
        showBigImg:false,
        fileName:'',
        isVedio:false,
        videoPath:'',
        hasVideo:false
    },
    inputSomething:function (e) {
        this.setData({
            content:e.detail.value,
            count:e.detail.value.length
        })
    },
    finishInput:function (e) {
        this.setData({
            focus:false
        })
    },
    lookImg:function () {

       let self=this
        wx.previewImage({
            urls: self.data.imgArr // 需要预览的图片http链接列表
        })
    }
    ,
    getNewImg:function() {
        if(this.data.isVedio){
            getNewVideo(this)
        }
        else {
            let self = this
            let num = 9 - this.data.imgArr.length
            wx.chooseImage({
                count: num, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    self.imgArrTemp.push(...res.tempFilePaths)
                    self.setData({
                        imgArr: self.imgArrTemp
                    })
                }
            })
        }
},
    addNewContent:function () {
            let self=this
        wx.showLoading({
            title:'发送中..',
            mask:true
        })
        if(this.data.isVedio)
            sendVedio(self)
            else
            submit(self)
    },
    cancelVideo:function () {
        this.setData({
            videoPath:'',
            hasVideo:false
        })
    }
    ,
    onLoad:function (option) {
        this.data.imgArr=[]
        this.imgArrTemp=new Array()

            if(option.isVideo==1){
                this.setData({
                    //fileName:option.name,
                    isVedio:true
                })
            }
    }
})

function getNewVideo(self) {

    wx.chooseVideo({
        sourceType: ['album','camera'],
        maxDuration: 30,
        camera: 'back',
        success: function(res) {
            self.setData({
                videoPath:res.tempFilePath,
                hasVideo:true
            })

        },
        fail:function (res) {
            /*     wx.showToast({
                     title: '上传失败，请稍后再试...',
                     icon: 'none',
                     duration: 2000
                 })*/
        }

    })
}
function submitVideo(self,filePath,resolve,reject) {
    const uploadTask = wx.uploadFile({
        url: 'https://www.onedayi.top/upload', //仅为示例，非真实的接口地址
        filePath: filePath,
        name: 'file',
        formData: {
            'type': 0,
            'user': app.globalData.openId
        },
        success: function (res) {
            wx.hideLoading()
            let name=JSON.parse(res.data).file.filename
            if (JSON.parse(res.data).errCode === 0) {
                self.setData({
                    fileName:name
                })
                resolve()
            }
            else {
                reject()
                wx.showToast({
                    title: '上传失败，请稍后再试...',
                    icon: 'none',
                    duration: 2000
                })
            }
            //do something

        },
        fail:function (res) {
            reject()
            wx.hideLoading()
            console.log(res)
            wx.showToast({
                title: '上传失败，请稍后再试...',
                icon: 'none',
                duration: 2000
            })
        }
    })
}
function sendVedio(self) {
    new Promise((resolve,reject)=>{
        "use strict";
        submitVideo(self,self.data.videoPath,resolve,reject)
    }).then(()=>{
        "use strict";
        wx.request({
            url: 'https://www.onedayi.top/newVedio', //仅为示例，并非真实的接口地址
            method:'POST',
            data: {
                openId:app.globalData.openId,
                content:encodeURI(self.data.content),
                fileName:self.data.fileName
            },
            dataType:'json',
            success: function(res) {
                /*     wx.hideLoading()*/
                wx.navigateBack()
                wx.showToast({
                    title: '发送成功...',
                    icon: 'success',
                    duration: 2000
                })

            },
            fail:function (res) {
                wx.hideLoading()
                wx.showToast({
                    title: '发送失败...',
                    duration: 2000
                })
            }
        })
    })

}
function sendContent(self,imgNameArr) {
    wx.request({
        url: 'https://www.onedayi.top/newThings', //仅为示例，并非真实的接口地址
        method:'POST',
        data: {
            openId:app.globalData.openId,
            content:self.data.content,
            imgName:imgNameArr.join('!')
        },
        dataType:'json',
        success: function(res) {
       /*     wx.hideLoading()*/
            wx.navigateBack()
            wx.showToast({
                title: '发送成功...',
                icon: 'success',
                duration: 2000
            })

        },
        fail:function (res) {
            wx.hideLoading()
            wx.showToast({
                title: '发送失败...',
                duration: 2000
            })
        }
    })
}

function submit(self) {
    return new Promise((resolve,reject)=>{
        "use strict";

            let i = 0;
            const length = self.data.imgArr.length
            let imgNameArr = []
        function submitImgs() {
            wx.uploadFile({
                url: 'https://www.onedayi.top/uploadImg', //仅为示例，非真实的接口地址
                filePath: self.data.imgArr[i],
                name: 'file',
                formData: {
                    'type': 1,
                    'user': app.globalData.openId
                },
                success: function (res) {
                    i++;
                    /*console.log(res.data)*/
                    imgNameArr.push(res.data)
                    //do something

                },
                complete: function () {

                    if (i === length) {
                        resolve({self, imgNameArr})
                    }
                    else {
                        submitImgs()
                    }
                }
            })
        }
        if(length===0)
            resolve({self,imgNameArr:[]})
        else
            submitImgs()
    }).then(data=>{
        console.log(data)
        "use strict";
        sendContent(data.self,data.imgNameArr)
    }).catch((data)=>{
        "use strict";
        console.log(data)
        wx.hideLoading()
        wx.showToast({
            title: '发送失败...',
            duration: 2000
        })
    })

}