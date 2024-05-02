import React, { useEffect } from "react";
import { SERVER_URL } from "../../config/server_url";
import io from "socket.io-client";
import { useSelector } from "react-redux";

function AuctionAlarm() {
    const loginedId = useSelector(state => state.loginedInfos.loginedId.loginedId);

    useEffect(() => {
        const socket = io(`${SERVER_URL.SERVER_URL()}`);

        socket.on('connect', () => {
            console.log('connected to server성공 !!!');
        });
        socket.emit('overbidding', { loginedId });

    }, []);

    return (
        <>
            <article>알람</article>
        </>
    );
}

export default AuctionAlarm;