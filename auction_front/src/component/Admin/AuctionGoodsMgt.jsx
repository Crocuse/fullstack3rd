import axios from "axios";
import React, { useEffect, useState } from "react";
import { SERVER_URL } from "../../config/server_url";

function AuctionGoodsMgt() {
  const [goodsList, setGoodsList] = useState([]);
  const [goodsState, setGoodsState] = useState(false);
  const [selectedGoods, setSelectedGoods] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [searchId, setSearchId] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedApproval, setSelectedApproval] = useState("");
  const [selectedReceipt, setSelectedReceipt] = useState("");
  const [sortColumn, setSortColumn] = useState("GR_NO");
  const [sortDirection, setSortDirection] = useState("desc");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    axios_goods_list();
  }, []);


  const goodsStateclickBtn = (goods) => {
    setGoodsState(!goodsState);
    if (!goodsState) {
      setSelectedGoods(goods);
    } else {
      axios_goods_state_change(goods.GR_NO);
    }
  };

  async function axios_goods_list() {
    try {
      const response = await axios.get(`${SERVER_URL.SERVER_URL()}/admin/goods_list`);
      setGoodsList(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function axios_goods_state_change(gr_no) {
    try {
      const approvalValue = document.querySelector(`select[name="goods_approval_sel_${gr_no}"]`).value;
      const receiptValue = document.querySelector(`select[name="goods_receipt_sel_${gr_no}"]`).value;

      const response = await axios.post(`${SERVER_URL.SERVER_URL()}/admin/goods_state_change`, {
        gr_no,
        approval: approvalValue,
        receipt: receiptValue,
      });

      if (response.data === 'success') {
      // 데이터 다시 불러오기
      axios_goods_list();
      } else {
        console.log('상태 변경 실패');
      }

      } catch (error) {
        console.log(error);
      }
    }

  const handleSearchNameChange = (e) => setSearchName(e.target.value);
  const handleSearchIdChange = (e) => setSearchId(e.target.value);
  const handleMinPriceChange = (e) => setMinPrice(e.target.value);
  const handleMaxPriceChange = (e) => setMaxPrice(e.target.value);
  const handleApprovalChange = (e) => setSelectedApproval(e.target.value);
  const handleReceiptChange = (e) => setSelectedReceipt(e.target.value);
  const handleStartDateChange = (e) => setStartDate(e.target.value);
  const handleEndDateChange = (e) => setEndDate(e.target.value);
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const filteredList = goodsList.filter((goods) => {
    if (searchName && !goods.GR_NAME.includes(searchName)) return false;
    if (searchId && goods.M_ID !== searchId) return false;
    if (minPrice && goods.GR_PRICE < minPrice) return false;
    if (maxPrice && goods.GR_PRICE > maxPrice) return false;
    if (selectedApproval && goods.GR_APPROVAL !== Number(selectedApproval)) return false;
    if (selectedReceipt && goods.GR_RECEIPT !== Number(selectedReceipt)) return false;
    
    // 시작 날짜와 종료 날짜가 모두 선택된 경우
    if (startDate && endDate) {
      const regDate = new Date(goods.GR_REG_DATE);
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      // 년, 월, 일을 추출하여 비교
      const regDateStr = `${regDate.getFullYear()}-${regDate.getMonth()}-${regDate.getDate()}`;
      const startStr = `${start.getFullYear()}-${start.getMonth()}-${start.getDate()}`;
      const endStr = `${end.getFullYear()}-${end.getMonth()}-${end.getDate()}`;
      
      // 상품의 등록일이 시작 날짜보다 작거나 종료 날짜보다 큰 경우에는 필터링에서 제외
      if (regDateStr < startStr || regDateStr > endStr) return false;
    } 
    // 시작 날짜만 선택된 경우
    else if (startDate) {
      const regDate = new Date(goods.GR_REG_DATE);
      const start = new Date(startDate);
      
      // 년, 월, 일을 추출하여 비교
      const regDateStr = `${regDate.getFullYear()}-${regDate.getMonth()}-${regDate.getDate()}`;
      const startStr = `${start.getFullYear()}-${start.getMonth()}-${start.getDate()}`;
      
      // 상품의 등록일이 시작 날짜보다 작은 경우에는 필터링에서 제외
      if (regDateStr < startStr) return false;
    }
    // 종료 날짜만 선택된 경우
    else if (endDate) {
      const regDate = new Date(goods.GR_REG_DATE);
      const end = new Date(endDate);
      
      // 년, 월, 일을 추출하여 비교
      const regDateStr = `${regDate.getFullYear()}-${regDate.getMonth()}-${regDate.getDate()}`;
      const endStr = `${end.getFullYear()}-${end.getMonth()}-${end.getDate()}`;
      
      // 상품의 등록일이 종료 날짜보다 큰 경우에는 필터링에서 제외
      if (regDateStr > endStr) return false;
    }
    
    return true;
  });

  const sortedList = filteredList.sort((a, b) => {
    if (sortColumn === "GR_NO") {
      return sortDirection === "asc" ? a.GR_NO - b.GR_NO : b.GR_NO - a.GR_NO;
    } else if (sortColumn === "GR_PRICE") {
      return sortDirection === "asc" ? a.GR_PRICE - b.GR_PRICE : b.GR_PRICE - a.GR_PRICE;
    } else if (sortColumn === "GR_REG_DATE") {
      return sortDirection === "asc"
        ? new Date(a.GR_REG_DATE) - new Date(b.GR_REG_DATE)
        : new Date(b.GR_REG_DATE) - new Date(a.GR_REG_DATE);
    } else if (sortColumn === "GR_MOD_DATE") {
      return sortDirection === "asc"
        ? new Date(a.GR_MOD_DATE) - new Date(b.GR_MOD_DATE)
        : new Date(b.GR_MOD_DATE) - new Date(a.GR_MOD_DATE);
    }
    return 0;
  });

  return (
    <article>
      <div>AuctionGoodsMgt</div>
      <div>
        <span>상품이름검색</span>
        <br />
        <input type="text" placeholder="검색어를 입력하세요" value={searchName} onChange={handleSearchNameChange} />
        <br />
        <span>등록ID검색</span>
        <br />
        <input type="text" placeholder="ID를 입력하세요" value={searchId} onChange={handleSearchIdChange} />
        <br />
        <span>가격범위검색</span>
        <br />
        <input type="number" value={minPrice} onChange={handleMinPriceChange} /> ~{" "}
        <input type="number" value={maxPrice} onChange={handleMaxPriceChange} />
        <br />
        <span>등록일 범위 검색</span>
        <br />
        <input type="date" value={startDate} onChange={handleStartDateChange} /> ~{" "}
        <input type="date" value={endDate} onChange={handleEndDateChange} />
        <span>등록상태</span>
        <select value={selectedApproval} onChange={handleApprovalChange}>
          <option value="">All</option>
          <option value="0">대기</option>
          <option value="1">승인</option>
          <option value="2">반려</option>
        </select>
        <span>수령상태</span>
        <select value={selectedReceipt} onChange={handleReceiptChange}>
          <option value="">All</option>
          <option value="0">미수령</option>
          <option value="1">수령</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort("GR_NO")}>
              상품번호 {sortColumn === "GR_NO" && (sortDirection === "asc" ? "▲" : "▼")}
            </th>
            <th>상품이름</th>
            <th>등록ID</th>
            <th onClick={() => handleSort("GR_PRICE")}>
              상품가격 {sortColumn === "GR_PRICE" && (sortDirection === "asc" ? "▲" : "▼")}
            </th>
            <th>등록상태</th>
            <th>수령상태</th>
            <th onClick={() => handleSort("GR_REG_DATE")}>
              등록일 {sortColumn === "GR_REG_DATE" && (sortDirection === "asc" ? "▲" : "▼")}
            </th>
            <th onClick={() => handleSort("GR_MOD_DATE")}>
              수정일 {sortColumn === "GR_MOD_DATE" && (sortDirection === "asc" ? "▲" : "▼")}
            </th>
            <th>수정</th>
          </tr>
        </thead>
        <tbody>
          {sortedList.map((goods) => (
            <tr key={goods.GR_NO} style={{ textDecoration: goods.GR_APPROVAL === 2 ? "line-through" : "none" }}>
              <td>{goods.GR_NO}</td>
              <td>{goods.GR_NAME}</td>
              <td>{goods.M_ID}</td>
              <td>{goods.GR_PRICE}</td>
              <td>
  {goodsState && selectedGoods.GR_NO === goods.GR_NO ? (
    <>
      <select name={`goods_approval_sel_${goods.GR_NO}`} defaultValue={goods.GR_APPROVAL}
        onChange={(e) => {
          if (e.target.value === "2") {
            setSelectedGoods({ ...selectedGoods, showRejectInput: true });
          } else {
            setSelectedGoods({ ...selectedGoods, showRejectInput: false });
          }
        }}
      >
        <option value="0">대기</option>
        <option value="1">승인</option>
        <option value="2">반려</option>
      </select>
      {selectedGoods.showRejectInput && (
        <input
          type="text"
          placeholder="반려 사유를 입력하세요"
          onChange={(e) => setSelectedGoods({ ...selectedGoods, rejectReason: e.target.value })}
        />
      )}
    </>
  ) : goods.GR_APPROVAL === 0 ? "대기" : goods.GR_APPROVAL === 1 ? "승인" : "반려"}
</td>
              <td>
                {goodsState && selectedGoods.GR_NO === goods.GR_NO ? (
                  <select name={`goods_receipt_sel_${goods.GR_NO}`} defaultValue={goods.GR_RECEIPT}>
                    <option value="0">미수령</option>
                    <option value="1">수령</option>
                  </select>
                ) : goods.GR_RECEIPT === 0 ? "미수령" : "수령"}
              </td>
              <td>{goods.GR_REG_DATE.slice(0, 16)}</td>
              <td>{goods.GR_MOD_DATE.slice(0, 16)}</td>
              <td>
                {goodsState && selectedGoods.GR_NO === goods.GR_NO ? (
                  <button onClick={() => goodsStateclickBtn(goods)}>확인</button>
                ) : (
                  <button onClick={() => goodsStateclickBtn(goods)}>수정</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}

export default AuctionGoodsMgt;