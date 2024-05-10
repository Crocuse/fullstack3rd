import React, { useEffect, useState } from 'react';
import { SERVER_URL } from '../../config/server_url';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';
import '../../css/Alarm/alarm.css';

function AuctionAlarm() {
    const loginedId = useSelector((state) => state.loginedInfos.loginedId.loginedId);
    const [auctionBids, setAuctionBids] = useState([]);
    const [message, setMessage] = useState();

    const socket = io(`${SERVER_URL.SERVER_URL()}`);

    useEffect(() => {

        socket.on('connect', () => {
            console.log('CONNECTED TO SERVER');
        });

        socket.on('notificationOverBidErr', (data) => {
            console.log(data);
        });

        socket.on('notificationOverBid', (data) => {
            console.log(data);
            setMessage(data.message);
        });

        // socket.on('acPointInfoErrorInDB', ({ message }) => {
        //     setAuctionBids((prevBids) => [message, ...prevBids]);
        // });

        // socket.on('acPointInfoError', (item) => {
        //     console.log(item);
        //     setAuctionBids((prevBids) => [item, ...prevBids]);
        // });


        // socket.on('maxAcPointError', ({ message }) => {
        //     setAuctionBids((prevBids) => [message, ...prevBids]);
        // });

        // socket.on('alarm', ({ maxAcPoint, products }) => {
        //     const newBids = products.map((product, index) => {
        //         const productName = product.productName;
        //         const maxBid = maxAcPoint[index].MAX_BID;
        //         return `[${productName}] 상회 입찰 발생 상회입찰가: ${maxBid}원`;
        //     });
        //     setAuctionBids((prevBids) => [...newBids, ...prevBids]);
        // });

        // socket.on('notFoundMaxAcPoint', ({ message }) => {
        //     setAuctionBids((prevBids) => [message, ...prevBids]);
        // });

        // socket.on('overBidInfo', ({ overBidInfo }) => {
        //     console.log("overBidInfo==>", overBidInfo);

        //     const overBidOk = overBidInfo.filter(item => item.AlertMessage === '상회입찰이 발생하였습니다.');
        //     const overBidOkData = overBidOk.map(item => ({ AlertMessage: item.AlertMessage, GR_NAME: item.GR_NAME }));

        //     const overBidNo = overBidInfo.filter(item => item.AlertMessage === '상회입찰자가 없습니다.');
        //     const overBidNoData = overBidNo.map(item => ({ AlertMessage: item.AlertMessage, GR_NAME: item.GR_NAME }));

        //     const notOverBid = overBidInfo.filter(item => item.AlertMessage === '알림을 보내지 않습니다.');
        //     const notOverBidData = notOverBid.map(item => ({ AlertMessage: item.AlertMessage, GR_NAME: item.GR_NAME }));

        //     console.log("상회입찰이 발생", overBidOkData);
        //     console.log("상회입찰자가 없습", overBidNoData);
        //     console.log("알림을 보내지 않습", notOverBidData);
        //     if (overBidOkData.length !== 0 || overBidNoData.length !== 0 || notOverBidData.length !== 0) {

        //         return { overBidNoData, overBidNoData, notOverBidData }
        //     } else {
        //         return null;
        //     }
        // });

        // socket.on('highPrice', (item) => {
        //     console.log("최고가라고 들어오나")
        //     setAuctionBids((prevBids) => [...prevBids, item]);
        // });

        // socket.on('nonHighPrice', (item) => {
        //     console.log("높은가격없다고 들어오나")
        //     setAuctionBids((prevBids) => [...prevBids, item]);
        // });

        // socket.on("overBidInfo", (item) => {
        //     console.log("오버비드인포로 들어오나")
        //     console.log(item);
        //     setAuctionBids((prevBids) => [...prevBids, item]);
        // });

        // socket.on("nonOverBidInfo", (item) => {
        //     setAuctionBids((prevBids) => [...prevBids, item]);
        // });




        return () => {
            socket.off('connect');
            socket.off('notificationOverBid');
            socket.disconnect();
        };
    }, [loginedId]);

    return (
        <>
            <div className="alarm-container">
                <div>
                    <p className="alarm-box">알람</p>
                </div>
                <div>

                    <div>
                        <p>상품명: </p>
                        <p> {message}</p>
                        <p>--------------------</p>
                    </div>

                </div>
            </div>
        </>
    );
}

export default AuctionAlarm;