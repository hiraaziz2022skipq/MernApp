const express = require('express');
const { dbcreate, update, delete_url, insert, search } = require('./mongodb_facade')
const { avail_datapoints, latency_datapoints } = require('./getdata')
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();                                        // Creating object of express.js
app.use(cors({ 'origin': "*" }));                             // Apply CORS to establish connection between two sites
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// const port = 3001
// app.listen(port, () => {console.log('http://localhost:'+port)})

// Get all the documents from mongdb
app.get('/', (req, res) => {

    dbcreate()                                         
        .then(result => res.send(result));

});

// Get data points from published metrics
app.get('/getdata/:urldata', async function (req, res) {

    const url = req.params.urldata //change

    let avail = avail_datapoints(url)                        // Getting availability datapoints
        .then((results) => {                                 // if success send datapoints
            return results;
        })
        .catch((err) => {
            // console.log(err);
        });
    let latency = latency_datapoints(url)                    // Getting latency datapoints
        .then((results) => {                                 // if success send datapoints
            return results;
        })
        .catch((err) => {
            // console.log(err);
        });
    Promise.all([avail, latency]).then(values => {
        res.send(values)
    });

});

//  Search specific document
app.get('/search/:searchurl', (req, res) => {

    const url_value = { "url": req.params.searchurl }         // Creating an obj for url
    search(url_value)                                         // Calling function search url
        .then(result => res.send(result));

});


// Insert value into mongodb
app.post('/', (req, res) => {

    const url_value = req.body.urls                          // Getting url to send to insert func
    insert(url_value)                                        // Calling insert into mongodb function
        .then(result => res.send(result));

});

// Update value in mongodb
app.put('/', (req, res) => {

    let updatedurl = req.body.updateurl                      // Getting updated url
    let url = req.body.url                                   // Getting url to update
    update(url, updatedurl)                                  // Calling an update function
        .then(result => res.send(result));

});

// Delete url from mongodb
app.delete('/:url', (req, res) => {

    let deleted_url = { "url": req.params.url }              // Getting url to delete from mongodb
    delete_url(deleted_url)                                  // Calling delete function
        .then(result => res.send(result));

})

module.exports = app