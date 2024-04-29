import React, { useEffect } from "react";

function PayAPI() {
    const IMP = window.IMP;

    useEffect(() => {
        IMP.init('imp55455045');

    }, []);

    function pointAddBtn() {
        IMP.request_pay(
            {
                pg: "html5_inicis.INIpayTest",
                pay_method: "card, trans, phone, vbank, kakaopay, tosspay",
                name: "포인트 충전",
                amount: 100,
                buyer_email: "gildong@gmail.com",
                buyer_name: "홍길동",
                buyer_tel: "010-4242-4242",
                buyer_addr: "서울특별시 강남구 신사동",
                buyer_postcode: "01181",
            },
            function (rsp) { // callback
                if (rsp.success) {
                    console.log(rsp);

                } else {
                    console.log(rsp);
                }
            });
    }

    return (
        <>

            <input type="button" onClick={pointAddBtn} value='포인트 충전' />

        </>
    );
}

export default PayAPI;