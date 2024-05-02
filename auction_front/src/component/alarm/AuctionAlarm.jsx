import React, { useEffect } from "react";
import { SERVER_URL } from "../../config/server_url";
import io from "socket.io-client";

function AuctionAlarm() {

    useEffect(() => {
        const socket = io(`${SERVER_URL.SERVER_URL()}`);

        socket.on('connect', () => {
            console.log('connected to server성공 !!!');
        });

        socket.on('disconnect', () => {
            console.log('disconnected from server');
        });

    }, []);

    return (
        <>
            <article>알람</article>
        </>
    );
}

export default AuctionAlarm;