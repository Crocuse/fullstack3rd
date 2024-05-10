import axios from "axios";
import React, { useEffect, useState, useMemo, useRef } from "react";
import { SERVER_URL } from "../../config/server_url";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sessionCheck } from "../../util/sessionCheck";
import "../../css/Admin/AuctionResult.css";
import LoadingModal from '../include/LoadingModal';

import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, RowType } from 'ag-grid-community';
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

function AuctionResult() {
    const gridRef = useRef();
    const sessionId = useSelector((state) => state['loginedInfos']['loginedId']['sessionId']);
    const navigate = useNavigate();
    const [resultList, setResultList] = useState([]);
    const [colDefs, setColDefs] = useState([]);
    const [loadingModalShow, setLoadingModalShow] = useState(false);

    useEffect(() => {
        sessionCheck(sessionId, navigate);
        setLoadingModalShow(true);
        axios_auction_result_list();
    }, [sessionId, navigate]);

    useEffect(() => {
        setColDefs([
            {
                field: 'GR_NO',
                headerName: '상품번호',
                width: 105,
                filter: 'agNumberColumnFilter',
            },
            {
                field: 'GR_NAME',
                headerName: '상품명',
                width: 291,
                filter: 'agTextColumnFilter',
            },
            {
                field: 'AR_IS_BID',
                headerName: '경매결과',
                width: 105,
                valueFormatter: (params) => params.value === 0 ? "유찰" : "낙찰",
                filter: 'agSetColumnFilter',
                filterParams: {
                    values: [0, 1],
                    valueFormatter: (params) => params.value === 0 ? "유찰" : "낙찰",
                },
            },
            {
                field: 'AR_SELL_ID',
                headerName: '판매자ID',
                filter: 'agTextColumnFilter',
                width: 120,
            },
            {
                field: 'AR_BUY_ID',
                headerName: '구매자ID',
                width: 120,
                filter: 'agTextColumnFilter',
            },
            {
                field: 'AR_POINT',
                headerName: '낙찰 포인트',
                width: 130,
                filter: 'agNumberColumnFilter',
            },
            {
                field: 'AR_REG_DATE',
                headerName: '경매일',
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
                field: 'DG_STATUS',
                headerName: '물품배송',
                width: 110,
                cellRenderer: (params) => {
                    const { DG_STATUS, DG_ADDR, AR_IS_BID, GR_NO, AR_BUY_ID } = params.data;
                    if (DG_STATUS === 0 && DG_ADDR !== null && AR_IS_BID === 1) {
                        return <button onClick={() => deliveryGoods(GR_NO, AR_BUY_ID)}>물품배송</button>;
                    } else if (DG_STATUS === 0 && DG_ADDR === null && AR_IS_BID === 1) {
                        return "배송지 정보가 없습니다.";
                    } else if (DG_STATUS === 1 && DG_ADDR !== null) {
                        return "배송중";
                    } else {
                        return "";
                    }
                },
                filter: false,
            },
            
        ]);
    }, []);

    const rowClassRules = useMemo(() => ({
      'row-green': (params) => params.data.AR_IS_BID === 1,
      'row-red': (params) => params.data.AR_IS_BID === 0,
      'row-yellow': (params) => params.data.AR_IS_BID === 1 && params.data.DG_STATUS === 0,
    }), []);


    const defaultColDef = useMemo(() => ({
        filter: true,
        floatingFilter: true,
        resizable: true,
    }), []);


    const deliveryGoods = (no, id) => {
        let confirm = window.confirm(`구매자 ${id} 에게 물품을 배송하시겠습니까?`);
        if (confirm) {
            axios_delivery_goods(no);
        }
    };

    async function axios_auction_result_list() {
        try {
            const response = await axios.get(`${SERVER_URL.SERVER_URL()}/admin/auction_result_list`);
            setResultList(response.data);
            setLoadingModalShow(false);
        } catch (error) {
            console.log(error);
        }
    }

    async function axios_delivery_goods(no) {
        try {
            const response = await axios.post(`${SERVER_URL.SERVER_URL()}/admin/delivery_goods`, { gr_no: no });
            if (response.data > 1) {
                axios_auction_result_list();
            } else {
                alert('물품배송 업데이트에 실패하였습니다.');
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <article className="auction-result">
            <div className="auction-result-title">AuctionResult</div>
            <div className="ag-theme-quartz" style={{ height: '500px', width: '100%' }}>
                <AgGridReact
                    ref={gridRef}
                    rowData={resultList}
                    columnDefs={colDefs}
                    defaultColDef={defaultColDef}
                    pagination={true}
                    paginationPageSize={10}
                    rowClassRules={rowClassRules}
                />
            </div>
            {loadingModalShow === true ? <LoadingModal /> : null}
        </article>
    );
}

export default AuctionResult;