import React, { useEffect, useState, useMemo, useRef } from "react";
import { SERVER_URL } from "../../config/server_url";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sessionCheck } from "../../util/sessionCheck";
import "../../css/Admin/AuctionGoodsReg.css";
import LoadingModal from '../include/LoadingModal';

import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry } from 'ag-grid-community';
import { ClientSideRowModelModule } from 'ag-grid-community';
import { MenuModule } from 'ag-grid-enterprise';
import { ColumnsToolPanelModule } from 'ag-grid-enterprise';
import { FiltersToolPanelModule } from 'ag-grid-enterprise';
import { SetFilterModule } from 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    MenuModule,
    ColumnsToolPanelModule,
    FiltersToolPanelModule,
    SetFilterModule,
]);

function AuctionGoodsReg() {
    const gridRef = useRef();
    const sessionId = useSelector((state) => state["loginedInfos"]["loginedId"]["sessionId"]);
    const navigate = useNavigate();
    const [rowClassName, setRowClassName] = useState('');
    const [goodsRegList, setGoodsRegList] = useState([]);
    const [rowData, setRowData] = useState([]);
    const [editModeRows, setEditModeRows] = useState({});
    const [colDefs, setColDefs] = useState([]);
    const [loadingModalShow,setLoadingModalShow] = useState(false);

    useEffect(() => {
        sessionCheck(sessionId, navigate);
        setLoadingModalShow(true)
        axios_goods_reg_list();
    }, [sessionId]);

    useEffect(() => {
        setColDefs([
            {
                field: 'GR_NO',
                headerName: '상품번호',
                pinned: 'left',
                width: 110,
                filter: 'agNumberColumnFilter',
            },
            {
                field: 'M_ID',
                headerName: '등록자ID',
                width: 130,
                filter: 'agTextColumnFilter',
            },
            {
                field: 'GR_NAME',
                headerName: '상품명',
                filter: 'agTextColumnFilter',
            },
            {
                field: 'GR_PRICE',
                headerName: '경매시작가',
                width: 130,
                filter: 'agNumberColumnFilter',
            },
            {
                field: 'AS_STATUS',
                headerName: '대기상태',
                cellRenderer: (params) => {
                    const { AS_START_DATE, AS_STATUS } = params.data;
                    if (AS_START_DATE === getTodayDate()) {
                        return "경매 진행중";
                    } else if (AS_START_DATE < getTodayDate()) {
                        return "경매 종료";
                    } else if (AS_STATUS === 0) {
                        return "등록 대기";
                    } else if (AS_STATUS === 1) {
                        return "재경매 미승인";
                    } else if (AS_STATUS === 2) {
                        return "경매 대기중";
                    } else {
                        return "오류";
                    }
                },
                filter: 'agTextColumnFilter',
            },
            {
                field: "AS_LOCATION_NUM",
                headerName: "자리위치번호",
                cellEditor: "agSelectCellEditor",
                cellEditorParams: {
                    values: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                },
                editable: (params) => editModeRows[params.data.GR_NO] || false,
                filter: 'agNumberColumnFilter',
            },
            {
                field: "AS_START_DATE",
                headerName: "경매시작날",
                cellEditor: "agDateStringCellEditor",
                editable: (params) => editModeRows[params.data.GR_NO] || false,
                cellEditorParams: {
                    minValidDate: getTodayDate(),
                },
                filter: "agDateColumnFilter",
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
                field: "edit",
                headerName: "경매등록",
                width: 120,
                cellRenderer: (params) => {
                    if (params.data.AS_START_DATE < getTodayDate()) return null;
                    return editModeRows[params.data.GR_NO] ? (
                        <button onClick={() => axios_goods_reg_state_change(params.data)}>저장</button>
                    ) : (
                        <input
                            type="checkbox"
                            checked={editModeRows[params.data.GR_NO] || false}
                            onChange={() =>
                                setEditModeRows({
                                    ...editModeRows,
                                    [params.data.GR_NO]: !editModeRows[params.data.GR_NO],
                                })
                            }
                        />
                    );
                },
                filter: false,
            },
        ]);
    }, [editModeRows]);

    const defaultColDef = useMemo(() => ({
        filter: true,
        floatingFilter: true,
        resizable: true,
    }), []);

    const rowClassRules = useMemo(() => ({
        
        'row-green': (params) => {
          const { AS_START_DATE, AS_STATUS } = params.data;
          return AS_START_DATE === getTodayDate() && AS_STATUS !== 1 && AS_STATUS !== 0 && AS_STATUS !== 2;
        },
        'row-red': (params) => params.data.AS_STATUS === 1,
        'row-yellow': (params) => params.data.AS_STATUS === 0,
        'row-blue': (params) => params.data.AS_STATUS === 2,
        'row-gray': (params) => params.data.AS_START_DATE < getTodayDate(),
      }), []);


    function getTodayDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    async function axios_goods_reg_list() {
        try {
            setLoadingModalShow(true)
            const response = await axios.get(`${SERVER_URL.SERVER_URL()}/admin/goods_reg_list`);
            
            setRowData(response.data);
            setLoadingModalShow(false)
        } catch (error) {
            console.log(error);
        }
    }

    async function axios_goods_reg_state_change(data) {
        try {
            setLoadingModalShow(true)
            const { GR_NO, AS_LOCATION_NUM, AS_STATUS, AS_START_DATE } = data;
            const startDate = new Date(AS_START_DATE).toISOString().split("T")[0];

            if (startDate <= getTodayDate()) {
                alert("당일이나 오늘 이전으로는 등록할 수 없습니다.");
                setLoadingModalShow(false)
                return;
            }

            const response = await axios.post(`${SERVER_URL.SERVER_URL()}/admin/goods_reg_state_change`, {
                gr_no: GR_NO,
                as_location_num: AS_LOCATION_NUM,
                as_state: AS_STATUS,
                as_start_date: startDate,
            });

            console.log(response.data);
            if (response.data === "fail") {
                alert("상태변경에 실패했습니다.");
            } else if (response.data === "already") {
                alert("한 날짜에 자리는 중복될 수 없습니다.");
            } else if (response.data === "success") {
                
                axios_goods_reg_list();
                setEditModeRows({});
            }
            setLoadingModalShow(false)
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <article className="auction-goods-reg">
        
            <div className="auction-goods-reg-title">AuctionGoodsReg</div>
            <div className="ag-theme-quartz" style={{ height: '500px', width: '100%' }}>
                <AgGridReact
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={colDefs}
                    defaultColDef={defaultColDef}
                    pagination={true}
                    paginationPageSize={10}
                    rowClassRules={rowClassRules}
                    sideBar={{
                        toolPanels: [
                        {
                            id: 'columns',
                            labelDefault: 'Columns',
                            labelKey: 'columns',
                            iconKey: 'columns',
                            toolPanel: 'agColumnsToolPanel',
                        },
                        {
                            id: 'filters',
                            labelDefault: 'Filters',
                            labelKey: 'filters',
                            iconKey: 'filter',
                            toolPanel: 'agFiltersToolPanel',
                        },
                        ],
                    }}
                />
            </div>
            {loadingModalShow === true ? <LoadingModal /> : null}
        </article>
    );
}

export default AuctionGoodsReg;