import React, { useEffect, useState, useMemo, useRef } from "react";
import { SERVER_URL } from "../../config/server_url";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sessionCheck } from "../../util/sessionCheck";
import '../../css/Admin/UserMgt.css';
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

function UserMgt() {
    const gridRef = useRef(null);
    const [rowData, setRowData] = useState([]);
    const [colDefs, setColDefs] = useState([]);
    const [editModeRows, setEditModeRows] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [detailAddress, setDetailAddress] = useState("");
    const [loadingModalShow,setLoadingModalShow] = useState(false);


    const sessionId = useSelector(state => state['loginedInfos']['loginedId']['sessionId']);
    const navigate = useNavigate();

    useEffect(() => {
        setLoadingModalShow(true)
        axios_member_list();
        sessionCheck(sessionId, navigate);
    }, [sessionId]);

    useEffect(() => {
        setColDefs([
            {
                field: 'M_ID',
                headerName: '아이디',
                pinned: 'left'
            },
            {
                field: 'M_STATUS',
                headerName: '상태',
                filter: false,
                floatingFilter: false,
                cellRenderer: (params) => (
                    params.value === 1 ? '탈퇴' : '활동중'
                ),
            },
            {
                field: 'M_MAIL',
                headerName: '멤버 이메일',
                editable: (params) => {
                    if (params.data.M_SOCIAL_ID) {
                        return false;
                    }
                    return editModeRows[params.data.M_ID] || false;
                },
                onCellDoubleClicked: (params) => {
                    if (params.data.M_SOCIAL_ID) {
                        alert("소셜 로그인한 계정은 이메일 수정이 불가합니다.");
                    }
                },
            },
            {
                field: 'M_PHONE',
                headerName: '멤버 연락처',
                editable: (params) => editModeRows[params.data.M_ID] || false,
            },
            {
                field: 'M_ADDR',
                headerName: '멤버 주소',
                editable: (params) => editModeRows[params.data.M_ID] || false,
            },
            {
                field: 'postcode',
                headerName: '우편번호',
                filter: false,
                floatingFilter: false,
                cellRenderer: (params) => (
                    editModeRows[params.data.M_ID] ? (
                        <button onClick={() => openModal(params.data)}>우편번호 찾기</button>
                    ) : null
                ),
                hide: true,
            },
            {   field: 'M_REG_DATE', 
                headerName: '멤버 등록일',
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
                    field: 'M_MOD_DATE',
                    headerName: '멤버 수정일',
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
                    params.data.M_STATUS === 1 ? null : (
                        editModeRows[params.data.M_ID] ? (
                            <button onClick={() => axios_member_modify_confirm(params.data)}>저장</button>
                        ) : (
                            <input
                                type="checkbox"
                                checked={editModeRows[params.data.M_ID] || false}
                                onChange={() =>
                                    setEditModeRows({
                                        ...editModeRows,
                                        [params.data.M_ID]: !editModeRows[params.data.M_ID],
                                    })
                                }
                            />
                        )
                    )
                ),
            },
            {
                field: 'delete',
                headerName: '탈퇴',
                width: 80,
                cellRenderer: (params) => (
                    params.data.M_STATUS === 1 ? null : (
                        <button onClick={() => memberDeleteBtn(params.data)}>탈퇴</button>
                    )
                ),
                filter: false,
                floatingFilter: false,
            },
        ]);
    }, [editModeRows]);

    const defaultColDef = useMemo(() => {
        return {
            filter: 'agTextColumnFilter',
            floatingFilter: true,
            resizable: true,
        };
    }, []);

    const openModal = (member) => {
        setSelectedMember(member);
        setIsModalOpen(true);
        gridRef.current.columnApi.setColumnVisible('postcode', true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedAddress(null);
        setDetailAddress("");
    };

    const execDaumPostcode = () => {
        new window.daum.Postcode({
            oncomplete: function (data) {
                let roadAddr = data.roadAddress;
                let extraRoadAddr = "";

                if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
                    extraRoadAddr += data.bname;
                }
                if (data.buildingName !== "" && data.apartment === "Y") {
                    extraRoadAddr += extraRoadAddr !== "" ? ", " + data.buildingName : data.buildingName;
                }
                if (extraRoadAddr !== "") {
                    extraRoadAddr = " (" + extraRoadAddr + ")";
                }

                setSelectedAddress({
                    postcode: data.zonecode,
                    roadAddress: roadAddr,
                    extraAddress: extraRoadAddr,
                });
            },
        }).open();
    };

    const handleSave = () => {
        const updatedRowData = rowData.map((member) => {
            if (member.M_ID === selectedMember.M_ID) {
                return {
                    ...member,
                    M_ADDR: `${selectedAddress.postcode}/ ${selectedAddress.roadAddress} / ${detailAddress} / ${selectedAddress.extraAddress} `,
                };
            }
            return member;
        });
        setRowData(updatedRowData);
        setEditModeRows({
            ...editModeRows,
            [selectedMember.M_ID]: false,
        });
        gridRef.current.columnApi.setColumnVisible('postcode', false);
        closeModal();
    };

    async function axios_member_modify_confirm(data) {
        try {
            const response = await axios.post(`${SERVER_URL.SERVER_URL()}/admin/member_modify_confirm`, {
                data
            });
            if (response.data == null) {
                alert('데이터베이스 오류가 발생했습니다.');
            } else if (response.data > 0) {
                alert('유저 수정에 성공하였습니다.');
                setEditModeRows({});
                axios_member_list();
                setLoadingModalShow(false)
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function memberDeleteBtn(id) {
        if (window.confirm("정말로 탈퇴시키겠습니까?")) {
            try {
                const response = await axios.delete(`${SERVER_URL.SERVER_URL()}/admin/member_delete`, {
                    data: {
                        id: id.M_ID,
                    },
                });
                if (response.data > 0) {
                    alert('삭제가 완료되었습니다.');
                    axios_member_list();
                    setLoadingModalShow(false)
                } else {
                    alert('삭제에 실패했습니다.');
                }
            } catch (error) {
                console.log(error);
                alert('삭제에 실패했습니다.');
            }
        }
    }

    async function axios_member_list() {
        try {
            const response = await axios.get(`${SERVER_URL.SERVER_URL()}/admin/member_list`);
            setRowData(response.data);
            setLoadingModalShow(false)
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <article className="user-mgt">
            <div className="user-mgt-title">MEMBER MANAGEMENT</div>
            <div className="ag-theme-quartz" style={{ height: '500px', width: '100%' }}>
                <AgGridReact
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={colDefs}
                    defaultColDef={defaultColDef}
                    pagination={true}
                    paginationPageSize={10}
                />
            </div>
            {loadingModalShow === true ? <LoadingModal /> : null}
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>주소 입력</h2>
                        <div>
                            <input type="text" value={selectedAddress?.postcode || ""} readOnly />
                            <button onClick={execDaumPostcode}>우편번호 찾기</button>
                        </div>
                        <div>
                            <input type="text" value={selectedAddress?.roadAddress || ""} readOnly />
                        </div>
                        <div>
                            <input
                                type="text"
                                value={detailAddress}
                                onChange={(e) => setDetailAddress(e.target.value)}
                                placeholder="상세 주소 입력"
                            />
                        </div>
                        <div>
                            <button onClick={handleSave}>저장</button>
                            <button onClick={closeModal}>취소</button>
                        </div>
                    </div>
                </div>
            )}
            
        </article>
    );
}

export default UserMgt;