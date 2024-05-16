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
        const inputValue = e.target.value.replace(/,/g, '');
        const numberValue = Number(inputValue);
        setChargeAmount(numberValue.toLocaleString());
    };

    const resetChargeAmount = () => {
        setChargeAmount('');
    };

    async function axios_get_my_point() {
        console.log('[POINT ADD FORM.JSX] axios_get_my_point()');

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
            </article>
        </>
    );
}

export default PointAddForm;
