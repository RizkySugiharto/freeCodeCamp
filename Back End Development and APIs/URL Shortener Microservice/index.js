require('dotenv').config();
const regexIfFullURL = new RegExp(/^(http)s?:\/\/.*/);
const dns = require('dns/promises');
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise')
const app = express();
const getMysqlConn = () => mysql.createConnection({
  host: process.env.MYSQL_HOST || 'localhost',
  port: process.env.MYSQL_PORT || 3306,
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'express_db',
});

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(require('body-parser').urlencoded({ extended: true }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.get('/api/shorturl/:short_url', async function(req, res) {
  try {
    const conn = await getMysqlConn();
    const [rows, fields] = await conn.query(
      'SELECT destination FROM urls WHERE id = ?',
      [req.params.short_url]
    );
    await conn.end();

    let destination;
    if (regexIfFullURL.test(rows[0].destination)) {
      destination = rows[0].destination;
    } else {
      destination = `https://${rows[0].destination}`;
    }

    res.redirect(destination)
  } catch (error) {
    console.error(error);
    res.json({
      error: 'No short URL found for the given input'
    });
  }
})

app.post('/api/shorturl', async function(req, res) {
  try {
    let url;

    if (regexIfFullURL.test(req.body.url)) {
      url = new URL(req.body.url);
    } else {
      url = new URL(`https://${req.body.url}`);
    }
    await dns.lookup(url.hostname);

    const conn = await getMysqlConn();
    await conn.execute('INSERT INTO urls (destination) VALUES (?)', [req.body.url]);
    const [rows, fields] = await conn.query('SELECT id FROM urls WHERE id = LAST_INSERT_ID()');
    await conn.end();
    
    res.json({
      original_url: req.body.url,
      short_url: rows[0].id,
    });
  } catch (error) {
    console.error(error);
    res.json({
      error: 'invalid url'
    });
  }
})

app.listen(port, function() {
  getMysqlConn().then(async function(conn) {
    await conn.ping();
    console.log('Successfully connected to mysql');
  })
  console.log(`Listening on port ${port}`);
});
