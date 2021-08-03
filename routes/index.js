var express = require('express');
var router = express.Router();
const multer=require('multer');
const upload=multer({dest:'public/images/clothes/'});

const ctrl=require('../control/userctrl');
const goodctrl=require('../control/goodctrl');

/* GET home page. */
//首页
router.get('/', function(req, res, next) {
    goodctrl.showhost(req,res);
});
//登录页面
router.get('/login', function(req, res, next) {
    res.render('login', {});
});
//商品列表
router.get('/goods', function(req, res, next) {
    goodctrl.showgoods(req,res);
});
//关于我们
router.get('/about',function (req, res, next) {
   res.render('about',{user:req.session.curuser});
});
//后台管理首页
router.get('/admin',function(req,res,next){
    res.render('admin/index',{user:req.session.curuser});
});
//忘记密码
router.get('/retrievepsw',function (req, res, next) {
    res.render('retrievepsw',{})
});
//找回密码
router.post('/doretrievepsw',function (req, res, next) {
    ctrl.doretrievepsw(req,res);
});
//重置密码
router.post('/resetpsw',function (req, res, next) {
    ctrl.resetpsw(req,res);
});
//显示用户信息页面
router.get('/userinfo',function(req,res,next){
    ctrl.showUserinfo(req,res);
});
//修改头像
router.post('/doHeand',upload.fields([{name:'handportrait',maxCount:1}]),function(req,res,next){
    if (req.files.handportrait[0].size>2000000){
        res.render("userinfo",{msg:"文件大小不能超过2m！",user:req.session.curuser})
    }else{
        ctrl.doHeand(req,res);
    }
});
//修改信息
router.post('/doUserinfo',function (req, res, next) {
   ctrl.doUserinfo(req,res);
});
//显示修改密码页面
router.get('/edituserpsw',function (req, res, next) {
    res.render('edituserpsw',{user:req.session.curuser});
});
//修改密码
router.post('/doEdituserpsw',function (req, res, next) {
    ctrl.doEdituserpsw(req,res);
});
//登录验证
router.post('/doLogin',function(req,res,next){
  ctrl.login(req,res,next);
});
//注册
router.post('/doRegist', function (req,res,next) {
    ctrl.doRegist(req,res);
});
//注销账号
router.get('/cancellation',function (req, res, next) {
    ctrl.cancellation(req,res);
});
//搜索商品
router.get('/search',function (req, res, next) {
    goodctrl.searchgoods(req,res);
});
//商品详情
router.get('/goodsdetails',function (req, res) {
    goodctrl.goodsdetails(req,res);
});
//添加购物车
router.get('/addCart',function(req,res,next){
    goodctrl.addCart(req,res);
});
//显示购物车
router.get('/shopcart',function (req, res, next) {
    goodctrl.showcart(req,res);
});
//购物车数量变化
router.get('/modNumber',function (req, res, next) {
    goodctrl.modNumber(req,res);
});
//删除购物车
router.get('/delcart',function (req,res,next) {
    goodctrl.delcart(req,res);
});
//结算
router.post('/settlement',function (req, res, next) {
    goodctrl.settlement(req,res);
});
//显示确认付款页面
router.get('/showpayment',function (req, res, next) {
    goodctrl.showpayment(req,res);
});
//显示用户订单详情
router.get('/showorderdetail',function (req, res, next) {
    goodctrl.showorderdetail(req,res);
});
//确认付款
router.post('/dopayment',function (req, res, next) {
   goodctrl.dopayment(req,res);
});
//查看订单
router.get('/orders',function (req, res, next) {
    goodctrl.showuserorder(req,res);
});
//用户取消订单
router.get('/cancel',function (req, res, next) {
   goodctrl.cancel(req,res);
});
//管理员删除已退款的订单
router.get('/admincancel',function (req, res, next) {
    goodctrl.admincancel(req,res);
});
//申请退款
router.get('/refund',function (req, res, next) {
    goodctrl.refund(req,res);
});
//确认收货
router.get('/docollect',function (req, res, next) {
   goodctrl.docollect(req,res);
});
//用户评论
router.get('/comment',function (req, res) {
   goodctrl.usercomment(req,res);
});
//用户删除评论
router.get('/deleteComments',function (req, res) {
   ctrl.deleteComments(req,res);
});
//管理员删除评论
router.get('/deleteAdminComments',function (req, res) {
    ctrl.deleteAdminComments(req,res);
});
module.exports = router;
