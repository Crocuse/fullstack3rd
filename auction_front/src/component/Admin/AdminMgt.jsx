import React, { useEffect } from "react"
import { SERVER_URL } from "../../config/server_url";
import axios from "axios";


function AdminMgt() {
    
    useEffect(()=>{
        axios_admin_list();
    },[])

    async function axios_admin_list() {
        
        try {
            const response = await axios.get(`${SERVER_URL.SERVER_URL()}/admin/admin_list`);
            console.log(response.data);

        } catch (error) {
            console.log(error);
        }
    }


    return (
        <article>
            <div>ADMIN MANAGEMENT</div>
            <table>
                <thead>
                    <tr>
                        <th>관리자 아이디</th>
                        <th>관리자 이름</th>
                        <th>관리자 전화번호</th>
                        <th>관리자 이메일</th>
                        <th>관리자 등록일</th>
                        <th>관리자 수정일</th>
                        <th>수정</th>
                        <th>탈퇴</th>
                    </tr>
                </thead>
                <tbody>

                </tbody>
            </table>
        </article>
    );
}
export default AdminMgt;