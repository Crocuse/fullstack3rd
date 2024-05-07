import React, { useEffect, useState } from 'react';
import '../../../css/member/mypage/MemberDelete.css';
import { useSelector } from 'react-redux';
import { sessionCheck } from '../../../util/sessionCheck';
import { useNavigate } from 'react-router-dom';
import LoadingModal from '../../include/LoadingModal';
import axios from 'axios';
import { SERVER_URL } from '../../../config/server_url';

const MemberDelete = () => {
    // Hook -----------------------------------------------------------------------------------------------------------
    const sessionId = useSelector((state) => state['loginedInfos']['loginedId']['sessionId']);
    const loginedId = useSelector((state) => state['loginedInfos']['loginedId']['loginedId']);
    const navigate = useNavigate();

    useEffect(() => {
        sessionCheck(sessionId, navigate);
    }, [sessionId]);

    const [loadingModalShow, setLoaingModalShow] = useState(false);

    // Handler -----------------------------------------------------------------------------------------------------------
    const memeberDeleteBtnClick = () => {
        let confirmRst = window.confirm('확인시 회원 탈퇴를 진행합니다.');
        if (confirmRst) axios_memberDeleteConfirm();
    };

    // Funtion -----------------------------------------------------------------------------------------------------------
    async function axios_memberDeleteConfirm() {
        setLoaingModalShow(true);
        try {
            const response = await axios.get(`${SERVER_URL.SERVER_URL()}/member/delete`, {
                params: {
                    id: loginedId,
                },
            });

            if (response.data === 'error') {
                alert('서버 오류로 회원 탈퇴에 실패했습니다.');
                setLoaingModalShow(false);
                return;
            }

            alert('회원 탈퇴가 완료되었습니다.');
            setLoaingModalShow(false);
            navigate('/');
        } catch (error) {
            console.log(error);
            alert('통신 오류가 발생헀습니다.');
            setLoaingModalShow(false);
        }
    }

    // Veiw -----------------------------------------------------------------------------------------------------------
    return (
        <article>
            <div className="member_delete_wrap">
                <div className="title">
                    <h2>회원탈퇴 안내</h2>
                </div>
                <div className="caution_txt">
                    회원님, 저희 서비스를 이용해 주셔서 감사합니다. 회원 탈퇴 전에 다음 사항을 꼭 확인해 주시기
                    바랍니다.
                </div>
                <div className="caution_list">
                    1. 탈퇴 시 회원님의 모든 개인정보와 서비스 이용 기록은 복구 불가능하게 삭제됩니다. <br />
                    2. 탈퇴 후 동일한 아이디로 재가입이 불가능하며, 신규 회원으로 가입하셔야 합니다. <br />
                    3. 소셜 로그인 아이디는 연동이 해제될 뿐, 실제 구글 및 네이버 아이디가 삭제되지 않습니다. <br />
                    4. 유료 서비스 이용 중이시라면 환불이 불가하오니 유의해 주시기 바랍니다. <br />
                    5. 회원 탈퇴 후에는 그동안 적립된 포인트와 쿠폰 등 모든 혜택이 소멸됩니다. <br /> <br />
                    정말로 회원 탈퇴를 진행하시겠습니까?
                </div>
                <div className="btn_wrap">
                    <button onClick={memeberDeleteBtnClick}>회원탈퇴</button>
                </div>
            </div>

            {loadingModalShow === true ? <LoadingModal /> : null}
        </article>
    );
};

export default MemberDelete;
