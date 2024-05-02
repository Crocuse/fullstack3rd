import React, { useEffect, useState } from "react";
import { sessionCheck } from "../../util/sessionCheck";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
function AuctionPage() {
    const sessionId = useSelector(state => state['loginedInfos']['loginedId']['sessionId']);
    const navigate = useNavigate();
    useEffect(() => {
        sessionCheck(sessionId, navigate);
        console.log(sessionId);
    })

    return (
        <div className="auction_page_wrap">
            <div className="auction_title">제품 이름</div>
            <div className="auction_semi_info">
                <div className="auction_img">
                    <img src="#none"/>
                </div>
                <div className="auction_price">
                    <h3>시작가 : </h3>
                    <h3>현재가 : </h3>
                </div>
            </div>
            <div className="auction_area">
            <div className="auction_img">
                    <img src="#none"/>
                </div>
                <div className="auction_progress">

                    <h3>시작가 : </h3>
                    <h3>현재가 : </h3>
                </div>
            </div>
        </div>
    );
}
export default AuctionPage;