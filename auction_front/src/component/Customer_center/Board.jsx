// Board.jsx
import React, { useEffect, useRef } from 'react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '@ckeditor/ckeditor5-build-classic/build/translations/ko.js';
import '../../css/Customer_center/Board.css';
import MyUploadAdapter from '../../util/MyUploadAdapter';
import $ from 'jquery';
import axios from 'axios';
import { SERVER_URL } from '../../config/server_url';

const Board = (props) => {
    // Hook ------------------------------------------------------------------------------------------------------------------------
    const editorRef = useRef(null);
    let editor;

    useEffect(() => {
        if (editorRef.current) {
            ClassicEditor.create(editorRef.current, {
                language: 'ko',
                extraPlugins: [MyCustomUploadAdapterPlugin],
            })
                .then((newEditor) => {
                    editor = newEditor;
                    console.log('Editor initialized:', editor);
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
    }, []);

    // Handler ------------------------------------------------------------------------------------------------------------------------
    const cancelWriteClick = () => {
        props.setShowEditor(false);
    };

    const writeQnaClick = () => {
        let title = $('#title').val();
        let editorData = editor.getData();
        console.log('Editor data:', editorData);

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
            // const response = await axios.post(`${SERVER_URL.SERVER_URL()}/customer_center/insertQna`);
        } catch (error) {}
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
