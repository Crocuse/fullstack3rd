import React, { useEffect } from "react"
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLoginedId } from "../../redux/action/setLoginedId";
import { SERVER_URL } from "../../config/server_url";

axios.defaults.withCredentials = true;

function Logout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {

        axios_logout_confirm();
        
    }, []);

    async function axios_logout_confirm() {
        console.log('axios_logout_confirm()')
        
        try {
            await axios.get(`${SERVER_URL.SERVER_URL()}/member/logout_confirm`);
            
            dispatch(setLoginedId('', '', ''));
            navigate('/');

        } catch (error) {
            console.log(error);
        }
    }
}

export default Logout;