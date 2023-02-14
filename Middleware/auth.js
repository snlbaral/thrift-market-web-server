const jwt = require('jsonwebtoken')

function auth(req,res,next){
    const token = req.header('access-token')

    try{
        const decode = jwt.verify(token,'thrifted')
        req.user = decode
        next();
    }catch(err){
        res.status('400').send(err.message)
    }
}
module.exports=auth