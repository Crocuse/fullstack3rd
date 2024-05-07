import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sessionCheck } from '../../../util/sessionCheck';
import axios from 'axios';
import { SERVER_URL } from '../../../config/server_url';
import $ from 'jquery';
import '../../../css/member/mypage/ModifyPassword.css';

function ModifyPassword() {
    // Hook -----------------------------------------------------------------------------------------------------------
    const sessionId = useSelector((state) => state['loginedInfos']['loginedId']['sessionId']);
    const loginedId = useSelector((state) => state['loginedInfos']['loginedId']['loginedId']);
    const navigate = useNavigate();

    const [checkPw, setCheckPw] = useState(false);

    useEffect(() => {
        sessionCheck(sessionId, navigate);
        changeDisplayModufyWrap();
    }, [sessionId, navigate]);

    // Handler -----------------------------------------------------------------------------------------------------------
    const modifyPwBtnClick = () => {
        let inputPw = $('input[name="current_pw"]').val();
        let pw = $('input[name="modify_pw"]').val();
        let pw_check = $('input[name="modify_pw_check"]').val();

        if (inputPw === '') {
            alert('현재 비밀번호를 입력해주세요.');
            $('input[name="current_pw"]').focus();
            return;
        }
        if (pw === '') {
            alert('수정할 비밀번호를 입력해주세요.');
            $('input[name="pw"]').focus();
            return;
        }
        if (pw_check === '') {
            alert('비밀번호 확인을 입력해주세요.');
            $('input[name="pw_check"]').focus();
            return;
        }

        axios_check_password(loginedId, inputPw);
        if (checkPw == false) return;

        if (pw !== pw_check) {
            alert('수정할 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
            return;
        }
        if (inputPw === pw) {
            alert('수정할 비밀번호가 현재 비밀번호와 일치합니다.');
            return;
        }

        axios_modify_password(loginedId, pw);
    };

    // Fucntion -----------------------------------------------------------------------------------------------------------
    function changeDisplayModufyWrap() {
        let socialIdMark = loginedId.substring(0, 2);
        console.log('🚀 ~ changeDisplayModufyWrap ~ socialIdMark:', socialIdMark);

        if (socialIdMark == 'G_' || socialIdMark == 'N_') {
            $('.modify_password_wrap').css('display', 'none');
            $('.modify_password_wrap_social').css('display', 'block');
        } else {
            $('.modify_password_wrap').css('display', 'block');
            $('.modify_password_wrap_social').css('display', 'none');
        }
    }

    // Axios -----------------------------------------------------------------------------------------------------------
    async function axios_check_password(id, pw) {
        try {
            const response = await axios.post(`${SERVER_URL.SERVER_URL()}/member/check_password`, { id, pw });

            let checkId = response.data;
            if (checkId === 'fail') {
                setCheckPw(false);
                alert('현재 비밀번호가 올바르지 않습니다.');
                $('input[name="current_pw"]').val('');
                $('input[name="current_pw"]').focus();
            } else {
                setCheckPw(true);
            }
        } catch (error) {
            console.log(error);
            alert('통신 오류가 발생했습니다.');
        }
    }

    async function axios_modify_password(id, pw) {
        try {
            const response = await axios.post(`${SERVER_URL.SERVER_URL()}/member/modify_password`, { id, pw });

            if (response.data === 'error') alert('비밀번호 변경에 오류가 발생했습니다.');
            else if (response.data === 'modified') {
                alert('비밀번호가 변경되었습니다. 다시 로그인 해주세요.');
                navigate('/member/logout_confirm');
            }
        } catch (error) {
            console.log(error);
            alert('통신 오류가 발생했습니다.');
        }
    }

    // View -----------------------------------------------------------------------------------------------------------
    return (
        <article>
            <div className="modify_password_wrap">
                <div className="title">
                    <h2>비밀번호 변경</h2>
                </div>

                <div className="modify_wrap">
                    <div>
                        <div className="input_title">현재 비밀번호</div>
                        <div className="input">
                            <input type="password" name="current_pw" />
                        </div>
                    </div>
                    <div>
                        <div className="input_title">수정할 비밀번호</div>
                        <div className="input">
                            <input type="password" name="modify_pw" />
                        </div>
                    </div>
                    <div>
                        <div className="input_title">비밀번호 확인</div>
                        <div className="input">
                            <input type="password" name="modify_pw_check" />
                        </div>
                    </div>

                    <div className="check_rst">
                        <span></span>
                    </div>
                    <div className="btn_wrap">
                        <button onClick={modifyPwBtnClick}>비밀번호 변경</button>
                    </div>
                </div>
            </div>

            <div className="modify_password_wrap_social">
                <div className="title">
                    <h2>비밀번호 변경</h2>
                </div>
                <div className="social_id_true">
                    <p>소셜 로그인으로 가입한 아이디는 비밀번호를 변경할 수 없습니다.</p>
                </div>
            </div>
        </article>
    );
}

export default ModifyPassword;
