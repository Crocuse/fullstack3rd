import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sessionCheck } from '../../../util/sessionCheck';
import axios from 'axios';
import { SERVER_URL } from '../../../config/server_url';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../../css/member/mypage/MyRegist.css';
import LoadingModal from '../../include/LoadingModal';
import $ from 'jquery';
import RegistForm from '../../Auction/RegistForm';

function MyRegist() {
    // Hook -----------------------------------------------------------------------------------------------------------
    const sessionId = useSelector((state) => state['loginedInfos']['loginedId']['sessionId']);
    const loginedId = useSelector((state) => state['loginedInfos']['loginedId']['loginedId']);
    const navigate = useNavigate();

    const [registList, setRegistList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loadingModalShow, setLoaingModalShow] = useState(false);
    const [temp, setTemp] = useState(false);
    const [showRjReason, setShowRjReason] = useState(false);
    const [selectedIdx, setSelectedIdx] = useState(0);
    const [modifyGoods, setModifyGoods] = useState([]);
    const [showModifyModal, setShowModifyModal] = useState(false);

    useEffect(() => {
        setLoaingModalShow(true);
        sessionCheck(sessionId, navigate);
        axios_getMyRegistList(currentPage);
    }, [sessionId, navigate, currentPage, temp]);

    useEffect(() => {
        if (showRjReason) {
            reasonModalPutInfo(selectedIdx);
        }
    }, [showRjReason, selectedIdx]);

    // Handler -----------------------------------------------------------------------------------------------------------
    function pageChangeHandler(page) {
        setCurrentPage(page);
        axios_getMyRegistList(page);
    }

    function registCancelClick(GR_NO) {
        let confirm = window.confirm('해당 경매 등록 신청을 취소하시겠습니까?');
        if (!confirm) return;

        setLoaingModalShow(true);
        axios_cancelGoods(GR_NO);
    }

    function showRjReasonClick(idx) {
        setSelectedIdx(idx);
        setShowRjReason(true);
    }

    function reasonModalCloseBtn() {
        setShowRjReason(false);
    }

    function registModifyClick(GR_NO) {
        let confirm = window.confirm('해당 경매를 수정하시겠습니까?');
        if (!confirm) return;

        setLoaingModalShow(true);
        axios_modifyGoods(GR_NO);
    }

    // Funtion -----------------------------------------------------------------------------------------------------------
    function reasonModalPutInfo(idx) {
        $('.info_table td.GR_NAME').html(registList[idx].GR_NAME);
        $('.info_table td.GR_PRICE').html(registList[idx].GR_PRICE.toLocaleString());
        $('.info_table td.GR_INFO').html(registList[idx].GR_INFO);
        $('.info_table td.GR_REGGR_REJECTED_REASON').html(registList[idx].GR_REJECTED_REASON);
        $('.goods_info .img').html(`<img src="${SERVER_URL.SERVER_URL()}/goodsImg/${registList[idx].GI_NAME}">`);
    }

    // Axios -----------------------------------------------------------------------------------------------------------
    async function axios_getMyRegistList(page) {
        try {
            const response = await axios.post(`${SERVER_URL.SERVER_URL()}/member/get_my_regist_list`, {
                id: loginedId,
                page: page,
                limit: 10,
            });
            if (response.data === 'error') {
                alert('정보를 불러오는데 실패했습니다.');
                setLoaingModalShow(false);
                return;
            } else if (response.data.list.length === 0) {
                setLoaingModalShow(false);
                return;
            }
            setRegistList(response.data.list);
            setTotalPages(response.data.totalPages);
            setLoaingModalShow(false);
        } catch (error) {
            console.log(error);
            alert('통신 오류가 발생했습니다.');
            setLoaingModalShow(false);
        }
    }

    async function axios_cancelGoods(GR_NO) {
        try {
            const response = await axios.get(`${SERVER_URL.SERVER_URL()}/member/cancel_goods`, {
                params: {
                    gr_no: GR_NO,
                },
            });

            if (response.data === 'error') {
                alert('서버 오류로 처리에 실패했습니다.');
                setLoaingModalShow(false);
                return;
            }

            setTemp((temp) => !temp);
            setLoaingModalShow(false);
            alert('경매 물품 등록 신청이 취소되었습니다.');
        } catch (error) {
            console.log(error);
            alert('통신 오류가 발생했습니다.');
            setLoaingModalShow(false);
        }
    }

    async function axios_modifyGoods(GR_NO) {
        try {
            const response = await axios.get(`${SERVER_URL.SERVER_URL()}/member/modify_goods_select`, {
                params: {
                    gr_no: GR_NO,
                },
            });
            console.log(response.data);
            setModifyGoods(response.data);
            setShowModifyModal(true);
        } catch (error) {
            console.log(error);
            alert('통신 오류가 발생했습니다.');
        } finally {
            setLoaingModalShow(false);
        }
    }

    // View -----------------------------------------------------------------------------------------------------------
    return (
        <article className="my-regist">
            <div className="title">
                <h2>내 경매 등록 내역</h2>
            </div>

            <div className="regist_list_wrap">
                {registList.length === 0 ? (
                    <div className="not_wrap">
                        <div>등록 신청 내역이 없습니다.</div>
                        <img src="/img/bid_bird_x.png" id="bidBirdX" />
                    </div>
                ) : (
                    <>
                        <div className="list-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>상품명</th>
                                        <th>가격</th>
                                        <th>설명</th>
                                        <th>승인상태</th>
                                        <th>발송상태</th>
                                        <th>경매일</th>
                                        <th>수정</th>
                                        <th>등록취소</th>
                                        <th>안내</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {registList.map((list, idx) => (
                                        <tr key={idx}>
                                            <td>
                                                {list.GR_NAME.length > 15
                                                    ? `${list.GR_NAME.slice(0, 15)}...`
                                                    : list.GR_NAME}
                                            </td>
                                            <td>{list.GR_PRICE.toLocaleString()}원</td>
                                            <td>
                                                {list.GR_INFO.length > 15
                                                    ? `${list.GR_INFO.slice(0, 15)}...`
                                                    : list.GR_INFO}
                                            </td>
                                            <td>
                                                {list.GR_APPROVAL === 0
                                                    ? '승인 대기중'
                                                    : list.GR_APPROVAL === 1
                                                    ? '승인 완료'
                                                    : '반려'}
                                            </td>
                                            <td>{list.GR_RECEIPT === 0 ? '발송 대기중' : '물품 수령'}</td>
                                            <td>{list.AS_START_DATE === null ? '-' : list.AS_START_DATE}</td>
                                            <td>
                                                {list.GR_RECEIPT === 0 && list.GR_APPROVAL === 0 ? (
                                                    <a href="#none" onClick={() => registModifyClick(list.GR_NO)}>
                                                        수정
                                                    </a>
                                                ) : null}
                                            </td>
                                            <td>
                                                {list.GR_APPROVAL === 0 || list.GR_RECEIPT === 0 ? (
                                                    <a href="#none" onClick={() => registCancelClick(list.GR_NO)}>
                                                        취소
                                                    </a>
                                                ) : null}
                                            </td>
                                            <td>
                                                {list.GR_APPROVAL === 0 ? (
                                                    '관리자 승인 대기중입니다.'
                                                ) : list.GR_APPROVAL === 2 ? (
                                                    <>
                                                        물품 등록이 반려 되었습니다. <br />{' '}
                                                        <a href="#none" onClick={() => showRjReasonClick(idx)}>
                                                            반려 사유 보기
                                                        </a>
                                                    </>
                                                ) : list.GR_RECEIPT === 0 ? (
                                                    <>
                                                        물품이 수령되지 않았습니다. <br /> 물품 수령 후 경매일이
                                                        등록됩니다.
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
            </div>

            {showRjReason === true ? (
                <div className="reason_modal_wrap">
                    <div className="reason_modal">
                        <div className="close_bar">
                            <div className="close" onClick={reasonModalCloseBtn}>
                                CLOSE
                            </div>
                        </div>
                        <div className="goods_info">
                            <div className="img"></div>
                            <div className="info_table">
                                <table>
                                    <tr>
                                        <td>등록명</td>
                                        <td className="GR_NAME"></td>
                                    </tr>
                                    <tr>
                                        <td>등록가격</td>
                                        <td className="GR_PRICE"></td>
                                    </tr>
                                    <tr>
                                        <td>물품 설명</td>
                                        <td className="GR_INFO"></td>
                                    </tr>
                                    <tr className="last_tr">
                                        <td>반려사유</td>
                                        <td className="GR_REGGR_REJECTED_REASON"></td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
            {showModifyModal === true ? (
                <div className="regist_modal_wrap">
                    <div className="regist_modal">
                        <div className="close_btn" onClick={() => setShowModifyModal(false)}>
                            <FontAwesomeIcon icon="fa-solid fa-times" />
                        </div>
                        <RegistForm
                            modifyGoods={modifyGoods}
                            setShowModifyModal={setShowModifyModal}
                            isModify={true}
                            setTemp={setTemp}
                        />
                    </div>
                </div>
            ) : null}
            {loadingModalShow === true ? <LoadingModal /> : null}
        </article>
    );
}

export default MyRegist;
