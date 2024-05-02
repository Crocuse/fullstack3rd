import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../css/include/LoadingModal.css';

const LoadingModal = () => {

    return (
        <div className="modal_wrap">
            <div className="loding_wrap">
                <div className="spinner_wrap">
                    <FontAwesomeIcon icon="spinner" size="4x" spin pulse style={{ color: "#74C0FC" }} />
                </div>
                
                <div className="txt">
                    로딩중입니다. <br />
                    잠시만 기다려주세요.
                </div>
            </div>
        </div>
    )
}

export default LoadingModal;