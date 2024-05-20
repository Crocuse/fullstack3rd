import axios from 'axios';
import { SERVER_URL } from '../../config/server_url';

export const axiosPreview = async () => {
    console.log('AXIOS PREVIEW');

    try {
        let response = await axios.get(`${SERVER_URL.SERVER_URL()}/home/bidImg`);
        let result = response.data;
        return result;

    } catch (error) {
        console.log('AXIOS PREVIEW ERROR', error);

    }
}