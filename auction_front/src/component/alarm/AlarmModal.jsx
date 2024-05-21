import React, { useEffect } from 'react';

const AlarmModal = ({ hasNewAlarm }) => {
    const modalClickHandler = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

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
            ;
        </>
    );
};
export default AlarmModal;
