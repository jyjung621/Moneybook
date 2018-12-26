
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
    var sql = "select * from payment where userId=? order by kinds, paymentName";
    // db.query(sql, [request.session.userId], (err, rs) => {
    //     if(err) {
    //         console.log('paymentList error : ' + err);
    //         throw err;
    //     }
    //     response.render('payment/paymentList.ejs', {
    //         message : "",
    //         list : rs
    //     });
    // });
});

router.post('/createPro', (request, response) => {
    var body = request.body;
    var sql = "insert into payment (paymentNo, userId, paymentName, kinds, company, account, payDate) \
            values (fn_maxTablenum('payment',?),?,?,?,?,?,?)";
    
            // db.query(sql,[body.userId, body.userId, body.paymentName, body.kinds, body.company, body.account, body.payDate], (err,rs) => {
            //     if(err){
            //         console.log('payment createPro error : ' + err);
            //         throw err;
            //     }
            //     response.redirect('list');
            // });
});

router.post('/updatePro', (request, response) => {
    var body = request.body;
    var sql = "update payment set paymentName=?, kinds=?, company=?, account=?, payDate=? where paymentNo=? and userId=?";
    console.log('updatePro data -> ' + JSON.stringify(body));
    // db.query(sql, [body.paymentName, body.kinds, body.company, body.account, body.payDate, body.paymentNo, body.userId], (err, rs) => {
    //     if(err) {
    //         console.log('paymentUpdatePro error : ' + err);
    //         throw err;
    //     }
    //     response.redirect('list');
    // });
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