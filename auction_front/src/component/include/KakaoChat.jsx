import React, { useEffect } from "react";

function KakaoChat() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//developers.kakao.com/sdk/js/kakao.min.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.Kakao) {
        const Kakao = window.Kakao;
        if (!Kakao.isInitialized()) {
          Kakao.init("b9ad816e0e7b482a41126f2189fe3b38");
        }

        Kakao.Channel.createChatButton({
          container: "#kakao-talk-channel-chat-button",
          channelPublicId: "_xnxhzkG"
        });
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <style jsx>{`
        @media (min-width: 768px) {
          #kakao-talk-channel-chat-button {
            position: fixed;
            z-index: 999;
            right: 30px;
            bottom: 30px;
          }
        }
      `}</style>
      <div id="kakao-talk-channel-chat-button"></div>
    </>
  );
}

export default KakaoChat;