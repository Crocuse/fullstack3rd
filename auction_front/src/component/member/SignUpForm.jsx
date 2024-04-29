import React, { useEffect, useState } from "react"
import $ from "jquery";
import { SERVER_URL } from "../../config/server_url";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { sessionCheck } from "../../util/sessionCheck";
import { useSelector } from "react-redux";

axios.defaults.withCredentials = true;

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
        let id = $('input[name="m_id"]').val();
        if (id == '') {
            alert('아이디를 입력해주세요.');
            return;
        }

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

        if (mail1 == '' || mail2 == '') {
            alert('메일을 입력해주세요.');
            return;
        }

        axios_is_mail(mail);
    }

    const pwChangehandler = () => {
        let pw = $('input[name="m_pw"]').val();
        let pw_check = $('input[name="m_pw_check"]').val();

        if (pw == pw_check) {
            $('#pw_check_false').text('비밀번호가 일치합니다.');
            $('#pw_check_true').text('');
        }
        else {
            $('#pw_check_false').text('');
            $('#pw_check_true').text('비밀번호가 일치하지 않습니다.');
        }
    }

    const signUpBtnClick = () => {
        let form = document.signup_form;

        if (form.m_id.value == '') {
            alert('아이디를 입력해주세요.')
            form.m_id.focus();
        }
        else if (IDCehck == false) {
            alert('아이디 중복 검사를 완료해주세요.');
            form.m_id.focus();
        }
        else if (form.m_pw.value == '') {
            alert('비밀번호를 입력해주세요.');
            form.m_pw.focus();
        }
        else if (form.m_pw_check.value == '') {
            alert('비밀번호 확인칸을 입력해주세요.');
            form.m_pw_check.focus();
        }
        else if (form.m_pw.value !== form.m_pw_check.value) {
            alert('비밀번호 확인이 일치하지 않습니다.')
            form.m_pw_check.focus();
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
            let m_pw = form.m_pw.value;
            let m_mail = `${form.mail1.value}@${form.mail2.value}`;
            let m_phone = `${form.phone1.value}-${form.phone2.value}-${form.phone3.value}`;
            let m_addr = `${form.postcode.value}/${form.roadAddress.value}/${form.detailAddress.value}`;
            if (form.extraAddress.value != '')
                m_addr += `/${form.extraAddress.value}`

            axios_signup_confirm(m_id, m_pw, m_mail, m_phone, m_addr);
        }
    }

    // Function -----------------------------------------------------------------------------------------------------------
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

    // axios
    async function axios_is_member(id) {
        try {
            const response = await axios.get(`${SERVER_URL.SERVER_URL()}/member/is_member`, {
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
            const response = await axios.post(`${SERVER_URL.SERVER_URL()}/member/is_mail`,
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

    async function axios_signup_confirm(m_id, m_pw, m_mail, m_phone, m_addr) {

        try {
            const response = await axios.post(`${SERVER_URL.SERVER_URL()}/member/signup_confirm`,
            {
                m_id, m_pw, m_mail, m_phone, m_addr
            });

            if (response.data == 'success') {
                alert('회원가입이 완료되었습니다.');
                navigate('/member/Login_form');
            }
            else
                alert('회원가입에 실패했습니다.');
    
        } catch (error) {
            console.log(error);
        }
    }

    // view
    return(
        <div className="signup_wrap">
            <h2>회원가입</h2>

            <form method="post" name="signup_form">

                <div className="input_wrap">
                    <p>아이디</p>
                    <input type="text" name="m_id" placeholder="아이디를 입력해주세요." onChange={mIdChangeHandler}/>
                    <input type="button" value={"아이디 중복 검사"} onClick={IdCheckbtnClick}/>
                    <span id="id_check_false"></span>
                    <span id="id_check_true"></span>
                </div>

                <div className="input_wrap">
                    <p>비밀번호</p>
                    <input type="password" name="m_pw" placeholder="비밀번호를 입력해주세요." onChange={pwChangehandler}/>
                </div>

                <div className="input_wrap">
                    <p>비밀번호 확인</p>
                    <input type="password" name="m_pw_check" placeholder="비밀번호 확인을 입력해주세요." onChange={pwChangehandler}/>
                </div>

                <div>
                    <span id="pw_check_false"></span>
                    <span id="pw_check_true"></span>
                </div>

                <div className="input_wrap">
                    <p>이메일</p>
                    <input type="text" name="mail1" onChange={mailChangehandler}/>
                    @
                    <input type="text" name="mail2" onChange={mailChangehandler}/>
                    <input type="button" value={"메일 중복 검사"} onClick={mailCheckClickHandler} />
                    <span id="mail_check_false"></span>
                    <span id="mail_check_true"></span>
                </div>
                
                <div className="input_wrap">
                    <p>연락처</p>
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

                <div className="input_wrap">
                    <p>주소</p>
                    <input type="text" name="postcode" id="postcode" placeholder="우편번호" />
                    <input type="button" onClick={execDaumPostcode} value="우편번호 찾기" />
                    <br />
                    <input type="text" name="roadAddress" id="roadAddress" placeholder="도로명주소" />
                    <span id="guide" style={{ color: "#999", display: "none" }}></span>
                    <input type="text" name="detailAddress" id="detailAddress" placeholder="상세주소" />
                    <input type="text" name="extraAddress" id="extraAddress" placeholder="참고항목" />
                </div>

                <div className="btns">
                    <input type="button" value="회원가입" onClick={signUpBtnClick}/>
                    <input type="reset" value="초기화" />
                </div>
                
            </form>
        </div>
    )

}
export default SignUpForm;