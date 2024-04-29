import React, { useEffect, useState } from "react";
import { SERVER_URL } from "../../config/server_url";
import axios from "axios";
import { data } from "jquery";
import '../../css/Admin/modify_modal.css'
function AdminMgt() {
  

    //hook
    const [adminList, setAdminList] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);


    useEffect(() => {


        axios_admin_list();
    }, []);

    //function

    function openModal(admin) {
        setSelectedAdmin(admin);
        setModalVisible(true);
        }
    
    function closeModal() {
        setSelectedAdmin(null);
        setModalVisible(false);
        }
  
    const adminModifyConfirmBtnClick = (e) => {
        e.preventDefault()
        // const form = this;
        let form = document.admin_modify_form;

        if (form.a_name.value == '') {
            alert('이름를 입력해주세요.');
            form.a_name.focus();
        }
        else if (form.mail1.value == '') {
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
        else {
            let a_id = form.a_id.value;
            let a_name = form.a_name.value;
            let a_mail = `${form.mail1.value}@${form.mail2.value}`;
            let a_phone = `${form.phone1.value}-${form.phone2.value}-${form.phone3.value}`;

            axios_admin_modify_confirm(a_id, a_name, a_mail, a_phone);
        }
    }
    //axios
    async function adminDeleteBtn(id) {
    
    if (window.confirm("정말로 탈퇴시키겠습니까?")){
        try {
            const response = await axios.delete(`${SERVER_URL.SERVER_URL()}/admin/admin_delete`,{
              data:{
                  id
              }
            });
            if(response.data > 0){
                alert('삭제가 완료되었습니다.')
                axios_admin_list();
            } else {
                alert('삭제에 실패했습니다.')
            }
            } catch (error) {
            console.log(error);
            alert('삭제에 실패했습니다.')
            }
        }
        
    }

    async function adminModifyBtn(id){
        try{
            const response = await axios.get(`${SERVER_URL.SERVER_URL()}/admin/admin_modify`,{
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

    async function axios_admin_list() {
        try {
        const response = await axios.get(`${SERVER_URL.SERVER_URL()}/admin/admin_list`);
        setAdminList(response.data);
        } catch (error) {
        console.log(error);
        }
    }

    async function axios_admin_modify_confirm(a_id,a_name, a_mail, a_phone) {
        try {
        const response = await axios.post(`${SERVER_URL.SERVER_URL()}/admin/admin_modify_confirm`,{
            a_id, a_name, a_mail, a_phone
        });
        if(response.data == null){
            alert('데이터베이스 오류가 발생했습니다.');
        } else if(response.data >0){
            alert('관리자 수정에 성공하였습니다.');
            axios_admin_list();
            closeModal();
        }
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
                    {adminList.filter((admin) => admin.A_ID !== "super")
                                .map((admin) => (
                                <tr key={admin.A_ID}>
                                    <td>{admin.A_ID}</td>
                                    <td>{admin.A_NAME}</td>
                                    <td>{admin.A_PHONE}</td>
                                    <td>{admin.A_MAIL}</td>
                                    <td>{admin.A_REG_DATE}</td>
                                    <td>{admin.A_MOD_DATE}</td>
                                    <td>
                                    <button onClick={() => adminModifyBtn(admin.A_ID)}>수정</button>
                                    </td>
                                    <td>
                                    <button onClick={() => adminDeleteBtn(admin.A_ID)}>탈퇴</button>
                                    </td>
                                </tr>
                                ))}
                    </tbody>
                </table>

                {modalVisible && (
                    <div className="modal">
                        <div className="modal-content">
                            <h2>관리자 정보 수정</h2>
                            <form name="admin_modify_form" method="post">
                                ID<br/>
                                <input type="text" name="a_id" defaultValue={selectedAdmin.A_ID} readOnly/><br/>
                                이름<br/>
                                <input type="text" name="a_name" defaultValue={selectedAdmin.A_NAME}/><br/>
                                연락처<br/>
                                <select name="phone1" defaultValue={selectedAdmin.phone1}>
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
                                    defaultValue={selectedAdmin.phone2}
                                />
                                -
                                <input
                                    type="number"
                                    name="phone3"
                                    defaultValue={selectedAdmin.phone3}
                                />
                                <br />
                                이메일
                                <br />
                                <input
                                    type="text"
                                    name="mail1"
                                    defaultValue={selectedAdmin.mail1}
                                />
                                @
                                <input
                                    type="text"
                                    name="mail2"
                                    defaultValue={selectedAdmin.mail2}
                                />
                                    <br />
                                <button onClick={closeModal}>닫기</button>
                                <button type="reset">초기화</button>
                                <button onClick={adminModifyConfirmBtnClick}>수정</button> 
                            </form>
                            
                        </div>
                    </div>
                )}
        </article>
    );
    }

export default AdminMgt;