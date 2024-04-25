const DB = require("../db/db");

const adminService = {
    
    adminRegistConfirm:(req,res)=>{
        let post = req.body;
        
        console.log(post.a_id);

        DB.query(`INSERT INTO TBL_ADMIN(A_ID,A_PW,A_NAME,A_MAIL,A_PHONE) VALUES (?,?,?,?,?)`,
                [post.a_id,post.a_pw,post.a_name,post.a_mail,post.a_phone],(err,result)=>{
                    
                    if(err){
                        console.log(err);
                        res.json(null);
                    } else if(result.affectedRows > 0){
                        res.json(result.affectedRows);
                    } else {
                        res.json(null);
                    }
                    
                })
        
    }
}

module.exports = adminService;