import React, { useEffect, useState } from "react";
import { SERVER_URL } from "../../config/server_url";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import "../../css/Alarm/alarm.css";

function AuctionAlarm() {
    const loginedId = useSelector(state => state.loginedInfos.loginedId.loginedId);
    const [auctionBid, setAuctionBid] = useState();
    const [maxAuctionPoint, setMaxAuctionPoint] = useState();


    useEffect(() => {
        const socket = io(`${SERVER_URL.SERVER_URL()}`);

        socket.on('connect', () => {
            console.log('connected to server');
        });
        socket.emit('overbidding', { loginedId });

        socket.on('acPointInfoErrorInDB', ({ message }) => {
            setAuctionBid(message);
        });

        socket.on('acPointInfoError', ({ message }) => {
            setAuctionBid(message);
        });

        socket.on('maxAcPointError', ({ message }) => {
            setAuctionBid(message);
        });

        socket.on('alarm', ({ maxAcPoint, products }) => {
            const alarmMessages = products.map((product, index) => {
                const productName = product.productName;
                const maxBid = maxAcPoint[index].MAX_BID;
                return `[${productName}] 상회 입찰 발생 상회입찰가: ${maxBid}원`;
            });
            const combinedMessage = alarmMessages.join(' ');

            setMaxAuctionPoint(combinedMessage);
        });

        socket.on('notFoundMaxAcPoint', ({ message }) => {
            setAuctionBid(message);
        });


        return () => {
            socket.off("connect");
            socket.off("acPointInfoErrorInDB");
            socket.off("acPointInfoError");
            socket.off("maxAcPointError");
            socket.off("maxAcPoint");
            socket.off("notFoundMaxAcPoint");
            socket.disconnect();
        };
    }, [maxAuctionPoint]);





    return (
        <>
            <div className="alarm-container">
                <article>
                    <div><p className="alarm-box">알람</p></div>
                    <div>
                        {auctionBid}
                        {maxAuctionPoint}
                    </div>
                </article>
            </div>
        </>
    );
}

export default AuctionAlarm;