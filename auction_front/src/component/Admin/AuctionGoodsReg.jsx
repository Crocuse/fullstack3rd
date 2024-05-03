import axios from "axios";
import React, { useEffect, useState } from "react"
import { SERVER_URL } from "../../config/server_url";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sessionCheck } from "../../util/sessionCheck";
import '../../css/Admin/AuctionGoodsReg.css';

function AuctionGoodsReg() {
    
    const sessionId = useSelector((state) => state['loginedInfos']['loginedId']['sessionId']);   
    const navigate = useNavigate();

    const [goodsRegList, setGoodsRegList] = useState([]);
    const [goodsState, setGoodsState] = useState(false);
    const [selectedGoods, setSelectedGoods] = useState(null);

    useEffect(()=>{
        sessionCheck(sessionId, navigate);
        axios_goods_reg_list();
        console.log(goodsState);
    },[sessionId, navigate])

    function getTodayDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
      }
    

    const goodsStateclickBtn = (goods) => {
        setGoodsState(!goodsState);
        if (!goodsState) {
          setSelectedGoods(goods);
        } else {
          axios_goods_reg_state_change(goods.GR_NO);
        }
      };

    async function axios_goods_reg_list(){
        try {
            const response = await axios.get(`${SERVER_URL.SERVER_URL()}/admin/goods_reg_list`);
            setGoodsRegList(response.data);
        } catch (error) {
            console.log(error);
        }
    }
    async function axios_goods_reg_state_change(gr_no){
        try {
            const locationNum = document.querySelector(`select[name="goods_location_num_${gr_no}"]`).value;
            const asState = document.querySelector(`select[name="goods_state_${gr_no}"]`).value;
            const startDate = document.querySelector(`input[name="as_start_date_${gr_no}"]`).value;

        

            if(startDate <= getTodayDate()){
                alert('당일이나 오늘 이전으로는 등록할 수 없습니다.');
                return;
            }
            

            const response = await axios.post(`${SERVER_URL.SERVER_URL()}/admin/goods_reg_state_change`, {
              gr_no,
              as_location_num: locationNum,
              as_state: asState,
              as_start_date : startDate
            });
            
            console.log(response.data);
            if(response.data==='fail'){
                alert('상태변경에 실패했습니다.')
                return;
            } else if(response.data === 'already'){
                alert('한 날짜에 자리는 중복될 수 없습니다.')
                return;
            } else if(response.data === 'success'){
                axios_goods_reg_list();
            }

            axios_goods_reg_list();
          } catch (error) {
            console.log(error);
          }
    }


    return (
        
        <article className="auction-goods-reg">
            <div className="auction-goods-reg-title">AuctionGoodsReg</div>    

            <table className="auction-goods-reg-table">
                <thead>
                    <tr>
                        <th>상품번호</th>
                        <th>등록자ID</th>
                        <th>상품명</th>
                        <th>시작가격</th>
                        <th>대기상태</th>
                        <th>자리위치번호</th>
                        <th>경매시작날</th>
                        <th>경매등록</th>
                    </tr>
                </thead>
                <tbody>
                    {goodsRegList.length == 0 ? (
                        <tr>
                        <td colSpan="8" className="auction-goods-reg-empty">등록 대기중인 상품이 없습니다.</td>
                        </tr>
                    ) : (
                        goodsRegList.map((goods) => (
                        <tr key={goods.GR_NO} className="auction-goods-reg-row">
                            <td>{goods.GR_NO}</td>
                            <td>{goods.M_ID}</td>
                            <td>{goods.GR_NAME}</td>
                            <td>{goods.GR_PRICE}</td>
                            <td className="auction-goods-reg-status">
                                {goodsState && selectedGoods.GR_NO === goods.GR_NO ?
                                
                                
                                    
                                    <select name={`goods_state_${goods.GR_NO}`} defaultValue={goods.AS_STATUS}>
                                        <option value="0">등록대기</option>
                                        <option value="2">등록완료</option>
                                    </select>
                                
                                :
                                    (

                                    goods.AS_START_DATE == getTodayDate() ?
                                    "경매 진행중"
                                    :
                                    goods.AS_START_DATE < getTodayDate() ?
                                    "경매 종료"
                                    :
                                    goods.AS_STATUS == 0 ? 
                                    "등록 대기"
                                    : 
                                    goods.AS_STATUS == 1 ? 
                                    "재경매 미승인" 
                                    : 
                                    goods.AS_STATUS == 2 ? 
                                    "경매 대기중"
                                    :
                                    
                                    "오류"
                                    )
                                }

                            </td>
                            <td className="auction-goods-reg-location">
                                {goodsState && selectedGoods.GR_NO === goods.GR_NO ?
                                
                                <select name={`goods_location_num_${goods.GR_NO}`} defaultValue={goods.AS_LOCATION_NUM}>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                </select>

                                :
                                
                                (
                                    goods.AS_LOCATION_NUM === null ? 
                                    "자리 미정"
                                    :
                                    `${goods.AS_LOCATION_NUM}번 자리`
                                )
                                }
                            </td>

                            <td className="auction-goods-reg-date">
                                {goodsState && selectedGoods.GR_NO === goods.GR_NO ?
                                
                                    <input type="date" name={`as_start_date_${goods.GR_NO}`} defaultValue={goods.AS_START_DATE}/>

                                :
                                
                                (
                                    goods.AS_START_DATE === null ? "시작날 미정" : goods.AS_START_DATE
                                )}
                                </td>
                            <td>
                                <button className="auction-goods-reg-button" onClick={()=>goodsStateclickBtn(goods)}>등록수정</button>
                            </td>
                        </tr>
                        ))
                    )}
                </tbody>
            </table>
        </article>
    );
}
export default AuctionGoodsReg;