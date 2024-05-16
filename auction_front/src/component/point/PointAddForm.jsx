import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { SERVER_URL } from '../../config/server_url';
import { useSelector } from 'react-redux';
import CertificationAPI from './CertificationAPI';
import PayAPI from './PayAPI';
import { useNavigate } from 'react-router-dom';
import { sessionCheck } from '../../util/sessionCheck';
import '../../css/Point/point.css';

function PointAddForm() {
    const sessionId = useSelector((state) => state['loginedInfos']['loginedId']['sessionId']);
    const navigate = useNavigate();

    const loginedId = useSelector((state) => state.loginedInfos.loginedId.loginedId);
    const [chargeAmount, setChargeAmount] = useState('');
    const [currentPoint, setCurrentPoint] = useState('');
    const chargeInputRef = useRef(null);

    useEffect(() => {
        sessionCheck(sessionId, navigate);
        axios_get_my_point();
    }, []);

    const chargeAmountHandler = (e) => {
        const inputValue = e.target.value.replace(/[^0-9]/g, '');
        const numberValue = Number(inputValue);
        setChargeAmount(numberValue.toLocaleString());
    };

    const resetChargeAmount = () => {
        setChargeAmount('');
    };

    async function axios_get_my_point() {
        try {
            const response = await axios.post(`${SERVER_URL.SERVER_URL()}/point/getMyPoint`, {
                loginedId: loginedId,
            });
            if (response.data === 'err') {
                setCurrentPoint('ERROR');
            }

            if (response.data.message === '0') {
                setCurrentPoint('0');
            }

            if (response.data.currentPoint > 0) {
                setCurrentPoint(response.data.currentPoint);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <article className="point_article">
                <div className="add_point_wrap">
                    <div className="add_point_title">
                        <p>포인트 충전</p>
                    </div>
                    <div className="add_point_content">
                        <div>
                            <span className="span_txt">현재 포인트 : </span>
                            <input
                                type="text"
                                className="poin_page_input"
                                readOnly
                                value={currentPoint.toLocaleString()}
                            />
                            <span className="span_txt">P</span> <br />
                        </div>
                        <div>
                            <span className="span_txt">포인트 충전 : </span>
                            <input
                                ref={chargeInputRef}
                                type="text"
                                className="poin_page_input"
                                value={chargeAmount}
                                onChange={(e) => chargeAmountHandler(e)}
                                placeholder="포인트 충전 금액을 입력하세요."
                            />
                            <span className="span_txt">원</span> <br />
                        </div>
                    </div>
                    {/* <CertificationAPI /> */}
                    <div className="point_btn_wrap">
                        <PayAPI
                            chargeAmount={chargeAmount}
                            resetChargeAmount={resetChargeAmount}
                            chargeInputRef={chargeInputRef}
                            axios_get_my_point={axios_get_my_point}
                        />
                    </div>
                </div>
                <div className="notion">
                    <h3 className="notion-title">포인트 충전 안내 및 주의사항</h3>
                    <ul className="notion-list">
                        <li>포인트 충전은 신용카드, 계좌이체, 휴대폰 결제 등 다양한 결제수단으로 가능합니다.</li>
                        <li>결제 전 반드시 충전 금액과 결제 수단을 다시 한번 확인해 주세요.</li>
                        <li>무단 결제 방지를 위해 결제 비밀번호를 타인에게 노출하지 말아 주세요.</li>
                        <li>충전된 포인트의 유효기간은 충전일로부터 1년이며, 유효기간 만료 시 자동 소멸됩니다.</li>
                        <li>충전한 포인트는 현금으로 환불이 불가능하며, 상품 구매 시에만 사용 가능합니다.</li>
                        <li>포인트 충전 내역 및 사용 내역은 마이페이지에서 확인 가능합니다.</li>
                        <li>포인트 관련 기타 문의사항은 고객센터를 이용해 주시기 바랍니다.</li>
                    </ul>
                </div>
            </article>
        </>
    );
}

export default PointAddForm;
