import axios from "axios";
import React, { useEffect } from "react";
import { SERVER_URL } from "../../config/server_url";
import { loginedInfoReducer } from "../../redux/reducer/loginedInfoReducer";

function PointAddForm() {
    const IMP = window.IMP;

    useEffect(() => {

        axios_point_add_page();
        IMP.init('imp55455045');

    }, []);

    async function axios_point_add_page () {
        console.log('[POINT ADD FORM.JSX] axios_point_add_page()');

        try {
            let response = await axios.post(`${SERVER_URL.SERVER_URL()}/point/pointAddForm`, {
                loginedInfoReducer
            });
            
        } catch (error) {
            console.log(error);
        }
    }
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
                        <p>현재 포인트  : <span></span> </p>
                        <p>본인 인증 후 포인트 결제가 가능합니다.</p>
                    </div>
                    <button onClick={onClickCertification}>본인 인증</button>
                </div>



            </article >
        </>
    );
}

export default PointAddForm;
