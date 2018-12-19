var db = require('../lib/db');

module.exports = {
    selectMeberInfo:function(email, passwd){
        var result = null;
        db.query('select * from member where email=?', [email], (err, data) => {
            if(err) {
                console.log('------ selectMeberInfo error ------\n' + err);
                throw err;
            }
            console.log('selectMeberInfo data --> ' + data);
            result = data;
        });
        return result;
    },
    
    list:function(filelist){
      var list = '<ul>';
      var i = 0;
      while(i < filelist.length){
        list = list + `<li><a href="/topic/${filelist[i]}">${filelist[i]}</a></li>`;
        i = i + 1;
      }
      list = list+'</ul>';
      return list;
    }
  }
  