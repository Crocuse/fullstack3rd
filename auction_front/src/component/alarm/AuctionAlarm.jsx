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
    const socket = io(`${SERVER_URL.SERVER_URL_NOT_PORT()}`);
    const sessionId = useSelector((state) => state['loginedInfos']['loginedId']['sessionId']);
    const loginedId = useSelector((state) => state.loginedInfos.loginedId.loginedId);

    const alarmInfo = useSelector((state) => state.alarmInfo);

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
            const hasUnReadAlarm = alarmInfo.some((alarmInfo) => alarmInfo.AOB_READ === 0);
            setUpdateAlarm(hasUnReadAlarm); // true
        } else {
            setUpdateAlarm(false);
        }
    };

    const getMyAlarm = async () => {
        try {
            let result = await axiosGetAlarmInfo(loginedId);
            if (result !== null) {
                dispatch(setAlarmInfo(result));
            } else {
                dispatch(setAlarmInfo('알림없음'));
            }
        } catch (error) {}
    };

    const alarmOldReminderClickHandler = async (event, data) => {
        console.log('ALARMCLICKHANDLER()');

        console.log('알람 내용-->', data);
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
        console.log('ALARMOVERBIDCLICKHANDLER()');
        let date = notification.date;
        let id = notification.id;
        let result = await axiosSetReadState(date, id);
        getMyAlarm();
    };

    return (
        <div id="alarm_container">
            <div className="alarm_title">
                <p className="alarm_box">알람</p>
            </div>
            <div className="alram_description_wrap">
                <div className="alarm_description">
                    <div className="alarmInfoInDB">
                        {Array.isArray(alarmInfo) ? (
                            alarmInfo.map((alarm, index) => (
                                <Link
                                    className="alarm_a"
                                    to={`/auction/auction_page?grNo=${alarm.GR_NO}`}
                                    key={index}
                                    onClick={(event) => alarmOldReminderClickHandler(event, alarm)}
                                >
                                    <p className="over_bid_group">
                                        상품명: {alarm.GR_NAME} <br />
                                        {alarm.AOB_TXT} <br />
                                        {alarm.AOB_OCCUR_DATE}
                                    </p>
                                </Link>
                            ))
                        ) : alarmInfo === '알림없음' ? (
                            <p>알림이 없습니다.</p>
                        ) : alarmInfo === 'ERROR' ? (
                            <p>
                                ERROR 관리자에 문의하세요. <br />
                                고객센터 : 031-1234-5678
                            </p>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuctionAlarm;
