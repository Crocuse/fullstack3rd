import React, { useEffect } from "react" 
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sessionCheck } from "../../../util/sessionCheck";

function ModifyPassword() {
    // Hook -----------------------------------------------------------------------------------------------------------
    const sessionId = useSelector(state => state['loginedInfos']['loginedId']['sessionId']);
    const navigate = useNavigate();
    
    useEffect(() => {
        sessionCheck(sessionId, navigate);
    })

    // Handler -----------------------------------------------------------------------------------------------------------

    // Fucntion -----------------------------------------------------------------------------------------------------------

    // Axios -----------------------------------------------------------------------------------------------------------

    // View -----------------------------------------------------------------------------------------------------------
    return (
        <article>
            <div className="title">
                <h2>비밀번호 변경</h2>
            </div>

            <div className="modify_wrap">
                현재 비밀번호 <input type="password" /> <br />
                수정할 비밀번호 <input type="password" /> <br />
                비밀번호 확인 <input type="password" /> <br />

                <button>변경</button>
            </div>
        </article>
    );
}

export default ModifyPassword;