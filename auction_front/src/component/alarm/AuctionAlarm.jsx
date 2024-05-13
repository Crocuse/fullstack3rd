import React, { useEffect, useState } from 'react';
import { SERVER_URL } from '../../config/server_url';
import io from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import '../../css/Alarm/alarm.css';
import { setOverBidMsg } from '../../redux/action/setOverBidMsg';

function AuctionAlarm() {
    const socket = io(SERVER_URL.SERVER_URL());
    const loginedId = useSelector((state) => state.loginedInfos.loginedId.loginedId);

    const notificationOverBid = useSelector(state => state.notificationOverBid);
    const message = useSelector(state => state.notificationOverBid.message.message);
    const id = useSelector(state => state.notificationOverBid.message.id);
    const name = useSelector(state => state.notificationOverBid.message.name);
    const date = useSelector(state => state.notificationOverBid.message.date);

    const dispatch = useDispatch();

    useEffect(() => {
    }, [notificationOverBid]);

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to server!');
        });

        socket.on('notificationOverBid', (data) => {
            console.log('Client NOTIFICATION OVER BID');
            if (data) {
                let message = data.message;
                let id = data.id;
                let name = data.name;
                let date = data.date;
                dispatch(setOverBidMsg({ id, message, name, date }));

            } else {
                return null;
            }
        });

        socket.on('notificationOverBidErr', (data) => {
                let message = data.message;
                let id = data.id;
                let name = data.name;
                let date = data.date;
                dispatch(setOverBidMsg({ id, message, name, date }));
        });

        return () => {
            socket.off('notificationOverBid');
            socket.off('notificationOverBidErr');
            socket.disconnect();
        };
    }, [socket]);


    return (
        <>
            <div className="alarm_container">
                <div>
                    <p className="alarm_box">알람</p>
                </div>
                <div>
                    {loginedId === id && (<div>
                        <p className='over_bid_name'>상품명: {name} </p>
                        <p className='over_bid_message'> {message}</p>
                        <p className='over_bid_date'>{date}</p>

                    </div>)}


                </div>
            </div>
        </>
    );
}

export default AuctionAlarm;