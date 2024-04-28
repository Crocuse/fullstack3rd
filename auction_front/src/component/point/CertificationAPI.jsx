import React, { useEffect } from "react";
import axios from "axios";
import { SERVER_URL } from "../../config/server_url";

function CertificationAPI () {
    const IMP = window.IMP;

    useEffect(() => {
        IMP.init('imp55455045');

    },[]);

    function certificationBtn() {

        // IMP.certification(param, callback) 호출
        IMP.certification({
            pg: "inicis_unified",
            merchant_uid: "store-9eef78c7-0222-4d91-9b80-8eccfdc3ff45", //가맹점 주문번호
           // m_redirect_url: "{리디렉션 될 URL}", // 모바일환경에서 popup:false(기본값) 인 경우 필수, 예: https://www.myservice.com/payments/complete/mobile

        }, function (rsp) {
            if (rsp.success){
             // 인증 성공 시 로직
                console.log('rsp.imp_uid==>',rsp.imp_uid);
                axios_certificationDB(rsp.imp_uid);

            } else {
                //인증 실패 시
                alert('에러 발생: ' + rsp.error_msg);
            }

        });
    }
// =====================================================
/*
    async  function axios_certificationDB (imp_uid) {
        console.log('imp_uid---->',imp_uid);
        try {
            const response = await axios.post(`${SERVER_URL.SERVER_URL()}/point/certifications`, {
                imp_uid: 'imp55455045',
            });

        } catch (error) {
            alert(error.error_msg);
        }
    }
    */
// =====================================================================================

async  function axios_certificationDB (imp_uid) {
  try {
    // 인증 토큰 발급 받기
    const getToken = await axios({
        url: "https://api.iamport.kr/users/getToken",
      // POST method
      method: "post",
      // "Content-Type": "application/json"
      headers: { "Content-Type": "application/json" },
      data: {
        imp_key: "3156367481334625", // REST API키
        imp_secret:
          "5Zginw69mpP3CcXSTo7mZYfUwP4U7VDkof6jmDn36bLGsrdTLb2lnuq4ZdGdGQW5Yw7B1HLjUjkJst5j", // REST API Secret
      },
    });
    const { access_token } = getToken.data.response; // 인증 토큰
    console.log('access_token-------------->>>>>>',{access_token});
    // imp_uid로 인증 정보 조회
    const getCertifications = await axios({
      // imp_uid 전달
      url: `https://api.iamport.kr/certifications/${imp_uid}`,
      // GET method
      method: "get",
      // 인증 토큰 Authorization header에 추가
      headers: { Authorization: access_token },
    });
    const certificationsInfo = getCertifications.data; // 조회한 인증 정보
     console.log('certificationsInfo==>>>',certificationsInfo)
  } catch (e) {
    console.error(e);
  }
}

    // =================================================================
    return(

        <>
         <input type="button" onClick={certificationBtn}  value='본인 인증'/>
        </>
    );
}

export default CertificationAPI;