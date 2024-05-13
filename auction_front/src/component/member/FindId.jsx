import { useState } from 'react';
import LoadingModal from '../include/LoadingModal';
import $ from 'jquery';
import axios from 'axios';
import { SERVER_URL } from '../../config/server_url';
import '../../css/member/FindId.css';

const FindId = () => {
    // Hook -----------------------------------------------------------------------------------------------------------
    const [loadingModalShow, setLoaingModalShow] = useState(false);

    // Handler -----------------------------------------------------------------------------------------------------------
    const findBtnClick = () => {
        let mail = $('input[name="m_mail"]').val();

        if (mail === '') {
            $('.wrong').text('메일 주소를 입력해주세요.');
            return;
        }
        setLoaingModalShow(true);

        axios_FindId(mail);
    };

    const pageCloseBtnClick = () => {
        window.close();
    };

    // Function -----------------------------------------------------------------------------------------------------------

    // axios -----------------------------------------------------------------------------------------------------------
    async function axios_FindId(mail) {
        try {
            const response = await axios.post(`${SERVER_URL.SERVER_URL()}/member/find_id`, { mail });

            if (response.data === 'error') {
                alert('멤버 정보를 불러오는데 실패했습니다.');
                return;
            }

            console.log(response.data);

            if (response.data === 'not_found') {
                $('.wrong').text('가입된 메일 주소가 아닙니다.');
            } else if (response.data === 'google_id') {
                $('.wrong').html(
                    `구글 계정으로 가입한 회원님은 별도의 아이디 찾기가 필요하지 않습니다. <br /> 구글 로그인을 통해 서비스를 이용해주세요.`
                );
            } else if (response.data === 'naver_id') {
                $('.wrong').html(
                    `네이버 계정으로 가입한 회원님은 별도의 아이디 찾기가 필요하지 않습니다. <br /> 네이버 로그인을 통해 서비스를 이용해주세요.`
                );
            } else if (response.data === 'kakao_id') {
                $('.wrong').html(
                    `카카오톡 계정으로 가입한 회원님은 별도의 아이디 찾기가 필요하지 않습니다. <br /> 카카오톡 로그인을 통해 서비스를 이용해주세요.`
                );
            } else if (response.data === 'mail_send') {
                $('.finded').css('display', 'block');
                $('.input_mail').css('display', 'none');
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
            <div className="find_id_wrap">
                <div className="title">
                    <h4>아이디 찾기</h4>
                </div>
                <div className="find">
                    <div className="find_txt">회원가입시 등록한 메일 주소로 아이디가 발송됩니다.</div>
                    <div className="input_mail">
                        <input type="text" name="m_mail" placeholder="가입시 등록한 이메일을 입력해주세요." />
                    </div>
                    <div className="wrong"></div>
                    <div className="finded" style={{ display: 'none' }}>
                        <div className="find_txt">
                            아이디 정보가 메일로 전송됐습니다. <br /> 메일 수신까지 2 ~ 3분 소요될 수 있습니다.
                        </div>
                        <button onClick={pageCloseBtnClick}>창닫기</button>
                    </div>
                    <div className="find_btn">
                        <input type="button" value={'아이디 찾기'} onClick={findBtnClick} />
                    </div>
                </div>
            </div>

            {loadingModalShow === true ? <LoadingModal /> : null}
        </>
    );
};

export default FindId;
