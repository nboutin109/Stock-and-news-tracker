const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const request = require('request');
const axios = require('axios');
var passport = require("./config/passport");
var db = require("./models");
var session = require("express-session");
const isAuthenticated = require('./config/middleware/isAuthenticated');

// const PORT = process.env.PORT || 5000;

const host = '0.0.0.0';
const port = process.env.PORT || 5000;
// app.listen(port, host, function() {
//   console.log("Server started.......");
// });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


// Need to use sessions to keep track of a user's login status //
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// create call_api function //
function call_api(finishedAPI, ticker) {
  request('https://cloud.iexapis.com/stable/stock/' + ticker + '/quote?token=pk_c31bdade5c47425fafb25d4831e9861e', { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    if (res.statusCode === 200) {
      finishedAPI(body);
    };
  });
};

//multiple API calls
const fetchApiInfo = async (url) => {
  console.log(`Fetching ${url}`)
  const stockInfo = await axios(url)
  return stockInfo.data;
}
// Iterates through array and return stock info
const fetchUserInfo = async (tickers) => {
  const requests = tickers.map((ticker) => {
    const url = `https://cloud.iexapis.com/stable/stock/` + ticker + `/quote?token=pk_c31bdade5c47425fafb25d4831e9861e`
    return fetchApiInfo(url)
      .then((res) => {
        return res
      })
  })
  return Promise.all(requests)
};

// Iterates through array to return news info
const fetchNewsInfo = async (tickers) => {
  const requests = tickers.map((ticker) => {
    const url = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + ticker + '&facet_fields=source&facet=true&begin_date=20200601&end_date=20200625&api-key=QzKMS3OtIrTljBwjuddSWl23yFk5P70N'
    return fetchApiInfo(url)
      .then((res) => {
        return res
      })
  })
  return Promise.all(requests)
};

// Setting the handlebars middleware //
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Set handlebar index get route //
app.get('/members', isAuthenticated, function (req, res) {
  call_api(function (doneAPI) {
    res.render('home', {
      stock: doneAPI
    });
  }, "fb");
});

//Create basic route
app.get("/", function (req, res) {
  if (req.user) {
    res.redirect("/members")
  } else {
    res.redirect("/login");
  }
})


// Create about page route 
app.get('/about', function (req, res) {
  if (!req.user) {
    res.redirect("/login");
  } else {
    res.render('about');
  }
});

//Create portfolio page route
app.get('/portfolio', async function (req, res) {
  if (!req.user) {
    res.redirect("/login");
  } else {
    const data = await fetchUserInfo(['fb', 'tsla', 'aapl']);
    const results = {};
    results.stocks = data;
    console.log(results);
    res.render('portfolio', results);
  }
});

//Create portfolio api/search
app.post('/portfolio', async function (req, res) {
  if (!req.user) {
    res.redirect("/login");
  } else {
    var sp = await req.body.port.split(",");
    const data = await fetchUserInfo(sp);
    const results = {};
    results.stocks = data;
    console.log(results);
    res.render('portfolio', results);
  }
});

//Create news page route
app.get('/news', async function (req, res) {
  if (!req.user) {
    res.redirect("/login");
  } else {
    const data = await fetchNewsInfo(['facebook', 'tesla', 'apple']);
    const results = {};
    results.response = data;
    console.log(results);
    res.render('news', results);
  }
});

// Create news api/search
app.post('/news', async function (req, res) {
  if (!req.user) {
    res.redirect("/login");
  } else {
    var sp = await req.body.newsSearch.split(",");
    const data = await fetchNewsInfo(sp);
    const results = {};
    results.response = data;
    console.log(results);
    res.render('news', results);
  }
});

// Set handlebar index post route //
app.post('/', function (req, res) {
  call_api(function (doneAPI) {
    //posted_stuff = req.body.stock_ticker;//
    res.render('home', {
      stock: doneAPI,
    });
  }, req.body.stock_ticker);

});

// Requring additional routes in our code //

require("./routes/api-routes.js")(app);
require("./routes/html-routes.js")(app);

 db.sequelize.sync().then(function () {
   app.listen(port, host, function() {
    console.log("Server started.......");
   });
 });
//app.listen(port, host, function() {
// console.log("Server started.......");
//});