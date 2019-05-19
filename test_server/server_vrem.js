const express = require('express');
const app = express();
const port = 8081;
var fs = require("fs");
const jsonfile = require('jsonfile');

var counter_test = 0;

/*function readJsonFileSync(filepath) {
    let file = fs.readFileSync(filepath, 'utf8');
    return JSON.parse(file);
};*/

function REwriteJsonFileSync(filepath, new_data) {
    jsonfile.writeFileSync(filepath, new_data, { flag: 'a', spaces: 2, EOL: '\r\n' })
}


// For correct work with CORS

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.get('/', function(req, res, next) {
    // Handle the get for this route
});

app.post('/', function(req, res, next) {
    // Handle the post for this route
});


// /test

app.route('/test')
    .post(function(req, res) {
        let data = '';
        req.on('data', function(chunk) {
            data += chunk.toString();
        });
        req.on('end', function() {
            //res.write('Принято');
            res.end();
            let json_data = JSON.parse(data);
            REwriteJsonFileSync('./JSON/POST.user_actions.json', json_data);
        });
        counter_test++;
        console.log('post-test: ' + counter_test);
    });


// Server listening

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err)
    }
    console.log(`Server is listening on http://127.0.0.1:${port}`)
})