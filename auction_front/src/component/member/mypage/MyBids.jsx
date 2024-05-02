import React, { useEffect } from "react" 
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sessionCheck } from "../../../util/sessionCheck";
import axios from "axios";

function MyBids() {
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
                <h2>내 입찰 내역</h2>
            </div>
        </article>
    );
}

export default MyBids;