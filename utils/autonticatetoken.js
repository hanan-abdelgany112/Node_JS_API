//take the token and check user is already exist or admin
const jwt=require('jsonwebtoken');
require('dotenv').config()
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader//.split(' ')[1]
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      console.log(err)
      if (err) return res.sendStatus(403)
      req.user = user
      next()
    })
  }

  
  app.get('/check', authenticateToken, (req, res) => {
    res.json(users.filter(user => user.email === req.user.email))
  })
  module.exports = router;