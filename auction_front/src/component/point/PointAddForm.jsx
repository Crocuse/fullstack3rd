import axios from "axios";
import React, { useEffect } from "react";
import { SERVER_URL } from "../../config/server_url";
import { loginedInfoReducer } from "../../redux/reducer/loginedInfoReducer";
import { useDispatch, useSelector } from "react-redux";
import CertificationAPI from "./CertificationAPI";

function PointAddForm() {
    const loginedId = useSelector(state => state.loginedInfos.loginedId);

    useEffect(() => {

        axios_point_add_page();

    }, []);

    async function axios_point_add_page () {
        console.log('[POINT ADD FORM.JSX] axios_point_add_page()');
        console.log('loginedId====>>>>>',loginedId);

        try {
            let response = await axios.post(`${SERVER_URL.SERVER_URL()}/point/pointAddForm`, {  
                loginedId,
            });
            
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
                        <p>현재 포인트  : <span> </span> </p>
                        <p>본인 인증 후 포인트 결제가 가능합니다.</p>
                    </div>
                   <CertificationAPI />
                </div>



            </article >
        </>
    );
}

export default PointAddForm;
