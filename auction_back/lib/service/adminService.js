const DB = require("../db/db");
const bcrypt = require('bcrypt');

const adminService = {
    
    isMember: (req, res) => {
        let id = req.query.id;
        DB.query(`
          SELECT COUNT(*) as count FROM (
            SELECT M_ID as ID FROM TBL_MEMBER
            UNION ALL
            SELECT A_ID as ID FROM TBL_ADMIN
          ) AS combined WHERE ID = ?
        `, [id], (err, rst) => {
          if (err) {
            console.log(err);
            res.json('error');
            return;
          }
          if (rst[0].count > 0) {
            res.json('is_member');
          } else {
            res.json('not_member');
          }
        });
      },

      isMail: (req, res) => {
        let mail = req.body.mail;
        DB.query(`
          SELECT COUNT(*) as count FROM (
            SELECT M_MAIL as MAIL FROM TBL_MEMBER
            UNION ALL
            SELECT A_MAIL as MAIL FROM TBL_ADMIN
          ) AS combined WHERE MAIL = ?
        `, [mail], (err, rst) => {
          if (err) {
            console.log(err);
            res.json('error');
            return;
          }
          if (rst[0].count > 0) {
            res.json('is_mail');
          } else {
            res.json('not_mail');
          }
        });
      },

    adminRegistConfirm: (req, res) => {
        let post = req.body;

        DB.query('INSERT INTO TBL_ADMIN(A_ID, A_PW, A_NAME, A_MAIL, A_PHONE) VALUES(?, ?, ?, ?, ?)',
        [post.a_id, bcrypt.hashSync(post.a_pw, 10), post.a_name, post.a_mail,post.a_phone],
        (err, rst) => {
            if (rst.affectedRows > 0) {
                res.json('success');
                return;
            }

            console.log(err);
            res.json('fail');
        })
    },
    adminList:(req,res)=>{
        
        DB.query(`SELECT * FROM TBL_ADMIN ORDER BY A_REG_DATE ASC`,(err,admins)=>{
            if(err){
                res.json(null);
            } else {
                res.json(admins);
            }
        })
    },
    memberList:(req,res)=>{
        
        DB.query(`SELECT * FROM TBL_MEMBER`,(err,members)=>{
            if(err){
                res.json(null);
            } else {
                res.json(members);
            }
        })
    },
    adminDelete:(req,res)=>{

        let a_id = req.body.id;

        console.log('a_id============>',a_id);

        DB.query(`DELETE FROM TBL_ADMIN WHERE A_ID =?`,[a_id],(err,result)=>{
            if(err){
                res.json(null);
            } else {
                res.json(result.affectedRows);
            }
        })
    },
    memberDelete:(req,res)=>{
        let m_id = req.body.id;

        console.log('m_id============>',m_id);

        DB.query(`DELETE FROM TBL_MEMBER WHERE M_ID =?`,[m_id],(err,result)=>{
            if(err){
                res.json(null);
            } else {
                res.json(result.affectedRows);
            }
        })
    },

    adminModify:(req,res)=>{

        id= req.query.id;
   
        DB.query(`SELECT * FROM TBL_ADMIN WHERE A_ID =?`,[id],(error,admin)=>{
            if(error){
                res.json(null);
            } else {

                const [mail1, mail2] = admin[0].A_MAIL.split("@");
                const [phone1, phone2, phone3] = admin[0].A_PHONE.split("-");

                const selectedAdmin = {
                    ...admin[0],
                    mail1,
                    mail2,
                    phone1,
                    phone2,
                    phone3,
                };

                res.json(selectedAdmin);
            }
        })
    },
    adminModifyConfirm:(req,res)=>{
        let post = req.body;
        console.log(req.body);
        DB.query(`UPDATE TBL_ADMIN SET A_NAME =?,A_PHONE=?,A_MAIL=?,A_MOD_DATE = NOW() WHERE A_ID =?`
                ,[post.a_name,post.a_phone,post.a_mail,post.a_id],
                (error,result)=>{
                    if(error){
                        console.log(error);
                        res.json(null)
                    } else {
                        res.json(result.affectedRows);
                    }
                })
        
    },
    memberModify:(req,res)=>{
        id= req.query.id;
   
        DB.query(`SELECT * FROM TBL_MEMBER WHERE M_ID =?`,[id],(error,member)=>{
            if(error){
                res.json(null);
            } else {

                const [mail1, mail2] = member[0].M_MAIL.split("@");
                const [phone1, phone2, phone3] = member[0].M_PHONE.split("-");
                const [addr1, addr2, addr3, addr4] = member[0].M_ADDR.split("/");

                const selectedMember = {
                    ...member[0],
                    mail1,
                    mail2,
                    phone1,
                    phone2,
                    phone3,
                    addr1,
                    addr2,
                    addr3,
                    addr4
                };

                res.json(selectedMember);
            }
        })
    },
    memberModifyConfirm:(req,res)=>{
        let post = req.body;
        console.log(req.body);
        DB.query(`UPDATE TBL_MEMBER SET M_MAIL =?,M_PHONE=?,M_ADDR=?, M_MOD_DATE = NOW() WHERE M_ID =?`
                ,[post.m_mail,post.m_phone,post.m_addr,post.m_id],
                (error,result)=>{
                    if(error){
                        console.log(error);
                        res.json(null)
                    } else {
                        res.json(result.affectedRows);
                    }
                })
    },
    goodsList:(req,res)=>{
        DB.query(`SELECT * FROM TBL_GOODS_REGIST`,(err,goods)=>{
            if(err){
                res.json(null);
            } else {
                res.json(goods);
            }
        })
    },
    goodsStateChange:(req,res)=>{

        let approval = req.body.approval;
        let receipt = req.body.receipt;


        DB.query(`UPDATE TBL_GOODS_REGIST SET GR_APPROVAL=?, GR_RECEIPT=? ,GR_MOD_DATE=NOW() WHERE GR_NO = ?`,
                [approval,receipt,req.body.gr_no],
                (err,result)=>{
            
                    if(err){
                        console.log(err);
                        res.json(null);
                    } else {
                        res.json(result.affectedRows);
                    }
        })
    }


}

module.exports = adminService;