

let app=getApp()
Page({
    data: {
            phoneHeight:'',
            thingInfo:null,
            userId:'',
        toComment:false,
        commentObj:{
            commentName:'',
            commentUserId:'',
            commentThingsId:'',
            toWhom:'',
            content:'',
            toCommentId:''
        }
    }
    ,
        CommentSomeone:function (e) {
            console.log(e)

            this.setData({
                toComment:true,
                ['commentObj.commentName']:e.target.dataset.name,
                ['commentObj.commentUserId']:e.target.dataset.userid,
                ['commentObj.toWhom']:e.target.dataset.toid,
                ['commentObj.toCommentId']:e.target.dataset.tocid,
                ['commentObj.commentThingsId']:e.target.dataset.thingsid,

            })
        },
        cancelComment:function () {
            this.setData({
                toComment:false,
                ['commentObj.content']:'',
            })
        },
    sendComment:function (e) {
        let self=this
        let content=e.detail.value
        let thingsId=e.target.dataset.thingsid
        let toWhom=e.target.dataset.toid
        let userId=e.target.dataset.userid
        let toId=e.target.dataset.tocid
        this.setData({
            toComment:false,
            ['commentObj.content']:''
        })


        wx.request({
            url:'https://www.onedayi.top/sendCommit',
            data:{
                thingsId,
                userId,
                toWhom,
                toId:toId,
                val:encodeURI(content)
            },
            method:'POST',
            success:function (res) {
                if(res.data.errcode===0) {
                    self.setData({
                        commentList: res.data.result
                    })
                   // getComment(self,thingsId)
                     self.selectComponent('#commentList').__proto__.refreshComment(self.selectComponent('#commentList'));
                }
            }
        })
    }
    ,

    onLoad:function (option) {


        this.setData({
            phoneHeight:app.globalData.phoneHeight,
            userId:app.globalData.openId
        })

        let id=option.id;
        let self=this
        wx.request({
            url:'https://www.onedayi.top/getThing?id='+id,
            success:function (res) {
                let info=res.data.result[0]
                info.nickName=decodeURI(info.nickName)
                info.content=decodeURI(info.content)
                let date=new Date(info.createdOn)
                info.createdOn=date.getMonth()+1+'月'+date.getDate()+"日"
                self.setData({
                    thingInfo:info
                })
                if(self.data.thingInfo.src!==''){
                    let imgArr=self.data.thingInfo.src.split('!')
                    let finalImgArr=[]
                    imgArr.forEach((item,index)=>{
                        "use strict";
                        finalImgArr[index]='https://www.onedayi.top/getTextImg?fileName='+item
                    })
                    self.setData({
                        ['thingInfo.imgSrc']:finalImgArr
                    })
                }



            }
        })
    }
})

function getComment(self,thingsId){
    "use strict";
    wx.request({
        url:'https://www.onedayi.top/getComment?thingsId='+thingsId,
        success:function (res) {
            let obj=res.data.result
            obj.forEach((item,index)=>{
                let date=new Date(item.created)
                item.created=date.getMonth()+1+'月'+date.getDate()+"日"
                item.content=decodeURI(item.content)
                item.nickName=decodeURI(item.nickName)

            })
            self.setData({
                commentList:obj
            })
            changeComment(self)
        }
    })

}

function getUserInfo(self) {

    let cList=self.data.commentList
    let count=0;
    cList.forEach((item,index)=>{
        "use strict";
        if(item['childComment'].length!=0){
            item['childComment'].forEach((item2,index2)=>{
                wx.request({
                    url:'https://www.onedayi.top/getUserInfo',
                    data:{
                        openId:item2.toWhom
                    },
                    method:'POST',
                    success:function (res) {
                        console.log(res)
                        let obj=res.data.result[0]
                        obj.nickName=decodeURI(obj.nickName)
                        let info='commentList['+index+'].childComment['+index2+'].userInfo'
                        self.setData({
                            [info]:obj
                        })
                    }
                })
            })

        }

    })
    console.log(self.data.commentList)


}

function changeComment(self) {
    let arr=[]
    let cList=self.data.commentList
    cList.forEach(item=>{
        "use strict";
        Object.assign(item,{childComment:[]})
        if(item.toCommentId!=0){
            arr.forEach(item2=>{
                if(item2['commentId']==item.toCommentId)
                    item2['childComment'].push(item)
            })
        }
        else
            arr.push(item)
    })
    self.setData({
        commentList:arr
    })
    getUserInfo(self)
}