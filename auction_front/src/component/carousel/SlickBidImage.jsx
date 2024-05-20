import React, { useCallback, useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../../css/carousel/SlickBidImage.css';
import { axiosPreview } from "../../axios/home/axiosHome";
import { SERVER_URL } from '../../config/server_url';
import { Link } from "react-router-dom";


function SlickBidImage() {
  const [bidImgList, setBidImgList] = useState([]);

  const settings = {
    dots: false,
    infinite: bidImgList.length > 1,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 2000,
    draggable: true,
  };


  useEffect(() => {
    console.log('[SLICK BID IMAGE] useEffect');
    let bidImageList = async () => {
      let data = await axiosPreview();
      if (data) {
        setBidImgList(data);

      }
    }
    bidImageList();
  }, []);

  return (
    <div className="preview_wrap">
      <h2> 진행 중인 경매</h2>
      <Slider {...settings} >
        {bidImgList.map((image, index) => (
          <Link to={`/auction/auction_page?grNo=${image.GR_NO}`} key={index}>
            <img src={`${SERVER_URL.SERVER_URL()}/goodsImg/${image.GI_NAME}`} />
          </Link>
        ))}
      </Slider>
    </div>
  );
}

export default SlickBidImage;
