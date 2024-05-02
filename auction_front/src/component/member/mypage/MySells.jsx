import React, { useEffect, useState } from "react" 
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sessionCheck } from "../../../util/sessionCheck";
import axios from "axios";
import { SERVER_URL } from "../../../config/server_url";

function MySells() {
    // Hook -----------------------------------------------------------------------------------------------------------
    const sessionId = useSelector(state => state['loginedInfos']['loginedId']['sessionId']);
    const loginedId = useSelector(state => state['loginedInfos']['loginedId']['loginedId']);
    const navigate = useNavigate();

    const [sellsList, setSellsList] = useState([]);
    
    useEffect(() => {
        sessionCheck(sessionId, navigate);
        axios_getMySells();
    }, [])

    // Handler -----------------------------------------------------------------------------------------------------------

    // Fucntion -----------------------------------------------------------------------------------------------------------

    // Axios -----------------------------------------------------------------------------------------------------------
    async function axios_getMySells() {
        try {
            const response = await axios.post(`${SERVER_URL.SERVER_URL()}/member/get_my_sells`,
            {"id" : loginedId})

            if (response.data === 'error') {
                alert('정보를 불러오는데 실패했습니다.');
                return;
            }

            setSellsList(response.data);
            
        } catch (error) {
            console.log(error);
            alert('통신 오류가 발생했습니다.')
        }
    }

    // View -----------------------------------------------------------------------------------------------------------
    return (
        <article>
            <div className="title">
                <h2>내 판매 내역</h2>
            </div>

            {
                (sellsList.length === 0) ?
                <div className="not_sell">
                    판매 내역이 없습니다.
                </div>
                :
                <div className="sells_table">
                    <table>
                        <thead>
                            <tr>
                                <th>상품명</th>
                                <th>이미지</th>
                                <th>등록 금액</th>
                                <th>경매일</th>
                                <th>경매 결과</th>
                                <th>최종 판매 금액</th>
                                <th>재등록 신청</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                sellsList.map((list, idx) => (
                                    <tr key={idx}>
                                        <td>{list.GR_NAME}</td>
                                        <td>
                                            이미지들어갈거임
                                        </td>
                                        <td>{`${(list.GR_PRICE).toLocaleString()}원`}</td>
                                        <td>{(list.AR_REG_DATE).slice(0, 10)}</td>
                                        <td>{(list.AR_IS_BID === 0) ? `유찰` : `낙찰`}</td>
                                        <td>
                                            {(list.AR_POINT === null || list.AR_POINT === 0) ? null : `${(list.AR_POINT).toLocaleString()}원`}
                                        </td>
                                        <td>{(list.AR_IS_BID === 0) ? (<><a href="#none">재등록</a></>) : null}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            }
        </article>
    );
}

export default MySells;