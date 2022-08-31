//to access secret key in env file
require('dotenv').config();

const express = require('express')
const router = express.Router();

const users=require('../model/user');
const jwt = require('jsonwebtoken')



let refreshTokens = []

//////////////////////////////////////////////////////////////////////////////refreshtoken
router.post('/token/', (req, res) => {
  const refreshToken = req.body.token
  if (refreshToken == null) return res.sendStatus(401)
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err){
       return res.sendStatus(403)
      
    }
    const accessToken = generateAccessToken({ email: user.email })
    res.json({ accessToken: accessToken })
  })
})
///////////////////////////////////////////////////////////////////////////////logout
router.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token)
  res.sendStatus(205);
  res.json('you are loged out,and must refresh token');
})
////////////////////////////////////////////////////////////////////////////////////login
router.post('/login/',async (req, res) => {
  // Authenticate User

  const emaill = req.body.email
  const password= req.body.password
  
  let useremail = await users.findOne({email : emaill})
  
  
if(!useremail){
    return res.status(422).json({
        errors: [
            {
                msg: "Invalid email",
            }
        ]
    })
}

if(useremail.password!=password)
res.status(403).send('pass is wrong')

  const user = { email: emaill }
  const accessToken = generateAccessToken(user)
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken)
  res.json({ accessToken: accessToken, refreshToken: refreshToken })

 
})


function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
}

module.exports = router;