import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sessionCheck } from '../../../util/sessionCheck';
import axios from 'axios';
import { SERVER_URL } from '../../../config/server_url';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../../css/member/mypage/MyWinnigBids.css';
import LoadingModal from '../../include/LoadingModal';

function MyWinnigBids() {
    // Hook -----------------------------------------------------------------------------------------------------------
    const sessionId = useSelector((state) => state['loginedInfos']['loginedId']['sessionId']);
    const loginedId = useSelector((state) => state['loginedInfos']['loginedId']['loginedId']);
    const navigate = useNavigate();

    const [winnigs, setWinnigs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loadingModalShow, setLoaingModalShow] = useState(false);

    useEffect(() => {
        setLoaingModalShow(true);
        sessionCheck(sessionId, navigate);
        ajax_getMyWinnigs(currentPage);
    }, [sessionId, navigate, currentPage]);

    // Handler -----------------------------------------------------------------------------------------------------------
    function pageChangeHandler(page) {
        setCurrentPage(page);
        ajax_getMyWinnigs(page);
    }

    // Axios -----------------------------------------------------------------------------------------------------------
    async function ajax_getMyWinnigs(page) {
        const response = await axios.post(`${SERVER_URL.SERVER_URL()}/member/get_my_winnigs`, {
            id: loginedId,
            page: page,
            limit: 10,
        });

        if (response.data === 'error') {
            alert('정보를 불러오는데 실패했습니다.');
            setLoaingModalShow(false);
            return;
        }

        setWinnigs(response.data.winnigs || []);
        setTotalPages(response.data.totalPages);
        setLoaingModalShow(false);
    }

    // View -----------------------------------------------------------------------------------------------------------
    return (
        <article className="my-winnig-bids">
            <div className="title">
                <h2>내 낙찰 내역</h2>
            </div>

            {winnigs.length > 0 ? (
                <>
                    <div className="winnig-list-table">
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
                                {winnigs.map((winnig, idx) => (
                                    <tr key={idx}>
                                        <td>
                                            {winnig.GR_NAME.length > 20
                                                ? `${winnig.GR_NAME.slice(0, 20)}...`
                                                : winnig.GR_NAME}
                                        </td>
                                        <td>이미지들어갈거임</td>
                                        <td>{winnig.GR_PRICE.toLocaleString()}원</td>
                                        <td>{winnig.AR_POINT.toLocaleString()}원</td>
                                        <td>{winnig.AR_REG_DATE.slice(0, 10)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="pagination">
                        <div className="pre_page">
                            <button onClick={() => pageChangeHandler(currentPage - 1)} disabled={currentPage === 1}>
                                <FontAwesomeIcon icon="fa-solid fa-caret-left" />
                            </button>
                        </div>
                        <div className="page_list">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => pageChangeHandler(page)}
                                    disabled={currentPage === page}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                        <div className="next_page">
                            <button
                                onClick={() => pageChangeHandler(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                <FontAwesomeIcon icon="fa-solid fa-caret-right" />
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <div className="not_wrap">
                    <div className="not-winnig">낙찰 내역이 없습니다.</div>
                    <img src="/img/bid_bird_x.png" id="bidBirdX" />
                </div>
            )}

            {loadingModalShow === true ? <LoadingModal /> : null}
        </article>
    );
}

export default MyWinnigBids;
