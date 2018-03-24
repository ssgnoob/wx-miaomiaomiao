let mysql= require('mysql');
const moment = require('moment');

let pool  = mysql.createPool({
    host:'101.132.116.22',
    user:'ssg',
    password:'shi753951',
    database:'wx_miao',
    port:3306,
    charset:'UTF8_GENERAL_CI'
});


let mysqlop= {
    users:function (openId,userInfo,cb) {

        pool.getConnection((err,conn)=>{
            "use strict";
            conn.query(`select * from users where 
openId='${openId}'`,(err,rows)=>{
                if(err){
                    conn.release()
                    console.log(err)
                    cb({errcode:1,err})
                }

                else if(rows.length===0)
                    conn.query(`insert into users values
('${openId}','${userInfo.nickName}',
${userInfo.gender},'${userInfo.city}','${userInfo.province}'
                    
,'${userInfo.country}','${userInfo.avatarUrl}')`,(err,results)=>{
                        if(err){
                            console.log(err)
                            cb({errcode:1,err})
                        }
                        else
                            cb({errcode:0,results})
                        conn.release()
                    })
                else {
                    cb({errcode: 0})
                    conn.release()
                }
            })
        })
    },
    newThings:function (openId,content,imgName,cb) {
        let date= moment(new Date).format("YYYY-MM-DD HH:mm:ss")
        pool.getConnection((err,conn)=>{
            "use strict";
            conn.query(`insert into newThings values
(null,1,'${content}',0,'${imgName}','${date}','${openId}')`,
                (err,results)=>{
                    if(err){
                        console.log(err)
                        cb({errcode:1,err})
                    }
                    else{
                        cb({errcode:0})
                    }
                    conn.release()
                })
        })
    },
    newVedio:function (openId,content,fileName,cb) {
        let date= moment(new Date).format("YYYY-MM-DD HH:mm:ss")
        pool.getConnection((err,conn)=>{
            "use strict";
            conn.query(`insert into newThings values
(null,0,'${content}',0,'${fileName}','${date}','${openId}')`,
                (err,results)=>{
                    if(err){
                        console.log(err)
                        cb({errcode:1,err})
                    }
                    else{
                        cb({errcode:0})
                    }
                    conn.release()
                })
        })
    },
    getVedioImg:function (id,cb) {
        pool.getConnection((err,conn=>{
            "use strict";
            conn.query('select * from ')
        }))
    },
    getContent:function (type,id,cb) {
        let sql=''
        if(id==0)
            sql='select * from newthings where type='+type+' order by createdOn desc'
        else
            sql=`select * from newthings where type=${type} and id='${id}' order by createdOn desc`

        pool.getConnection((err,conn)=>{
            "use strict";
            conn.query(sql,(err,rows)=>{
                if(err){
                    console.log(err)
                    cb({errcode:1,err})
                }
                else{
                    cb({errcode:0,rows})
                }
                conn.release()
            })
        })
    },
    getUserInfo:function(openId,cb){

        pool.getConnection((err,conn)=>{

            conn.query(`select * from users where openId='${openId}'`,(err,rows)=>{
                if(err){
                    console.log(err)
                    cb({errcode:1,err})
                }
                else{
                    cb({errcode:0,rows})
                }
                conn.release()

            })

        })


    },
    seeVideo:function(id,cb){
        pool.getConnection((err,conn)=>{
            conn.query('update newthings set hasSeen=hasSeen+1 where type=0 and id='+id,(err,result)=>{

                if(err){
                    console.log(err)
                    cb({errcode:1,err})
                }
                else{
                    cb({errcode:0,result})
                }
                conn.release()
            })

        })}

    ,
    getVideo:function(id,cb){
        pool.getConnection((err,conn)=>{
            conn.query('select * from newthings where type=0 and id='+id,(err,rows)=>{

                if(err){
                    console.log(err)
                    cb({errcode:1,err})
                }
                else{
                    cb({errcode:0,rows})
                }
                conn.release()
            })
        })
    },
    sendCommit:function(thingsId,toWhom,userId,content,cb){
        let date= moment(new Date).format("YYYY-MM-DD HH:mm:ss")
        pool.getConnection((err,conn)=>{
            conn.query(`insert into comments values('${userId}',${thingsId},'${toWhom}','${date}',0,'${content}')`,
                (err,results)=>{
                    if(err){
                        conn.release()
                        console.log(err)
                        cb({errcode:1,err})
                    }
                    else{
                        conn.query('select * from comments where thingsId='+thingsId,(err,rows)=>{

                            if(err){
                                console.log(err)
                                cb({errcode:1,err})
                            }
                            else{
                                cb({errcode:0,rows})
                            }
                            conn,release()}
                        )

                    }
                })



        })
    }



    ,
}
module.exports=mysqlop



