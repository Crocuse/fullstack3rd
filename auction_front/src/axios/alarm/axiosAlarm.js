import axios from 'axios';
import { SERVER_URL } from '../../config/server_url';



export const axiosGetAlarmInfo = async (loginedId) => {
    console.log('AXIOS GET ALARM INFO');
    try {
        let result = await axios.post(`${SERVER_URL.SERVER_URL()}/alarm/alarmInfo`, {
            loginedId: loginedId
        });
        let alarmInfo = result.data;
        console.log('엑시오스 결과', alarmInfo);
        return alarmInfo;

    } catch (error) {
        console.log("AXIOS GET ALARM INFO ERROR", error);
    }
};

export const axiosSetReadState = async (date, id) => {
    console.log('AXIOS SET READ STATE');

    try {
        let result = await axios.put(`${SERVER_URL.SERVER_URL()}/alarm/alarmReadState`, {
            date: date,
            id: id,
        });

        return result.data;

    } catch (error) {
        console.log("AXIOS SET READ STATE ERROR", error);
    }

}
