import axios from "axios";
import React, { useEffect, useState } from "react";
import { SERVER_URL } from "../../config/server_url";
import { loginedInfoReducer } from "../../redux/reducer/loginedInfoReducer";
import { useDispatch, useSelector } from "react-redux";
import CertificationAPI from "./CertificationAPI";
import PayAPI from "./PayAPI";
import { type } from "@testing-library/user-event/dist/type";

function PointAddForm() {
    const loginedId = useSelector(state => state.loginedInfos.loginedId.loginedId);

    const dispatch = useDispatch();
    const [addPoint, setAddPoint] = useState('');

    useEffect(() => {

        axios_point_add_page();

    }, []);

    const addPointEvent = (e) => {

        setAddPoint(e.target.value);

    }

    async function axios_point_add_page() {
        console.log('[POINT ADD FORM.JSX] axios_point_add_page()');

        console.log('loginedId--->', loginedId);
        console.log('addPoint--->', addPoint);

        try {
            const response = await axios.post(`${SERVER_URL.SERVER_URL()}/point/pointAddForm`, {
                loginedId: loginedId,
                addPoint: addPoint,
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
                        <span>현재 포인트 : </span>
                        <input type="text" name="currentPoint" readOnly value="88570" />P <br />
                        <span>포인트 충전 : </span>
                        <input type="text" name="addPoint" value={addPoint} onChange={(e) => addPointEvent(e)} placeholder="포인트 충전 금액을 입력하세요." />원 <br />
                    </div>
                    {/* <CertificationAPI /> */}
                    <PayAPI />
                </div>



            </article >
        </>
    );
}

export default PointAddForm;
