import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sessionCheck } from '../../util/sessionCheck';
import '../../css/Admin/AdminHome.css';

function AdminHome() {
    const sessionId = useSelector((state) => state['loginedInfos']['loginedId']['sessionId']);
    const loginedId = useSelector((state) => state['loginedInfos']['loginedId']['loginedId']);

    const navigate = useNavigate();

    useEffect(() => {
        sessionCheck(sessionId, navigate);
    }, [sessionId, navigate]);

    return (
        <article>
            <div className="admin_home_wrap">
                <img src="/img/bid_bird_img.png" />
                <div className="admin-info">
                    <p>접속 아이디</p>
                    <p className="admin-id">{loginedId}</p>
                    <span className="note">※ 어드민 계정 등록 및 관리는 슈퍼어드민 계정만 가능합니다.</span>
                </div>
            </div>
        </article>
    );
}
export default AdminHome;
