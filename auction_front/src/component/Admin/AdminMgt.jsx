import React, { useEffect, useState,useMemo } from "react";
import { SERVER_URL } from "../../config/server_url";
import axios from "axios";
import '../../css/Admin/modify_modal.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sessionCheck } from "../../util/sessionCheck";
import '../../css/Admin/AdminMgt.css';
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

function AdminMgt() {
    const sessionId = useSelector((state) => state['loginedInfos']['loginedId']['sessionId']);
    const navigate = useNavigate();
    const [loadingModalShow,setLoadingModalShow] = useState(false);
    const [rowData, setRowData] = useState([]);
    const [colDefs, setColDefs] = useState([]);
    const [editModeRows, setEditModeRows] = useState({});

    useEffect(() => {
        sessionCheck(sessionId, navigate);
        setLoadingModalShow(true)
        axios_admin_list();

        setColDefs([
            
            {
                field: 'A_ID',
                headerName: '관리자ID',
                width: 130,
            },
            {
                field: 'A_NAME',
                headerName: '관리자 이름',
                width: 140,
                editable: (params) => editModeRows[params.data.A_ID] || false,

            },
            {
                field: 'A_PHONE',
                headerName: '관리자 전화번호',
                width: 150,
                editable: (params) => editModeRows[params.data.A_ID] || false,
                onCellDoubleClicked: axios_admin_modify_confirm,
            },
            {
                field: 'A_MAIL',
                headerName: '관리자 이메일',
                editable: (params) => editModeRows[params.data.A_ID] || false,
                onCellDoubleClicked: axios_admin_modify_confirm,
            },
            {   field: 'A_REG_DATE', 
                headerName: '관리자 등록일',
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
            {   field: 'A_MOD_DATE', 
                headerName: '관리자 수정일',
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
                field: 'edit',
                headerName: '수정',
                width: 80,            
                filter: false,
                floatingFilter: false,

                cellRenderer: (params) => (
                    editModeRows[params.data.A_ID] ? (
                        <button onClick={() => handleSave(params.data)}>저장</button>
                    ) : (
                        <input
                            type="checkbox"
                            checked={editModeRows[params.data.A_ID] || false}
                            onChange={() =>
                                setEditModeRows({
                                    ...editModeRows,
                                    [params.data.A_ID]: !editModeRows[params.data.A_ID],
                                })
                            }
                        />
                    )
                ),
            },
            {
                field: 'delete',
                headerName: '탈퇴',
                width: 80,
                cellRenderer: (params) => (
                    <button onClick={() => adminDeleteBtn(params.data)}>탈퇴</button>
                ),
                filter: false,
                floatingFilter: false,
            },
        ]);
    }, [sessionId, editModeRows]);

    const defaultColDef = useMemo(() => {
        return {
            filter: 'agTextColumnFilter',
            floatingFilter: true,
            resizable: true,
        };
    }, []);

    async function axios_admin_list() {
        try {
            const response = await axios.get(`${SERVER_URL.SERVER_URL()}/admin/admin_list`);
            setRowData(response.data);
            setLoadingModalShow(false)
        } catch (error) {
            console.log(error);
        }
    }

    async function adminDeleteBtn(id) {
        if (window.confirm("정말로 탈퇴시키겠습니까?")) {
            try {
                const response = await axios.delete(`${SERVER_URL.SERVER_URL()}/admin/admin_delete`, {
                    data: {
                        id: id.A_ID
                    }
                });
                if (response.data > 0) {
                    alert('삭제가 완료되었습니다.');
                    axios_admin_list();
                } else {
                    alert('삭제에 실패했습니다.');
                }
            } catch (error) {
                console.log(error);
                alert('삭제에 실패했습니다.');
            }
        }
    }

    const handleSave = (admin) => {

        console.log("저장할 관리자 정보:", admin);

        axios_admin_modify_confirm(admin.A_ID, admin.A_NAME, admin.A_MAIL, admin.A_PHONE);
        setEditModeRows({
            ...editModeRows,
            [admin.A_ID]: false,
        });
    };

    async function axios_admin_modify_confirm(a_id, a_name, a_mail, a_phone) {
        try {
            const response = await axios.post(`${SERVER_URL.SERVER_URL()}/admin/admin_modify_confirm`, {
                a_id,
                a_name,
                a_mail,
                a_phone
            });
            if (response.data == null) {
                alert('데이터베이스 오류가 발생했습니다.');
            } else if (response.data > 0) {
                alert('관리자 수정에 성공하였습니다.');
                axios_admin_list();
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        
        <article className="admin-mgt">
            
            <div className="admin-mgt-title">어드민 관리</div>
            <div className="ag-theme-quartz" style={{ height: '500px', width: '100%' }}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={colDefs}
                    defaultColDef={defaultColDef}
                    pagination={true}
                    paginationPageSize={10}
                />
            </div>
            {loadingModalShow === true ? <LoadingModal /> : null}
        </article>
        
    );
}

export default AdminMgt;