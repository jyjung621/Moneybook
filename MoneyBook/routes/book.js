
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
    db.query('select * from moneybook where userid=? order by parentBook, kinds, bookName', [session.userId], (err, bookList) => {
        if (err) {
            console.log('/book/list error : ' + err);
            throw err;
        }
        db.query('select * from payment where userid=? order by kinds, paymentName', [session.userId], (err2, paymentList) => {
            if (err2) {
                console.log('/book/list payment Select error : ' + err2);
                throw err2;
            }
            /* console.log('session --> ' + session); */
            response.render('moneybook/bookList.ejs', {
                list: bookList,
                pList: paymentList
            });
        });
    });

});

// router.get('/createForm', (request,response) => {
//     db.query("select * from moneybook where kinds='0' and userId=?", [request.session.userId], (err, rs) => {
//         if(err) {
//             console.log('/book/createForm error : ' + err);
//             throw err;
//         }
//         response.render('moneybookCreateForm.ejs', {
//             list : rs,
//         });
//     });
// });

router.post('/createPro', (request, response) => {
    var body = request.body;
    var session = request.session;
    var sql = "";
    var sqlStart = "INSERT INTO moneybook (bookNo, bookName, userId, kinds, parentBook, memo, regDate) VALUES (fn_maxTablenum('moneybook',?), ?, ?, ?, ";
    var sqlEnd = " ?, NOW())";

    console.log('parentBook --> ' + body.parentBook);
    sql += sqlStart;
    if (body.parentBook === '0') {
        sql += " fn_maxTablenum('moneybook',?),";
    } else {
        sql += " ?,"
    }
    sql += sqlEnd;

    db.query(sql, [session.userId, body.bookName, session.userId, body.kinds, session.userId, body.memo], (err, rs) => {
        if (err) {
            console.log('/book/createPro error -> ' + err);
            throw err;
        }
        response.redirect('list');
    });
});

router.get('/contentView', (request, response) => {
    var str = request.query;
    var sql = "select * from moneybook where bookNo=? and userId=?";
    db.query(sql, [str.bookNo, request.session.userId], (err, bookInfo) => {
        if (err) {
            console.log('/book/contentView error -> ' + err);
            throw err;
        }
        var sql1 = "select * from financy where userId=? and bookName=?";
        db.query(sql1, [request.session.userId, bookInfo[0].bookName], (err2, financyInfo) => {
            if (err2) {
                console.log('/book/contentView financy error -> ' + err2);
                throw err2;
            }   
            response.render('moneybook/bookContent.ejs', {
                content: bookInfo[0],
                financy: financyInfo
            });
        });
    });
});

// router.get('/updateForm', (request, response) => {
//     var str = request.query;
//     var sql = "select * from moneybook where bookNo=? and userId=?";

//     db.query(sql, [str.bookNo, request.session.userId], (err, rs) => {
//         if(err) {
//             console.log('/book/deleteChk error -> ' + err);
//             throw err;
//         }
//         response.render('moneybookUpdateForm.ejs', {
//             contents : rs[0]
//         });
//     });
// });

router.post('/parentSel', (request, response) => {
    db.query("select * from moneybook where kinds='0' and userId=?", [request.session.userId], (err, rs) => {
        if (err) {
            console.log('/book/parentSel error : ' + err);
            throw err;
        }
        response.json(rs);
    });
});

router.post('/updatePro', (request, response, next) => {
    var body = request.body;
    console.log('---------body----------\n' + JSON.stringify(body, null, '\t'));
    // for(var i in body.bookPayment) {
    //     console.log('bookPayment'+ i + ' -> ' + body.bookPayment[i]);
    // }
    var sql = "update moneybook set bookName=?, kinds=?, parentBook=?, memo=? where bookNo=? and userId=?";
    var kinds = body.oldKinds;
    var parentBook = body.oldParentBook;
    if (body.parentBook != "" && body.parentBook != undefined) {
        parentBook = body.parentBook;
    }
    if (body.newKinds != undefined) {
        kinds = body.newKinds;
        if (kinds === '0') {
            parentBook = body.bookNo;
        }
    }

    db.query(sql, [body.bookName, kinds, parentBook, body.memo, body.bookNo, request.session.userId], (err, rs) => {
        if (err) {
            console.log('/book/updatePro error -> ' + err);
            throw err;
        }
        next();
    });

}, (request, response, next) => {
    var body = request.body;
    var sql = "delete from mapmoneypay where userId=? and bookName=?";
    db.query(sql,[request.session.userId, body.oldBookName], (err, rs) => {
        if (err) {
            console.log('/book/updatePro mapmoney delete error -> ' + err);
            throw err;
        }
        next();
    });

},(request, response) => {
    var body = request.body;
    var bookPayment = body.bookPayment;
    // console.log('---------test----------\n' + JSON.stringify(body,null,'\t'));
    var sql = "insert into mapmoneypay values (?,?,?)";
    for (var i in bookPayment) {
        db.query(sql, [request.session.userId, bookPayment[i], body.bookName], (err, rs) => {
            if (err) {
                console.log('/book/updatePro mapmoneypay insert error -> ' + err);
                throw err;
            }
        });
    }
    response.redirect('list');
});


router.post('/deleteChk', (request, response) => {
    var body = request.body;
    console.log("deleteChk bookNo -> " + body.bookNo);
    console.log("deleteChk parentBook -> " + body.parentBook);
    var sql = "select count(*) cnt from moneybook where parentBook=? and userId=?";

    db.query(sql, [body.bookNo, request.session.userId], (err, rs) => {
        if (err) {
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
    var sqlEnd = " and userId=?";

    sql += sqlStart;
    if (str.bookNo != undefined) {
        sql += "bookNo=?";
        deleteNo = str.bookNo;
        console.log('bookNo -> ' + str.bookNo);
    } else if (str.parentBook != undefined) {
        sql += "parentBook=?";
        deleteNo = str.parentBook;
        console.log('parentBook -> ' + str.parentBook);
    } else {
        console.log('bookNo & parentBook ... -> ' + str.bookNo + ',' + str.parentBook);
    }
    sql += sqlEnd;

    db.query(sql, [deleteNo, request.session.userId], (err, rs) => {
        if (err) {
            console.log('/book/deletePro error -> ' + err);
            throw err;
        }
        response.redirect('list');
    });
});

module.exports = router;