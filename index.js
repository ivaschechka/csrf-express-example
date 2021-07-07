const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser');
const path = require('path')
const PORT = process.env.PORT || 5000
var corswithCredentials = {
  origin: 'http://localhost:4200',
  credentials: true
}

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(cookieParser())
  .use(express.json())
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => {
    const username = req.cookies['username'];
    const isShowInfo = username != undefined || username != null;
    var model = {
      username: isShowInfo ? username : '',
      isShowInfo: isShowInfo
    }
    return res.render('pages/index', model);
  })
  .options('/api/bank/transactions', cors(corswithCredentials))
  .post('/api/bank/transactions', cors(corswithCredentials), (req, res) => {
    const username = req.cookies['username'];
    if (username != undefined || username != null) {
      const transaction = {
        from: username,
        to: req.body.to,
        amount: req.body.amount,
        status: 'success'
      }
      res.json(transaction);
    } else {
      res.status(403).end();
    }
  })
  .options('/api/login/info', cors(corswithCredentials))
  .get('/api/login/info', cors(corswithCredentials), function (req, res) {
    const info = req.cookies['username'];
    if (info != undefined || info != null) {
      res.json({ username: info });
    } else {
      res.status(403).end();
    }
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`))
