import React from "react";
import axios from "axios";
import $ from "jquery"
import { SERVER_URL } from "../../config/server_url";

function AdminReg() {

    const adminRegSubmitBtnClickHandler = () => {
        
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

        const body = {
                "a_id" : $('input[name="a_id"]').val(),
                "a_pw" : $('input[name="a_pw"]').val(),
                "a_name" : $('input[name="a_name"]').val(),
                "a_mail" : $('input[name="a_mail"]').val(),
                "a_phone" : $('input[name="a_phone"]').val(),
            }

        axios.post(`${SERVER_URL.SERVER_URL()}/admin/admin_regist_confirm`, body)
            .then(response => {

                if (response.data !== null && response.data > 0) {
                    alert('ADMIN REGIST PROCESS SUCCESS!!');

                } else {
                    alert('ADMIN REGIST PROCESS FAIL!!');
                    $('form[name="admin_regist_form"]')[0].reset();
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
                    <p>관리자 이메일</p>
                    <input type="text" name="a_mail"/>
                    @
                    <input type="text" name="mail2"/>
                    <input type="button" value={"메일 중복 검사"} />
                </div>

                    <div className="input_wrap">
                        <p>관리자 연락처</p>
                    <select name="phone1">
                        <option value="010">010</option>
                        <option value="011">011</option>
                        <option value="016">016</option>
                        <option value="017">017</option>
                        <option value="018">018</option>
                        <option value="019">019</option>
                    </select>
                    -
                    <input type="number" name="a_phone"/>
                    -
                    <input type="number" name="phone3"/>
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