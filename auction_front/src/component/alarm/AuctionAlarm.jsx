import React, { useEffect, useState } from "react";
import { SERVER_URL } from "../../config/server_url";
import io from "socket.io-client";
import { useSelector } from "react-redux";
// import "../../css/Alarm/alarm.css";

function AuctionAlarm() {
    const loginedId = useSelector(state => state.loginedInfos.loginedId.loginedId);
    const [acutionBid, setAcutionBid] = useState();
    const [maxAuctionPoint, setMaxAuctionPoint] = useState();

    
    useEffect(() => {
        const socket = io(`${SERVER_URL.SERVER_URL()}`);
        // 컴포넌트 마운트 시에 Socket.IO 이벤트를 수신할 수 있음
        socket.on('connect', () => {
            console.log('connected to server성공 !!!');
        });
        socket.emit('overbidding', { loginedId });
    
        socket.on('acPointInfoErrorInDB', ({ message }) => {
            console.log(message);
        });
        socket.on('acPointInfo', ({ acPoint }) => {
            console.log('acPoint', acPoint);
        });
    
        socket.on('acPointInfoError', ({ message }) => {
            setAcutionBid(message);
        });
    
        socket.on('maxAcPointError', ({ message }) => {
            console.log(message);
        });
    
        socket.on('maxAcPoint', ({ maxAcPoint }) => {
            setMaxAuctionPoint(`상회 입찰 발생 [입찰가] : ${maxAcPoint[0].max_bid}원`);
        });
    
        socket.on('maxAcPointError', (message) => {
            console.log(message);
        });
        
    
        return () => {
          // 컴포넌트 언마운트 시에 Socket.IO 이벤트 리스너 정리
          socket.off("connect");
          socket.off("acPointInfoErrorInDB");
          socket.off("acPointInfo");
          socket.off("acPointInfoError");
          socket.off("maxAcPointError");
          socket.off("maxAcPoint");
          socket.off("maxAcPointError");
          socket.disconnect();
        };
      }, [loginedId]);

   



    return (
        <>
            <div className="alarm-container">
                <article>
                    <div><p className="alarm-box">알람</p></div>
                    <div>
                        {acutionBid}
                        {maxAuctionPoint}
                    </div>
                </article>
            </div>
        </>
    );
}

export default AuctionAlarm;