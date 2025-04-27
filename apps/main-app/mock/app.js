var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var tableRouter = require("./routes/table");
var cardRouter = require("./routes/card");
var one2oneRouter = require("./routes/one2one");
var targetRouter = require("./routes/target");
var imageRouter = require("./routes/image");
var recordRouter = require("./routes/record");
var offlineRouter = require("./routes/offline");
var historyRouter = require("./routes/history");
var n2nRouter = require("./routes/n2n")
var vehicleAnalysis = require("./routes/vehicleAnalysis")
var crossRouter = require('./routes/cross')
var clueRouter = require("./routes/clue")
var foothold = require("./routes/foothold")
var personfoothold = require("./routes/personfoothold")
var deploy = require("./routes/deploy")
var doublecar = require("./routes/doublecar")
var track = require("./routes/track")
var personAnalysisRouter = require("./routes/personAnalysis")
var activeNightRouter = require('./routes/activeNight')
var exportRouter = require('./routes/export')
var personRegionalMapping = require('./routes/personRegionalMapping')
var vehicleFakeClone = require('./routes/vehicleFakeClone')
var feedBack = require('./routes/feedBack')
var recordRehicle = require('./routes/record-vehicle')
var notifyRouter = require('./routes/notify')
var eventStream = require('./routes/eventStream')
var login =require("./routes/login")
var homepageRouter = require('./routes/homepage')
var log = require('./routes/log')
var labelManage = require('./routes/labelManage')

var app = express();

function logErrors(err, req, res, next) {
  console.error(err.stack)
  next(err)
}

function errorHandler(err, req, res, next) {
  res.status(500)
  res.render('error', { error: err })
}

function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' })
  } else {
    next(err)
  }
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
// app.use(express.json({ limit: 999999 }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// app.use(logErrors)
// app.use(clientErrorHandler)
// app.use(errorHandler)

/**
 * @apiDefine APICommon  全局方法,定义了一个全局apiDoc方法
 * @apiSuccess  {String} message  成功信息
 * @apiSuccess  {Number} status 状态码 <code>20000 成功, 30009、40006、40005 token失效</code>
 */

app.use("*", function (req, res, next) {
  const { origin, Origin, referer, Referer } = req.headers;
  const allowOrigin = origin || Origin || referer || Referer || "*";
  res.header("Access-Control-Allow-Origin", allowOrigin);
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With, Admin-Token, Page-Name"
  );
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("X-Powered-By", "Express");

  req.json = {
    // status: 20000,
    message: "ok",
  };

  req.sleep = function (time) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(null);
      }, time * 1000);
    });
  };

  if (req.method == "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use("/", indexRouter);
app.use("/", tableRouter);
app.use("/", cardRouter);
app.use("/", one2oneRouter);
app.use('/', targetRouter);
app.use('/', imageRouter);
app.use('/', offlineRouter)
app.use('/', historyRouter)
app.use('/', n2nRouter)
app.use('/', vehicleAnalysis)
app.use('/', crossRouter)
app.use('/', clueRouter)
app.use('/', foothold)
app.use('/', personfoothold)
app.use('/', deploy)
app.use('/', doublecar)
app.use('/', track)
app.use('/', recordRouter)
app.use('/', personAnalysisRouter)
app.use('/', activeNightRouter)
app.use('/', exportRouter)
app.use('/', personRegionalMapping)
app.use('/', vehicleFakeClone)
app.use('/', feedBack)
app.use('/', recordRehicle)
app.use('/', notifyRouter)
app.use('/', eventStream)
app.use('/',login)
app.use('/', homepageRouter)
app.use('/', log)
app.use('/', labelManage)
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
