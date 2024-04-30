import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { SERVER_URL } from "../../config/server_url";
import axios from "axios";

function PayAPI({ chargeAmount }) {
    const IMP = window.IMP;
    const loginedId = useSelector(state => state.loginedInfos.loginedId.loginedId);

    useEffect(() => {
        IMP.init('imp55455045');

    }, [chargeAmount]);

    function pointAddBtn() {
        console.log('chargeAmount', chargeAmount);

        if (!chargeAmount || chargeAmount === '0') {
            alert("포인트 충전 금액을 입력하세요.");
            return;
        }
        IMP.request_pay(
            {
                pg: "html5_inicis.INIpayTest",
                pay_method: "card, trans, phone, vbank, kakaopay, tosspay",
                name: "포인트 충전",
                amount: chargeAmount,
                buyer_name: loginedId,
            },
            function (rsp) { // callback
                if (rsp.success) {
                    axios_set_point_info();

                } else {
                    console.log(rsp);
                }
            });
    }

    async function axios_set_point_info() {
        console.log('[PayAPI.jsx] axios_set_point_info()');

        try {
            const response = await axios.post(`${SERVER_URL.SERVER_URL()}/point/setPointInfo`, {
                loginedId: loginedId,
                chargeAmount: chargeAmount,
                history: "충전",
            });

            if (response.data === "success") {
                alert("충전되었습니다.");
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>

            <input type="button" onClick={pointAddBtn} value='포인트 충전' />

        </>
    );
}

export default PayAPI;