import React from "react"
import { SERVER_URL } from "../../config/server_url";
import axios from "axios";
import $ from 'jquery';
import { useDispatch } from "react-redux";
import { setLoginedId } from "../../redux/action/setLoginedId";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;

function LoginForm() {
    // Hook -----------------------------------------------------------------------------------------------------------
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Handler -----------------------------------------------------------------------------------------------------------
    const LoginBtnClickHandler = () => {
        let form = document.login_form;
        let m_id = form.m_id.value;
        let m_pw = form.m_pw.value;

        if (m_id == '') {
            alert('아이디를 입력해주세요.');
            m_id();
        }
        else if (m_pw == '') {
            alert('비밀번호를 입력해주세요.');
            m_pw();
        }
        else 
            axios_login_confirm(m_id, m_pw);
    }

    // Function -----------------------------------------------------------------------------------------------------------

    // Axios -----------------------------------------------------------------------------------------------------------
    async function axios_login_confirm(m_id, m_pw) {

        try {
            const response = await axios.post(`${SERVER_URL.SERVER_URL()}/member/login_confirm`,
            { m_id, m_pw });

            if(response.data.error) {
                $('#fail_massage').text(response.data.error[0]);
                return;
            }

            dispatch(setLoginedId(response.data.sessionID, response.data.loginedAdmin, response.data.loginId));
            navigate('/');
                        
        } catch (error) {
            console.log(error);
        }
    }

    // View -----------------------------------------------------------------------------------------------------------
    return (
        <div className="login_wrap">
        <h2>로그인</h2>

        <form method="post" name="login_form">
            <div className="input_wrap">
                <p>아이디</p>
                <input type="text" name="m_id" placeholder="아이디를 입력해주세요."/>
            </div>

            <div className="input_wrap">
                <p>비밀번호</p>
                <input type="password" name="m_pw" placeholder="비밀번호를 입력해주세요."/>
            </div>

            <div className="massage_wrap">
                <p id="fail_massage"></p>
            </div>

            <div className="btns">
                <input type="button" value="로그인" onClick={LoginBtnClickHandler}/>
            </div>
        </form>

        <div className="social_login_wrap">
            <a href="#none">구글 계정으로 로그인하기</a> <br />
            <a href="#none">네이버 계정으로 로그인하기</a> <br />
            <a href="#none">카카오톡 계정으로 로그인하기</a> <br />
        </div>

    </div>
    )
}
export default LoginForm;