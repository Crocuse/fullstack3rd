import React, { useEffect, useState } from "react" 
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sessionCheck } from "../../../util/sessionCheck";
import axios from "axios";
import { SERVER_URL } from "../../../config/server_url";

function MyRegist() {
    // Hook -----------------------------------------------------------------------------------------------------------
    const sessionId = useSelector(state => state['loginedInfos']['loginedId']['sessionId']);
    const loginedId = useSelector(state => state['loginedInfos']['loginedId']['loginedId']);
    const navigate = useNavigate();

    const [registList, setRegistList] = useState([]);
    
    useEffect(() => {
        sessionCheck(sessionId, navigate);
        axios_getMyRegistList();
    }, [])

    // Handler -----------------------------------------------------------------------------------------------------------
    const getYesterday = () => {
        let today = new Date();
        let yesterday = new Date(today.setDate(today.getDate() - 1));

        return yesterday;
    }

    // Fucntion -----------------------------------------------------------------------------------------------------------

    // Axios -----------------------------------------------------------------------------------------------------------
    async function axios_getMyRegistList () {
        try {
            const response  = await axios.post(`${SERVER_URL.SERVER_URL()}/member/get_my_regist_list`,
            { "id" : loginedId });

            console.log("🚀 ~ axios_getMyRegistList ~ response.data:", response.data)

            if (response.data === 'error') {
                alert('정보를 불러오는데 실패했습니다.')
                return;

            } else if (response.data.length === 0) return;

            setRegistList(response.data);

        } catch (error) {
            console.log(error);
            alert('통신 오류가 발생했습니다.')
        }
    }

    // View -----------------------------------------------------------------------------------------------------------
    return (
        <article>
            <div className="title">
                <h2>내 상품 등록 내역</h2>
            </div>

            <div className="regist_list_wrap">
                { (registList.length === 0) ? 
                    <>
                    <div className="no_regist">
                        <p>상품 등록 내역이 없습니다.</p>
                    </div>
                    </>
                : 
                    <>
                    <div className="list_table">
                        <table>
                            <thead>
                                <tr>
                                    <th>상품명</th>
                                    <th>가격</th>
                                    <th>설명</th>
                                    <th>승인상태</th>
                                    <th>발송상태</th>
                                    <th>경매일</th>
                                    <th>등록취소</th>
                                    <th>안내</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registList.map((list, idx) => (
                                    <tr key={idx}>
                                        <td>{list.GR_NAME}</td>
                                        <td>{list.GR_PRICE.toLocaleString()}원</td>
                                        <td>{list.GR_INFO}</td>
                                        <td> 
                                            {list.GR_APPROVAL === 0 ? '승인 대기중' :
                                            list.GR_APPROVAL === 1 ? '승인 완료' : '반려'}
                                        </td>
                                        <td>
                                            {list.GR_RECEIPT === 0 ? '발송 대기중' : '물품 수령'}
                                        </td>
                                        <td>{list.AS_START_DATE === null ? '-' : list.AS_START_DATE}
                                        </td>
                                        <td> <a href="#none">취소</a> </td>
                                        <td>
                                            {
                                                list.GR_APPROVAL === 0 ? ('관리자 승인 대기중입니다.') :
                                                list.GR_APPROVAL === 2 ? (<> 물품 등록이 반려 되었습니다. <a href="#none">반려 사유 보기</a> </>) :
                                                list.GR_RECEIPT === 0 ? ('물품이 수령되지 않았습니다. 물품 수령 후 경매가 등록됩니다.') :
                                                null
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    </>
                }
            </div>
        </article>
    );
}

export default MyRegist;