show databases;

use opentutorials;

show tables;

create table board (
	boardNo 	int(8) primary key,
    title 		varchar(200) NOT NULL,
    content 	varchar(4000),
    hits		int(4),
    likeCnt		int(4),
    memberId	varchar(20),
    regDate		date
);


select sysdate(), now() from dual;


insert into board values (1,'게시글1','게시글1내용1',0,0,'rucy',now());
insert into board values (2,'게시글2','게시글2내용1',0,0,'rucy',now());
insert into board values (3,'게시글3','게시글3내용1',0,0,'rucy',now());
insert into board values (4,'게시글4','게시글4내용1',0,0,'rucy',sysdate());

select * from board;

delete from board where boardno=5;

insert into board (boardNo, title, content, memberId, regDate) values (5, '게시글5', '게시글5내용1', 'rucy', sysdate());