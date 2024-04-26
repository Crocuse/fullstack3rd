import React, { useEffect } from "react";

function PointAddForm() {
    const IMP = window.IMP;

    useEffect(() => {
        IMP.init('imp55455045');

    }, []);

    function onClickCertification() {
        IMP.certification({
            pg: "inicis_unified",
            merchant_uid: "store-9eef78c7-0222-4d91-9b80-8eccfdc3ff45",
            popup: false,
        });
    }

    return (
        <>
            <article>
                <div className="add_point_wrap">
                    <div className="add_point_title">
                        <p>포인트 충전</p>
                    </div>
                    <div className="add_point_content">
                        <p>현재 포인트  : </p>
                        <p>본인 인증 후 포인트 결제가 가능합니다.</p>
                    </div>
                    <button onClick={onClickCertification}>본인 인증</button>
                </div>



            </article >
        </>
    );
}

export default PointAddForm;
