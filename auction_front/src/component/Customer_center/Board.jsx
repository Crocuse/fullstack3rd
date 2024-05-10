import React, { useEffect, useRef } from 'react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '@ckeditor/ckeditor5-build-classic/build/translations/ko.js';
import '../../css/Customer_center/Board.css';

const Board = (props) => {
    // Hook ------------------------------------------------------------------------------------------------------------------------
    const editorRef = useRef(null);
    let editor;

    useEffect(() => {
        if (editorRef.current) {
            ClassicEditor.create(editorRef.current, {
                language: 'ko',
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
        if (editor) {
            const editorData = editor.getData();
            console.log('Editor data:', editorData);
            // 여기에서 에디터 데이터를 활용하여 필요한 작업을 수행할 수 있습니다.
            // 예를 들어, 서버로 데이터를 전송하거나 상태를 업데이트할 수 있습니다.
        }
    };

    // View ------------------------------------------------------------------------------------------------------------------------
    return (
        <div className="board_wrap">
            <div className="title">
                <input type="text" placeholder="문의명을 입력해주세요." />
            </div>
            <div className="editor" ref={editorRef}></div>
            <div className="btn_wrap">
                <button onClick={cancelWriteClick}>취소하기</button>
                <button onClick={writeQnaClick}>문의등록</button>
            </div>
        </div>
    );
};

export default Board;
