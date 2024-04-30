const express = require('express');
const adminService = require('../lib/service/adminService');
const router = express.Router();


router.post('/admin_regist_confirm', (req, res) => {
    console.log('/admin_regist_confirm');
    adminService.adminRegistConfirm(req, res);
});

router.get('/is_member', (req, res) => {
    adminService.isMember(req, res);
});

router.post('/is_mail', (req, res) => {
    adminService.isMail(req, res);
});

router.get('/admin_list',(req,res)=>{
    adminService.adminList(req,res);
});

router.get('/member_list',(req,res)=>{
    adminService.memberList(req,res);
});

router.delete('/admin_delete',(req,res)=>{
    adminService.adminDelete(req,res);
});

router.delete('/member_delete',(req,res)=>{
    adminService.memberDelete(req,res);
});

router.get('/admin_modify',(req,res)=>{
    adminService.adminModify(req,res);
})

router.post('/admin_modify_confirm',(req,res)=>{
    adminService.adminModifyConfirm(req,res);
});

router.get('/member_modify',(req,res)=>{
    adminService.memberModify(req,res);
});

router.post('/member_modify_confirm',(req,res)=>{
    adminService.memberModifyConfirm(req,res);
});

router.get('/goods_list',(req,res)=>{
    adminService.goodsList(req,res);
});
router.post('/goods_state_change',(req,res)=>{
    adminService.goodsStateChange(req,res);
});
module.exports = router;

