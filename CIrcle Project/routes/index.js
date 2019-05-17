const express = require('express');
const router = express.Router();
const pg = require('pg');
const crypto = require('crypto');
const path = require('path');
const http = require('http');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/monitor_urls';

/* GET home page. */
router.get('/', function(req, res, next) {

  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      done();
      console.log(err);
      return res.status(500)
        .json({success: false, data: err});
    }

    var data = {};
    data["no_of_urls"] = 0;
    data["urls"] = [];

    // Query to insert
    const query = client.query('SELECT * FROM identity');

    query.on('row', function(row) {
      ++data["no_of_urls"];
      data["urls"].push({id: row.id, url: row.url, data1: row.data1, data2:row.data2 });
    });

    query.on('end', function() {
      done();
      res.render('index', { data: data });
    });
  });

});

router.get('/:id', function(req, res, next) {

  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      done();
      console.log(err);
      return res.status(500)
        .json({success: false, data: err});
    }

    var data = {};
    data['id'] = req.params.id;
    // Query to insert
    const query = client.query('SELECT * FROM responses WHERE id=$1',
      [req.params.id]);

    query.on('row', function(row) {
      data["responses"] = row.delays.split(' ');
      console.log(data);
    });

    query.on('end', function() {
      done();
      res.render('responses', { data: data });
    });
  });


});

router.post('/add', function(req, res, next) {
  const results = [];
  var url_id = crypto.randomBytes(64).toString('hex');  // 64 creates hex of 128
  const data = {url: req.body.url, id: url_id,data1: req.body.data1, data2: req.body.data2}

  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      done();
      console.log(err);
      return res.status(500)
        .json({success: false, data: err});
    }

    // Query to insert
    const query = client.query('INSERT INTO identity(id, url, data1, data2) values($1, $2, $3, $4)',
      [data.id, data.url,data.data1, data.data2]);

    const query2 = client.query('INSERT INTO responses(id, delays) values($1, $2)',
      [data.id, '']);

    results.push(data.id);

    query.on('end', function() {
      done();
      return res.json(results);
    });
  });
});

router.post('/responses', function(req, res, next) {
  url_id = req.body.id;

  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      done();
      console.log(err);
      return res.status(500)
        .json({success: false, data: err});
    }

    // Query to select
    const query = client.query('SELECT * FROM responses WHERE id=$1;',
      [url_id]);

    query.on('row', function(row) {
      results = row.delays.split(' ');
      return res.status(200)
        .json(results);
    });

    query.on('end', function(row) {
      done();
    });
  });

});

router.post('/edit', function(req, res, next) {
  url_id = req.body.id;  
  new_data1 = req.body.data1;
  new_data2 = req.body.data2;

  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      done();
      console.log(err);
      return res.status(500)
        .json({success: false, data: err});
    }

    // Query to update
    const query = client.query('UPDATE identity SET data1 = $2,data2=$3 WHERE id=$1;',
      [url_id, new_data1,new_data2]);

    query.on('end', function() {
      done();
      return res.status(200)
        .json({success: true});
    });
  });
});


router.post('/stop', function(req, res, next) {
  url_id = req.body.id;

  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      done();
      console.log(err);
      return res.status(500)
        .json({success: false, data: err});
    }

    // Query to delete
    const query1 = client.query('DELETE FROM identity WHERE id = $1',
      [url_id]);

    const query2 = client.query('DELETE FROM responses WHERE id = $1',
      [url_id]);

    query2.on('end', function() {
      done();
      return res.status(200)
        .json({success: true});
    });
  });
});

router.post('/check', function(req, res, next) {
  url_id = req.body.id;

  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      done();
      console.log(err);
      return res.status(500)
        .json({success: false, data: err});
    }

    // Query to check
    const query = client.query('SELECT FROM identity WHERE EXISTS id = $1',
      [url_id]);

      query.on('end', function() {
      done();
      return res.status(200)
        .json({success: false});
    });
  });
});


module.exports = router;
