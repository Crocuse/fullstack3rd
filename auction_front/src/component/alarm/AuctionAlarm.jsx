import React, { useEffect, useState } from "react";
import { SERVER_URL } from "../../config/server_url";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import "../../css/Alarm/alarm.css";

function AuctionAlarm() {
    const loginedId = useSelector(state => state.loginedInfos.loginedId.loginedId);
    const [auctionBids, setAuctionBids] = useState([]);

    useEffect(() => {
        const socket = io(`${SERVER_URL.SERVER_URL()}/overCountBid`, {
            query: { loginedId }
        });

        socket.on('connect', () => {
            console.log('connected to server');
        });

        socket.on('acPointInfoErrorInDB', ({ message }) => {
            setAuctionBids(prevBids => [message, ...prevBids]);
        });

        socket.on('acPointInfoError', ({ message }) => {
            setAuctionBids(prevBids => [message, ...prevBids]);
        });

        socket.on('maxAcPointError', ({ message }) => {
            setAuctionBids(prevBids => [message, ...prevBids]);
        });

        socket.on('alarm', ({ maxAcPoint, products }) => {
            const newBids = products.map((product, index) => {
                const productName = product.productName;
                const maxBid = maxAcPoint[index].MAX_BID;
                return `[${productName}] 상회 입찰 발생 상회입찰가: ${maxBid}원`;
            });
            setAuctionBids(prevBids => [...newBids, ...prevBids]);
        });

        socket.on('notFoundMaxAcPoint', ({ message }) => {
            setAuctionBids(prevBids => [message, ...prevBids]);
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
    }, []);

    return (
        <>
            <div className="alarm-container">
                <article>
                    <div><p className="alarm-box">알람</p></div>
                    <div>
                        {auctionBids.map((bid, index) => (
                            <div key={index}>{bid}</div>
                        ))}
                    </div>
                </article>
            </div>
        </>
    );
}

export default AuctionAlarm;
