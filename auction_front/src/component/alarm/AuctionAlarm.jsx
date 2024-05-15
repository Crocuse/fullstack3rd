import React, { useEffect, useState } from 'react';
import { SERVER_URL } from '../../config/server_url';
import io from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import '../../css/Alarm/alarm.css';
import { setOverBidMsg } from '../../redux/action/setOverBidMsg';
import {axiosGetAlarmInfo} from '../../axios/alarm/axiosAlarm';
import {axiosSetReadState} from '../../axios/alarm/axiosAlarm';
import { Link } from 'react-router-dom';

function AuctionAlarm() {
    const socket = io(SERVER_URL.SERVER_URL());
    const loginedId = useSelector((state) => state.loginedInfos.loginedId.loginedId);

    const notificationOverBid = useSelector(state => state.notificationOverBid);
    const id = useSelector(state => state.notificationOverBid.message.id);

    const [notification, setNotification] = useState(null);
    const [alarmInfo, setAlarmInfo] = useState([]);
    const [alarmState, setAlarmState] = useState(false);

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
                let grNo = data.grNo;                
                dispatch(setOverBidMsg({ id, message, name, date, grNo }));
                setNotification({ id, message, name, date, grNo });

            } else {
                return null;
            }
        });

        socket.on('notificationOverBidErr', (data) => {
            let message = data.message;
            let id = data.id;
            let name = data.name;
            let date = data.date;
            let grNo = data.grNo;
            dispatch(setOverBidMsg({ id, message, name, date, grNo }));
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

    }, [loginedId]);


    const alarmOldReminderClickHandler = async (event, data) => {
        console.log('ALARMCLICKHANDLER()');

        console.log("알람 내용-->",data);
        if(data !== null) {
            console.log("여기 들ㅇㅓ오나---->",data.AOB_NO);
            let date = data.AOB_OCCUR_DATE;
            let id = data.M_ID;
            let result = await axiosSetReadState(date, id);
            console.log("여기 오나?????",result);

        } else {
            console.log("여기 들ㅇㅓ오나---->",data);
            event.preventDefault();

        }
    };
    

    const alarmOverBidClickHandler = async (notification) => {
        console.log('ALARMOVERBIDCLICKHANDLER()')
        console.log('노티피케이션---------------',notification.id);
        console.log('노티피케이션---------------',notification.date);
        let date = notification.date;
        let id = notification.id;
        let result = await axiosSetReadState(date, id);
        console.log("상회입찰 알림 클릭하고 -------->",result);

    }

    return (
        <div className="alarm_container">
            <div>
                <p className="alarm_box">알람</p>
            </div>
            <div>
                {notification && loginedId === id && notification != '' && (
                    <Link to={`/auction/auction_page?grNo=${notification.grNo}`}  onClick={() => alarmOverBidClickHandler(notification)}>
                        <p className='over_bid_name'>상품명: {notification.name} </p>
                        <p className='over_bid_message'> {notification.message}</p>
                        <p className='over_bid_date'>{notification.date}</p>
                    </Link>
                )}
            </div>
            <div>
                <div className='alarmInfoInDB'>
                    {Array.isArray(alarmInfo) ? (       // Array.isArray는 배열인 경우 true 아닐 경우 false 반환 
                        alarmInfo.map((alarm, index) => (
                            <Link to={`/auction/auction_page?grNo=${alarm.GR_NO}`} key={index} onClick={(event) => alarmOldReminderClickHandler(event, alarm)}>
                                <p className='over_bid_name'>상품명: {alarm.GR_NAME}</p>
                                <p className='over_bid_message'>{alarm.AOB_TXT}</p>
                                <p className='over_bid_date'>{alarm.AOB_OCCUR_DATE}</p>
                            </Link>
                        ))
                    ) : (
                        <Link to={`/auction/auction_page?grNo=${alarmInfo.GR_NO}`}  onClick={(event) => alarmOldReminderClickHandler(event, alarmInfo)} >  
                            <p className='over_bid_name'>상품명: {alarmInfo.GR_NAME}</p>
                            <p className='over_bid_message'>{alarmInfo.AOB_TXT}</p>
                            <p className='over_bid_date'>{alarmInfo.AOB_OCCUR_DATE}</p>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AuctionAlarm;