// Board.jsx
import React, { useEffect, useRef, useState } from 'react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '@ckeditor/ckeditor5-build-classic/build/translations/ko.js';
import MyUploadAdapter from '../../util/MyUploadAdapter';
import $ from 'jquery';
import axios from 'axios';
import { SERVER_URL } from '../../config/server_url';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sessionCheck } from '../../util/sessionCheck';
import '../../css/Admin/QnaBoard.css';

const QnaBoard = (props) => {
    // Hook ------------------------------------------------------------------------------------------------------------------------
    const editorRef = useRef(null);
    const sessionId = useSelector((state) => state['loginedInfos']['loginedId']['sessionId']);
    const navigate = useNavigate();
    const [editor, setEditor] = useState(null);

    useEffect(() => {
        sessionCheck(sessionId, navigate);

        if (editorRef.current) {
            ClassicEditor.create(editorRef.current, {
                language: 'ko',
                extraPlugins: [MyCustomUploadAdapterPlugin],
            })
                .then((newEditor) => {
                    setEditor(newEditor);
                    console.log('Editor initialized:', newEditor);
                })
                .catch((error) => {
                    console.error('Error initializing editor:', error);
                });
        }

        return () => {
            if (editor) {
                editor.destroy();
            }
        };
    }, [sessionId]);

    // Handler ------------------------------------------------------------------------------------------------------------------------

    const writeQnaClick = () => {
        let editorData = '';

        if (editor) {
            editorData = editor.getData();
        }

        if (editorData === '') {
            alert('답변 내용이 비어있습니다.');
            return;
        } else {
            axios_updateQNA(editorData);
        }
    };

    // Axios ------------------------------------------------------------------------------------------------------------------------
    async function axios_updateQNA(editorData) {
        try {
            const response = await axios.put(`${SERVER_URL.SERVER_URL()}/admin/qna`, {
                editorData,
                q_no: props.q_no,
            });
            if (response.data === true) {
                alert('답변이 등록되었습니다.');
                props.setTemp((temp) => !temp);
            } else {
                alert('서버 오류로 답변 등록에 실패했습니다.');
            }
        } catch (error) {
            alert('통신 에러가 발생했습니다.');
        }
    }

    // View ------------------------------------------------------------------------------------------------------------------------
    return (
        <div className="qna_board_wrap">
            <div className="editor" ref={editorRef}></div>
            <div className="btn_wrap">
                <button onClick={writeQnaClick}>답변등록</button>
            </div>
        </div>
    );
};

function MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return new MyUploadAdapter(loader);
    };
}

export default QnaBoard;
