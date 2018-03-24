let express= require('express')
let https=require('https')
let bodyParser = require('body-parser');
let cors = require('cors');
let app=express()
let path = require('path');
let fs = require('fs');
let mysqlop=require('./mysqlop');
let multer  = require('multer');
const uuidV4 = require('uuid/v4');
let getVedioImg=require('./getVedioImg');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


function dateFormat(date){
    return date.getFullYear()+'-'+(date.getMonth
    ()+1)+'-'+date.getDate()+'_'+date.getHours()+":"+date.getMinutes
    ()+":"+date.getSeconds()
}
function getHouZhui(name){
    let arr=name.split('.')
    return arr[arr.length-1]
}
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname+'/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, uuidV4()+'.'+getHouZhui
        (file.originalname))
    }
})
let upload = multer({storage: storage});

let storageImg = multer.diskStorage({
    destination: function (req, files, cb) {
        cb(null, __dirname+'/uploadsImg')
    },
    filename: function (req, file, cb) {

        cb(null, uuidV4()+'.'+getHouZhui(file.originalname))

    }
})
let uploadImg = multer({storage: storageImg});






app.get('/',function(req,res){console.log('连接成功')
    res.send('hello')})

app.post('/users',(req,res)=>{
        "use strict";
        mysqlop.users(req.body.openId,req.body.userInfo,(results)=>{
            if(results.errcode===0){
                res.status(200).json({errcode:0})
            }
            else{
                res.status(200).json({errcode:1,errmsg:results.err})
            }
        })
    }

)

app.get('/onLogin',(req,res)=>{
    let JSCODE=req.query.code
    let result=''
    let url='https://api.weixin.qq.com/sns/jscode2session?appid=wxc0e5f1026a2e46f4&secret=2ef444e2195874e88b2a4f464e1d7f40&js_code='+JSCODE+'&grant_type=authorization_code'
    let sendRes=res
    https.get(url, function (res) {
        let datas = [];
        let size = 0;
        res.on('data', function (data) {
            datas.push(data);
            size += data.length;
            //process.stdout.write(data);
        });
        res.on("end", function () {
            let buff = Buffer.concat(datas, size);
            //var result = iconv.decode(buff, "utf8");//转码
            result=buff.toString()

            sendRes.status(200).json(result)
        });

    }).on("error", function (err) {
        res.status(500).json({msg:err})
    });

})

app.post('/upload',upload.single('file'),(req,res,next)=>{
    getVedioImg.get(req.file.filename)
    res.status(200).json({errCode:0,file:req.file})


})

app.post('/uploadImg',uploadImg.single('file'),(req,res,next)=>{
    "use strict";

    res.status(200).send(req.file.filename)
})

app.post('/newThings',(req,res)=>{

    mysqlop.newThings
    (req.body.openId,req.body.content,req.body.imgName,(results)=>{
        if(results.errcode===0)
            res.status(200).json({errcode:0})
        else
            res.status(200).json({errcode:1,err:results.err})
    })
})


app.post('/newVedio',(req,res)=>{

    mysqlop.newVedio
    (req.body.openId,req.body.content,req.body.fileName,(results)=>{
        if(results.errcode===0)
            res.status(200).json({errcode:0})
        else
            res.status(200).json({errcode:1,err:results.err})
    })
})

app.get('/getVedioImg',(req,res)=>{
    "use strict";

    let filename=req.query.fileName
    res.status(200).sendFile(__dirname+'/vedioImg/'+filename)

})

app.get('/getTextImg',(req,res)=>{

    let name=req.query.fileName
    res.status(200).sendFile(__dirname+'/uploadsImg/'+filename)
})


app.post('/getContent',(req,res)=>{
    "use strict";
    let type=req.body.type;
    let id=req.body.id;

    mysqlop.getContent(type,id,(results)=>{
        if(results.errcode===0)
            res.status(200).send({errcode:0,result:results.rows})
        else
            res.status(200).json({errcode:1,err:results.err})

    })
})

app.post('/getUserInfo',(req,res)=>{

        let openId=req.body.openId

        mysqlop.getUserInfo(openId,(results)=>{
            if(results.errcode===0)
                res.status(200).send({errcode:0,result:results.rows})
            else
                res.status(200).json({errcode:1,err:results.err})


        })
    }
)











let privateKey  = fs.readFileSync(path.join(__dirname,
    './ssl/onedayi.top.key'), 'utf8');
let certificate = fs.readFileSync(path.join(__dirname,
    './ssl/onedayi.top-ca-bundle.crt'), 'utf8');
let credentials = {key: privateKey, cert: certificate,secureProtocol:'TLSv1_2_method'};


// 静态文件配置
app.use(express.static(__dirname))

app.use(cors({
    origin:['*'],
    methods:['GET','POST'],
    alloweHeaders:['Content-Type', 'Authorization']
}));

var httpsServer = https.createServer(credentials, app);

//var httpsServer = https.createServer(app);
httpsServer.listen(3001, function() {
    console.log('HTTPS Server is running on: https://localhost:%s',
        3001);
})



/*let server = app.listen(3001, function(){
  console.log(server.address())
  let host = server.address().address;
  let port = server.address().port;
  console.log('Listening at http://%s:%s', host, port);
});
*/