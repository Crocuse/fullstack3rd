import React, { useEffect, useState } from 'react';
import { SERVER_URL } from '../../config/server_url';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';
import '../../css/Alarm/alarm.css';

function AuctionAlarm() {
    const loginedId = useSelector((state) => state.loginedInfos.loginedId.loginedId);

    const message = useSelector(state => state.notificationOverBid.message.message);
    const id = useSelector(state => state.notificationOverBid.message.id);
    const name = useSelector(state => state.notificationOverBid.message.name);
    const date = useSelector(state => state.notificationOverBid.message.date);
    console.log('여기ㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣ',date);
    console.log(id);

    useEffect(() => {


        
    }, [message]);

    return (
        <>
            <div className="alarm-container">
                <div>
                    <p className="alarm-box">알람</p>
                </div>
                <div>
                {loginedId === id && (<div>
                        <p>상품명: {name} </p>
                        <p> {message}</p>
                        <p>{date}</p>
                    </div>)}
                    

                </div>
            </div>
        </>
    );
}

export default AuctionAlarm;