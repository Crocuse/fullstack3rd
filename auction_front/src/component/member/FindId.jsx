import { useState } from 'react';
import LoadingModal from '../include/LoadingModal';
import $ from 'jquery';

const FindId = () => {
    // Hook -----------------------------------------------------------------------------------------------------------
    const [loadingModalShow, setLoaingModalShow] = useState(false);

    // Handler -----------------------------------------------------------------------------------------------------------
    const findBtnClick = () => {
        let mail = $('input[name="m_mail"]').val();

        if (mail === '') {
            alert('메일 주소를 입력해주세요.');
            return;
        }
        setLoaingModalShow(true);

        axios_FindId(mail);
    };

    // Function -----------------------------------------------------------------------------------------------------------

    // axios -----------------------------------------------------------------------------------------------------------
    async function axios_FindId(mail) {}

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
                        이메일
                        <input type="text" name="m_mail" />
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
