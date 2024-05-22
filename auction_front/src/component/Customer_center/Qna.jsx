import React, { useEffect, useState } from 'react';
import Board from './Board';
import '../../css/Customer_center/Qna.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sessionCheck } from '../../util/sessionCheck';
import LoadingModal from '../include/LoadingModal';
import axios from 'axios';
import { SERVER_URL } from '../../config/server_url';

const Qna = () => {
    // Hook ------------------------------------------------------------------------------------------------------------------------
    const sessionId = useSelector((state) => state['loginedInfos']['loginedId']['sessionId']);
    const loginedId = useSelector((state) => state['loginedInfos']['loginedId']['loginedId']);
    const navigate = useNavigate();

    const [myQnaList, setMyQnaList] = useState([]);
    const [showEditor, setShowEditor] = useState(false);
    const [loadingModalShow, setLoaingModalShow] = useState(false);
    const [selectQna, setSelectQna] = useState(-1);

    useEffect(() => {
        sessionCheck(sessionId, navigate);
        axios_getMyQnalist();
    }, [sessionId, navigate, myQnaList]);

    // Handler ------------------------------------------------------------------------------------------------------------------------
    const editorShowClick = () => {
        setShowEditor(true);
        setSelectQna(-1);
    };

    const qnalistClick = (idx) => {
        setSelectQna(idx);
    };

    // Axios ------------------------------------------------------------------------------------------------------------------------
    async function axios_getMyQnalist() {
        try {
            const response = await axios.get(`${SERVER_URL.SERVER_URL()}/customer_center/QnaList`, {
                params: {
                    loginedId,
                },
            });

            setMyQnaList(response.data || []);
        } catch (error) {
            alert('통신 오류가 발생헀습니다.');
            console.log(error);
        }
    }

    // View ------------------------------------------------------------------------------------------------------------------------
    return (
        <div className="qna_wrap">
            {showEditor === true ? (
                <Board setShowEditor={setShowEditor} setLoaingModalShow={setLoaingModalShow} />
            ) : (
                <>
                    <h2>내 문의내역</h2>
                    <table className="qna_list">
                        <tr>
                            <th>문의번호</th>
                            <th>문의일시</th>
                            <th>문의명</th>
                            <th>처리결과</th>
                            <th>답변일시</th>
                        </tr>
                        {myQnaList.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="no_qna">
                                    문의 내역이 없습니다.
                                </td>
                            </tr>
                        ) : (
                            myQnaList.map((qna, idx) => {
                                return (
                                    <tr key={idx} onClick={() => qnalistClick(idx)}>
                                        <td>{qna.Q_NO}</td>
                                        <td>{qna.Q_REG_DATE.slice(0, 10)}</td>
                                        <td>
                                            {qna.Q_TITLE.length > 20 ? `${qna.Q_TITLE.slice(0, 20)}...` : qna.Q_TITLE}
                                        </td>
                                        <td>{qna.Q_ANSWER === null ? '답변대기중' : '답변완료'}</td>
                                        <td>{qna.Q_ANSWER_DATE === null ? '답변대기중' : qna.Q_ANSWER_DATE}</td>
                                    </tr>
                                );
                            })
                        )}
                    </table>
                    <div className="write_btn">
                        <button onClick={editorShowClick}>문의작성</button>
                    </div>
                </>
            )}

            {selectQna < 0 ? null : (
                <div className="select_qna_wrap">
                    <table className="select_qna">
                        <tr>
                            <td colSpan={2}>문의</td>
                        </tr>
                        <tr>
                            <td>문의명</td>
                            <td>{myQnaList[selectQna].Q_TITLE}</td>
                        </tr>
                        <tr>
                            <td>문의일시</td>
                            <td>{myQnaList[selectQna].Q_REG_DATE}</td>
                        </tr>
                        <tr>
                            <td>문의내용</td>
                            <td dangerouslySetInnerHTML={{ __html: myQnaList[selectQna].Q_HTML }}></td>
                        </tr>
                        {myQnaList[selectQna].Q_ANSWER === null ? null : (
                            <>
                                <tr>
                                    <td colSpan={2}>답변</td>
                                </tr>
                                <tr>
                                    <td>답변일시</td>
                                    <td>{myQnaList[selectQna].Q_ANSWER_DATE}</td>
                                </tr>
                                <tr>
                                    <td>답변내용</td>
                                    <td dangerouslySetInnerHTML={{ __html: myQnaList[selectQna].Q_ANSWER }}></td>
                                </tr>
                            </>
                        )}
                    </table>
                </div>
            )}

            {loadingModalShow === true ? <LoadingModal /> : null}
        </div>
    );
};

export default Qna;
