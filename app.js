var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var MongoClient = require('mongodb').MongoClient
var config = require('./config')
const { monitor } = require('./controller/monitor')

var monitorRouter = require('./routes/monitor');
var dataRouter = require('./routes/data');
var userRouter = require('./routes/user');

var app = express();

app.all('/*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE')
  next()
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// setup monitor 
var data_url = []

setInterval(function() {monitor(config.SLACK_WEBHOOK_URL, data_url)}, 1000*30)

app.use('/monitor', monitorRouter);
app.use('/data', dataRouter);
app.use('/user', userRouter);
app.get('/refresh-data', (req, res) => {
  MongoClient.connect(config.Mongo_URL, {useNewUrlParser : true}, function (err, client) {
    if (err) return res.status(500).json({err : "Connection Error"})
    const db = client.db(config.DB_Name)
    db.collection(config.data_url).find({ monitor : true}).toArray(function (err, URL) {
      client.close()
      if (err) return res.status(500).json(err)
      data_url = URL
      return res.status(200).json(URL)
    })
  })
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
