import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setLoginedId } from '../../redux/action/setLoginedId';
import { SERVER_URL } from '../../config/server_url';
import { useMutation, useQuery } from '@tanstack/react-query';

axios.defaults.withCredentials = true;

function Logout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutConfirm = () => axios.get(`${SERVER_URL.SERVER_URL()}/member/logout_confirm`);

    const { mutate: logout } = useMutation({
        mutationFn: logoutConfirm,
        onSuccess: () => {
            dispatch(setLoginedId('', '', ''));
            navigate('/');
        },
    });

    useEffect(() => {
        logout();
    }, [logout]);
}

export default Logout;
