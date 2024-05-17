// Board.jsx
import React, { useEffect, useRef, useState } from 'react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '@ckeditor/ckeditor5-build-classic/build/translations/ko.js';
import '../../css/Customer_center/Board.css';
import MyUploadAdapter from '../../util/MyUploadAdapter';
import $ from 'jquery';
import axios from 'axios';
import { SERVER_URL } from '../../config/server_url';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sessionCheck } from '../../util/sessionCheck';

const Board = (props) => {
    // Hook ------------------------------------------------------------------------------------------------------------------------
    const editorRef = useRef(null);
    const sessionId = useSelector((state) => state['loginedInfos']['loginedId']['sessionId']);
    const loginedId = useSelector((state) => state['loginedInfos']['loginedId']['loginedId']);
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
    const cancelWriteClick = () => {
        props.setShowEditor(false);
    };

    const writeQnaClick = () => {
        let title = $('#title').val();
        let editorData = '';

        if (editor) {
            editorData = editor.getData();
        }

        if (title === '') {
            alert('문의명을 입력해주세요.');
            return;
        } else if (editorData === '') {
            alert('문의 내용을 작성해주세요.');
            return;
        } else {
            axios_insertQNA(title, editorData);
        }
    };

    // Axios ------------------------------------------------------------------------------------------------------------------------
    async function axios_insertQNA(title, editorData) {
        try {
            const response = await axios.post(`${SERVER_URL.SERVER_URL()}/customer_center/Qna`, {
                title,
                editorData,
                loginedId,
            });
            if (response.data === true) {
                alert('문의가 등록되었습니다.');
                props.setShowEditor(false);
            } else {
                alert('서버 오류로 문의 등록에 실패했습니다.');
            }
        } catch (error) {
            alert('통신 에러가 발생했습니다.');
        }
    }

    // View ------------------------------------------------------------------------------------------------------------------------
    return (
        <div className="board_wrap">
            <div className="title">
                <input type="text" id="title" placeholder="문의명을 입력해주세요." />
            </div>
            <div className="editor" ref={editorRef}></div>
            <div className="btn_wrap">
                <button onClick={cancelWriteClick}>취소하기</button>
                <button onClick={writeQnaClick}>문의등록</button>
            </div>
        </div>
    );
};

function MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return new MyUploadAdapter(loader);
    };
}

export default Board;
