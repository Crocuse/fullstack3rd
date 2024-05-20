import '../../css/Admin/QnaAnswer.css';
import React, { useEffect, useState } from 'react';
import '../../css/Customer_center/Qna.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sessionCheck } from '../../util/sessionCheck';
import LoadingModal from '../include/LoadingModal';
import axios from 'axios';
import { SERVER_URL } from '../../config/server_url';
import QnaBoard from './QnaBoard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const QnaAwnser = () => {
    // Hook ------------------------------------------------------------------------------------------------------------------------
    const sessionId = useSelector((state) => state['loginedInfos']['loginedId']['sessionId']);
    const navigate = useNavigate();

    const [qnaList, setQnaList] = useState([]);
    const [loadingModalShow, setLoaingModalShow] = useState(false);
    const [selectQna, setSelectQna] = useState(-1);
    const [temp, setTemp] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');

    useEffect(() => {
        sessionCheck(sessionId, navigate);
        axios_getQnalist(currentPage, sortColumn, sortOrder);
    }, [sessionId, navigate, temp, currentPage, selectQna, sortColumn, sortOrder]);

    // Handler ------------------------------------------------------------------------------------------------------------------------

    const qnalistClick = (idx) => {
        setSelectQna(idx);
    };

    function pageChangeHandler(page) {
        setCurrentPage(page);
        axios_getQnalist(page);
    };

    const sortQnaList = (list, sortColumn, sortOrder) => {
        const sortedList = [...list];
      
        if (sortColumn) {
          sortedList.sort((a, b) => {
            const valueA = a[sortColumn];
            const valueB = b[sortColumn];
      
            if (valueA === null) return sortOrder === 'asc' ? 1 : -1;
            if (valueB === null) return sortOrder === 'asc' ? -1 : 1;
      
            if (typeof valueA === 'string') {
              return sortOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
            } else {
              return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
            }
          });
        }
      
        return sortedList;
      };

      const handleSort = (column) => {
        if (sortColumn === column) {
          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
          setSortColumn(column);
          setSortOrder('asc');
        }
    };

    // Axios ------------------------------------------------------------------------------------------------------------------------
    async function axios_getQnalist(page) {
        try {
          const response = await axios.get(`${SERVER_URL.SERVER_URL()}/admin/QnaList`, {
            params: {
              page: page,
              limit: 10,
            },
          });
      
          if (response.data === false) {
            return;
          }
          const sortedList = sortQnaList(response.data.list, sortColumn, sortOrder);
          setQnaList(sortedList);
          setTotalPages(response.data.totalPages);
        } catch (error) {
          console.log(error);
          alert('통신 에러가 발생했습니다.');
          return;
        }
    };

    // View ------------------------------------------------------------------------------------------------------------------------
    return (
        <article>
            <div className="qna_answer_wrap">
                <h2>문의내역</h2>
                <table className="qna_list">
                <tr>
                    <th onClick={() => handleSort('Q_NO')}>문의번호</th>
                    <th onClick={() => handleSort('M_ID')}>아이디</th>
                    <th onClick={() => handleSort('Q_REG_DATE')}>문의일시</th>
                    <th>문의명</th>
                    <th onClick={() => handleSort('Q_ANSWER')}>처리결과</th>
                    <th onClick={() => handleSort('Q_ANSWER_DATE')}>답변일시</th>
                </tr>
                    {qnaList.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="no_qna">
                                문의 내역이 없습니다.
                            </td>
                        </tr>
                    ) : (
                        qnaList.map((qna, idx) => {
                            return (
                                <tr key={idx} onClick={() => qnalistClick(idx)}>
                                    <td>{qna.Q_NO}</td>
                                    <td>{qna.M_ID}</td>
                                    <td>{qna.Q_REG_DATE.slice(0, 10)}</td>
                                    <td>{qna.Q_TITLE.length > 20 ? `${qna.Q_TITLE.slice(0, 20)}...` : qna.Q_TITLE}</td>
                                    <td>{qna.Q_ANSWER === null ? '답변대기중' : '답변완료'}</td>
                                    <td>
                                        {qna.Q_ANSWER_DATE === null ? '답변대기중' : qna.Q_ANSWER_DATE.slice(0, 10)}
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </table>

                {selectQna < 0 ? null : (
                    <>
                        <div className="select_qna_wrap">
                            <table className="select_qna">
                                <tr>
                                    <td colSpan={2}>문의</td>
                                </tr>
                                <tr>
                                    <td>문의명</td>
                                    <td>{qnaList[selectQna].Q_TITLE}</td>
                                </tr>
                                <tr>
                                    <td>문의일시</td>
                                    <td>{qnaList[selectQna].Q_REG_DATE}</td>
                                </tr>
                                <tr>
                                    <td>문의내용</td>
                                    <td dangerouslySetInnerHTML={{ __html: qnaList[selectQna].Q_HTML }}></td>
                                </tr>
                                {qnaList[selectQna].Q_ANSWER === null ? null : (
                                    <>
                                        <tr>
                                            <td colSpan={2}>답변</td>
                                        </tr>
                                        <tr>
                                            <td>답변일시</td>
                                            <td>{qnaList[selectQna].Q_ANSWER_DATE}</td>
                                        </tr>
                                        <tr>
                                            <td>답변내용</td>
                                            <td dangerouslySetInnerHTML={{ __html: qnaList[selectQna].Q_ANSWER }}></td>
                                        </tr>
                                    </>
                                )}
                            </table>
                        </div>

                        {qnaList[selectQna].Q_ANSWER === null ? (
                            <QnaBoard
                                setLoaingModalShow={setLoaingModalShow}
                                setSelectQna={setSelectQna}
                                q_no={qnaList[selectQna].Q_NO}
                                setTemp={setTemp}
                            />
                        ) : null}
                    </>
                )}

                <div className="pagination">
                    <div className="pre_page">
                        <button onClick={() => pageChangeHandler(currentPage - 1)} disabled={currentPage === 1}>
                            <FontAwesomeIcon icon="fa-solid fa-caret-left" />
                        </button>
                    </div>
                    <div className="page_list">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button key={page} onClick={() => pageChangeHandler(page)} disabled={currentPage === page}>
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
                        </button>{' '}
                    </div>
                </div>

                {loadingModalShow === true ? <LoadingModal /> : null}
            </div>
        </article>
    );
};

export default QnaAwnser;
