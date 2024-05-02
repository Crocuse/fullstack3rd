import axios from "axios";
import React, { useEffect, useState } from "react";
import { SERVER_URL } from "../../config/server_url";

function AuctionResult() {
  const [resultList, setResultList] = useState([]);

  useEffect(() => {
    axios_auction_result_list();
  }, []);

  const reBidAlert = (no,id) =>{
    let confirm = window.confirm(`판매자 ${id} 에게 재경매 여부 알림을 보내시겠습니까?`);
  }
  const deliveryGoods = (no,id) =>{
    let confirm = window.confirm(`구매자 ${id} 에게 물품을 배송하시겠습니까?`);

    if(confirm){
        axios_delivery_goods(no);
    }
  }


  async function axios_auction_result_list() {
    try {
      const response = await axios.get(
        `${SERVER_URL.SERVER_URL()}/admin/auction_result_list`
      );
      setResultList(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function axios_delivery_goods(no) {
    try {
      const response = await axios.post(
        `${SERVER_URL.SERVER_URL()}/admin/delivery_goods`,{gr_no : no}
      );
      if(response.data > 1){
          axios_auction_result_list();
      }else {
        alert('물품배송 업데이트에 실패하였습니다.');
      }
      
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <article>
      <div>AuctionResult</div>
      <table>
        <thead>
          <tr>
            <th>상품번호</th>
            <th>상품명</th>
            <th>경매결과</th>
            <th>판매자ID</th>
            <th>구매자ID</th>
            <th>낙찰 포인트</th>
            <th>경매일</th>
            <th>물품배송</th>
            <th>재경매여부</th>
          </tr>
        </thead>
        <tbody>
          {resultList.length > 0 ? (
            resultList.map((List) => (
              <tr key={List.GR_NO}>
                <td>{List.GR_NO}</td>
                <td>{List.GR_NAME}</td>
                <td>{List.AR_IS_BID === 0 ? "유찰": "낙찰"}</td>
                <td>{List.AR_SELL_ID}</td>
                <td>{List.AR_BUY_ID}</td>
                <td>{List.AR_POINT}</td>
                <td>{List.AR_REG_DATE}</td>
                <td>
                  {

                  List.DG_STATUS === 0 && List.DG_ADDR !== null && List.AR_IS_BID === 1  
                  ? 
                  
                  <button onClick={()=>deliveryGoods(List.GR_NO,List.AR_BUY_ID)}>물품배송</button> 
                  
                  : 
                  
                  List.DG_STATUS === 0 && List.DG_ADDR === null && List.AR_IS_BID === 1 
                  ?
                  "배송지 정보가 없습니다."
                  :
                  List.DG_STATUS === 1 && List.DG_ADDR !== null 
                  ?
                  "배송중"
                  :
                  ""

                  }
                </td>
                <td>
                  {List.AR_IS_BID === 0 ? <button onClick={()=>reBidAlert(List.AR_SELL_ID)}>재경매알림</button> : null}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9">경매 종료된 상품이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </article>
  );
}

export default AuctionResult;