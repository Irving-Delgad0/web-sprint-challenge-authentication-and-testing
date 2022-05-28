const {JWT_SECRET} = require('../secrets/index')
const jwt = require('jsonwebtoken')
const Users = require('../Users/users-model')

const checkRegister = async (req,res,next) => {
  let {username, password} = req.body

  if(username == null || password == null){
    next({message: 'username and password required'})
    return
  }

  let alreadyExists = await Users.findBy({username}).first() != null
  if(alreadyExists){
    next({status: 422, message: "username taken"})
    return
  }
  next()
}

const checkLogin = async (req, res, next) => {
  let {username, password} = req.body

  if(username == null || password == null){
    next({message: 'username and password required'})
    return
  }
  next()
}




const restrict = async (req, res, next) => {
  if(req.headers.authorization == null){
    next({status: 401, message: 'token required'})
    return;
  }
  
  try{
    req.decodedJwt = await jwt.verify(req.headers.authorization, JWT_SECRET)
  }catch(err){
    next({status: 401, message: "token invalid"})
  }
  next()
  /*
  IMPLEMENT
  
  1- On valid token in the Authorization header, call next.
  
  2- On missing token in the Authorization header,
  the response body should include a string exactly as follows: "token required".
  
  3- On invalid or expired token in the Authorization header,
  the response body should include a string exactly as follows: "token invalid".
  */
}

 module.exports = {
   restrict,
   checkRegister,
   checkLogin
 }