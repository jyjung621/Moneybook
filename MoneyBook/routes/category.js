
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


router.get('/', (request, response) => {
    response.redirect('/category/list');
});

router.get('/list', (request, response) => {
    var sql = "select * from category where userId=?";
    db.query(sql, [request.session.userId], (err, rs) => {
        if(err) {
            console.log('categoryList error : ' + err);
            throw err;
        }
        response.render('category/categoryList.ejs', {
            message : "",
            list : rs
        });
    });
});

router.post('/createPro', (request, response) => {
    var body = request.body;
    var sql = "insert into category (categoryNo, userId, name, kinds) \
            values (fn_maxTablenum('category',?),?,?,?)";
    db.query(sql,[body.userId, body.userId, body.name, body.kinds], (err,rs) => {
        if(err){
            console.log('category createPro error : ' + err);
            throw err;
        }
        response.redirect('list');
    });
});

router.post('/updatePro', (request, response) => {
    var body = request.body;
    var sql = "update category set name=?, kinds=? where categoryNo=? and userId=?";
    console.log('updatePro data -> ' + JSON.stringify(body));
    db.query(sql, [body.name, body.kinds, body.categoryNo, body.userId], (err, rs) => {
        if(err) {
            console.log('categoryUpdatePro error : ' + err);
            throw err;
        }
        response.redirect('list');
    });
});

// router.post('/test-btn1', (request, response) => {
//     var body = request.body;
//     console.log('test-btn1 --> ' + JSON.stringify(body));
//     response.redirect('list');
// });
// router.post('/test-btn2', (request, response) => {
//     var body = request.body;
//     console.log('test-btn2 --> ' + JSON.stringify(body));;
//     response.redirect('list');
// });



module.exports = router;