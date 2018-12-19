
var express = require('express');
var router = express.Router();
var app = express();
var ejs = require('ejs');

app.engine('ejs', ejs.renderFile);


router.get('/', function(request, response) {
    /* var html = `
        <h2>Board Project TEST</h2>
        <input type="button" name="goBoard" value="게시판 이동" onclick="">
        `;
    
    response.send(html); */
    response.render('index.ejs');
});

module.exports = router;