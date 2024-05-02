import React, { useEffect, useState } from "react" 
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sessionCheck } from "../../../util/sessionCheck";
import axios from "axios";
import { SERVER_URL } from "../../../config/server_url";

function MyWinnigBids() {
    // Hook -----------------------------------------------------------------------------------------------------------
    const sessionId = useSelector(state => state['loginedInfos']['loginedId']['sessionId']);
    const loginedId = useSelector(state => state['loginedInfos']['loginedId']['loginedId']);
    const navigate = useNavigate();

    const [winnigs, setWinnigs] = useState([]);
    
    useEffect(() => {
        sessionCheck(sessionId, navigate);
        ajax_getMyWinnigs();
    })

    // Handler -----------------------------------------------------------------------------------------------------------

    // Fucntion -----------------------------------------------------------------------------------------------------------

    // Axios -----------------------------------------------------------------------------------------------------------
    async function ajax_getMyWinnigs() {
        const response = await axios.post(`${SERVER_URL.SERVER_URL()}/member/get_my_winnigs`,
        { "id" : loginedId })

        if (response.data === 'error') {
            alert('정보를 불러오는데 실패했습니다.');
            return;
        }

        setWinnigs(response.data || []);
    }

    // View -----------------------------------------------------------------------------------------------------------
    return (
        <article>
            <div className="title">
                <h2>내 낙찰 내역</h2>
            </div>

            {
                (winnigs.length > 0) ?

                <div className="winnig_lsit_table">
                    <table>
                        <thead>
                            <tr>
                                <th>상품명</th>
                                <th>이미지</th>
                                <th>시작 금액</th>
                                <th>낙찰 금액</th>
                                <th>낙찰일</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                winnigs.map((winnig, idx) => (
                                    <tr key={idx}>
                                        <td>{winnig.GR_NAME}</td>
                                        <td>이미지들어갈거임</td>
                                        <td>{winnig.GR_PRICE}</td>
                                        <td>{winnig.AR_POINT}</td>
                                        <td>{(winnig.AR_REG_DATE).slice(0, 10)}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>

                :

                <div className="not_winnig">
                    낙찰 내역이 없습니다.
                </div>
            }

        </article>
    );
}

export default MyWinnigBids;