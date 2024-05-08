import React from 'react';
import '../css/Home.css';

function Home() {
    return (
        <article>
            <div className="home_wrap">
                <div className="first_sec">
                    <div className="intro_company_sec">
                        <div className="definition_title">
                            <div>
                                <span id="definition">비드버드란?</span>
                            </div>
                        </div>
                        <div className="definition_txt">
                            <div>세상의 다양한 수집품을 경매로 만나볼 수 있는 비드버드에 오신 것을 환영합니다!</div>
                            <div className="main_txt">
                                비드버드에서는 여러분의 소중한 수집품을 경매로 판매하거나, 다른 이들의 수집품을 입찰을
                                통해 구매할 수 있습니다. <br />
                                경매 과정은 귀여운 작은 새 '비드버드'가 도와드립니다! <br />
                                비드버드와 함께 수집의 즐거움을 경험해보세요. 희귀한 아이템부터 특별한 의미를 지닌
                                물건까지, 다양한 수집품들이 여러분을 기다리고 있습니다. <br /> 경매를 통해 새로운 보물을
                                찾는 즐거움을 느껴보시고, 여러분의 수집품도 가치 있게 판매해보세요. <br /> 비드버드는
                                공정하고 신뢰할 수 있는 경매 시스템을 제공하여, 수집가들 간의 활발한 교류의 장이 되고자
                                합니다. <br />
                                지금 바로 비드버드에 가입하시고, 수집의 새로운 세계로 빠져보세요!
                            </div>
                        </div>
                        <div className="bid_btn_wrap">
                            <div className="bid_btn">
                                <a href="/auction/Current_list">입찰하기</a>
                                <a href="/auction/Regist_form">등록하기</a>
                            </div>
                        </div>
                    </div>
                    <div className="logo_img_sec">
                        <img src="/img/bid_bird_img.png" alt="비드버드 로고" id="bird_img" />
                    </div>
                </div>

                <div className="second_sec">
                    <div className="current_bid_sec">
                        <div>진행 중인 경매</div>
                        <div className="current_bid_img">
                            <div>
                                <a href="#">
                                    <img src="/img/arrow_left.png" className="bid_list_btn" />
                                </a>
                            </div>
                            <div>
                                <a href="#">img</a>
                            </div>
                            <div>
                                <a href="#">
                                    <img src="/img/arrow_right.png" className="bid_list_btn" />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div>
                        <a href="#">자세히 보기</a>
                    </div>
                </div>

                <div></div>
            </div>
        </article>
    );
}
export default Home;
