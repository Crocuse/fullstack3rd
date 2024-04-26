import React, { useEffect, useState } from "react";
import { SERVER_URL } from "../../config/server_url";
import axios from "axios";

function UserMgt() {
  
    const [memberList, setMemberList] = useState([]);

    useEffect(() => {
        axios_member_list();
    }, [memberList]);

  async function memberDeleteBtn(id) {
    
    if (window.confirm("정말로 탈퇴시키겠습니까?")){
        try {
            const response = await axios.delete(`${SERVER_URL.SERVER_URL()}/admin/member_delete`,{
              data:{
                  id
              }
            });
            if(response.data > 0){
                alert('삭제가 완료되었습니다.')
            } else {
                alert('삭제에 실패했습니다.')
            }
            } catch (error) {
            console.log(error);
            alert('삭제에 실패했습니다.')
            }
    }
    
  }

  async function axios_member_list() {
    try {
      const response = await axios.get(`${SERVER_URL.SERVER_URL()}/admin/member_list`);
      setMemberList(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <article>
      <div>MEMBER MANAGEMENT</div>
      <table>
        <thead>
          <tr>
            <th>회원 아이디</th>
            <th>회원 이메일</th>
            <th>회원 전화번호</th>
            <th>회원 주소</th>
            <th>회원 등록일</th>
            <th>회원 수정일</th>
            <th>수정</th>
            <th>탈퇴</th>
          </tr>
        </thead>
        <tbody>
            {memberList.map((member) => (
                <tr key={member.M_ID}>
                <td>{member.M_ID}</td>
                <td>{member.M_MAIL}</td>
                <td>{member.M_PHONE}</td>
                <td>{member.M_ADDR}</td>
                <td>{member.M_REG_DATE}</td>
                <td>{member.M_MOD_DATE}</td>
                <td>
                    <button >수정</button>
                </td>
                <td>
                    <button onClick={()=>memberDeleteBtn(member.M_ID)}>탈퇴</button>
                </td>
                </tr>
            ))}
            </tbody>
      </table>
    </article>
  );
}

export default UserMgt;