import React, { useEffect } from "react" 
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sessionCheck } from "../../../util/sessionCheck";

function MyRegist() {
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
            MyRegist
        </article>
    );
}

export default MyRegist;