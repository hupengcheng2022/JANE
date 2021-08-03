/**
 * Created by Administrator on 2020/10/21 0021.
 */
const fs=require('fs');
const path=require('path');
const dbutil=require('../common/dbutil');
const config=require('../config');

//登录处理
module.exports.login=function (req,res,next){
    let uname=req.body.username;
    let psw=req.body.password;
    let sql='select *,date_format(birthday,\'%Y-%m-%d\') as birthday from users where username=? and psw=?';
    let params=[uname,psw];
    dbutil(sql,params,function(err,results){
        if(err){
            console.log(err.message);
            res.render('login',{msg:'访问数据库异常，请与管理员联系！'});
        }else{
            let sql1="update users set time=now() where username=?;";
            dbutil(sql1,uname,function (err1, results1) {
            });
            if(results.length>0){  //登录成功
                req.session.curuser=results[0];  //保存用户登录状态
                if(results[0].role=='1'){//管理员
                    res.redirect('/admin/admin');
                    //res.redirect('/admin/userslist')
                }else{  //购买者
                    if (results[0].state=='0'){
                        req.session.curuser="";
                        res.render('login',{msgs:'用户已被冻结,请联系管理员！'});
                    }else{
                        res.redirect('/');
                    }
                }
            }else{
                res.render('login',{msgs:'用户名或密码错误！'});
            }
        }
    });
};

//注册处理
module.exports.doRegist=function(req,res){
    let realname=req.body.realname;
    let username=req.body.username;
    let psw=req.body.psw;
    let sql="select * from users where username=?";
    dbutil(sql,[username], function (err1,results1) {
        if(err1){
            res.send(err1.message);
        }else{
            if(results1.length>0){//用户名已存在
                res.render('login',{msg:'用户名'+username+'已存在！'});
            }else{
                let sql2="insert into users(realname,username,psw) values(?,?,?)";
                dbutil(sql2,[realname,username,psw], function (err2,results2) {
                    if(err2){
                        res.send(err2.message);
                    } else{
                        res.redirect('login');
                    }
                });
            }
        }
    });
};

//后台用户列表的显示与查询
module.exports.userslist=function(req,res){
    let curpage=1;
    if(req.query.curpage){
        curpage=parseInt(req.query.curpage);
    }
    let pagesize=config.pagesize;
    let sql='select *,date_format(birthday,\'%Y-%m-%d\') as birthday,date_format(time,\'%Y-%m-%d-%H:%i:%s\') as time from users where role=0 ';
    let sql2='select count(*) as total from users where role=0 ';
    let params=new Array();
    let rname='';
    if(req.query.realname){
        rname=req.query.realname;
        sql+='and realname like ? and role=0 ';
        sql2+='and realname like ? and role=0 ';
        params.push('%'+rname+'%');
    }
    let time=req.query.time;
    if(req.query.time){
        screentime=parseInt(req.query.time);
        if (screentime=='1'){
            sql+="and DATEDIFF(NOW(),time)>365 ";
            sql2+="and DATEDIFF(NOW(),time)>365 "
        }else if (screentime=='2'){
            sql+="and DATEDIFF(NOW(),time)>730 ";
            sql2+="and DATEDIFF(NOW(),time)>730 "
        }
    }
    sql+='order by userid desc limit ?,?;';
    sql+=sql2;
    params.push((curpage-1)*pagesize);
    params.push(pagesize);
    params.push('%'+rname+'%');
    dbutil(sql,params,function(err,results){
        if(err){
            res.send(err.message);
        }else{
            let total=results[1][0].total;
            let pages=Math.ceil(total/pagesize);
            res.render('admin/userslist',{time:time,user:req.session.curuser,users:results[0],curpage:curpage,rname:rname,total:total,pagesize:pagesize,pages:pages})
        }
    })
};

//冻结用户
module.exports.doFrozen=function(req,res){
    let userid=req.query.userid;
    let state=req.query.state;
    let curpage=req.query.curpage;
    //console.log(state,userid);
    let sql='update users set state=? where userid=?';
    dbutil(sql,[state,userid],function(err,results){
        if(err){
            res.send(err.message);
        }else{
            res.redirect('userslist?curpage='+curpage);
        }
    })
};
//批量冻结
module.exports.batch=function(req,res){
    let users=req.body.users;
    let time=req.body.time;
    users.forEach(function (g) {
        let sql="update users set state=0 where userid=?";
        dbutil(sql,[g.userid], function (err, results) {
        })
    });
    res.send(time);
};
//删除用户
module.exports.deluser=function(req,res){
  let userid=req.query.userid;
  let curpage=req.query.curpage;
  let time=req.query.time;
  let sql="delete from users where userid=?;";
  dbutil(sql,userid,function (err, results) {
      if (err){
          res.send(err.message);
      }else{
          res.redirect('userslist?curpage='+curpage+'&time='+time);
      }
  })
};
//升级为vip用户
module.exports.doVip=function(req,res){
    let userid=req.query.userid;
    let curpage=req.query.curpage;
    let sql='update users set vip=1 where userid=?';
    dbutil(sql,[userid],function(err,results){
        if(err){
            res.send(err.message);
        }else{
            res.redirect('userslist?curpage='+curpage);
        }
    })
};
//显示用户信息
module.exports.showUserinfo=function(req,res){
    let userid=req.session.curuser.userid;
    let sql="select *,date_format(birthday,\'%Y-%m-%d\') as birthday from users where userid=?";
    dbutil(sql,[userid],function (err, results) {
        if (err){
            res.send(err.message);
        }else {
            res.render('userinfo',{user:results[0]})
        }
    })
};

//修改头像
module.exports.doHeand= function (req,res) {
    let userid=req.body.userid;
    let handportrait=req.body.handportrait;
    if(req.files.handportrait){
        let files=req.files.handportrait; //取主图文件域的所有文件
        let orgname=files[0].originalname;  //获取上传文件名（客户端）
        handportrait=Date.now()+orgname;//新的文件名
        let oldpath=files[0].path; //上传后默认的文件完整路径
        let newpath=path.join(files[0].destination,handportrait); //新的路径
        fs.rename(oldpath,newpath,function(err){});//修改文件名
    }
    let sql="update users set handportrait=? where userid=?";
    dbutil(sql,[handportrait,userid],function(err,results){
        if(err){
            res.send(err.message);
        }else{
            res.redirect('userinfo');
        }
    })
};

//修改信息
module.exports.doUserinfo= function (req,res) {
    let userid=req.body.userid;
    let realname=req.body.realname;
    let sex=req.body.sex;
    let username=req.body.username;
    let birthday=req.body.birthday;
    let address=req.body.address;
    let phone=req.body.phone;
    let postcode=req.body.postcode;
    let handportrait=req.body.handportrait;
    let question=req.body.question;
    let answer=req.body.answer;
    let sql="update users set realname=?,username=?,sex=?,birthday=?,phone=?,address=?,postcode=?,question=?,answer=?,handportrait=? where userid=?";
    dbutil(sql,[realname,username,sex,birthday,phone,address,postcode,question,answer,handportrait,userid],function(err,results){
        if(err){
            res.send(err.message);
        }else{
            req.session.curuser.realname=realname;
            req.session.curuser.username=username;
            req.session.curuser.sex=sex;
            req.session.curuser.birthday=birthday;
            req.session.curuser.phone=phone;
            req.session.curuser.address=address;
            req.session.curuser.postcode=postcode;
            req.session.curuser.handportrait=handportrait;
            req.session.curuser.question=question;
            req.session.curuser.answer=answer;
            res.render('userinfo',{user:req.session.curuser});
        }
    })
};

//修改密码
module.exports.doEdituserpsw=function (req, res) {
  let psw=req.body.psw;
  let xpsw=req.body.xpsw;
  let userid=req.body.userid;
  let sql1="select * from users where psw=? and userid=?";
    dbutil(sql1,[psw,userid],function (err1, results1) {
        if (err1){
            res.send(err1.message);
        }else{
            if (results1.length==0){
                res.render('edituserpsw',{msg:'密码错误！',user:req.session.curuser});
            }else{
                let sql2="update users set psw=? where userid=?";
                dbutil(sql2,[xpsw,userid],function (err2,results2) {
                    if (err2){
                        res.send(err2.message);
                    }else{
                        req.session.destroy();
                        res.render('login',{msg:'修改成功请重新登录！'});
                    }
                })
            }
        }
    })
};

//找回密码
module.exports.doretrievepsw=function (req, res) {
    let username=req.body.username;
    let question=req.body.question;
    let answer=req.body.answer;
    let sql="select * from users where username=? and question=? and answer=?";
    dbutil(sql,[username,question,answer],function (err, results) {
        if (err){
            res.send(err.message);
        }else{
            if (results.length>0){
                res.render('resetpsw',{user:results[0]})
            }else{
                res.render('retrievepsw',{msg:'信息错误！'});
            }
        }
    })
};

//重置密码
module.exports.resetpsw=function (req, res) {
    let psw=req.body.psw;
    let userid=req.body.userid;
    let sql="update users set psw=? where userid=?";
    dbutil(sql,[psw,userid],function (err, results) {
        if (err){
            res.send(err.message);
        }else{
            res.render('login',{msg:'重置成功请登录！'});
        }
    })
};

//注销账号
module.exports.cancellation=function (req, res) {
    let userid=req.query.userid;
    let sql="delete from carts where userid=?;";
    let sql1="delete from comments where userid=?;";
    let sql2="delete from users where userid=?;";
    sql+=sql1+=sql2;
    dbutil(sql,[userid,userid,userid],function (err, results) {
        if (err){
            res.send(err.message);
        }else{
            res.session.destroy();
            res.render('login',{msg:'账号已注销！'});
        }
    })
};
//用户删除评论
module.exports.deleteComments=function (req, res) {
    let commentid=req.query.commentid;
    let goodid=req.query.goodid;
    let sql="delete from admincomment where commentid=?;";
    let sql1="delete from comments where commentid=?;";
    sql+=sql1;
    dbutil(sql,[commentid,commentid],function (err, results) {
        if (err){
            res.send(err.message);
        }else{
            res.redirect('/goodsdetails?goodid='+goodid);
        }
    })
};
//管理员删除评论
module.exports.deleteAdminComments=function (req, res) {
    let adminCommentid=req.query.adminCommentid;
    let goodid=req.query.goodid;
    let sql="delete from admincomment where id=?;";
    dbutil(sql,[adminCommentid],function (err, results) {
        if (err){
            res.send(err.message);
        }else{
            res.redirect('/goodsdetails?goodid='+goodid);
        }
    })
};
