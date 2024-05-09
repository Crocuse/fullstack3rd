import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { sessionCheck } from "../../util/sessionCheck";
import { redirect, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { SERVER_URL } from "../../config/server_url";
import '../../css/Auction/AuctionPage.css';
import LoadingModal from "../include/LoadingModal";
import { io } from "socket.io-client";



function AuctionPage() {
    const [asPrice, setAsPrice] = useState('');
    const [nowPrice, setNowPirce] = useState('');
    const [nextBid, setNextBid] = useState('');
    const [idx, setIdx] = useState(0);
    const [loadingModalShow, setLoaingModalShow] = useState(false);
    const [isSocketIo, setIsSocketio] = useState(false);
    const [bidingLog, setBidingLog] = useState([]);
    const sessionId = useSelector(state => state['loginedInfos']['loginedId']['sessionId']);
    const loginedId = useSelector(state => state['loginedInfos']['loginedId']['loginedId']);
    const navigate = useNavigate();
    const location = useLocation();
    const product = location.state.product;
    const auctionLogRef = useRef(null);
    const socket = io(`${SERVER_URL.SERVER_URL()}`)

    useEffect(() => {
        console.log("useEffect");
        setLoaingModalShow(true);
        sessionCheck(sessionId, navigate);
        nowBidPrice();
        if(product.GR_PRICE >= nowPrice)
            setNowPirce(product.GR_PRICE);
    }, [])

    useEffect(() => {
        console.log("useEffect2");
        const auctionLogElement = auctionLogRef.current;
        if (auctionLogElement) {
        auctionLogElement.scrollTop = auctionLogElement.scrollHeight;
        }
    }, [bidingLog]);

    useEffect(() => {
        console.log("useEffect3");

        const socketData = {
            loginedId,
            nextBid,
        }

        console.log(socketData);

        socket.emit('auctionRefresh', socketData);

        socket.on('bidmsg', (data) => {
            console.log(data);
        })
    });

    async function nowBidPrice() {
        console.log('nowBidPrice()');

        try{
            const response = await axios.get(`${SERVER_URL.SERVER_URL()}/auction/bidingInfo?grNo=${product.GR_NO}`);
            if(response.data.length > 0){
                let maxIdx = response.data.length - 1;
                setNowPirce(response.data[maxIdx].AC_POINT);
                let nextbid = response.data[maxIdx].AC_POINT + (response.data[maxIdx].AC_POINT * 0.1);
                nextbid = Math.round(nextbid/100) * 100;
                setNextBid(nextbid.toLocaleString('ko-KR'));
                setBidingLog(response.data);
                
            } else {
                setNowPirce(product.GR_PRICE);
                setNextBid(0);
                setBidingLog([]);
            }
            setLoaingModalShow(false);
            
        } catch(error) {
            console.log(error);
        }
    }

    async function normalBid() {
        console.log('normalBid()');

        try{
            const response = await axios.get(`${SERVER_URL.SERVER_URL()}/auction/biding?grNo=${product.GR_NO}&asPrice=${nowPrice}`);

            if(response.data == 'fail') {
                alert('입찰에 실패 했습니다.');
                window.location.reload();
                setLoaingModalShow(false);
            } else {
                alert('입찰에 성공 했습니다.');
                nowBidPrice();
                setLoaingModalShow(false);
                setIsSocketio(true);
            }
        } catch(error) {
            console.log(error);
            setLoaingModalShow(false);
        }
    }

    const asPriceChangeHandler = (e) => {
        console.log('asPriceChangeHandler()');
        let value = e.target.value;
        value = Number(value.replaceAll(',', ''));
        if(isNaN(value)){
            setAsPrice(0);
        } else {
            setAsPrice(value.toLocaleString('ko-KR'));
        }
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

    const normalBidBtnHandler = () => {
        console.log("normalBidBtnHandler()");
        setIsSocketio(false);
        sessionCheck(sessionId, navigate);
        setLoaingModalShow(true);
        normalBid();
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
                        <h3>시작가 | {product.GR_PRICE.toLocaleString('ko-KR')}원</h3>
                        <h3>현재가 | {nowPrice.toLocaleString('ko-KR')}원</h3>
                        <h3>판매자ID | {product.M_ID}</h3>
                        <h3>물건 소개</h3>
                        {product.GR_INFO}
                    </div>
                </div>
                <div className="auction_area">
                    <div className="auction_bird">
                        <img id="bid_bird" src="/img/bid_bird_img.png" alt="" />
                        <img id="bubble" src="/img/bubble.png" alt="" />
                    </div>
                    <div className="bubble_text">
                        
                    </div>
                    <div className="auction_progress">
                        <div className="auction_log" ref={auctionLogRef}>
                            <div className="text_log">
                            {
                                bidingLog.map((biding, idx) => (
                                    <>
                                        <div>[{biding.AC_REG_DATE}] {biding.M_ID}님 께서 {biding.AC_POINT}원 에 상회 입찰 하였습니다.</div>
                                    </>
                                ))
                            }
                            </div>
                        </div>
                        <div className="auction_btn">
                            <button onClick={normalBidBtnHandler}>입찰({nextBid}₩)</button><br/>
                            <div className="call_bid">
                                <div>
                                    <input type="text" name="as_price" value={asPrice} onChange={(e) => asPriceChangeHandler(e)}/>      
                                </div>
                                <div>
                                    <button>호가 입찰</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {loadingModalShow === true ? <LoadingModal /> : null}
        </article>
        
    );
}
export default AuctionPage;