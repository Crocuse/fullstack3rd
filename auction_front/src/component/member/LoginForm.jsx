import axios from "axios";
import $ from 'jquery';
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SERVER_URL } from "../../config/server_url";
import '../../css/member/LoginForm.css';
import { setLoginedId } from "../../redux/action/setLoginedId";
import LoadingModal from "../include/LoadingModal";

axios.defaults.withCredentials = true;

function LoginForm() {
    // Hook -----------------------------------------------------------------------------------------------------------
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [loadingModalShow, setLoaingModalShow] = useState(false);

    // Handler -----------------------------------------------------------------------------------------------------------
    const LoginBtnClickHandler = () => {
        setLoaingModalShow(true);

        let form = document.login_form;
        let m_id = form.m_id.value;
        let m_pw = form.m_pw.value;

        if (m_id == '') {
            alert('아이디를 입력해주세요.');
            return;
        }
        if (m_pw == '') {
            alert('비밀번호를 입력해주세요.');
            return;
        }

        axios_login_confirm(m_id, m_pw);
    }

    const googleLoginClick = () => {
        axios_google_login();
    }

    const naverLoginClick = () => {
        axios_naver_login();
    }

    const enterPressHandler = (e) => {
        if (e.key === 'Enter') LoginBtnClickHandler();
    }

    // Function -----------------------------------------------------------------------------------------------------------

    // Axios -----------------------------------------------------------------------------------------------------------
    async function axios_login_confirm(m_id, m_pw) {
        try {
            const response = await axios.post(`${SERVER_URL.SERVER_URL()}/member/login_confirm`,
            { m_id, m_pw });

            console.log("🚀 ~ axios_login_confirm ~ response.data.error:", response.data.error)
            if(response.data.error) {
                $('#fail_massage').text(response.data.error[0]);
                setLoaingModalShow(false);
                return;
            }

            dispatch(setLoginedId(response.data.sessionID, response.data.loginedAdmin, response.data.loginedId));
            navigate('/');
                        
        } catch (error) {
            console.log(error);
            setLoaingModalShow(false);
        }
    }

    async function axios_google_login() {
        try {
            const response = await axios.get(`${SERVER_URL.SERVER_URL()}/member/google_login`);
            
            window.location.href = response.data.url;
        }
        catch (error) {
            console.log(error);
        }
    }

    async function axios_naver_login() {
        try {
            const response = await axios.get(`${SERVER_URL.SERVER_URL()}/member/naver_login`);
            
            window.location.href = response.data.url;
        }
        catch (error) {
            console.log(error);
        }
    }

    // View -----------------------------------------------------------------------------------------------------------
    return (
    <div className="login_wrap">
        <h2>로그인</h2>

        <form method="post" name="login_form">
            <div className="input_wrap">
                <input type="text" name="m_id" placeholder="아이디를 입력해주세요." />
            </div>

            <div className="input_wrap">
                <input type="password" name="m_pw" placeholder="비밀번호를 입력해주세요." onKeyDown={enterPressHandler} />
            </div>

            <div className="massage_wrap" >
                <p id="fail_massage"></p>
            </div>

            <div className="btns">
                <input type="button" value="로그인" onClick={LoginBtnClickHandler}/>
            </div>
        </form>

        <div className="find_member">
            <a href="">아이디 찾기</a>
            <a href="">비밀번호 찾기</a>
        </div>

        <div className="social_login_wrap">
            <div className="google_login" onClick={googleLoginClick}>
                <div className="icon">
                    <img src="/img/member/login_icon/google.png"/>
                </div>
                <div className="login_txt">
                    구글 로그인
                </div>
            </div>
            <div className="naver_login" onClick={naverLoginClick}>
                <div className="icon">
                    <img src="/img/member/login_icon/naver.png"/>
                </div>
                <div className="login_txt">
                    네이버 로그인
                </div>
            </div>
        </div>

        {
            (loadingModalShow === true) ?
            <LoadingModal /> :
            null
        }

    </div>
    )
}
export default LoginForm;