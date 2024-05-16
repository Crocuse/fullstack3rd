const DB = require('../db/db');
const bcrypt = require('bcrypt');
const generateTemp = require('../util/uuidGenerator');
const dbSql = require('../db/ModuelSql');
const AdminDao = require('../dao/AdminDao');

const adminService = {

    isMember: async (req, res) => {
        let result = await AdminDao.isMember(req.query.id);
        res.json(result);
    },

    adminRegistConfirm:async (req, res) => {
        let post = req.body;
        let result = await AdminDao.adminRegistConfirm(post);
        res.json(result);
    },

    adminList: async (req, res) => {
        let list = await AdminDao.adminList();

        res.json(list);
    },

    memberList:async (req, res) => {
        let list = await AdminDao.memberList();
        res.json(list);
    },

    adminDelete: async (req, res) => {
        let result = await AdminDao.adminDelete(req.body.id);
        res.json(result);
    },

    memberDelete:async (req, res) => {
        let shortId = generateTemp(6);
        let result = await AdminDao.memberDelete(req.body.id,shortId);
        res.json(result);
    },

    adminModifyConfirm: async (req, res) => {
        let result = await AdminDao.adminModifyConfirm(req.body);
        res.json(result);
    },

    memberModifyConfirm:async (req, res) => {
        let result = await AdminDao.memberModifyConfirm(req.body.data);
        res.json(result);
    },
    goodsList:async (req, res) => {
        let list = await AdminDao.goodsList();
        res.json(list);
    },
    goodsStateChange:async (req, res) => {
        let result = await AdminDao.goodsStateChange(req.body);
        res.json(result);
    },
    goodsRegList:async (req, res) => {
        let list = await AdminDao.goodsRegList();
        res.json(list);
    },
    goodsRegStateChange: async (req, res) => {
        const { as_start_date, as_location_num, as_state, gr_no } = req.body;
    
        try {
            const countValue = await AdminDao.checkAuctionSchedule(as_start_date, as_location_num);
    
            if (countValue === 1) {
                res.json('already');
            } else {
                let updatedStartDate = as_start_date;
                let updatedLocationNum = as_location_num;
    
                if (as_state === 0) {
                    updatedStartDate = null;
                    updatedLocationNum = null;
                }
    
                const result = await AdminDao.updateAuctionSchedule(as_state, updatedStartDate, updatedLocationNum, gr_no);
    
                if (result) {
                    res.json('success');
                } else {
                    res.json('error');
                }
            }
        } catch (err) {
            console.log(err);
            res.json('error');
        }
    },

    auctionResultList:async (req, res) => {
        let list =await AdminDao.auctionResultList();
        res.json(list);
    },

    deliveryGoods: async (req, res) => {
        let result =await AdminDao.deliveryGoods(req.body.gr_no);
        res.json(result);
    },

    getSalesData: async (req, res) => {
        let list = await AdminDao.getSalesData();
        res.json(list);
    },

    goodsRejectReason: async (req, res) => {
        let result =await AdminDao.goodsRejectReason(req.body);
        res.json(result);
    },

    getQnaList:async (req, res) => {
        let page = Number(req.query.page) || 1;
        let limit = Number(req.query.limit) || 10;
        let offset = (page - 1) * limit;

        let list = await AdminDao.getQnaList(limit,offset);
        res.json(list);
        
    },

    updateQna:async (req, res) => {
        let answer = req.body.editorData;
        let q_no = req.body.q_no;

        let list = await AdminDao.updateQna(answer,q_no);
        res.json(list);
        
    },

};

module.exports = adminService;
