let app=getApp()
Page({
    data: {
        userId:null,
        commentList:null,
        commentObj:{
            commentName:'',
            commentUserId:'',
            commentThingsId:'',
            toWhom:'',
            content:'',
            toCommentId:''
        }
    },
    CommentSomeone:function (e) {

        this.setData({
            toComment:true,
            ['commentObj.commentName']:e.target.dataset.name,
            ['commentObj.commentUserId']:e.target.dataset.userid,
            ['commentObj.toWhom']:e.target.dataset.toid,
            ['commentObj.toCommentId']:e.target.dataset.tocid,
            ['commentObj.commentThingsId']:e.target.dataset.thingsid,

        })
    },
    turnToPageUser:function(e) {
        wx.navigateTo({
            url:`../user/user?id=${e.target.dataset.id}`
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
            method:'POST'
        })
    },
    turnToPage:function (e) {
        console.log(e)
        let thingsId=e.target.dataset.thingsid
        let type=e.target.dataset.type
        if(type===0){
            wx.navigateTo({
                url:'../avideo/avideo?id='+thingsId
            })
        }
        else{
            wx.navigateTo({
                url:'../athing/athing?id='+thingsId
            })
        }
    },
    onLoad:function () {
        let id=app.globalData.openId
        this.setData({
            userId:id
        })
        getComm(this,id)
        readIt(this,id)
    }
})
function getComm(self,id) {

    wx.request({
        url:'https://www.onedayi.top/getMyComment?id='+id,
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
        }
    })
}

function readIt(self,id) {
    wx.request({
        url:'https://www.onedayi.top/readIt?id='+id,
        success:function (res) {
            wx.removeTabBarBadge({
                index: 1,
            })
        }
    })
}