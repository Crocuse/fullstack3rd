import React from "react"
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
                            <div>
                                <span>WHAT IS BIDBIRD?</span>
                            </div>
                        </div>
                        <div className="definition_txt">
                            <div>
                                비드버드는 수집의 즐거움을 넘어서 수집품의 가치를 올리는 경매의 흥미진진한 경험을 제공합니다.
                                다양한 분야의 수집품들이 모여 있어, 아트, 안티크, 고급 장난감부터 특별한 컬렉션 아이템까지 다양한 선택의 기회를 제공합니다.
                                또한, 수집가와 판매자 사이의 원활한 거래를 도와주는 전문적인 시스템과 서비스를 통해 안전하고 신뢰성 있는 거래 환경을 제공합니다.
                                비드버드는 수집의 즐거움과 경매의 흥미를 한데 모아, 수집가들에게 새로운 경험과 가치를 제공하는 플랫폼입니다.
                            </div>
                        </div>
                        <div className="bid_btn_wrap">
                            <div className="bid_btn">
                                <a href="/auction/Current_list">입찰하기</a>
                                <a href="/action/Regist_form">등록하기</a>
                            </div>
                        </div>
                    </div>
                    <div className="logo_img_sec">
                        <img src="/img/bid_bird_img.png" />
                    </div>
                </div>

                <div className="second_sec">
                    <div className="current_bid_sec">
                        <div>진행 중인 경매</div>
                        <div className="current_bid_img">
                            <div><a href="#"><img src="/img/arrow_left.png" className="bid_list_btn" /></a></div>
                            <div><a href="#">img</a></div>
                            <div><a href="#"><img src="/img/arrow_right.png" className="bid_list_btn" /></a></div>
                        </div>
                    </div>
                    <div>
                        <a href="#">자세히 보기</a>
                    </div>
                </div>

                <div>

                </div>
            </div>
        </article>
    );
}
export default Home;