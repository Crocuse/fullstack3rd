export const setAlarmInfo = (alarmInfo) => ({
    type: 'SET_ALARM_INFO',
    payload: alarmInfo,
});

export const setHasNewAlarm = (hasNewAlarm) => ({
    type: 'SET_HAS_NEW_ALARM',
    payload: hasNewAlarm,
});
