import axios from "axios";
import React, { useEffect, useState } from "react";
import { SERVER_URL } from "../../config/server_url";
import { useDispatch, useSelector } from "react-redux";
import CertificationAPI from "./CertificationAPI";
import PayAPI from "./PayAPI";
import { useNavigate } from "react-router-dom";
import { sessionCheck } from "../../util/sessionCheck"
import { addPoint } from "../../redux/action/addPoint";

function PointAddForm() {
    const sessionId = useSelector(state => state['loginedInfos']['loginedId']['sessionId']);
    const navigate = useNavigate();

    const loginedId = useSelector(state => state.loginedInfos.loginedId.loginedId);

    const dispatch = useDispatch();
    const [chargeAmount, setChargeAmount] = useState('');
    const [currenPoint, setCurrentPoint] = useState('');

    useEffect(() => {
        sessionCheck(sessionId, navigate);
        axios_get_my_point();

    }, []);

    const chargeAmountHandler = (e) => {
        setChargeAmount(e.target.value);
    }

    async function axios_get_my_point() {
        console.log('[POINT ADD FORM.JSX] axios_get_my_point()');

        try {
            const response = await axios.post(`${SERVER_URL.SERVER_URL()}/point/getMyPoint`, {
                loginedId: loginedId,
            });

            if (response.data.message == "error") {
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
            <article>
                <div className="add_point_wrap">
                    <div className="add_point_title">
                        <p>포인트 충전</p>
                    </div>
                    <div className="add_point_content">
                        <span>현재 포인트 : </span>
                        <input type="text" name="currentPoint" readOnly value={currenPoint} />P <br />
                        <span>포인트 충전 : </span>
                        <input type="text" name="chargeAmount" value={chargeAmount} onChange={(e) => chargeAmountHandler(e)} placeholder="포인트 충전 금액을 입력하세요." />원 <br />
                    </div>
                    {/* <CertificationAPI /> */}
                    <PayAPI chargeAmount={chargeAmount} />
                </div>



            </article >
        </>
    );
}

export default PointAddForm;
