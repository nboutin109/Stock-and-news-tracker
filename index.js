const express = require('express');
const app = express();
const exphbs  = require('express-handlebars');
const path = require('path');
const request = require('request');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 5000;

// Body parser middleware setup //
app.use(bodyParser.urlencoded({extended: false}));


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
app.get('/about.html', function (req, res) {
    res.render('about');
});

// Set a static folder //
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => console.log('Server is listening on port ' + PORT));
