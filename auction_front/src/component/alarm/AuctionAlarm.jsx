import React, { useEffect, useState } from 'react';
import { SERVER_URL } from '../../config/server_url';
import io from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import '../../css/Alarm/alarm.css';
import { axiosGetAlarmInfo } from '../../axios/alarm/axiosAlarm';
import { axiosSetReadState } from '../../axios/alarm/axiosAlarm';
import { Link, useNavigate } from 'react-router-dom';
import { setAlarmInfo, setHasNewAlarm } from '../../redux/action/setAlarmInfo';
import { sessionCheck } from '../../util/sessionCheck';

function AuctionAlarm() {
    const socketServerUrl =
        window.location.hostname === 'localhost' ? 'http://localhost:3002' : 'https://bidbird.kro.kr:3001';
    const socket = io(socketServerUrl);
    const sessionId = useSelector((state) => state['loginedInfos']['loginedId']['sessionId']);
    const loginedId = useSelector((state) => state.loginedInfos.loginedId.loginedId);

    const alarmInfo = useSelector((state) => state.alarmInfo.alarmInfo);

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
            dispatch(setHasNewAlarm(true)); // 새로운 알람이 있음을 표시
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
        if (unReadAlarm()) {
            getMyAlarm();
            dispatch(setHasNewAlarm(true));
        } else {
            dispatch(setHasNewAlarm(false));
        }
    }, [updateAlarm]);

    const unReadAlarm = () => {
        if (alarmInfo !== '알림없음' && alarmInfo !== 'ERROR' && alarmInfo.length > 0) {
            const hasUnReadAlarm = alarmInfo.some((alarmInfo) => alarmInfo.AOB_READ === 0);
            setUpdateAlarm(hasUnReadAlarm);
            return hasUnReadAlarm;
        } else {
            setUpdateAlarm(false);
            return false;
        }
    };

    const getMyAlarm = async () => {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        try {
            if (currentHour === 23 && currentMinute > 55) {
                dispatch(setAlarmInfo('알림없음'));
                setHasNewAlarm(false);
                return;
            }

            let result = await axiosGetAlarmInfo(loginedId);
            if (result !== null) {
                dispatch(setAlarmInfo(result));
                const hasUnreadAlarm = result.some((alarm) => alarm.AOB_READ === 0);
                setHasNewAlarm(hasUnreadAlarm);
            } else {
                dispatch(setAlarmInfo('알림없음'));
                setHasNewAlarm(false);
            }
        } catch (error) {
            console.log('[AuctionAlarm]', error);
        }
    };

    const alarmOldReminderClickHandler = async (event, data) => {
        console.log('ALARMCLICKHANDLER()');

        if (data !== null) {
            let date = data.AOB_OCCUR_DATE;
            let id = data.M_ID;
            let result = await axiosSetReadState(date, id);
            if (result === 'success') {
                getMyAlarm();
            }
        } else {
            event.preventDefault();
        }
    };

    return (
        <>
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
        </>
    );
}

export default AuctionAlarm;
