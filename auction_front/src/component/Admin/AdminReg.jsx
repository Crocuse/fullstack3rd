import React from "react";
import axios from "axios";
import { SERVER_URL } from "../../config/server_url";
import $ from 'jquery';

function AdminReg() {

    const adminRegSubmitBtnClickHandler = () => {
        let form = document.admin_regist_form;
        let aId = $('input[name="a_id"]').val();
        let aPw = $('input[name="a_pw"]').val();
        let aPwCheck = $('input[name="a_pw_check"]').val();
        let aName = $('input[name="a_name"]').val();
        let aMail = $('input[name="a_mail"]').val();
        let aPhone = $('input[name="a_phone"]').val();

        if (aId === '') {
            alert('INPUT ADMIN ID');
            $('input[name="a_id"]').focus();
        } else if (aPw === '') {
            alert('INPUT ADMIN PW');
            $('input[name="a_pw"]').focus();
        } else if (aPwCheck === '') {
            alert('INPUT ADMIN PW CHECK');
            $('input[name="a_pw_check"]').focus();
        } else if (aPw !== aPwCheck) {
            alert('ADMIN PW AND PW CHECK DO NOT MATCH');
            $('input[name="a_pw"]').focus();
        } else if (aName === '') {
            alert('INPUT ADMIN NAME');
            $('input[name="a_name"]').focus();
        } else if (aMail === '') {
            alert('INPUT ADMIN MAIL');
            $('input[name="a_mail"]').focus();
        } else if (aPhone === '') {
            alert('INPUT ADMIN PHONE');
            $('input[name="a_phone"]').focus();
        } else {
            axios_admin_regist();
        }
    };



const axios_admin_regist = () => {
        let formData = new FormData();
        formData.append("a_id", $('input[name="a_id"]').val());
        formData.append("a_pw", $('input[name="a_pw"]').val());
        formData.append("a_name", $('input[name="a_name"]').val());
        formData.append("a_mail", $('input[name="a_mail"]').val());
        formData.append("a_phone", $('input[name="a_phone"]').val());

        axios.post(`${SERVER_URL.SERVER_URL()}/admin/admin_regist_confirm`, formData)
            .then(response => {
                if (response.data !== null && response.data > 0) {
                    alert('ADMIN REGIST PROCESS SUCCESS!!');
                    // TODO: 관리자 등록 성공 후 처리할 로직 추가
                } else {
                    alert('ADMIN REGIST PROCESS FAIL!!');
                    $('form[name="admin_regist_form"]').remove();
                }
            })
            .catch(error => {
                console.error('AXIOS ADMIN REGIST COMMUNICATION ERROR', error);
            })
            .finally(() => {
                console.log('AXIOS ADMIN REGIST COMMUNICATION COMPLETE');
            });
    };

    return (
        <article>
            <div className="admin_regist_wrap">
                <h2>관리자 등록</h2>

                <form name="admin_regist_form">
                    <div className="input_wrap">
                        <p>관리자 아이디</p>
                        <input type="text" name="a_id" placeholder="관리자 아이디를 입력해주세요." />
                        <input type="button" value="아이디 중복 검사" />
                    </div>

                    <div className="input_wrap">
                        <p>관리자 비밀번호</p>
                        <input type="password" name="a_pw" placeholder="비밀번호를 입력해주세요." />
                    </div>

                    <div className="input_wrap">
                        <p>비밀번호 확인</p>
                        <input type="password" name="a_pw_check" placeholder="비밀번호 확인을 입력해주세요." />
                    </div>

                    <div className="input_wrap">
                        <p>관리자 이름</p>
                        <input type="text" name="a_name" placeholder="관리자 이름을 입력해주세요." />
                    </div>

                    <div className="input_wrap">
                        <p>이메일</p>
                        <input type="email" name="a_mail" placeholder="관리자 메일주소를 입력해주세요." />
                    </div>

                    <div className="input_wrap">
                        <p>연락처</p>
                        <input type="text" name="a_phone" placeholder="관리자 연락처를 입력해주세요." />
                    </div>

                    <div className="btns">
                        <input type="button" value="관리자 등록" onClick={adminRegSubmitBtnClickHandler} />
                        <input type="reset" value="초기화" />
                    </div>
                </form>
            </div>
        </article>
    );
}

export default AdminReg;