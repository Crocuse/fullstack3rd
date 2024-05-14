import axios from 'axios';
import { SERVER_URL } from '../../config/server_url';

const axiosGetAlarmInfo = async (loginedId) => {
    console.log('AXIOS GET ALARM INFO');
    try {
        let result = await axios.post(`${SERVER_URL.SERVER_URL()}/alarm/alarmInfo`, {
            loginedId: loginedId
        });
        console.log("axios 결과000", result);
    } catch (error) {
        console.log("AXIOS GET ALARM INFO 에러 !!", error);
    }
}

export default axiosGetAlarmInfo;