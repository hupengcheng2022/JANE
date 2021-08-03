/**
 * 商品管理
 */
const fs=require('fs');
const path=require('path');
const uuid=require('uuid');
const dbutil=require('../common/dbutil');
const config=require('../config');
//商品分页及根据商品名称模糊查询
module.exports.goodslist=function(req,res){
    let curpage=1;
    if(req.query.curpage){
        curpage=parseInt(req.query.curpage);
    }
    let pagesize=config.pagesize;
    let sql='select * from goods ';
    let sql2='select count(*) as total from goods ';
    let params=new Array();
    let gname='';
    if(req.query.goodname){
        gname=req.query.goodname;
        sql+='where goodname like ? ';
        sql2+='where goodname like ? ';
        params.push('%'+gname+'%');
    }
    sql+='order by number desc limit ?,?;';
    sql+=sql2;
    params.push((curpage-1)*pagesize);
    params.push(pagesize);
    params.push('%'+gname+'%');
    console.log(params);
    dbutil(sql,params,function(err,results){
        if(err){
            res.send(err.message);
        }else{
            let total=results[1][0].total;
            let pages=Math.ceil(total/pagesize);
            res.render('admin/goodslist',{user:req.session.curuser,goods:results[0],curpage:curpage,gname:gname,total:total,pagesize:pagesize,pages:pages})
        }
    })
};

//上架商品处理
module.exports.updown=function(req,res){
    let goodid=req.query.goodid;
    let state=req.query.state;
    let sql='update goods set state=? where goodid=?';
    dbutil(sql,[state,goodid],function(err,results){
        if(err){
            res.send(err.message);
        }else{
            res.redirect('/admin/goodslist');
        }
    })
};

//商品热门设置
module.exports.dohost=function(req,res){
    let goodid=req.query.goodid;
    let host=req.query.host;
    let sql='update goods set host=? where goodid=?';
    dbutil(sql,[host,goodid],function(err,results){
        if(err){
            res.send(err.message);
        }else{
            res.redirect('/admin/goodslist');
        }
    })
};
/*//设置优惠商品
module.exports.dodiscount=function(req,res){
    let goodid=req.query.goodid;
    let discount=req.query.discount;
    let sql='update goods set discount=? where goodid=?';
    dbutil(sql,[discount,goodid],function(err,results){
        if(err){
            res.send(err.message);
        }else{
            res.redirect('/admin/goodslist');
        }
    })
};*/
//前端热门商品操作
module.exports.showhost=function (req,res) {
    let sql="select * from goods where state=1 and host=1 limit 0,4";
    dbutil(sql,[],function (err,results) {
        if (err){
            res.send(err.message);
        }else{
            res.render('index',{goods:results,user:req.session.curuser})
        }
    })
};

//显示编辑商品页面处理
module.exports.showeditgood=function (req,res) {
    let goodid=req.query.goodid;
    let sql="select * from goods where goodid=?";
    dbutil(sql,[goodid],function (err,results) {
        if (err){
            res.send(err.message);
        }else {
            res.render('admin/editgoodinfo',{user:req.session.curuser,good:results[0],goodid:goodid})
        }
    })
};

//商品编辑处理
module.exports.doeditgoodinfo=function (req,res) {
    let goodid=req.body.goodid;
    let goodname=req.body.goodname;
    let price=req.body.price;
    let style=req.body.style;
    let type=req.body.type;
    let model=req.body.model;
    let picture=req.body.oldpicture;
    let details=req.body.details;
    let object=req.body.object;
    let discount=req.body.discount;
    let stock=req.body.stock;
    if(req.files.picture){
        let files=req.files.picture; //取主图文件域的所有文件
        let orgname=files[0].originalname;  //获取上传文件名（客户端）
        picture=Date.now()+orgname;//新的文件名
        let oldpath=files[0].path; //上传后默认的文件完整路径
        let newpath=path.join(files[0].destination,picture); //新的路径
        fs.rename(oldpath,newpath,function(err){});//修改文件名
    }
    let sql="update goods set goodname=?,price=?,style=?,type=?,picture=?,details=?,object=?,discount=?,stock=?,model=? where goodid=?";
    let params=[goodname,price,style,type,picture,details,object,discount,stock,model,goodid];
    dbutil(sql,params,function(err,results){
        if(err){
            res.send(err.message);
        }else{
            res.redirect('goodslist');
        }
    })
};

//前台商品列表显示
module.exports.showgoods=function (req, res) {
    let style=req.query.style;
    let type=req.query.type;
    let curpage=1;
    if(req.query.curpage){
        curpage=parseInt(req.query.curpage);
    }
    let pagesize=4;
    let sql="select * from goods where state=1 and style=? and type=? order by goodid desc limit ?,?;";
    let sql2="select count(*) as total from goods where state=1 and style=? and type=?;";
    let params=new Array();
    sql+=sql2;
    params.push(style);
    params.push(type);
    params.push((curpage-1)*pagesize);
    params.push(pagesize);
    params.push(style);
    params.push(type);
    dbutil(sql,params,function (err, results) {
        if (err){
            res.send(err.message);
        }else{
            let total=results[1][0].total;
            let pages=Math.ceil(total/pagesize);
            res.render('goods',{
                user:req.session.curuser,
                goods:results[0],
                style:style,
                type:type,
                curpage:curpage,
                total:total,
                pagesize:pagesize,
                pages:pages
            });
        }
    })
};

//前台搜索商品
module.exports.searchgoods=function(req,res){
    let curpage=1;
    if(req.query.curpage){
        curpage=parseInt(req.query.curpage);
    }
    let pagesize=8;
    let sql='select * from goods where state=1 ';
    let sql2='select count(*) as total from goods where state=1 ';
    let params=new Array();
    let goodname='';
    if(req.query.goodname){
        goodname=req.query.goodname;
        sql+='and goodname like ? ';
        sql2+='and goodname like ? ';
        params.push('%'+goodname+'%');
    }
    sql+='order by goodid desc limit ?,?;';
    sql+=sql2;
    params.push((curpage-1)*pagesize);
    params.push(pagesize);
    params.push('%'+goodname+'%');
    console.log(params);
    dbutil(sql,params,function(err,results){
        if(err){
            res.send(err.message);
        }else{
            let total=results[1][0].total;
            let pages=Math.ceil(total/pagesize);
            res.render('searchgoods',{user:req.session.curuser,goods:results[0],curpage:curpage,goodname:goodname,total:total,pagesize:pagesize,pages:pages})
        }
    })
};
//用户评论列表
module.exports.admincomment=function(req,res){
    let curpage=1;
    if(req.query.curpage){
        curpage=parseInt(req.query.curpage);
    }
    let pagesize=config.pagesize;
    let sql='select a.*,date_format(a.time,\'%Y-%m-%d %H:%i:%s\') as time,b.picture,b.goodname,b.goodid,c.username from comments a,goods b,users c where a.goodid=b.goodid and a.userid=c.userid ';
    let sql2='select count(*) as total from comments ';
    let params=new Array();
    let content='';
    if(req.query.content){
        content=req.query.content;
        sql+='and a.content like ? ';
        sql2+='where content like ? ';
        params.push('%'+content+'%');
    }
    sql+='order by time desc limit ?,?;';
    sql+=sql2;
    params.push((curpage-1)*pagesize);
    params.push(pagesize);
    params.push('%'+content+'%');
    dbutil(sql,params,function(err,results){
        if(err){
            res.send(err.message);
        }else{
            let total=results[1][0].total;
            let pages=Math.ceil(total/pagesize);
            console.log(results);
            res.render('admin/comment',{user:req.session.curuser,comments:results[0],curpage:curpage,content:content,total:total,pagesize:pagesize,pages:pages})
        }
    })
};
//回复用户评论
module.exports.reply=function(req,res){
  let commentid=req.query.commentid;
  let goodid=req.query.goodid;
  let content=req.query.content;
  let userid=req.session.curuser.userid;
  let sql="insert into admincomment values(0,?,?,?,?,now());";
  let sql1="update comments set state=1 where commentid=?";
  sql+=sql1;
  dbutil(sql,[commentid,userid,goodid,content,commentid],function (err, results) {
      if (err){
          res.send(err.message);
      }else{
          res.redirect('/admin/comment');
      }
  })
};
//添加商品处理
module.exports.doaddgood=function (req,res) {
    let goodname=req.body.goodname;
    let price=req.body.price;
    let model=req.body.model;
    let style=req.body.style;
    let type=req.body.type;
    let picture=req.body.picture;
    let details=req.body.details;
    let stock=req.body.stock;
    if(req.files.picture){
        let files=req.files.picture; //取主图文件域的所有文件
        let orgname=files[0].originalname;  //获取上传文件名（客户端）
        picture=Date.now()+orgname;//新的文件名
        let oldpath=files[0].path; //上传后默认的文件完整路径
        let newpath=path.join(files[0].destination,picture); //新的路径
        fs.rename(oldpath,newpath,function(err){});//修改文件名
    }
    let sql="insert into goods values(0,?,?,?,?,?,?,?,'0','0','2','0','0',?)";
    let params=[goodname,price,style,type,picture,details,stock,model];
    dbutil(sql,params,function(err,results){
        if(err){
            res.send(err.message);
        }else{
            res.redirect('goodslist');
        }
    })
};

//新增商品删除处理
module.exports.delgood=function (req, res) {
  let goodid=req.query.goodid;
  let sql="delete from goods where goodid=?";
  dbutil(sql,[goodid],function (err, results) {
      if (err){
          res.send(err.message);
      }else{
          res.redirect('goodslist');
      }
  })
};
//商品详情页面显示
module.exports.goodsdetails=function (req, res) {
    let goodid=req.query.goodid;
    let sql="select * from goods where goodid=?;";
    let sql1="SELECT c.*,b.handportrait,b.username,b.userid,a.content,a.commentid,date_format(a.time,'%Y-%m-%d %H:%i:%s') as time,b.role\n" +
        "FROM comments a\n" +
        "INNER JOIN users b\n" +
        "ON a.userid=b.userid\n" +
        "INNER JOIN goods c\n" +
        "ON a.goodid=c.goodid\n" +
        "WHERE c.goodid=? order by a.time desc;";
    let sql2="SELECT b.*,date_format(b.time,'%Y-%m-%d %H:%i:%s') as time\n" +
        "FROM comments a\n" +
        "INNER JOIN admincomment b\n" +
        "ON a.commentid=b.commentid\n" +
        "INNER JOIN goods c\n" +
        "ON a.goodid=c.goodid\n" +
        "WHERE c.goodid=? order by a.time desc;";
    sql+=sql1;
    sql+=sql2;
    dbutil(sql,[goodid,goodid,goodid],function (err, results) {
        if (err){
            res.send(err.message);
        }else{
            res.render('goodsdetails',{goods:results[0][0],good:results[1],agood:results[2],user:req.session.curuser});
        }
    })
};
//添加购物车
module.exports.addCart= function (req,res) {
    let goodid=req.query.goodid;
    let goodsize=req.query.goodsize;
    let price=req.query.price;
    let number=req.query.number;
    let model=req.query.model;
    let user=req.session.curuser;
    let sql1="select * from carts where goodid=? and userid=? and size=?";
    let parmas1=[goodid,user.userid,goodsize];
    dbutil(sql1,parmas1, function (err1,results1) {
        if(err1){
            res.send(err1.message);
        }else{
            if(results1.length>0){ //已选该商品
                let parmas2=[number,goodid,user.userid,goodsize];
                let sql2="update carts set number=number+? where goodid=? and userid=? and size=?";
                dbutil(sql2,parmas2, function (err2,results2) {
                    if(err2){
                        res.send(err2.message);
                    }else{
                        res.redirect('/goodsdetails?goodid='+goodid);
                    }
                })
            }else{
                let sql3="insert into carts values(0,?,?,?,?,?,?)";
                let params3=[user.userid,goodid,price,goodsize,number,model];
                dbutil(sql3,params3, function (err3,results3) {
                    if(err3){
                        res.send(err3.message);
                    }else{
                        res.redirect('/goodsdetails?goodid='+goodid);
                    }
                })
            }
        }
    });
};
//显示购物车
module.exports.showcart=function (req, res) {
    let userid=req.session.curuser.userid;
    let sql="SELECT a.goodname,a.goodid,a.picture,a.price,a.object,a.discount,a.state,b.size,b.number,b.cartid FROM goods a,carts b WHERE a.goodid=b.goodid AND userid=? order by cartid desc;";
    let sql1="select a.* from goods a,carts b where a.state=1 and a.model=b.model AND a.goodid NOT IN (SELECT goodid FROM carts) AND userid=? order by cartid desc;";
    sql+=sql1;
    dbutil(sql,[userid,userid],function (err, results) {
        if (err){
            res.send(err.message);
        }else{
            console.log(results);
            res.render('shopcart',{cart:results[0],goods:results[1],user:req.session.curuser})
        }
    })
};
//购物车数量变化
module.exports.modNumber= function (req,res) {
    let scid=req.query.cartid;
    let num=req.query.number;
    let sql="update carts set number=? where cartid=?";
    dbutil(sql,[num,scid], function (err,results) {
        if(err){
            res.send(err.message);
        }else{
            res.send('success');
        }
    })
};
//删除购物车
module.exports.delcart=function (req, res) {
    let cartid=req.query.cartid;
    let sql="delete from carts where cartid=?;";
    dbutil(sql,[cartid],function (err, results) {
        if (err){
            res.send(err.message);
        }else{
            res.redirect('/shopcart');
        }
    })
};
//结算
module.exports.settlement=function (req,res) {
    let goods=req.body.goods;
    let total=req.body.total;
    let address=req.session.curuser.address;
    let username=req.session.curuser.username;
    let phone=req.session.curuser.phone;
    let ordernumber=uuid.v4();
    let sql="insert into orders values(?,?,now(),?,?,?,'0','0')";
    dbutil(sql,[ordernumber,username,total,phone,address],function (err, results) {
        if (err){
            res.send(err.message);
        }else{
            let sql1="insert into ordersdetails values";
            let params1=new Array();
            goods.forEach(function (item) {
                sql1+="(?,?,?,?,?),";
                console.log(item.price);
                params1.push(ordernumber,item.goodid,item.size,item.number,item.price);
            });
            sql1=sql1.substr(0,sql1.length-1);
            dbutil(sql1,params1,function (err1, results1) {
                if (err1){
                    res.send(err1.message);
                }else{
                    goods.forEach(function (g) {
                        let sql2="delete from carts where cartid=?";
                        dbutil(sql2,[g.cartid], function (err2, resutls2) {
                        })
                    });
                    res.send(ordernumber);
                }
            })
        }
    });
};
//显示订单页面
module.exports.showorders=function(req,res){
    let curpage=1;
    if(req.query.curpage){
        curpage=parseInt(req.query.curpage);
    }
    let pagesize=config.pagesize;
    let sql='select *,date_format(time,\'%Y-%m-%d %H:%i:%s\') as time from orders ';
    let sql2='select count(*) as total from orders ';
    let params=new Array();
    let ordernumber='';
    if(req.query.ordernumber){
        ordernumber=req.query.ordernumber;
        sql+='where ordernumber=? ';
        sql2+='where ordernumber=? ';
        params.push(ordernumber);
    }
    let state=req.query.state;
    if (req.query.state){
        screenstate=parseInt(req.query.state);
        if (screenstate=='1'){
            sql+='where state=0 ';
            sql2+='where state=0 ';
        }else if (screenstate=='2'){
            sql+='where state=1 and rstate=0 ';
            sql2+='where state=1 and rstate=0 ';
        }else if (screenstate=='3'){
            sql+='where state=2 and rstate=0 ';
            sql2+='where state=2 and rstate=0 ';
        }else if (screenstate=='4'){
            sql+='where state=3 ';
            sql2+='where state=3 ';
        }else if (screenstate=='5'){
            sql+='where rstate=1 ';
            sql2+='where rstate=1 ';
        }else if (screenstate=='6'){
            sql+='where rstate=2 ';
            sql2+='where rstate=2 ';
        }else if (screenstate=='7'){
            sql+='where rstate=3 ';
            sql2+='where rstate=3 ';
        }
    }
    sql+='order by time desc limit ?,?;';
    sql+=sql2;
    params.push((curpage-1)*pagesize);
    params.push(pagesize);
    params.push(ordernumber);
    dbutil(sql,params,function(err,results){
        if(err){
            res.send(err.message);
        }else{
            let total=results[1][0].total;
            let pages=Math.ceil(total/pagesize);
            res.render('admin/orders',{state:state,user:req.session.curuser,orders:results[0],curpage:curpage,ordernumber:ordernumber,total:total,pagesize:pagesize,pages:pages})
        }
    })
};
//显示确认付款页面
module.exports.showpayment=function (req, res) {
  let ordernumber=req.query.ordernumber;
    let sql="select b.ordernumber,date_format(b.time,'%Y-%m-%d %H:%i:%s') as time,b.total,a.goodname,a.price,a.picture,a.object,a.discount,a.details,c.size,c.number \n" +
        "from ordersdetails c\n" +
        "INNER JOIN orders b\n" +
        "ON b.ordernumber=c.ordernumber\n" +
        "INNER JOIN goods a\n" +
        "ON a.goodid=c.goodid\n" +
        "WHERE \n" +
        "b.ordernumber=?;";
    dbutil(sql,ordernumber,function (err3, results3) {
        if (err3){
            res.send(err3.message);
        }else{
            console.log(results3);
            res.render('payment',{good:results3[0],user:req.session.curuser,ordernumber:ordernumber,goods:results3})
        }
    })
};
//确认付款操作
module.exports.dopayment=function(req,res){
  let ordernumber=req.body.ordernumber;
  let phone=req.body.phone;
  let address=req.body.address;
  let sql="UPDATE goods a\n" +
      "INNER JOIN ordersdetails c\n" +
      "ON a.goodid=c.goodid\n" +
      "INNER JOIN orders b\n" +
      "ON c.ordernumber=b.ordernumber\n" +
      "SET a.number=a.number+1,b.state=1,b.phone=?,b.address=?\n" +
      "WHERE b.ordernumber=?;";
  dbutil(sql,[phone,address,ordernumber],function (err, results) {
      if (err){
          res.send(err.message);
      }else{
          res.redirect('/orders');
      }
  })
};
//显示用户订单详情
module.exports.showorderdetail=function (req, res) {
    let ordernumber=req.query.ordernumber;
    let sql="select b.ordernumber,b.username,b.address,b.phone,b.state,b.rstate,date_format(b.time,'%Y-%m-%d %H:%i:%s') as time,b.total,a.goodname,a.price,a.picture,a.object,a.discount,a.details,c.size,c.number,c.goodid \n" +
        "from ordersdetails c\n" +
        "INNER JOIN orders b\n" +
        "ON b.ordernumber=c.ordernumber\n" +
        "INNER JOIN goods a\n" +
        "ON a.goodid=c.goodid\n" +
        "WHERE \n" +
        "b.ordernumber=? order by b.time desc;";
    dbutil(sql,ordernumber,function (err, results) {
        if (err){
            res.send(err.message);
        }else{
            res.render('orderdetail',{good:results[0],user:req.session.curuser,ordernumber:ordernumber,goods:results})
        }
    })
};
//显示用户订单
module.exports.showuserorder=function (req, res) {
    let username=req.session.curuser.username;
    let user=req.session.curuser;
    let sql="select *,date_format(time,'%Y-%m-%d %H:%i:%s') as time from orders where username=? order by time desc;";
    dbutil(sql,username,function (err, results) {
        if (err){
            res.send(err.message);
        }else{
            res.render('orders',{user:user,orders:results});
        }
    })
};
//发货处理
module.exports.dodeliver=function (req, res) {
  let ordernumber=req.query.ordernumber;
  let sql="update orders set state=2 where ordernumber=?;";
  dbutil(sql,ordernumber,function (err, results) {
      if (err){
          res.send(err.message);
      }else{
          res.redirect('/admin/orders');
      }
  })
};
module.exports.allDelivered=function(req,res){
    let orders=req.body.orders;
    let state=req.body.state;
    orders.forEach(function (g) {
        let sql="update orders set state=2 where ordernumber=?";
        dbutil(sql,[g.orderid], function (err, results) {
        })
    });
    res.send(state);
};
//取消订单
module.exports.cancel=function(req,res){
  let ordernumber=req.query.ordernumber;
  let sql="delete from ordersdetails where ordernumber=?;";
  let sql1="delete from orders where ordernumber=?;";
  sql+=sql1;
  dbutil(sql,[ordernumber,ordernumber],function (err, results) {
      if (err){
          res.send(err.message);
      }else{
          res.redirect('/orders');
      }
  })
};
//管理员删除已退款的订单
module.exports.admincancel=function(req,res){
    let ordernumber=req.query.ordernumber;
    let sql="delete from ordersdetails where ordernumber=?;";
    let sql1="delete from orders where ordernumber=?;";
    sql+=sql1;
    dbutil(sql,[ordernumber,ordernumber],function (err, results) {
        if (err){
            res.send(err.message);
        }else{
            res.redirect('/admin/orders');
        }
    })
};
//申请退款
module.exports.refund=function(req,res){
    let ordernumber=req.query.ordernumber;
    let sql="update orders set rstate=1 where ordernumber=?;";
    dbutil(sql,ordernumber,function (err, results) {
        if (err){
            res.send(err.message);
        }else{
            res.redirect('/orders');
        }
    })
};
//退款处理
module.exports.dorefund=function(req,res){
    let ordernumber=req.query.ordernumber;
    let sql="update orders set rstate=2 where ordernumber=?;";
    dbutil(sql,ordernumber,function (err, results) {
        if (err){
            res.send(err.message);
        }else{
            res.redirect('/admin/orders');
        }
    })
};
//不退款处理
module.exports.undorefund=function(req,res){
    let ordernumber=req.query.ordernumber;
    let sql="update orders set rstate=3 where ordernumber=?;";
    dbutil(sql,ordernumber,function (err, results) {
        if (err){
            res.send(err.message);
        }else{
            res.redirect('/admin/orders');
        }
    })
};
//确认收货
module.exports.docollect=function (req, res) {
  let ordernumber=req.query.ordernumber;
/*  let sql="update orders set state=3 where ordernumber=?;";*/
  let sql="UPDATE goods a\n" +
      "INNER JOIN ordersdetails c\n" +
      "ON a.goodid=c.goodid\n" +
      "INNER JOIN orders b\n" +
      "ON c.ordernumber=b.ordernumber\n" +
      "SET a.stock=a.stock-1,b.state=3\n" +
      "WHERE b.ordernumber=?;";
  dbutil(sql,ordernumber,function (err, results) {
      if (err){
          res.send(err.message);
      }else{
          res.redirect('/orders');
      }
  })
};
//评论
module.exports.usercomment=function (req, res) {
  let goodid=req.query.goodid;
  let content=req.query.content;
  let ordernumber=req.query.ordernumber;
  let userid=req.session.curuser.userid;
  let sql="insert into comments values(0,?,?,?,now(),'0');";
  dbutil(sql,[userid,goodid,content],function (err, results) {
      if (err){
          res.send(err.message);
      }else{
          res.redirect('/showorderdetail?ordernumber='+ordernumber);
      }
  })
};
//后台首页统计
module.exports.Statistics=function (req, res) {
    let userid=req.session.curuser.userid;
  let sql="select sum(total) as total from orders where state=3;";
  let sql1="select count(*) as total from users where role=0;";
  let sql2="select count(*) as total from orders;";
  let sql3="select count(*) as total from comments;";
  let sql4="select date_format(time,'%Y-%m-%d %H:%i:%s') as time from users where userid=?;";
  sql+=sql1+=sql2+=sql3+=sql4;
  dbutil(sql,[userid],function (err, results) {
      if (err){
          res.send(err.message);
      }else{
          res.render('admin/index',{user:req.session.curuser,totals:results[0][0],users:results[1][0],orders:results[2][0],comments:results[3][0],time:results[4][0]})
      }
  })
};