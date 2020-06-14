const express = require('express');
const app = express();
const exphbs  = require('express-handlebars');
const path = require('path');
const request = require('request');
// const bodyParser = require('body-parser');
const axios = require('axios');


const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({extended: true}));
app.use(express.json())


// API key - pk_c31bdade5c47425fafb25d4831e9861e //

// create call_api function //
function call_api(finishedAPI, ticker) {
    request('https://cloud.iexapis.com/stable/stock/' + ticker + '/quote?token=pk_c31bdade5c47425fafb25d4831e9861e', { json: true }, (err, res, body) => {
        if (err) {return console.log(err);}
        if (res.statusCode === 200){
            //console.log(body);
            finishedAPI(body);
           };
        });
};

//multiple API calls
const fetchApiInfo = async (url) => {
    console.log(`Fetching ${url}`)
    const stockInfo = await axios(url) // API call 
    return stockInfo.data;
   }
   // Iterates through array and return stock info
   const fetchUserInfo = async (tickers) => {
    const requests = tickers.map((ticker) => {
     const url = `https://cloud.iexapis.com/stable/stock/` + ticker + `/quote?token=pk_c31bdade5c47425fafb25d4831e9861e`
     return fetchApiInfo(url) // Async function that fetches the user info.
      .then((res) => {
      return res 
      })
    })
    return Promise.all(requests) // Waiting for all the requests to get resolved.
   }
   //invoke fetch user info
   // fetchUserInfo([‘fb’, ‘tsla’, ‘aapl’])
   // .then(a => console.log(JSON.stringify(a)))

// Setting the handlebars middleware //
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

const otherstuff = "hello there, this is other stuff!";

// Set handlebar index get route //
app.get('/', function (req, res) {
    call_api(function(doneAPI) {
        res.render('home', { 
            stock: doneAPI
         });
    }, "fb");
   
});

// Set handlebar index post route //
app.post('/', function (req, res) {
    call_api(function(doneAPI) {
     //posted_stuff = req.body.stock_ticker;//
        res.render('home', { 
            stock: doneAPI,
        });
    }, req.body.stock_ticker);

});

// Create about page route //
app.get('/about.html', async function (req, res) {
    const data = await fetchUserInfo(['fb', 'tsla', 'aapl']);
    const results = {};
    results.stocks = data; 
    console.log(results);
    res.render('portfolio', results);
  });

app.get('/portfolio.html', async function (req, res) {
    const data = await fetchUserInfo(['fb', 'tsla', 'aapl']);
    const results = {};
    results.stocks = data; 
    console.log(results);
    res.render('portfolio', results);
  });
// Set a static folder //
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => console.log('Server is listening on port ' + PORT));
