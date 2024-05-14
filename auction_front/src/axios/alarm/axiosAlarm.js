import axios from 'axios';
import { SERVER_URL } from '../../config/server_url';



  export const  axiosGetAlarmInfo = async (loginedId) => {
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
    };

    export const axiosSetReadState = async (data) => {
       console.log('AXIOS SET READ STATE');

       try {
        let no = data.AOB_NO
        let result = await axios.put(`${SERVER_URL.SERVER_URL()}/alarm/alarmReadState`, {
            no: no,
        });
        console.log(result);
        
       } catch (error) {
        
       }
        
    }
