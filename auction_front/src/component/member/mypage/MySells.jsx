import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sessionCheck } from '../../../util/sessionCheck';
import axios from 'axios';
import { SERVER_URL } from '../../../config/server_url';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../../css/member/mypage/MySells.css';
import LoadingModal from '../../include/LoadingModal';
import RegistForm from '../../Auction/RegistForm';

function MySells() {
    // Hook -----------------------------------------------------------------------------------------------------------
    const sessionId = useSelector((state) => state['loginedInfos']['loginedId']['sessionId']);
    const loginedId = useSelector((state) => state['loginedInfos']['loginedId']['loginedId']);
    const navigate = useNavigate();

    const [sellsList, setSellsList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [showReRegist, setShowReRegist] = useState(false);
    const [reRegistInfo, setReRegistInfo] = useState();
    const [reRegistNo, setReRegistNo] = useState(0);
    const [loadingModalShow, setLoaingModalShow] = useState(false);

    useEffect(() => {
        setLoaingModalShow(true);
        sessionCheck(sessionId, navigate);
        axios_getMySells(currentPage);
    }, [sessionId, currentPage]);

    useEffect(() => {
        if (reRegistNo > 0) {
            axios_reRegist();
            axios_getMySells(currentPage);
        }
    }, [reRegistNo]);

    // Handler -----------------------------------------------------------------------------------------------------------
    function pageChangeHandler(page) {
        setCurrentPage(page);
        axios_getMySells(page);
    }

    function reRegistBtnClick(registDefault) {
        setShowReRegist(true);
        setReRegistInfo(registDefault);
    }

    // Axios -----------------------------------------------------------------------------------------------------------
    async function axios_getMySells(page) {
        try {
            const response = await axios.post(`${SERVER_URL.SERVER_URL()}/member/get_my_sells`, {
                id: loginedId,
                page: page,
                limit: 10,
            });

            if (response.data === 'error') {
                alert('정보를 불러오는데 실패했습니다.');
                setLoaingModalShow(false);
                return;
            }

            setSellsList(response.data.list || []);
            setTotalPages(response.data.totalPages);
            setLoaingModalShow(false);
        } catch (error) {
            console.log(error);
            alert('통신 오류가 발생했습니다.');
            setLoaingModalShow(false);
        }
    }

    async function axios_reRegist() {
        try {
            const response = await axios.put(`${SERVER_URL.SERVER_URL()}/member/reRegist`, {
                GR_NO: reRegistNo,
            });

            if (response.data === false) {
                alert('서버 오류로 재등록에 실패했습니다.');
                return;
            }
        } catch (error) {
            alert('서버 오류로 재등록에 실패했습니다.');
        }
    }

    // View -----------------------------------------------------------------------------------------------------------
    return (
        <article className="my-sells">
            <div className="title">
                <h2>내 판매 내역</h2>
            </div>

            {sellsList.length === 0 ? (
                <div className="not_wrap">
                    <div className="not-sell">판매 내역이 없습니다.</div>
                    <img src="/img/bid_bird_x.png" id="bidBirdX" />
                </div>
            ) : (
                <>
                    <div className="sells-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>상품명</th>
                                    <th>등록 금액</th>
                                    <th>경매일</th>
                                    <th>경매 결과</th>
                                    <th>최종 판매 금액</th>
                                    <th>재등록 신청</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sellsList.map((list, idx) => (
                                    <tr key={idx}>
                                        <td>
                                            {list.GR_NAME.length > 20
                                                ? `${list.GR_NAME.slice(0, 20)}...`
                                                : list.GR_NAME}
                                        </td>
                                        <td>{`${list.GR_PRICE.toLocaleString()}원`}</td>
                                        <td>{list.AR_REG_DATE.slice(0, 10)}</td>
                                        <td>{list.AR_IS_BID === 0 ? `유찰` : `낙찰`}</td>
                                        <td>
                                            {list.AR_POINT === null || list.AR_POINT === 0
                                                ? null
                                                : `${list.AR_POINT.toLocaleString()}원`}
                                        </td>
                                        <td>
                                            {list.AR_RE_REGIST === 1 ? (
                                                `재등록 완료`
                                            ) : list.AR_IS_BID === 0 ? (
                                                <>
                                                    <a href="#none" onClick={() => reRegistBtnClick(list)}>
                                                        재등록
                                                    </a>
                                                </>
                                            ) : null}
                                        </td>
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
            )}

            {showReRegist === true ? (
                <div className="regist_modal_wrap">
                    <div className="regist_modal">
                        <div className="close_btn" onClick={() => setShowReRegist(false)}>
                            <FontAwesomeIcon icon="fa-solid fa-times" />
                        </div>
                        <RegistForm
                            reRegistInfo={reRegistInfo}
                            setReRegistNo={setReRegistNo}
                            setShowReRegist={setShowReRegist}
                        />
                    </div>
                </div>
            ) : null}

            {loadingModalShow === true ? <LoadingModal /> : null}
        </article>
    );
}

export default MySells;
