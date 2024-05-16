import axios from 'axios';
import { SERVER_URL } from '../../config/server_url';

export const axiosBidImg = async (loginedId) => {
    console.log('AXIOS BID IMG');

    try {
        let result = await axios.get(`${SERVER_URL.SERVER_URL()}/home/bidImg`);
        console.log(result);

    } catch (error) {

    }
}