import React, { useEffect, useState } from 'react';
import { SERVER_URL } from '../../config/server_url';
import io from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import '../../css/Alarm/alarm.css';
import { axiosGetAlarmInfo } from '../../axios/alarm/axiosAlarm';
import { axiosSetReadState } from '../../axios/alarm/axiosAlarm';
import { Link, useNavigate } from 'react-router-dom';
import { setAlarmInfo } from '../../redux/action/setAlarmInfo';
import { sessionCheck } from '../../util/sessionCheck';

function AuctionAlarm() {
    const socket = io(SERVER_URL.SERVER_URL());
    const sessionId = useSelector((state) => state['loginedInfos']['loginedId']['sessionId']);
    const loginedId = useSelector((state) => state.loginedInfos.loginedId.loginedId);

    const alarmInfo = useSelector(state => state.alarmInfo);

    const [updateAlarm, setUpdateAlarm] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        sessionCheck(sessionId, navigate);

    }, [sessionId]);

    useEffect(() => {
        socket.on('notificationOverBid', () => {
            console.log('Client NOTIFICATION OVER BID');

            getMyAlarm();

        });

        socket.on('notificationOverBidErr', (data) => {
            dispatch(setAlarmInfo('ERROR'));
        });

        return () => {
            socket.off('notificationOverBid');
            socket.off('notificationOverBidErr');
            socket.disconnect();
        };
    }, [socket]);

    useEffect(() => {

        if (unReadAlarm) {
            getMyAlarm();
        }

    }, [updateAlarm]);

    const unReadAlarm = () => {
        if (alarmInfo !== '알림없음' && alarmInfo !== 'ERROR' && alarmInfo.length > 0) {
            const hasUnReadAlarm = alarmInfo.some(alarmInfo => alarmInfo.AOB_READ === 0)
            setUpdateAlarm(hasUnReadAlarm); // true

        } else {
            setUpdateAlarm(false);
        }
    }

    const getMyAlarm = async () => {

        try {
            let result = await axiosGetAlarmInfo(loginedId);
            console.log("getMyAlarm() -->", result);
            if (result !== null) {
                dispatch(setAlarmInfo(result));

            } else {
                dispatch(setAlarmInfo('알림없음'));
            }

        } catch (error) {

        }
    }

    const alarmOldReminderClickHandler = async (event, data) => {
        console.log('ALARMCLICKHANDLER()');

        console.log("알람 내용-->", data);
        if (data !== null) {
            let date = data.AOB_OCCUR_DATE;
            let id = data.M_ID;
            let result = await axiosSetReadState(date, id);
            getMyAlarm();

        } else {
            event.preventDefault();

        }
    };


    const alarmOverBidClickHandler = async (notification) => {
        console.log('ALARMOVERBIDCLICKHANDLER()')
        let date = notification.date;
        let id = notification.id;
        let result = await axiosSetReadState(date, id);
        getMyAlarm();

    }

    return (
        <div className="alarm_container">
            <div>
                <p className="alarm_box">알람</p>
            </div>
            <div className='alram_description'>
                <div>
                    <div className='alarmInfoInDB'>
                        {Array.isArray(alarmInfo) ? (
                            alarmInfo.map((alarm, index) => (
                                <Link to={`/auction/auction_page?grNo=${alarm.GR_NO}`} key={index} onClick={(event) => alarmOldReminderClickHandler(event, alarm)}>
                                    <p className='over_bid_name'>상품명: {alarm.GR_NAME}</p>
                                    <p className='over_bid_message'>{alarm.AOB_TXT}</p>
                                    <p className='over_bid_date'>{alarm.AOB_OCCUR_DATE}</p>
                                </Link>
                            ))
                        ) : alarmInfo === '알림없음' ? (
                            <p>알림이 없습니다.</p>
                        ) : alarmInfo === 'ERROR' ? (
                            <p>ERROR 관리자에 문의하세요. <br />고객센터 : 031-1234-5678</p>
                        ) : null}

                    </div>
                </div>

            </div>
        </div>
    );
}

export default AuctionAlarm;