import { useState } from 'react';
import LoadingModal from '../include/LoadingModal';
import $ from 'jquery';
import axios from 'axios';
import { SERVER_URL } from '../../config/server_url';
import '../../css/member/FindPw.css';

const FindPw = () => {
    // Hook -----------------------------------------------------------------------------------------------------------
    const [loadingModalShow, setLoaingModalShow] = useState(false);

    // Handler -----------------------------------------------------------------------------------------------------------
    const findBtnClick = () => {
        let mail = $('input[name="m_mail"]').val();
        let id = $('input[name="m_id"]').val();

        if (mail === '') {
            $('.wrong').text('메일 주소를 입력해주세요.');
            return;
        }
        if (id === '') {
            $('.wrong').text('아이디를 입력해주세요.');
            return;
        }

        setLoaingModalShow(true);

        axios_FindPw(mail, id);
    };

    const pageCloseBtnClick = () => {
        window.close();
    };

    // Function -----------------------------------------------------------------------------------------------------------

    // axios -----------------------------------------------------------------------------------------------------------
    async function axios_FindPw(mail, id) {
        try {
            const response = await axios.post(`${SERVER_URL.SERVER_URL()}/member/find_pw`, { mail, id });

            if (response.data === 'error') {
                alert('멤버 정보를 불러오는데 실패했습니다.');
                return;
            }

            if (response.data === 'not_found') {
                $('.wrong').text('회원 정보를 찾을 수 없습니다.');
            } else if (response.data === 'google_id') {
                $('.wrong').html(
                    `구글 계정으로 가입한 회원님은 별도의 비밀번호 찾기가 필요하지 않습니다. <br /> 구글 로그인을 통해 서비스를 이용해주세요.`
                );
            } else if (response.data === 'naver_id') {
                $('.wrong').html(
                    `네이버 계정으로 가입한 회원님은 별도의 비밀번호 찾기가 필요하지 않습니다. <br /> 네이버 로그인을 통해 서비스를 이용해주세요.`
                );
            } else if (response.data === 'mail_send') {
                $('.finded').css('display', 'block');
                $('.find_txt').css('display', 'none');
                $('.input_mail').css('display', 'none');
                $('.input_id').css('display', 'none');
                $('.wrong').css('display', 'none');
                $('.find_btn').css('display', 'none');
            }
            setLoaingModalShow(false);
        } catch (error) {
            console.log(error);
            alert('통신 오류가 발생했습니다.');
            setLoaingModalShow(false);
        }
    }

    // View -----------------------------------------------------------------------------------------------------------
    return (
        <>
            <div className="find_pw_wrap">
                <div className="title">
                    <h4>비밀번호 찾기</h4>
                </div>
                <div className="find">
                    <div className="find_txt">회원가입시 등록한 메일로 임시 비밀번호가 발송됩니다.</div>
                    <div className="input_mail">
                        <input type="text" name="m_mail" placeholder="가입시 등록한 이메일 주소를 입력해주세요." />
                    </div>
                    <div className="input_id">
                        <input type="text" name="m_id" placeholder="가입시 등록한 아이디를 입력해주세요." />
                    </div>
                    <div className="wrong"></div>
                    <div className="finded" style={{ display: 'none' }}>
                        <div className="finded_txt">
                            임시 비밀번호가 메일로 전송됐습니다. 메일 수신까지 2 ~ 3분 소요될 수 있습니다.
                        </div>
                        <button onClick={pageCloseBtnClick}>창닫기</button>
                    </div>
                    <div className="find_btn">
                        <input type="button" value={'비밀번호 찾기'} onClick={findBtnClick} />
                    </div>
                </div>
            </div>

            {loadingModalShow === true ? <LoadingModal /> : null}
        </>
    );
};

export default FindPw;
