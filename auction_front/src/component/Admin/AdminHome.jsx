import React, { useEffect, useState } from "react"
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sessionCheck } from "../../util/sessionCheck";


function AdminHome() {

    const sessionId = useSelector((state) => state['loginedInfos']['loginedId']['sessionId']);

    const navigate = useNavigate();


    useEffect(() => {
        sessionCheck(sessionId, navigate);

    }, [sessionId, navigate]);

    return (
        
        <article>
            <div>AdminHome</div>    
        </article>
    );
}
export default AdminHome;