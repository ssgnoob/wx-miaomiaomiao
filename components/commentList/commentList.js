let app=getApp()
Component({
    properties: {
        thingsId:{
            type:String
        },
        phoneHeight:{
            type:String
        }
    },
    data:{
        userId:'',
      commentList:[],
        toComment:false,
        commentObj:{
          commentName:'',
          commentUserId:'',
          commentThingsId:'',
          toWhom:'',
          content:'',
          toCommentId:''
        }
    },
    methods:{
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
        refreshComment:function(el){
            "use strict";
            getComment(el,el.data.thingsId)
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
                        getComment(self,thingsId)
                    }
                }
            })
        },

    }
    ,
    ready:function () {
        this.setData({
            userId:app.globalData.openId
        })
        let thingsId=this.data.thingsId
        console.log(thingsId)
        getComment(this,thingsId)
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


}

function changeComment(self) {
    let arr=[]
    let cList=self.data.commentList
    console.log(cList)
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
    arr.reverse()
    self.setData({
        commentList:arr
    })
    console.log(self.data.commentList)
    getUserInfo(self)
}