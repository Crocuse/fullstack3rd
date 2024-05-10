import React, { useEffect, useState } from 'react';
import Board from './Board';
import '../../css/Customer_center/Qna.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sessionCheck } from '../../util/sessionCheck';

const Qna = () => {
    // Hook ------------------------------------------------------------------------------------------------------------------------
    const sessionId = useSelector((state) => state['loginedInfos']['loginedId']['sessionId']);
    const loginedId = useSelector((state) => state['loginedInfos']['loginedId']['loginedId']);
    const navigate = useNavigate();

    const [showWriteBtn, setShowWriteBtn] = useState(true);
    const [myQnaList, setMyQnaList] = useState([]);
    const [showEditor, setShowEditor] = useState(false);

    useEffect(() => {
        sessionCheck(sessionId, navigate);
    }, [sessionId, navigate]);

    // Handler ------------------------------------------------------------------------------------------------------------------------
    const editorShowClick = () => {
        setShowEditor(true);
    };

    // Axios ------------------------------------------------------------------------------------------------------------------------

    // View ------------------------------------------------------------------------------------------------------------------------
    return (
        <div className="qna_wrap">
            {showEditor === true ? (
                <Board setShowEditor={setShowEditor} />
            ) : (
                <>
                    <h2>내 문의내역</h2>
                    <table>
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
                            <></>
                        )}
                    </table>
                    <div className="write_btn">
                        <button onClick={editorShowClick}>문의작성</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Qna;
