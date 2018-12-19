
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
    response.redirect('/book/list');
});

router.get('/list', (request, response) => {
    var session = request.session;
    db.query('select * from moneybook where userid=? order by parentBook, kinds, bookName', [session.userId], (err, rs) => {
        if(err) {
            console.log('/book/list error : ' + err);
            throw err;
        }
        /* console.log('session --> ' + session); */
        response.render('moneybook/bookList.ejs', {
            list : rs
        });
    });
    
});

router.get('/createForm', (request,response) => {
    db.query("select * from moneybook where kinds='0'", (err, rs) => {
        if(err) {
            console.log('/book/createForm error : ' + err);
            throw err;
        }
        response.render('moneybookCreateForm.ejs', {
            list : rs,
        });
    });
});

router.post('/createPro', (request, response) => {
    var body = request.body;
    var session = request.session;
    var sql = "";
    var sqlStart = "INSERT INTO moneybook (bookNo, bookName, userId, kinds, parentBook, memo, regDate) VALUES (fn_maxTablenum('moneybook',?), ?, ?, ?, ";
    var sqlEnd = " ?, NOW())";

    console.log('parentBook --> ' + body.parentBook);
    sql += sqlStart;
    if(body.parentBook === '0') {
        sql += " fn_maxTablenum('moneybook',?),";
    } else {
        sql += " ?,"
    }
    sql += sqlEnd;

    db.query(sql,[session.userId, body.bookName, session.userId, body.kinds, session.userId, body.memo], (err, rs) => {
            if(err) {
                console.log('/book/createPro error -> ' + err);
                throw err;
            }
            response.redirect('list');
        });
});

router.get('/contentView', (request, response) => {
    var str = request.query;
    var sql = "select * from moneybook where bookNo=?";

    db.query(sql, [str.bookNo], (err, rs) => {
        if(err) {
            console.log('/book/contentView error -> ' + err);
            throw err;
        }
        response.render('moneybookContentView.ejs', {
            contents : rs[0]
        });
    });
});

router.get('/updateForm', (request, response) => {
    var str = request.query;
    var sql = "select * from moneybook where bookNo=?";

    db.query(sql, [str.bookNo], (err, rs) => {
        if(err) {
            console.log('/book/deleteChk error -> ' + err);
            throw err;
        }
        response.render('moneybookUpdateForm.ejs', {
            contents : rs[0]
        });
    });
});

router.post('/parentSel', (request,response) => {
    db.query("select * from moneybook where kinds='0'", (err, rs) => {
        if(err) {
            console.log('/book/parentSel error : ' + err);
            throw err;
        }
        response.json(rs);
    });
});

router.post('/updatePro', (request, response) => {
    var body = request.body;
    console.log('---------body----------\n' + JSON.stringify(body,null,'\t'));
    var sql = "update moneybook set bookName=?, kinds=?, parentBook=?, memo=? where bookNo=?";
    var kinds = body.oldKinds;
    var parentBook = body.parentBook;
    if(body.newKinds != undefined) {
        kinds = body.newKinds;
        if(kinds === '0') {
            parentBook = body.bookNo;
        }
    }

    db.query(sql, [body.bookName, kinds, parentBook, body.memo, body.bookNo], (err, rs) => {
        if(err) {
            console.log('/book/updatePro error -> ' + err);
            throw err;
        }
        response.redirect('contentView?bookNo=' + body.bookNo);
    });

});

router.post('/deleteChk', (request, response) => {
    var body = request.body;
    console.log("deleteChk bookNo -> " + body.bookNo);
    console.log("deleteChk parentBook -> " + body.parentBook);
    var sql = "select count(*) cnt from moneybook where parentBook=?";

    db.query(sql, [body.bookNo], (err, rs) => {
        if(err) {
            console.log('/book/deleteChk error -> ' + err);
            throw err;
        }
        console.log("DB result : " + rs[0].cnt);
        response.json(rs[0]);
    });
});

router.get('/deletePro', (request, response) => {
    var str = request.query;
    var deleteNo = 0;
    var sql = "";
    var sqlStart = "delete from moneybook where ";
    var sqlEnd = "";

    sql += sqlStart;
    if(str.bookNo != undefined) {
        sql += "bookNo=?";
        deleteNo = str.bookNo;
        console.log('bookNo -> ' + str.bookNo);
    } else if(str.parentBook != undefined) {
        sql += "parentBook=?";
        deleteNo = str.parentBook;
        console.log('parentBook -> ' + str.parentBook);
    } else {
        console.log('bookNo & parentBook 없음... -> ' + str.bookNo + ',' + str.parentBook);
    }
    sql += sqlEnd;

    db.query(sql, [deleteNo], (err, rs) => {
        if(err) {
            console.log('/book/deletePro error -> ' + err);
            throw err;
        }
        response.redirect('list');
    });
});

module.exports = router;