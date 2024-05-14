import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { sessionCheck } from "../../util/sessionCheck";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { SERVER_URL } from "../../config/server_url";
import '../../css/Auction/AuctionPage.css';
import LoadingModal from "../include/LoadingModal";
import { io } from "socket.io-client";

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
    const [product, setProduct] = useState();
    const [extendLevel, setExtendLevel] = useState(0);
    const [highestBidder, setHighestBidder] = useState('');

    const sessionId = useSelector(state => state['loginedInfos']['loginedId']['sessionId']);
    const loginedId = useSelector(state => state['loginedInfos']['loginedId']['loginedId']);
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(window.location.search);
    const grNo = searchParams.get('grNo');
    const auctionLogRef = useRef(null);

    
    useEffect(() => {
        console.log("useEffect5");
        if (grNo) {
            fetchProductData(grNo);
        }
    }, [grNo]);

    useEffect(() => {
        console.log("useEffect");
        const socket = io(`${SERVER_URL.SERVER_URL()}`);
        setLoaingModalShow(true);
        sessionCheck(sessionId, navigate);
        if(product !== undefined) {
            if (product.GR_PRICE >= nowPrice) {
                setNowPirce(product.GR_PRICE);
            } 
            nowBidPrice();
        }
        
        socket.on('bidmsg', (data) => {
            console.log(data);
            setBidingLog(data.log);

            if (data.bid !== '') {
                if (!data.bidType) {
                    setNextBid(nextBidfunc(data.bid));
                    setNowPirce(data.bid);
                    setHighestBidder(data.loginedId)
                } else {
                    let tmpAsPrice = data.asPrice.replaceAll(',', '');
                    setNextBid(nextBidfunc(Number(tmpAsPrice)));
                    setNowPirce(data.asPrice);
                    setHighestBidder(data.loginedId)
                }
            }
        })

        return () => {
            socket.off('bidmsg');
        }
    }, [product])

    useEffect(() => {
        console.log("useEffect2");
        const auctionLogElement = auctionLogRef.current;
        if (auctionLogElement) {
            auctionLogElement.scrollTop = auctionLogElement.scrollHeight;
        }
    }, [bidingLog]);

    useEffect(() => {
        console.log("useEffect3");
        if(!product)
            return;
        const socket = io(`${SERVER_URL.SERVER_URL()}`)
        const socketData = {
            loginedId,
            nextBid,
            nowPrice,
            asPrice,
            grNo: product.GR_NO,
            isBidType: isBidType
        }
        socket.emit('overBid', socketData);
        socket.emit('auctionRefresh', socketData);

        return () => {
            console.log("Socket disconnected.");
            socket.disconnect();
        }
    }, [isIoSocket]);

    useEffect(() => {
        console.log("useEffect4");
        const id = setInterval(() => {
            // setHour(23 - today.getHours());
            //setMinutes(59 - today.getMinutes());
            // setSeconds(59 - today.getSeconds());
            setHour(0);
            setMinutes(42);
            setSeconds(59 - today.getSeconds());
            isAuctionEnd();
        }, 1000);
        

        timeSetExtendLevel();

        return () => clearInterval(id);
    }, [today]);

    const timeSetExtendLevel = () => {
        if(hour === 0){
            if(minutes < 30 && minutes > 20) {
                console.log('levle0');
                setExtendLevel(1);
            } else if(minutes <= 35 && minutes > 30) {
                console.log('levle1');
                setExtendLevel(2);
            } else if(minutes <= 40 && minutes > 35) {
                console.log('levle2');
                setExtendLevel(3);
            } else if(minutes <= 45 && minutes > 40) {
                console.log('levle3');
                setExtendLevel(4);
            } else if(minutes <= 50 && minutes > 45) {
                console.log('levle4');
                setExtendLevel(5);
            } else if(minutes <= 55 && minutes > 50) {
                console.log('levle5');
                setExtendLevel(6);
            } else if(minutes < 0 && minutes > 55) {
                console.log('levle6');
                setExtendLevel(7);
            }
        }
    }

    const isAuctionEnd = () =>{
        if(hour === 0 && seconds === 0){
            if(minutes >= 30 && extendLevel < 1) {
                return true;
            } else if(minutes >= 35 && extendLevel < 2) {
                return true;
            } else if(minutes >= 40 && extendLevel < 3) {
                return true;
            } else if(minutes >= 45 && extendLevel < 4) {
                return true;
            } else if(minutes >= 50 && extendLevel < 5) {
                return true;
            } else if(minutes >= 55 && extendLevel < 6) {
                return true;
            } else if(minutes >= 0 && extendLevel < 7) {
                return true;
            }
        }
        return false;
    }

    useEffect(()=>{
        console.log('extendLevel>>>>>>>>>>>>>>>>>>>>>>>>>>>', extendLevel);
        if(hour === 0){
            switch(extendLevel) {
                case 0:
                    if(minutes < 30 && minutes > 20) {
                        console.log('levle0');
                        setExtendLevel(1);
                    }
                    break;
                case 1:
                    if(minutes < 35 && minutes > 30) {
                        console.log('levle1');
                        setExtendLevel(2);
                    }
                    break;
                case 2:
                    if(minutes < 40 && minutes > 35) {
                        console.log('levle2');
                        setExtendLevel(3);
                    }
                    break;
                case 3:
                    if(minutes < 45 && minutes > 40) {
                        console.log('levle3');
                        setExtendLevel(4);
                    }
                    break;
                case 4:
                    if(minutes < 50 && minutes > 45) {
                        console.log('levle4');
                        setExtendLevel(5);
                    }
                    break;
                case 5:
                    if(minutes < 55 && minutes > 50) {
                        console.log('levle5');
                        setExtendLevel(6);
                    }
                    break;
                case 6:
                    if(minutes < 0 && minutes > 55) {
                        console.log('levle6');
                        setExtendLevel(7);
                    }
                    break;
            }    
        }
    }, [highestBidder])

    async function fetchProductData(grNo) {
        try {

            const response = await axios.get(`${SERVER_URL.SERVER_URL()}/auction/list_product?grNo=${grNo}`);
            if(response.data == 'noProduct')
                alert('상품이 없습니다.');
            else{
                console.log(response.data);
                setProduct(response.data);

                setLoaingModalShow(false);
                
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function nowBidPrice() {
        console.log('nowBidPrice()');

        try {
            if(product) {
                const response = await axios.get(`${SERVER_URL.SERVER_URL()}/auction/bidingInfo?grNo=${product.GR_NO}`);
                if (response.data.length > 0) {
                    let maxIdx = response.data.length - 1;
                    let nPrice = response.data[maxIdx].AC_POINT;
                    setNowPirce(nPrice);
                    setNextBid(nextBidfunc(nPrice));
                    setBidingLog(response.data);
                    setHighestBidder(response.data[maxIdx].M_ID)
                } else {
                    console.log('length0');
                    let nPrice = product.GR_PRICE;
                    setNowPirce(nPrice);
                    setNextBid(nextBidfunc(nPrice));
                    setBidingLog([]);
                }
                setLoaingModalShow(false);
            }
            

        } catch (error) {
            console.log(error);
        }
    }

    async function normalBid() {
        console.log('normalBid()');
        try {
            if(product) {
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
            }
        } catch (error) {
            console.log(error);
            setLoaingModalShow(false);
        }
    }

    async function asBid() {
        console.log('asBid()');

        try {
            if(product) {
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
        if(checkId()) {
            sessionCheck(sessionId, navigate);
            setLoaingModalShow(true);
            normalBid();
        }
    }

    const asBidBtnHandler = () => {
        console.log("asBidBtnHandler()");
        if (checkAsBid(asPrice) && checkId()) {
            sessionCheck(sessionId, navigate);
            setLoaingModalShow(true);
            asBid();
        }
    }

    const checkId = () => {
        console.log('checkId()');
        if(highestBidder === loginedId){
            alert('이미 최고 입찰자 입니다.');
            return false;
        }
        return true;
    }

    const checkAsBid = (price) => {
        price = price.replaceAll(',', '');

        let tmpPrice = (nowPrice * 0.1) + nowPrice;
        if (price < tmpPrice) {
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
                            { product &&  (
                                <img src={`${SERVER_URL.SERVER_URL()}/goodsImg/${product.imgs[imgIdx]}`} alt="" />
                            )}
                        </div>
                        <button><img src="/img/arrow_right.png" onClick={rightBtnClickHandler} /></button>
                    </div>
                    <div className="auction_info">
                        <div className="product">
                            {
                                product && (
                                <>
                                    <h1>{product.GR_NAME}</h1>
                                    <h3>시작가 | {product.GR_PRICE.toLocaleString('ko-KR')}원</h3>
                                    <h3>현재가 | {nowPrice.toLocaleString('ko-KR')}원</h3>
                                    <h3>판매자ID | {product.M_ID}</h3>
                                    <h3>물건 소개</h3>
                                    {product.GR_INFO}
                                </>
                            )}
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
                            <img id="bubble" src="/img/bubble.png" alt="" />
                            <span className="bubble_text">
                                {
                                    bidingLog.length === 0 ? <>
                                         남은 경매 시간 {hour < 10 ? '0' + hour : hour}:{minutes < 10 ? '0' + minutes : minutes}:{seconds < 10 ? '0' + seconds : seconds}입니다.    
                                    </> :
                                    <>
                                         {bidingLog.length > 0 ? bidingLog[bidingLog.length - 1].M_ID : ''} 님 께서
                                        {bidingLog.length > 0 ? bidingLog[bidingLog.length - 1].AC_POINT.toLocaleString('ko-KR') : ''} 원에
                                        상회 입찰 하였습니다.<br />
                                         남은 경매 시간 {hour < 10 ? '0' + hour : hour}:{minutes < 10 ? '0' + minutes : minutes}:{seconds < 10 ? '0' + seconds : seconds}입니다.    
                                    </>
                                }

                                

                            </span>

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