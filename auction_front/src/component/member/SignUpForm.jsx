import React, { useState } from "react"

function SignUpForm() {

    // Hook -----------------------------------------------------------------------------------------------------------

    // Handler -----------------------------------------------------------------------------------------------------------

    // Function -----------------------------------------------------------------------------------------------------------
    function execDaumPostcode() {
        new window.daum.Postcode({
            oncomplete: function(data) {
                let roadAddr = data.roadAddress; 
                let extraRoadAddr = ''; 

                if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
                    extraRoadAddr += data.bname;
                }
                if(data.buildingName !== '' && data.apartment === 'Y'){
                   extraRoadAddr += (extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                }
                if(extraRoadAddr !== ''){
                    extraRoadAddr = ' (' + extraRoadAddr + ')';
                }

                document.getElementById('postcode').value = data.zonecode;
                document.getElementById("roadAddress").value = roadAddr;
                document.getElementById("jibunAddress").value = data.jibunAddress;
                
                if(roadAddr !== ''){
                    document.getElementById("extraAddress").value = extraRoadAddr;
                } else {
                    document.getElementById("extraAddress").value = '';
                }

                let guideTextBox = document.getElementById("guide");
                if(data.autoRoadAddress) {
                    let expRoadAddr = data.autoRoadAddress + extraRoadAddr;
                    guideTextBox.innerHTML = '(예상 도로명 주소 : ' + expRoadAddr + ')';
                    guideTextBox.style.display = 'block';

                } else if(data.autoJibunAddress) {
                    let expJibunAddr = data.autoJibunAddress;
                    guideTextBox.innerHTML = '(예상 지번 주소 : ' + expJibunAddr + ')';
                    guideTextBox.style.display = 'block';
                } else {
                    guideTextBox.innerHTML = '';
                    guideTextBox.style.display = 'none';
                }
            }
        }).open();
    }

    // ajax

    // view
    return(
        <div className="signup_wrap">
            <h2>회원가입</h2>

            <form action="http://localhost:3001/member/signup_confirm" method="post" name="signup_form">

                <div className="input_wrap">
                    <p>아이디</p>
                    <input type="text" name="m_id" placeholder="아이디를 입력해주세요." />
                    <input type="button" value={"아이디 중복 검사"} />
                </div>

                <div className="input_wrap">
                    <p>비밀번호</p>
                    <input type="password" name="m_pw" placeholder="비밀번호를 입력해주세요."/>
                </div>

                <div className="input_wrap">
                    <p>비밀번호 확인</p>
                    <input type="password" name="m_pw_check" placeholder="비밀번호 확인을 입력해주세요."/>
                </div>

                <div className="input_wrap">
                    <p>이메일</p>
                    <input type="text" name="mail1"/>
                    @
                    <input type="text" name="mail2"/>
                    <input type="button" value={"메일 중복 검사"} />
                </div>
                
                <div className="input_wrap">
                    <p>연락처</p>
                    <select name="phone1">
                        <option value="010">010</option>
                        <option value="011">011</option>
                        <option value="011">012</option>
                        <option value="016">016</option>
                        <option value="017">017</option>
                        <option value="018">018</option>
                        <option value="019">019</option>
                    </select>
                    -
                    <input type="number" name="phone2"/>
                    -
                    <input type="number" name="phone3"/>
                </div>

                <div className="input_wrap">
                    <p>주소</p>
                    <input type="text" id="postcode" placeholder="우편번호" />
                    <input type="button" onClick={execDaumPostcode} value="우편번호 찾기" />
                    <br />
                    <input type="text" id="roadAddress" placeholder="도로명주소" />
                    <input type="text" id="jibunAddress" placeholder="지번주소" />
                    <span id="guide" style={{ color: "#999", display: "none" }}></span>
                    <input type="text" id="detailAddress" placeholder="상세주소" />
                    <input type="text" id="extraAddress" placeholder="참고항목" />
                </div>

                <div className="btns">
                    <input type="button" value="회원가입" />
                    <input type="reset" value="초기화" />
                </div>
                
            </form>
        </div>
    )

}
export default SignUpForm;