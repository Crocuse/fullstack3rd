import React, { useEffect, useState } from "react";
import { sessionCheck } from "../../util/sessionCheck";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { SERVER_URL } from "../../config/server_url";
function AuctionPage() {
    const [asPrice, setAsPrice] = useState('');
    const sessionId = useSelector(state => state['loginedInfos']['loginedId']['sessionId']);
    const navigate = useNavigate();
    const location = useLocation();
    const product = location.state.product;

    useEffect(() => {
        sessionCheck(sessionId, navigate);
        console.log(sessionId);
    })

    const asPriceChangeHandler = (e) => {
        console.log('asPriceChangeHandler()');
        setAsPrice(e.target.value); 
    }

    return (
        <div className="auction_page_wrap">
            <div className="auction_title">{product.GR_NAME}</div>
            <div className="auction_semi_info">
                <div className="auction_img">
                    <img src={`${SERVER_URL.SERVER_URL()}/goodsImg/${product.imgs[0]}`} alt="" />
                </div>
                <div className="auction_price">
                    <h3>시작가 : {product.GR_PRICE}</h3>
                    <h3>현재가 : {product.GR_PRICE}</h3>
                </div>
            </div>
            <div className="auction_area">
                <div className="auction_img">
                    <img src="" alt="" />
                </div>
                <div className="auction_progress">
                    <div className="auction_log">

                    </div>
                    <div className="auction_btn">
                        <button>입찰</button><br/>
                        <input type="number" name="as_price" onChange={(e) => asPriceChangeHandler(e)}/><button>호가 입찰</button>
                    </div>
                </div>
            </div>
            <div className="auction_detail">
                간단한 설명
            </div>
        </div>
    );
}
export default AuctionPage;