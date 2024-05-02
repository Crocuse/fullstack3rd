import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sessionCheck } from '../../../util/sessionCheck';
import axios from 'axios';
import { SERVER_URL } from '../../../config/server_url';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function MyPoint() {
    // Hook -----------------------------------------------------------------------------------------------------------
    const sessionId = useSelector((state) => state['loginedInfos']['loginedId']['sessionId']);
    const loginedId = useSelector((state) => state['loginedInfos']['loginedId']['loginedId']);
    const navigate = useNavigate();

    const [pointHistory, setPointHistory] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        sessionCheck(sessionId, navigate);
        axois_getMyPointHistory(1);
    });

    // Handler -----------------------------------------------------------------------------------------------------------
    function handlePageChange(page) {
        setCurrentPage(page);
        axois_getMyPointHistory(page);
    }

    // Fucntion -----------------------------------------------------------------------------------------------------------

    // Axios -----------------------------------------------------------------------------------------------------------
    async function axois_getMyPointHistory(page) {
        const response = await axios.post(`${SERVER_URL.SERVER_URL()}/member/get_my_point_history`, {
            id: loginedId,
            page: page,
            limit: 10,
        });

        try {
            if (response.data === 'error') {
                alert('데이터를 불러오는데 실패했습니다.');
            } else {
                setPointHistory(response.data.history || []);
                setTotalPages(response.data.totalPages);
            }
        } catch (error) {
            console.log(error);
            alert('통신 오류가 발생했습니다.');
        }
    }

    // View -----------------------------------------------------------------------------------------------------------
    return (
        <article>
            <div className="title">
                <h2>내 포인트 내역</h2>
            </div>

            <div className="current_table">
                현재 내 포인트
                <span>{pointHistory.length > 0 ? pointHistory[0].P_CURRENT.toLocaleString() : 0}</span>
            </div>

            {pointHistory.length === 0 ? (
                <div className="not_history">포인트 변동 내역이 존재하지 않습니다.</div>
            ) : (
                <div className="point_table">
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
                            {pointHistory.map((point, idx) => (
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
                            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                                <FontAwesomeIcon icon="fa-solid fa-caret-left" />
                            </button>
                        </div>
                        <div className="page_list">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    disabled={currentPage === page}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                        <div className="next_page">
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
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
