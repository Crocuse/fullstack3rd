import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sessionCheck } from '../../../util/sessionCheck';
import axios from 'axios';
import { SERVER_URL } from '../../../config/server_url';
import $ from 'jquery';

axios.defaults.withCredentials = true;

function ModifyInfo() {
    // Hook -----------------------------------------------------------------------------------------------------------
    const sessionId = useSelector((state) => state['loginedInfos']['loginedId']['sessionId']);
    const loginedId = useSelector((state) => state['loginedInfos']['loginedId']['loginedId']);
    const navigate = useNavigate();

    useEffect(() => {
        sessionCheck(sessionId, navigate);
        axios_get_my_info();
    }, [sessionId, navigate]);

    const [memberInfo, setMemberInfo] = useState({});
    const [memberPoint, setMemberPoint] = useState(0);
    const [phoneModify, setPhoneModify] = useState(false);
    const [addrModify, setAddrModify] = useState(false);

    // Handler -----------------------------------------------------------------------------------------------------------
    const modifyPhoneBtnClick = () => {
        setPhoneModify((prevState) => !prevState);
    };

    const modifyPhoneConfirmClick = () => {
        sessionCheck(sessionId, navigate);

        let phone1 = $('select[name="phone1"]').val();
        let phone2 = $('input[name="phone2"]').val();
        let phone3 = $('input[name="phone3"]').val();

        if (phone2 == '' || phone3 == '') {
            alert('수정할 연락처를 입력해주세요.');
            return;
        }

        let m_phone = `${phone1}-${phone2}-${phone3}`;

        axios_modify_phone(m_phone);
    };

    const modifyAddrBtnClick = () => {
        setAddrModify((prevState) => !prevState);
    };

    const modifyAddrConfirmClick = () => {
        sessionCheck(sessionId, navigate);

        let postcode = $('#postcode').val();
        let roadAddress = $('#roadAddress').val();
        let detailAddress = $('#detailAddress').val();
        let extraAddress = $('#extraAddress').val();

        if (postcode == '' || roadAddress == '' || detailAddress == '' || extraAddress == '') {
            alert('새로운 주소를 입력해주세요.');
            return;
        }

        let m_addr = `(${postcode})/${roadAddress}/${detailAddress}/${extraAddress}`;

        axios_modify_addr(m_addr);
    };

    // Fucntion -----------------------------------------------------------------------------------------------------------
    function execDaumPostcode() {
        new window.daum.Postcode({
            oncomplete: function (data) {
                let roadAddr = data.roadAddress;
                let extraRoadAddr = '';

                if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                    extraRoadAddr += data.bname;
                }
                if (data.buildingName !== '' && data.apartment === 'Y') {
                    extraRoadAddr += extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName;
                }
                if (extraRoadAddr !== '') {
                    extraRoadAddr = ' (' + extraRoadAddr + ')';
                }

                document.getElementById('postcode').value = data.zonecode;
                document.getElementById('roadAddress').value = roadAddr;

                if (roadAddr !== '') {
                    document.getElementById('extraAddress').value = extraRoadAddr;
                } else {
                    document.getElementById('extraAddress').value = '';
                }

                let guideTextBox = document.getElementById('guide');
                if (data.autoRoadAddress) {
                    let expRoadAddr = data.autoRoadAddress + extraRoadAddr;
                    guideTextBox.innerHTML = '(예상 도로명 주소 : ' + expRoadAddr + ')';
                    guideTextBox.style.display = 'block';
                } else {
                    guideTextBox.innerHTML = '';
                    guideTextBox.style.display = 'none';
                }
            },
        }).open();
    }

    // Axios -----------------------------------------------------------------------------------------------------------
    async function axios_get_my_info() {
        try {
            const response = await axios.get(`${SERVER_URL.SERVER_URL()}/member/get_my_info`, {
                params: {
                    id: loginedId,
                },
            });

            if (response.data == 'error') {
                alert('멤버 정보를 불러오는데 실패했습니다.');
                return;
            }

            setMemberInfo(response.data.selectedMember);
            setMemberPoint(response.data.currentPoint.P_CURRENT || 0);
        } catch (error) {
            console.log(error);
            alert('통신 오류가 발생했습니다.');
        }
    }

    async function axios_modify_phone(m_phone) {
        try {
            const response = await axios.post(`${SERVER_URL.SERVER_URL()}/member/modify_phone`, {
                m_phone,
            });

            if (response.data == 'error') {
                alert('회원 정보 수정에 실패했습니다.');
                return;
            }

            alert('연락처 정보가 수정되었습니다.');
            axios_get_my_info();
            modifyPhoneBtnClick();
        } catch (error) {
            console.log(error);
            alert('통신 오류가 발생했습니다.');
        }
    }

    async function axios_modify_addr(m_addr) {
        try {
            const response = await axios.post(`${SERVER_URL.SERVER_URL()}/member/modify_addr`, {
                m_addr,
            });

            if (response.data == 'error') {
                alert('회원 정보 수정에 실패했습니다.');
                return;
            }

            alert('주소 정보가 수정되었습니다.');
            axios_get_my_info();
            modifyAddrBtnClick();
        } catch (error) {
            console.log(error);
            alert('통신 오류가 발생했습니다.');
        }
    }

    // View -----------------------------------------------------------------------------------------------------------
    return (
        <article>
            <div className="title">
                <h2>내 정보</h2>
            </div>

            <div className="my_infos">
                <div className="id">아이디 : {memberInfo.M_ID}</div>

                <div className="mail">메일 {memberInfo.M_MAIL}</div>

                <div className="phone">
                    {phoneModify === false ? (
                        <>
                            연락처 {memberInfo.M_PHONE}
                            <button onClick={modifyPhoneBtnClick}>수정</button>
                        </>
                    ) : (
                        <>
                            <select name="phone1">
                                <option value="010">010</option>
                                <option value="011">011</option>
                                <option value="016">016</option>
                                <option value="017">017</option>
                                <option value="018">018</option>
                                <option value="019">019</option>
                            </select>
                            -
                            <input type="number" name="phone2" />
                            -
                            <input type="number" name="phone3" />
                            <button onClick={modifyPhoneConfirmClick}>수정</button>
                            <button onClick={modifyPhoneBtnClick}>수정 취소</button>
                        </>
                    )}
                </div>

                <div className="adress">
                    {addrModify === false ? (
                        <>
                            주소 {memberInfo.M_ADDR}
                            <button onClick={modifyAddrBtnClick}>수정</button>
                        </>
                    ) : (
                        <>
                            <input type="text" name="postcode" id="postcode" placeholder="우편번호" />
                            <input type="button" onClick={execDaumPostcode} value="우편번호 찾기" />
                            <br />
                            <input type="text" name="roadAddress" id="roadAddress" placeholder="도로명주소" />
                            <span id="guide" style={{ color: '#999', display: 'none' }}></span>
                            <input type="text" name="detailAddress" id="detailAddress" placeholder="상세주소" />
                            <input type="text" name="extraAddress" id="extraAddress" placeholder="참고항목" />
                            <button onClick={modifyAddrConfirmClick}>수정</button>
                            <button onClick={modifyAddrBtnClick}>수정 취소</button>
                        </>
                    )}
                </div>

                <div className="social_id">소셜 아이디</div>

                <div className="point">내 포인트 {memberPoint.toLocaleString()}</div>

                <div className="reg_mod_date">
                    가입일 {memberInfo.M_REG_DATE} <br />
                    최근 수정일 {memberInfo.M_MOD_DATE}
                </div>
            </div>
        </article>
    );
}

export default ModifyInfo;
