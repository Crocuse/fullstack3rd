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
    goodsStateChange: (req, res) => {
        let approval = req.body.approval;
        let receipt = req.body.receipt;
      
        DB.query(
          `UPDATE TBL_GOODS_REGIST SET GR_APPROVAL=?, GR_RECEIPT=? ,GR_MOD_DATE=NOW() WHERE GR_NO = ?`,
          [approval, receipt, req.body.gr_no],
          (err1, result1) => {
            if (err1) {
              console.log(err1);
              res.json(null);
            } else if (approval == 1 && receipt == 1 && result1.affectedRows == 1) {
              DB.query(
                `INSERT INTO TBL_AUCTION_SCHEDULE(GR_NO) VALUES (?)`,
                [req.body.gr_no],
                (err2, result2) => {
                  if (err2) {
                    console.log(err2);
                    res.json(null);
                  } else {
                    res.json('success');
                  }
                }
              );
            } else if (approval == 2 || approval == 0) {
              DB.query(
                `DELETE FROM TBL_AUCTION_SCHEDULE WHERE GR_NO =?`,
                [req.body.gr_no],
                (err3, result3) => {
                  if (err3) {
                    console.log(err3);
                    res.json(null);
                  } else {
                    res.json('success');
                  }
                }
              );
            } else {
              res.json('success');
            }
          }
        );
      },
    goodsRegList:(req,res)=>{
        DB.query(`SELECT * FROM TBL_AUCTION_SCHEDULE AS A JOIN TBL_GOODS_REGIST AS GR ON A.GR_NO = GR.GR_NO`,(err,goods)=>{
            if(err){
                res.json(null);
            } else {
                res.json(goods);
            }
        })
    },
    goodsRegStateChange:(req,res)=>{
        let as_location_num = req.body.as_location_num;
        let as_state = req.body.as_state;
        let as_start_date = req.body.as_start_date;
        let gr_no = req.body.gr_no;
        
        console.log('스테이트값1!',as_state);
        DB.query(`SELECT COUNT(*) FROM TBL_AUCTION_SCHEDULE WHERE AS_START_DATE= ? AND AS_LOCATION_NUM = ?`
                ,[as_start_date,as_location_num],
                (err,count)=>{
                    let countValue = count[0]['COUNT(*)'];
                    console.log('스테이트값2!',as_state);
                    if(err){
                        console.log(err);
                        res.json('error')
                    } else if(countValue == 1){
                        res.json('already')
                    } else {
                      console.log('스테이트값3!',as_state);
                      
                      if(as_state == '0'){
                          as_location_num = null;
                          as_start_date = null;
                          console.log('여기까지 찍히나');
                        }

                        DB.query(`UPDATE TBL_AUCTION_SCHEDULE SET AS_STATUS =?,AS_START_DATE=?,AS_LOCATION_NUM =?,AS_MOD_DATE =NOW() WHERE GR_NO =?`,
                        [as_state,as_start_date,as_location_num,gr_no],
                        (err,result)=>{
                            if(err){
                                console.log(err);
                                res.json(null);
                            } else {
                                res.json('success');
                                return;
                            }
                        })
                    }
                })
    },
    auctionResultList: (req, res) => {
      const sql = `
        SELECT 
          AR.GR_NO,
          AR.AR_IS_BID,
          AR.AR_SELL_ID,
          AR.AR_BUY_ID,
          AR.AR_POINT,
          AR.AR_REG_DATE,
          AR.AR_MOD_DATE,
          GR.GR_NAME,
          DG.DG_ADDR,
          DG.DG_STATUS
        FROM 
          TBL_AUCTION_RESULT AS AR
          JOIN TBL_GOODS_REGIST AS GR ON AR.GR_NO = GR.GR_NO
          LEFT JOIN TBL_DELIVERY_GOODS AS DG ON AR.GR_NO = DG.GR_NO
      `;
    
      DB.query(sql, (err, results) => {
        if (err) {
          console.log(err);
          res.json(null);
        } else {
          res.json(results);
        }
      });
    },
    deliveryGoods:(req,res)=>{

      let gr_no = req.body.gr_no;


      DB.query(`UPDATE TBL_DELIVERY_GOODS SET DG_STATUS = 1 WHERE GR_NO = ?`,[gr_no],(err,result)=>{
        if(err){
          console.log(err);
          res.json(null);
        } else {
          res.json(result.affectedRows);
        }
      })
    },
    getSalesData:(req,res)=>{
      const sql = `
        SELECT 
          AR.GR_NO,
          AR.AR_IS_BID,
          AR.AR_SELL_ID,
          AR.AR_BUY_ID,
          AR.AR_POINT,
          AR.AR_REG_DATE,
          AR.AR_MOD_DATE,
          TAS.AS_LOCATION_NUM,
          GR.GR_NAME
        FROM
          TBL_AUCTION_RESULT AR
              JOIN
          TBL_AUCTION_SCHEDULE TAS ON AR.GR_NO = TAS.GR_NO
              JOIN
          TBL_GOODS_REGIST GR ON AR.GR_NO = GR.GR_NO
      `;
      DB.query(sql, (err, datas) => {
        if (err) {
          console.log(err);
          res.json(null);
        } else {
          res.json(datas);
        }
      });

    }
    


}

module.exports = adminService;