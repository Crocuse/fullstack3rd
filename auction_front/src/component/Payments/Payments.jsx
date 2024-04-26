import React, { useEffect } from "react";


function Payments() {

    useEffect(() => {
        const IMP = window.IMP;
        window.IMP.init("imp55455045");

    }, []);


    // IMP.certification(param, callback) 호출
    IMP.certification(
        {
            // param
            pg: "inicis_unified.{MIIiasTest}", //본인인증 설정이 2개이상 되어 있는 경우 필수
            merchant_uid: "ORD20180131-0000011", // 주문 번호
            m_redirect_url: "{리디렉션 될 URL}", // 모바일환경에서 popup:false(기본값) 인 경우 필수, 예: https://www.myservice.com/payments/complete/mobile
            popup: false, // PC환경에서는 popup 파라미터가 무시되고 항상 true 로 적용됨
        },
        function (rsp) {
            // callback
            if (rsp.success) {
                // 인증 성공 시 로직
            } else {
                // 인증 실패 시 로직
            }
        },
    );

    return (
        <>

        </>
    );
}

export default Payments;