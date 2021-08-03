
const express=require('express');
const router=express.Router();
const multer=require('multer');
const userctrl=require('../control/userctrl');
const goodctrl=require('../control/goodctrl');
const upload=multer({dest:'public/images/goodclothes/'});
router.get('/admin',function(req,res,next){
    goodctrl.Statistics(req,res);
});
//显示商品列表
router.get('/goodslist',function(req,res,next){
    goodctrl.goodslist(req,res);
});
//上下架处理
router.get('/updown',function (req,res,next) {
    goodctrl.updown(req,res);
});
//热门处理
router.get('/dohost',function (req,res,next) {
    goodctrl.dohost(req,res);
});
//显示商品编辑页面
router.get('/showeditgood',function (req,res,next) {
    goodctrl.showeditgood(req,res);
});
//商品编辑处理
router.post('/doeditgoodinfo',upload.fields([{name:'picture',maxCount:1}]),function (req,res,next) {
    goodctrl.doeditgoodinfo(req,res);
});
//商品添加处理
router.post('/doaddgood',upload.fields([{name:'picture',maxCount:1}]),function (req,res,next) {
    goodctrl.doaddgood(req,res);
});
//新增商品删除处理
router.get('/delgood',function (req, res, next) {
    goodctrl.delgood(req,res);
});
//添加商品处理
router.get('/addgood',function (req, res, next) {
    res.render('admin/addgood',{user:req.session.curuser});
});
//后台显示用户列表
router.get('/userslist',function(req,res,next){
    userctrl.userslist(req,res)
});
//冻结用户
router.get('/doFrozen',function (req, res, next) {
    userctrl.doFrozen(req,res);
});
//删除用户
router.get('/deluser',function (req, res, next) {
    userctrl.deluser(req,res);
});
//批量冻结
router.post('/batch',function (req, res, next) {
    userctrl.batch(req,res);
});
//升级vip
router.get('/doVip',function (req, res, next) {
    userctrl.doVip(req,res);
});
//后台订单
router.get('/orders',function(req,res,next){
    goodctrl.showorders(req,res)
});
//显示管理员信息编辑页面
router.get('/admininfo',function(req,res,next){
    res.render('admin/admininfo',{user:req.session.curuser});
});
//显示修改密码页面
router.get('/editadminpsw',function(req,res,next){
    res.render('admin/editadminpsw',{user:req.session.curuser});
});
//发货处理
router.get('/dodeliver',function (req, res, next) {
   goodctrl.dodeliver(req,res);
});
router.post('/allDelivered',function (req, res, next) {
   goodctrl.allDelivered(req,res);
});
//退款处理
router.get('/dorefund',function (req, res, next) {
    goodctrl.dorefund(req,res);
});
router.get('/undorefund',function (req, res, next) {
    goodctrl.undorefund(req,res);
});
//用户评论列表
router.get('/comment',function (req, res, next) {
   goodctrl.admincomment(req,res);
});
//回复评论
router.get('/reply',function (req, res, next) {
   goodctrl.reply(req,res);
});
//退出登录
router.get('/exit',function(req,res,next){
    req.session.destroy();   //清空session
    res.send('<script>parent.location.href="/";</script>');
});

module.exports=router;

