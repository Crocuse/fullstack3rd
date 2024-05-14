import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sessionCheck } from '../../../util/sessionCheck';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { SERVER_URL } from '../../../config/server_url';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LoadingModal from '../../include/LoadingModal';
import '../../../css/member/mypage/MyPoint.css';

function MyPoint() {
    const sessionId = useSelector((state) => state['loginedInfos']['loginedId']['sessionId']);
    const loginedId = useSelector((state) => state['loginedInfos']['loginedId']['loginedId']);
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        sessionCheck(sessionId, navigate);
    }, [sessionId, navigate]);

    const fetchMyPointHistory = async ({ queryKey }) => {
        const [, page] = queryKey;
        const response = await axios.post(`${SERVER_URL.SERVER_URL()}/member/get_my_point_history`, {
            id: loginedId,
            page,
            limit: 10,
        });
        return response.data;
    };

    const { isLoading, error, data } = useQuery(['myPointHistory', currentPage], fetchMyPointHistory, {
        keepPreviousData: true,
    });

    const pageChangeHandler = (page) => {
        setCurrentPage(page);
    };

    if (isLoading) return <LoadingModal />;

    if (error) return <div>Error: {error.message}</div>;

    const { history, totalPages } = data || {};
    const totalPoint = history?.[0]?.P_CURRENT || 0;

    return (
        <article className="my-point">
            <div className="title">
                <h2>내 포인트 내역</h2>
            </div>

            <div className="current-point">
                현재 내 포인트 :<span>{totalPoint.toLocaleString()}</span>
            </div>

            {history?.length === 0 ? (
                <div className="not-wrap">
                    <div className="not-history">포인트 변동 내역이 존재하지 않습니다.</div>
                    <img src="/img/bid_bird_x.png" alt="No history" id="bidBirdX" />
                </div>
            ) : (
                <div className="point-table">
                    <table>
                        <thead>
                            <tr>
                                <th>포인트 변동일</th>
                                <th>변동 포인트</th>
                                <th>변동 내역</th>
                                <th>변동 후 포인트</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((point, idx) => (
                                <tr key={idx}>
                                    <td>{point.P_REG_DATE}</td>
                                    <td>
                                        {point.P_CHANGE > 0 ? `+${point.P_CHANGE.toLocaleString()}` : point.P_CHANGE}
                                    </td>
                                    <td>{point.P_HISTORY}</td>
                                    <td>{point.P_CURRENT.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

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
                </div>
            )}
        </article>
    );
}

export default MyPoint;
