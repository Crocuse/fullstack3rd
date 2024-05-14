import React, { useEffect, useState } from 'react';
import { SERVER_URL } from '../../config/server_url';
import io from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import '../../css/Alarm/alarm.css';
import { setOverBidMsg } from '../../redux/action/setOverBidMsg';
import axiosGetAlarmInfo from '../../axios/alarm/axiosGetAlarmInfo';
import { contains } from 'jquery';

function AuctionAlarm() {
    const socket = io(SERVER_URL.SERVER_URL());
    const loginedId = useSelector((state) => state.loginedInfos.loginedId.loginedId);

    const notificationOverBid = useSelector(state => state.notificationOverBid);
    const message = useSelector(state => state.notificationOverBid.message.message);
    const id = useSelector(state => state.notificationOverBid.message.id);
    const name = useSelector(state => state.notificationOverBid.message.name);
    const date = useSelector(state => state.notificationOverBid.message.date);

    const [notification, setNotification] = useState(null);
    const [alarmInfo, setAlarmInfo] = useState('');
    const [auctionItemName, setAuctionItemName] = useState('');
    const [alarmMessage, setAlarmMessage] = useState('');
    const [highestBidDate, setHighestBidDate] = useState('');

    const dispatch = useDispatch();

    useEffect(() => {

        socket.on('notificationOverBid', (data) => {
            console.log('Client NOTIFICATION OVER BID');
            if (data) {
                console.log('소켓으로 쏘면 뭐가 나오나-------->', data);

                let message = data.message;
                let id = data.id;
                let name = data.name;
                let date = data.date;
                dispatch(setOverBidMsg({ id, message, name, date }));
                setNotification({ id, message, name, date });

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
    }, [socket, notificationOverBid]);

    useEffect(() => {
        const getMyAlarm = async () => {

            try {
                let result = await axiosGetAlarmInfo(loginedId);
                console.log("보자보자 ㅏㅏㅏㅏㅏㅏ", result);
                if (result)
                    setAlarmInfo(result);

            } catch (error) {

            }
        }
        getMyAlarm();

    }, []);



    return (
        <div className="alarm_container">
            <div>
                <p className="alarm_box">알람</p>
            </div>
            <div>
                {notification && loginedId === id && (
                    <div>
                        <p className='over_bid_name'>상품명: {notification.name} </p>
                        <p className='over_bid_message'> {notification.message}</p>
                        <p className='over_bid_date'>{notification.date}</p>
                    </div>
                )}
            </div>
            <div>
                <div className='alarmInfoInDB'>
                    {Array.isArray(alarmInfo) ? (       // 배열인 경우 true 아닐 경우 false 반환 
                        alarmInfo.map((alarm, index) => (
                            <div key={index}>
                                <p className='over_bid_name'>상품명: {alarm.GR_NAME}</p>
                                <p className='over_bid_message'>{alarm.AOB_TXT}</p>
                                <p className='over_bid_date'>{alarm.AOB_OCCUR_DATE}</p>
                            </div>
                        ))
                    ) : (
                        <div>
                            <p className='over_bid_name'>상품명: {alarmInfo.GR_NAME}</p>
                            <p className='over_bid_message'>{alarmInfo.AOB_TXT}</p>
                            <p className='over_bid_date'>{alarmInfo.AOB_OCCUR_DATE}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AuctionAlarm;