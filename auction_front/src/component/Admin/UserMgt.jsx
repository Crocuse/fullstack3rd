import React, { useEffect, useState } from "react";
import { SERVER_URL } from "../../config/server_url";
import axios from "axios";

function UserMgt() {
  
    const [memberList, setMemberList] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);


    useEffect(() => {
        axios_member_list();
    }, [memberList]);
    
    function execDaumPostcode() {
      new window.daum.Postcode({
        oncomplete: function(data) {
          let roadAddr = data.roadAddress;
          let extraRoadAddr = '';
    
          if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
            extraRoadAddr += data.bname;
          }
          if (data.buildingName !== '' && data.apartment === 'Y') {
            extraRoadAddr += (extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName);
          }
          if (extraRoadAddr !== '') {
            extraRoadAddr = ' (' + extraRoadAddr + ')';
          }
    
          document.getElementById('postcode').value = data.zonecode;
          document.getElementById("roadAddress").value = roadAddr;
    
          if (roadAddr !== '') {
            document.getElementById("extraAddress").value = extraRoadAddr;
          } else {
            document.getElementById("extraAddress").value = '';
          }
    
          let guideTextBox = document.getElementById("guide");
          if (data.autoRoadAddress) {
            let expRoadAddr = data.autoRoadAddress + extraRoadAddr;
            guideTextBox.innerHTML = '(예상 도로명 주소 : ' + expRoadAddr + ')';
            guideTextBox.style.display = 'block';
          } else {
            guideTextBox.innerHTML = '';
            guideTextBox.style.display = 'none';
          }
        }
      }).open();
    }
    const memberModifyConfirmBtnClick = (e) => {
      e.preventDefault()
      let form = document.member_modify_form;
      
      if (form.mail1.value == '') {
          alert('메일 주소를 입력해주세요.');
          form.mail1.focus();
      }
      else if (form.mail2.value == '') {
          alert('메일 주소를 입력해주세요.');
          form.mail2.focus();
      }
      else if (form.phone2.value == '') {
          alert('연락처를 입력해주세요.');
          form.phone2.focus();
      }
      else if (form.phone3.value == '') {
          alert('연락처를 입력해주세요.');
          form.phone3.focus();
      }
      else if (form.postcode.value == '') {
          alert('우편번호를 입력해주세요.');
          form.postcode.focus();
      }
      else if (form.roadAddress.value == '') {
          alert('도로명 주소를 입력해주세요.');
          form.roadAddress.focus();
      }
      else {
          let m_id = form.m_id.value;
          let m_mail = `${form.mail1.value}@${form.mail2.value}`;
          let m_phone = `${form.phone1.value}-${form.phone2.value}-${form.phone3.value}`;
          let m_addr = `${form.postcode.value}/ ${form.roadAddress.value} /${form.detailAddress.value}`;
          if (form.extraAddress.value != '')
              m_addr += ` /${form.extraAddress.value}`

              axios_member_modify_confirm(m_id, m_mail, m_phone, m_addr);
      }
  }



    function openModal(member) {
      setSelectedMember(member);
      setModalVisible(true);
    }
  
    function closeModal() {
      setSelectedMember(null);
      setModalVisible(false);
    }


    async function memberModifyBtn(id) {
      try{
        const response = await axios.get(`${SERVER_URL.SERVER_URL()}/admin/member_modify`,{
            params:{
                id
            }
        });
        if(response.data != null){
            openModal(response.data)
        } else {
            alert('데이터를 불러올수 없습니다.')
        }
    } catch (error){
        console.log(error)
        alert('통신 오류가 발생했습니다.')
    }
    }

    async function axios_member_modify_confirm(m_id,m_mail,m_phone,m_addr){
      try {
        const response = await axios.post(`${SERVER_URL.SERVER_URL()}/admin/member_modify_confirm`,{
            m_id, m_mail, m_phone , m_addr
        });
        if(response.data == null){
            alert('데이터베이스 오류가 발생했습니다.');
        } else if(response.data >0){
            alert('유저 수정에 성공하였습니다.');
            axios_member_list();
            closeModal();
        }
        } catch (error) {
        console.log(error);
        }
    }
    

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
                <td>{member.M_ADDR.split('/').join(' ')}</td>
                <td>{member.M_REG_DATE}</td>
                <td>{member.M_MOD_DATE}</td>
                <td>
                    <button onClick={()=>memberModifyBtn(member.M_ID)}>수정</button>
                </td>
                <td>
                    <button onClick={()=>memberDeleteBtn(member.M_ID)}>탈퇴</button>
                </td>
                </tr>
            ))}
            </tbody>
      </table>
      {modalVisible && (
                    <div className="modal">
                        <div className="modal-content">
                            <h2>유저 정보 수정</h2>
                            <form name="member_modify_form" method="post">
                                ID<br/>
                                <input type="text" name="m_id" defaultValue={selectedMember.M_ID} readOnly/><br/>
                                
                                연락처<br/>
                                <select name="phone1" defaultValue={selectedMember.phone1}>
                                    <option defaultValue="010">010</option>
                                    <option defaultValue="011">011</option>
                                    <option defaultValue="016">016</option>
                                    <option defaultValue="017">017</option>
                                    <option defaultValue="018">018</option>
                                    <option defaultValue="019">019</option>
                                </select>
                                -
                                <input
                                    type="number"
                                    name="phone2"
                                    defaultValue={selectedMember.phone2}
                                />
                                -
                                <input
                                    type="number"
                                    name="phone3"
                                    defaultValue={selectedMember.phone3}
                                />
                                <br />
                                이메일
                                <br />
                                <span>{selectedMember.M_SOCIAL_ID ? "소셜로그인한 사람은 MAIL 수정이 불가합니다":""}</span>
                                <input 
                                    readOnly={selectedMember.M_SOCIAL_ID ? true : false}
                                    type="text"
                                    name="mail1"
                                    defaultValue={selectedMember.mail1}
                                />
                                @
                                <input
                                    readOnly={selectedMember.M_SOCIAL_ID ? true : false}
                                    type="text"
                                    name="mail2"
                                    defaultValue={selectedMember.mail2}
                                />
                                <br/>
                                주소
                                <br />
                                <input type="text" name="postcode" id="postcode" placeholder="우편번호" defaultValue={selectedMember.addr1}/>
                                <input type="button" onClick={execDaumPostcode} value="우편번호 찾기" />
                                <br />
                                <input type="text" name="roadAddress" id="roadAddress" placeholder="도로명주소" defaultValue={selectedMember.addr2}/>
                                <span id="guide" style={{ color: "#999", display: "none" }}></span>
                                <input type="text" name="detailAddress" id="detailAddress" placeholder="상세주소" defaultValue={selectedMember.addr3}/>
                                <input type="text" name="extraAddress" id="extraAddress" placeholder="참고항목" defaultValue={selectedMember.addr4}/>
                                <br/>

                                <button onClick={closeModal}>닫기</button>
                                <button type="reset">초기화</button>
                                <button onClick={memberModifyConfirmBtnClick}>수정</button> 
                            </form>
                            
                        </div>
                    </div>
                )}
    </article>
  );
}

export default UserMgt;