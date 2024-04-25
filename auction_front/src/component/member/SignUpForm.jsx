import React, { useState } from "react"

<script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>

function SignUpForm() {

    // Hook -----------------------------------------------------------------------------------------------------------
    const [mId, setMId] = useState('');
    const [mPw, setMPw] = useState('');
    const [mPwCheck, setMPwCheck] = useState('');
    const [mMail, setMMail] = useState('');
    const [mPhone, setMPhone] = useState('');

    // Handler -----------------------------------------------------------------------------------------------------------
    

    // Function -----------------------------------------------------------------------------------------------------------


    // ajax


    // view
    return(
        <div className="sginup_wrap">
            <h2>회원가입</h2>

            <form action="http://localhost:3001/member/signup_confirm" method="post" name="signup_form">

                <div className="input_wrap">
                    <p>아이디</p>
                    <input type="text" name="m_id" placeholder="아이디를 입력해주세요."/>
                    <input type="button" value={"아이디 중복 검사"} />
                </div>

                <div className="input_wrap">
                    <p>비밀번호</p>
                    <input type="password" name="m_pw" placeholder="비밀번호를 입력해주세요."/>
                </div>

                <div className="input_wrap">
                    <p>비밀번호 확인</p>
                    <input type="password" name="m_pw_check" placeholder="비밀번호 확인을 입력해주세요."/>
                </div>

                <div className="input_wrap">
                    <p>이메일</p>
                    <input type="email" name="m_mail" placeholder="메일주소를 입력해주세요." />
                    <input type="button" value={"메일 중복 검사"} />
                </div>
                
                <div className="input_wrap">
                    <p>연락처</p>
                    <input type="phone" name="m_phone" placeholder="연락처를 입력해주세요." />
                </div>

                <div className="btns">
                    <input type="button" value="회원가입" />
                    <input type="reset" value="초기화" />
                </div>
                
            </form>
        </div>
    )

}
export default SignUpForm;