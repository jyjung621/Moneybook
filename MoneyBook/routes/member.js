
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
    response.redirect('/member/loginForm');
});

router.get('/loginForm', (request, response) => {
    response.render('member/loginForm.ejs', {
        message : ""
    });
});


router.post('/loginPro', (request, response) => {
    var body = request.body;
   
    db.query("select * from member where memberid=?",[body.memberId], (err, memberInfo) => {
        if(err) {
            console.log('loginPro select error : ' + err);
            throw err;
        }
        // console.log('rs --> ' + rs[0]);
        if(!rs[0]) {
            console.log('회원 정보 없음...');
            return response.render('member/loginForm.ejs', {
                message : "로그인 실패(회원정보 없음)" 
            });
        } else {
            if(body.passwd === rs[0].passwd) {
                console.log('로그인... 성공!!');
                /* db.query("select * from moneybook where userId=?",[memberInfo[0].memberId], (err2, bookList) => {
                    if(err2) {
                        console.log('loginPro selectBook error : ' + err2);
                        throw err2;
                    } */
                    request.session.is_logined = true;
                    request.session.userId = memberInfo[0].memberId;
                    request.session.nickname = memberInfo[0].nickname;
                    request.session.grade = memberInfo[0].grade;
                    request.session.phone = memberInfo[0].phone;
                    /* request.session.bookList = bookList;
                    console.log('BookList -> ' + bookList); */
                    request.session.save(function() {
                        return response.redirect('/home');
                    /* }); */
                });
                
            } else {
                console.log('로그인... 실패 (비밀번호 오류)');
                return response.render('member/loginForm.ejs', {
                    message : "로그인 실패(비밀번호 재확인)" 
                });
            }
        }
    });
});

router.get('/logoutPro', (request, response) => {
    if(request.session.is_logined) {
        request.session.destroy(function(err) {
            if(err) {
                console.log('logout error : ' + err);
                throw err;
            } else {
                response.redirect('/');
            }
        });
    }
});

router.get('/joinForm', (request, response) => {
    response.render('member/joinForm.ejs');
});

router.post('/joinPro', (request, response) => {
    var body = request.body;

    db.query("insert into member values (fn_maxTablenum('member','0'),?,?,?,?,'3',sysdate())",[body.memberId, body.passwd, body.nickName, body.telNum], (err, rs) => {
        if(err) {
            console.log('joinPro member insert error : ' + err);
            throw err;
        }
        db.query("INSERT INTO moneybook (bookNo, bookName, userId, kinds, parentBook, memo, regDate) \
          VALUES (1,'메인가계부',?,'0',1,null,NOW())", [body.memberId, body.memberId], (err2, rs) => {
            if(err2) {
                console.log('joinPro moneybook insert error : ' + err2);
                throw err2;
            }
            return response.redirect('loginForm');
          });
    });
});

router.get('/searchIdPw', (request, response) => {
    response.render('member/searchIdPw.ejs');
});



module.exports = router;