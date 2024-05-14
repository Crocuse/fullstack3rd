import axios from 'axios';
import { SERVER_URL } from '../../config/server_url';

const axiosGetAlarmInfo = async (loginedId) => {
    console.log('AXIOS GET ALARM INFO');
    try {
        let result = await axios.post(`${SERVER_URL.SERVER_URL()}/alarm/alarmInfo`, {
            loginedId: loginedId
        });
        let alarmInfo = result.data;
        return alarmInfo;

    } catch (error) {
        console.log("AXIOS GET ALARM INFO ERROR", error);
    }
}

export default axiosGetAlarmInfo;