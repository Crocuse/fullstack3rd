import React, { useState } from "react"
import $ from "jquery";
import { SERVER_URL } from "../../config/server_url";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignUpForm() {

    // Hook -----------------------------------------------------------------------------------------------------------
    const [IDCehck, setIDCehck] = useState(false);
    const [mailCheck, setMailCheck] = useState(false);

    const navigate = useNavigate();

    // Handler -----------------------------------------------------------------------------------------------------------
    const mIdChangeHandler = () => {
        setIDCehck(false);
        $('#id_check_false').text(`아이디 중복 검사를 실행해주세요.`);     
        $('#id_check_true').text('');  
    }

    const IdCheckbtnClick = () => {
        let id = $('input[name="a_id"]').val();

        axios_is_member(id);
    }

    const mailChangehandler = () => {
        setMailCheck(false);
        $('#mail_check_false').text(`메일 중복 검사를 실행해주세요.`);     
        $('#mail_check_true').text('');
    }

    const mailCheckClickHandler = () => {
        let mail1 = $('input[name="mail1"]').val();
        let mail2 = $('input[name="mail2"]').val();
        let mail = `${mail1}@${mail2}`;

        axios_is_mail(mail);
    }

    const pwChangehandler = () => {
        let pw = $('input[name="a_pw"]').val();
        let pw_check = $('input[name="a_pw_check"]').val();

        if (pw == pw_check) {
            $('#pw_check_false').text('비밀번호가 일치합니다.');
            $('#pw_check_true').text('');
        }
        else {
            $('#pw_check_false').text('');
            $('#pw_check_true').text('비밀번호가 일치하지 않습니다.');
        }
    }

    const adminRegBtnClick = () => {
        let form = document.admin_reg_form;

        if (form.a_id.value == '') {
            alert('아이디를 입력해주세요.')
            form.a_id.focus();
        }
        else if (IDCehck == false) {
            alert('아이디 중복 검사를 완료해주세요.');
            form.a_id.focus();
        }
        else if (form.a_pw.value == '') {
            alert('비밀번호를 입력해주세요.');
            form.a_pw.focus();
        }
        else if (form.a_pw_check.value == '') {
            alert('비밀번호 확인칸을 입력해주세요.');
            form.a_pw_check.focus();
        }
        else if (form.a_pw.value !== form.a_pw_check.value) {
            alert('비밀번호 확인이 일치하지 않습니다.')
            form.a_pw_check.focus();
        } 
        else if (form.a_name.value == '') {
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
        else if (mailCheck == false) {
            alert('메일 중복 검사를 완료해주세요.')
            form.mail1.focus();
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
            let a_pw = form.a_pw.value;
            let a_name = form.a_name.value;
            let a_mail = `${form.mail1.value}@${form.mail2.value}`;
            let a_phone = `${form.phone1.value}-${form.phone2.value}-${form.phone3.value}`;


            axios_admin_reg_confirm(a_id, a_pw, a_name, a_mail, a_phone);
        }
    }

    // Function -----------------------------------------------------------------------------------------------------------

    // axios
    async function axios_is_member(id) {
        try {
            const response = await axios.get(`${SERVER_URL.SERVER_URL()}/admin/is_member`, {
                params: { id }
            });
            console.log(response.data);

            if (response.data == 'is_member') {
                $('#id_check_false').text(`사용 중인 아이디입니다.`);     
                $('#id_check_true').text('');     
                setIDCehck(false);
            }
            else if (response.data == 'error') {
                $('#id_check_false').text('오류가 발생했습니다. 다시 시도해주세요.');   
                $('#id_check_true').text('');   
                setIDCehck(false);
            }
            else if (response.data == 'not_member') {
                $('#id_check_false').text('');  
                $('#id_check_true').text(`사용 가능한 아이디입니다.`);
                setIDCehck(true);
            }

        } catch (error) {
            console.log(error);
        }
    }

    async function axios_is_mail(mail) {

        try {
            const response = await axios.post(`${SERVER_URL.SERVER_URL()}/admin/is_mail`,
            {
                "mail": mail,
            });

            if (response.data == 'is_mail') {
                $('#mail_check_false').text(`사용 중인 메일입니다.`);     
                $('#mail_check_true').text('');     
                setMailCheck(false);
            }
            else if (response.data == 'error') {
                $('#mail_check_false').text('오류가 발생했습니다. 다시 시도해주세요.');   
                $('#mail_check_true').text('');   
                setMailCheck(false);
            }
            else if (response.data == 'not_mail') {
                $('#mail_check_false').text('');  
                $('#mail_check_true').text(`사용 가능한 메일입니다.`);
                setMailCheck(true);
            }
    
        } catch (error) {
            console.log(error);
        }
    }

    async function axios_admin_reg_confirm(a_id, a_pw, a_name,a_mail, a_phone) {

        try {
            const response = await axios.post(`${SERVER_URL.SERVER_URL()}/admin/admin_regist_confirm`,
            {
                a_id, a_pw, a_name,a_mail, a_phone
            });

            if (response.data == 'success') {
                alert('어드민 등록이 완료되었습니다.');
                navigate('/admin/home');
            }
            else
                alert('어드민 등록에 실패했습니다.');
    
        } catch (error) {
            console.log(error);
        }
    }

    // view
    return(
        <div className="admin_reg_wrap">
            <h2>어드민 등록</h2>

            <form method="post" name="admin_reg_form">

                <div className="input_wrap">
                    <p>관리자 아이디</p>
                    <input type="text" name="a_id" placeholder="아이디를 입력해주세요." onChange={mIdChangeHandler}/>
                    <input type="button" value={"아이디 중복 검사"} onClick={IdCheckbtnClick}/>
                    <span id="id_check_false"></span>
                    <span id="id_check_true"></span>
                </div>

                <div className="input_wrap">
                    <p>비밀번호</p>
                    <input type="password" name="a_pw" placeholder="비밀번호를 입력해주세요." onChange={pwChangehandler}/>
                </div>

                <div className="input_wrap">
                    <p>비밀번호 확인</p>
                    <input type="password" name="a_pw_check" placeholder="비밀번호 확인을 입력해주세요." onChange={pwChangehandler}/>
                </div>

                <div>
                    <span id="pw_check_false"></span>
                    <span id="pw_check_true"></span>
                </div>

                <div className="input_wrap">
                    <p>관리자 이름</p>
                    <input type="text" name="a_name" placeholder="관리자 이름을 입력하세요"/>
                </div>

                <div className="input_wrap">
                    <p>관리자 이메일</p>
                    <input type="text" name="mail1" onChange={mailChangehandler}/>
                    @
                    <input type="text" name="mail2" onChange={mailChangehandler}/>
                    <input type="button" value={"메일 중복 검사"} onClick={mailCheckClickHandler} />
                    <span id="mail_check_false"></span>
                    <span id="mail_check_true"></span>
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
                    <input type="number" name="phone2"/>
                    -
                    <input type="number" name="phone3"/>
                </div>

                <div className="btns">
                    <input type="button" value="어드민등록" onClick={adminRegBtnClick}/>
                    <input type="reset" value="초기화" />
                </div>
                
            </form>
        </div>
    )

}
export default SignUpForm;