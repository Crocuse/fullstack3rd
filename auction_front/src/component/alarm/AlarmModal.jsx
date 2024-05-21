import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setHasNewAlarm } from '../../redux/action/setAlarmInfo';

const AlarmModal = () => {
    const dispatch = useDispatch();
    const hasNewAlarm = useSelector((state) => state['alarmInfo']['hasNewAlarm']);

    const modalClickHandler = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        dispatch(setHasNewAlarm(false)); // 알람을 확인했음을 표시
    };

    useEffect(() => {
        console.log(hasNewAlarm);
    }, [hasNewAlarm]);

    return (
        <>
            {hasNewAlarm && (
                <div id="alarm_modal" onClick={modalClickHandler}>
                    <div className="flex">
                        <div className="img">
                            <img src="/img/bell.png" alt="" />
                        </div>
                        <div className="txt">새로운 알람이 있습니다.</div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AlarmModal;
