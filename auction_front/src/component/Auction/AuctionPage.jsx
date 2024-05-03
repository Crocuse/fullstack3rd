import React, { useEffect, useState } from "react";
import { sessionCheck } from "../../util/sessionCheck";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { SERVER_URL } from "../../config/server_url";
import '../../css/Auction/AuctionPage.css';



function AuctionPage() {
    const [asPrice, setAsPrice] = useState('');
    const [idx, setIdx] = useState(0);
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

    const leftBtnClickHandler = () => {
        console.log('leftBtnClickHandler()');
        let tmp = idx;
        tmp--;
        if(tmp < 0) {
            tmp = product.imgs.length -1;
        }
        setIdx(tmp);
        console.log(tmp);
    }

    const rightBtnClickHandler = () => {
        console.log('rightBtnClickHandler()');
        let tmp = idx;
        tmp++;
        if(tmp > product.imgs.length -1) {
            tmp = 0;
        }
        setIdx(tmp);
        console.log(tmp);
    }

    return (
        <article>
            <div className="auction_page_wrap">
                <div className="auction_semi_info">
                    <div className="auction_back_img">
                        <button onClick={leftBtnClickHandler}><img src="/img/arrow_left.png"/></button>
                        <div className="auction_img">
                            <img src={`${SERVER_URL.SERVER_URL()}/goodsImg/${product.imgs[idx]}`} alt="" />
                        </div>
                        <button><img src="/img/arrow_right.png" onClick={rightBtnClickHandler}/></button>
                    </div>
                    <div className="auction_info">
                        <h1>{product.GR_NAME}</h1>
                        <h2>시작가 {product.GR_PRICE}</h2>
                        <h2>현재가 {product.GR_PRICE}</h2>
                        <h4>판매자ID {product.M_ID}</h4>
                        <h4>물건 소개 </h4>
                        {product.GR_INFO}
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
            </div>
        </article>
        
    );
}
export default AuctionPage;