import axios from "axios";
import React, { useEffect, useState, useMemo, useRef } from "react";
import { SERVER_URL } from "../../config/server_url";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sessionCheck } from "../../util/sessionCheck";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import LoadingModal from '../include/LoadingModal';
import '../../css/Admin/AuctionGoodsMgt.css';

function AuctionGoodsMgt() {
  const sessionId = useSelector((state) => state['loginedInfos']['loginedId']['sessionId']);
  const navigate = useNavigate();
  const gridRef = useRef(null);
  const [rowData, setRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [loadingModalShow, setLoadingModalShow] = useState(false);
  const [editModeRows, setEditModeRows] = useState({});

  useEffect(() => {
    setLoadingModalShow(true);
    sessionCheck(sessionId, navigate);
    axios_goods_list();
  }, [sessionId, navigate]);

  useEffect(() => {
    setColumnDefs([
      { headerName: '상품번호', field: 'GR_NO' },
      { headerName: '상품이름', field: 'GR_NAME' },
      { headerName: '등록ID', field: 'M_ID' },
      { headerName: '상품가격', field: 'GR_PRICE' },
      {
        headerName: '등록상태',
        field: 'GR_APPROVAL',
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: ['대기', '승인', '반려']
        },
      },
      {
        headerName: '수령상태',
        field: 'GR_RECEIPT',
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: ['미수령', '수령'],
        },
      },
      {
        headerName: '등록일',
        field: 'GR_REG_DATE',
        filter: 'agDateColumnFilter',
        filterParams: {
          comparator: (filterLocalDateAtMidnight, cellValue) => {
            const cellDate = new Date(cellValue);
            const cellDateOnly = new Date(cellDate.getFullYear(), cellDate.getMonth(), cellDate.getDate());
            if (filterLocalDateAtMidnight.getTime() === cellDateOnly.getTime()) {
              return 0;
            }
            if (cellDateOnly < filterLocalDateAtMidnight) {
              return -1;
            }
            if (cellDateOnly > filterLocalDateAtMidnight) {
              return 1;
            }
          },
        },
      },
      {
        headerName: '수정일',
        field: 'GR_MOD_DATE',
        filter: 'agDateColumnFilter',
        filterParams: {
          comparator: (filterLocalDateAtMidnight, cellValue) => {
            const cellDate = new Date(cellValue);
            const cellDateOnly = new Date(cellDate.getFullYear(), cellDate.getMonth(), cellDate.getDate());
            if (filterLocalDateAtMidnight.getTime() === cellDateOnly.getTime()) {
              return 0;
            }
            if (cellDateOnly < filterLocalDateAtMidnight) {
              return -1;
            }
            if (cellDateOnly > filterLocalDateAtMidnight) {
              return 1;
            }
          },
        },
      },
      {
        headerName: '수정',
        field: 'GR_NO',
        filter: false,
        floatingFilter: false,
        cellRenderer: (params) => (
          editModeRows[params.data.GR_NO] ? (
            <button onClick={() => {
              const approvalMap = {
                '대기': 0,
                '승인': 1,
                '반려': 2,
              };
              const receiptMap = {
                '미수령': 0,
                '수령': 1,
              };
              const approval = approvalMap[params.data.GR_APPROVAL];
              const receipt = receiptMap[params.data.GR_RECEIPT];
              axios_goods_state_change(params.value, approval, receipt);
              setEditModeRows(prevState => ({
                ...prevState,
                [params.data.GR_NO]: false,
              }));
            }}>
              저장
            </button>
          ) : (
            <input
              type="checkbox"
              checked={editModeRows[params.data.GR_NO] || false}
              onChange={() =>
                setEditModeRows(prevState => ({
                  ...prevState,
                  [params.data.GR_NO]: !prevState[params.data.GR_NO],
                }))
              }
            />
          )
        ),
      },
    ]);
  }, [editModeRows]);

  const defaultColDef = useMemo(() => ({
    editable: (params) => editModeRows[params.data.GR_NO] || false,
    resizable: true,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
  }), [editModeRows]);

  const rowClassRules = useMemo(() => ({
  'row-red': params => params.data.GR_APPROVAL === '반려',
  'row-green': params => params.data.GR_APPROVAL === '승인',
  'row-yellow': params => params.data.GR_APPROVAL === '대기',
  }), []);

  const axios_goods_list = async () => {
    try {
      const response = await axios.get(`${SERVER_URL.SERVER_URL()}/admin/goods_list`);
      const data = response.data.map(item => ({
        ...item,
        GR_APPROVAL: item.GR_APPROVAL === 0 ? '대기' :
                     item.GR_APPROVAL === 1 ? '승인' : '반려',
        GR_RECEIPT: item.GR_RECEIPT === 0 ? '미수령' : 
                    item.GR_RECEIPT === 1 ? '수령' : '오류'
      }));
      setRowData(data);
      setLoadingModalShow(false);
    } catch (error) {
      console.log(error);
    }
  };

  const axios_goods_state_change = async (gr_no, approval, receipt) => {
    try {
      const response = await axios.post(`${SERVER_URL.SERVER_URL()}/admin/goods_state_change`, {
        gr_no,
        approval,
        receipt : approval == 0 ? 0 : 
                  approval == 1 ? receipt :
                  approval == 2 ? 0 : null,
      });

      if (response.data === 'success') {
        axios_goods_list();
      } else {
        console.log('상태 변경 실패');
      }
    } catch (error) {
      console.log(error);
    }
  };

  
  return (
    <article>
      <div>AuctionGoodsMgt</div>
      <div className="ag-theme-quartz" style={{ height: '500px', width: '100%' }}>
      <AgGridReact
        rowClassRules={rowClassRules}
        ref={gridRef}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        paginationPageSize={20}
      />
      </div>
      {loadingModalShow === true ? <LoadingModal /> : null}
    </article>
  );
}

export default AuctionGoodsMgt;