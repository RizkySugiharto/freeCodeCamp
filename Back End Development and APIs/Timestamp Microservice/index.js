// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use('/public', express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/:date", function (req, res) {
  const shortDateRegex = new RegExp(/^\d{4}-\d{2}-\d{2}$/);
  const unixRegex = new RegExp(/^\d*$/);
  let date, unix, utc;

  if (shortDateRegex.test(req.params.date)) {
    unix = Date.parse(req.params.date);
  } else if (unixRegex.test(req.params.date)) {
    unix = parseInt(req.params.date);
  } else {
    unix = Date.parse(req.params.date);
  }
  
  date = new Date(unix);
  utc = date.toUTCString();

  if (utc === 'Invalid Date') {
    res.json({
      error: utc,
    });
  } else {
    res.json({
      unix,
      utc 
    });
  }
});

app.get("/api", function (req, res) {
  let date, date_string, utc;

  date_string = Date.now();
  date = new Date(date_string);
  utc = date.toUTCString();

  res.json({
    unix: date_string,
    utc 
  });
});



// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
