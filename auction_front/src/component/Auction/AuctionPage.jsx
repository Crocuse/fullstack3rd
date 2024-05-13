import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { sessionCheck } from "../../util/sessionCheck";
import { redirect, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { SERVER_URL } from "../../config/server_url";
import '../../css/Auction/AuctionPage.css';
import LoadingModal from "../include/LoadingModal";
import { io } from "socket.io-client";
import { useDispatch } from 'react-redux';
import {setOverBidMsg} from '../../redux/action/setOverBidMsg';



function AuctionPage() {
    const today = new Date();
    const [asPrice, setAsPrice] = useState('');
    const [nowPrice, setNowPirce] = useState('');
    const [nextBid, setNextBid] = useState('');
    const [imgIdx, setImgIdx] = useState(0);
    const [loadingModalShow, setLoaingModalShow] = useState(false);
    const [isBidType, setIsBidType] = useState(false);
    const [isIoSocket, setIsIoSocket] = useState(false);
    const [bidingLog, setBidingLog] = useState([]);
    const [hour, setHour] = useState(23 - today.getHours());
    const [minutes, setMinutes] = useState(59 - today.getMinutes());
    const [seconds, setSeconds] = useState(59 - today.getSeconds());

    const sessionId = useSelector(state => state['loginedInfos']['loginedId']['sessionId']);
    const loginedId = useSelector(state => state['loginedInfos']['loginedId']['loginedId']);
    const navigate = useNavigate();
    const location = useLocation();
    const product = location.state.product;
    const auctionLogRef = useRef(null);

    const dispatch = useDispatch();

    useEffect(() => {
        console.log("useEffect");
        const socket = io(`${SERVER_URL.SERVER_URL()}`)
        setLoaingModalShow(true);
        sessionCheck(sessionId, navigate);
        nowBidPrice();
        if (product.GR_PRICE >= nowPrice){
            setNowPirce(product.GR_PRICE);
        }
        
        socket.on('bidmsg', (data) => {
            console.log(data);
            setBidingLog(data.log);

            if (data.bid !== ''){
                if(!data.bidType)
                {
                    setNextBid(nextBidfunc(data.bid));
                    setNowPirce(data.bid);
                } else {
                    let tmpAsPrice = data.asPrice.replaceAll(',', '');
                    setNextBid(nextBidfunc(Number(tmpAsPrice)));
                    setNowPirce(data.asPrice);
                }
            }
        })

        return () => {
            socket.off('bidmsg');
        }
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
        const socket = io(`${SERVER_URL.SERVER_URL()}`)
        const socketData = {
            loginedId,
            nextBid,
            nowPrice,
            asPrice,
            grNo: product.GR_NO,
            isBidType : isBidType
        }
        socket.emit('overBid', socketData);
        socket.emit('auctionRefresh', socketData);
        socket.on('notificationOverBid', (data) => {
            if(data) {
                let message = data.message;
                let id = data.id;
                let name = data.name;
                let date = data.date;
                dispatch(setOverBidMsg({id, message, name, date}));
            } else {
                return null;
            }
        });
        
        return () => {
            console.log("Socket disconnected.");
            socket.disconnect();
        }
    }, [isIoSocket]);

    useEffect(() => {
        console.log("useEffect4");
        const id = setInterval(() => {
            setHour(23- today.getHours());
            setMinutes(59- today.getMinutes());
            setSeconds(59- today.getSeconds());
        }, 1000);
        return () => clearInterval(id);
    });

    async function nowBidPrice() {
        console.log('nowBidPrice()');

        try {
            const response = await axios.get(`${SERVER_URL.SERVER_URL()}/auction/bidingInfo?grNo=${product.GR_NO}`);
            if (response.data.length > 0) {
                let maxIdx = response.data.length - 1;
                let nPrice = response.data[maxIdx].AC_POINT;
                setNowPirce(nPrice);
                setNextBid(nextBidfunc(nPrice));
                setBidingLog(response.data);

            } else {
                console.log('length0');
                let nPrice = product.GR_PRICE;
                setNowPirce(nPrice);
                setNextBid(nextBidfunc(nPrice));
                setBidingLog([]);
            }
            setLoaingModalShow(false);

        } catch (error) {
            console.log(error);
        }
    }

    async function normalBid() {
        console.log('normalBid()');
        console.log(nextBid);
        try {
            const response = await axios.get(`${SERVER_URL.SERVER_URL()}/auction/biding?grNo=${product.GR_NO}&asPrice=${nextBid}`);
            
            if (response.data == 'fail') {
                alert('입찰에 실패 했습니다.');
                window.location.reload();
                setLoaingModalShow(false);
            } else {
                alert('입찰에 성공 했습니다.');
                nowBidPrice();
                setLoaingModalShow(false);
                setIsIoSocket(prev => !prev)
                setIsBidType(false);
            }
        } catch (error) {
            console.log(error);
            setLoaingModalShow(false);
        }
    }

    async function asBid() {
        console.log('asBid()');

        try {
            const response = await axios.get(`${SERVER_URL.SERVER_URL()}/auction/asBiding?grNo=${product.GR_NO}&asPrice=${asPrice}`);

            if (response.data == 'fail') {
                alert('입찰에 실패 했습니다.');
                window.location.reload();
                setLoaingModalShow(false);
            } else {
                alert('입찰에 성공 했습니다.');
                nowBidPrice();
                setLoaingModalShow(false);
                setIsIoSocket(prev => !prev)
                setIsBidType(true);
            }
        } catch (error) {
            console.log(error);
            setLoaingModalShow(false);
        }
    }

    const asPriceChangeHandler = (e) => {
        console.log('asPriceChangeHandler()');
        let value = e.target.value;
        value = Number(value.replaceAll(',', ''));
        if (isNaN(value)) {
            setAsPrice(0);
        } else {
            setAsPrice(value.toLocaleString('ko-KR'));
        }
    }

    const nextBidfunc = (nPrice) => {
        console.log('nextBidfunc');
        
        let tmpnextbid = nPrice + (nPrice * 0.05);
        console.log(tmpnextbid);
        tmpnextbid = Math.round(tmpnextbid / 100) * 100;
        return tmpnextbid;
        
    }

    const leftBtnClickHandler = () => {
        console.log('leftBtnClickHandler()');
        let tmp = imgIdx;
        tmp--;
        if (tmp < 0) {
            tmp = product.imgs.length - 1;
        }
        setImgIdx(tmp);
    }

    const rightBtnClickHandler = () => {
        console.log('rightBtnClickHandler()');
        let tmp = imgIdx;
        tmp++;
        if (tmp > product.imgs.length - 1) {
            tmp = 0;
        }
        setImgIdx(tmp);
    }

    const normalBidBtnHandler = () => {
        console.log("normalBidBtnHandler()");
        sessionCheck(sessionId, navigate);
        setLoaingModalShow(true);
        normalBid();
    }

    const asBidBtnHandler = () => {
        console.log("asBidBtnHandler()");
        if (checkAsBid(asPrice)) {
            sessionCheck(sessionId, navigate);
            setLoaingModalShow(true);
            asBid();
        }
    }

    const checkAsBid = (price) => {
        price = price.replaceAll(',', '');

        let tmpPrice = (nowPrice * 0.1) + nowPrice;        
        if(price < tmpPrice) {
            alert('현재 가격보다 10%이상 호가 해야 합니다.');
            return false;
        }

        tmpPrice = Math.round(price / 100) * 100;
        tmpPrice = Math.abs(price - tmpPrice);
        console.log(tmpPrice);
        if (tmpPrice !== 0) {
            alert('10원 단위 이하의 금액은 사용할 수 없습니다.');
            return false;
        }



        return true;
    }

    return (
        <article>
            <div className="auction_page_wrap">
                <div className="auction_semi_info">
                    <div className="auction_back_img">
                        <button onClick={leftBtnClickHandler}><img src="/img/arrow_left.png" /></button>
                        <div className="auction_img">
                            <img src={`${SERVER_URL.SERVER_URL()}/goodsImg/${product.imgs[imgIdx]}`} alt="" />
                        </div>
                        <button><img src="/img/arrow_right.png" onClick={rightBtnClickHandler} /></button>
                    </div>
                    <div className="auction_info">
                        <div className="product">
                            <h1>{product.GR_NAME}</h1>
                            <h3>시작가 | {product.GR_PRICE.toLocaleString('ko-KR')}원</h3>
                            <h3>현재가 | {nowPrice.toLocaleString('ko-KR')}원</h3>
                            <h3>판매자ID | {product.M_ID}</h3>
                            <h3>물건 소개</h3>
                            {product.GR_INFO}
                        </div>
                        <div className="limit_time">
                            <h1>남은 시간</h1>
                            <span>
                                {hour < 10 ? '0' + hour : hour}:{minutes < 10 ? '0' + minutes : minutes}:{seconds < 10 ? '0' + seconds : seconds}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="auction_area">
                    <div className="auction_bird">
                        <img id="bid_bird" src="/img/bid_bird_img.png" alt="" />
                        <div>
                            <img id="bubble" src="/img/bubble.png" alt="" />
                            <span className="bubble_text">
                                {bidingLog.length > 0 ?  bidingLog[bidingLog.length - 1].M_ID : ''} 님 께서
                                {bidingLog.length > 0 ?  bidingLog[bidingLog.length - 1].AC_POINT.toLocaleString('ko-KR') : ''} 원에
                                상회 입찰 하였습니다.<br/>
                                남은 경매 시간 {hour < 10 ? '0' + hour : hour}:{minutes < 10 ? '0' + minutes : minutes}:{seconds < 10 ? '0' + seconds : seconds}입니다.

                            </span>
                        </div>
                        
                    </div>
                    <div className="bubble_text">

                    </div>
                    <div className="auction_progress">
                        <div className="auction_log" ref={auctionLogRef}>
                            <div className="text_log">
                                {
                                    bidingLog.map((biding) => (
                                        <div key={biding.AC_NO}>
                                            [{biding.AC_REG_DATE}] {biding.M_ID}님 께서 {biding.AC_POINT.toLocaleString('ko-KR')}원 에 상회 입찰 하였습니다.
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        <div className="auction_btn">
                            <button onClick={normalBidBtnHandler}>입찰({nextBid.toLocaleString('ko-KR')}₩)</button><br />
                            <div className="call_bid">
                                <div>
                                    <input type="text" name="as_price" value={asPrice} onChange={(e) => asPriceChangeHandler(e)} />
                                </div>
                                <div>
                                    <button onClick={asBidBtnHandler}>호가 입찰</button>
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