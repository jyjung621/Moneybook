
var express = require('express');
var router = express.Router();
var app = express();
var ejs = require('ejs');
var db = require('../lib/db');
var bodyParser = require('body-parser');

// var md = require('../lib/memberDao');


app.engine('ejs', ejs.renderFile);
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

/* router.get('/sampleView', (req, res) => {
    res.redirect('basicForm1.ejs');
}); */

router.get('/', (request, response) => {
    response.redirect('/home/booklist');
});

router.get('/admin', (request, response) => {
    request.session.is_logined = true;
    request.session.nickname = "Admin";
    request.session.grade = 0;
    request.session.userId = "admin@admin.com";
    request.session.phone = "1588-8888";
    request.session.save(function() {
        return response.redirect('booklist');
    });
});

router.get('/booklist', (req,res) => {
    var session = req.session;
    db.query("select * from moneybook where userId=? order by parentBook, kinds, bookName",[session.userId], (err, bookList) => {
        if(err) {
            console.log('loginPro selectBook error : ' + err);
            throw err;
        }
        req.session.bookList = bookList;
        req.session.save(function() {
            return res.redirect('main');
        });
    });
});

router.get('/main', (request, response) => {
    response.render('home.ejs', {
        /* is_logined : request.session.is_logined,
        nickname : request.session.nickname,
        grade : request.session.grade */
    });
});

module.exports = router;