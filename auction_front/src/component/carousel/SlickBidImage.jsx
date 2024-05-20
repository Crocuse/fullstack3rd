import React, { useCallback, useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../../css/carousel/SlickBidImage.css';
import { axiosPreview } from "../../axios/home/axiosHome";
import { SERVER_URL } from '../../config/server_url';


function SlickBidImage() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 2000,
    draggable: true,
  };

  const [bidImgList, setBidImgList] = useState([]);

  useEffect(() => {
    console.log('[SLICK BID IMAGE] useEffect');
    let bidImageList = async () => {
      let data = await axiosPreview();
      if (data) {
        setBidImgList(data);

      }
    }
    bidImageList();
  }, [])
  // const slickRef = useRef(null);

  // const previous = useCallback(() => slickRef.current.slickPrev(), [slickRef]);
  // const next = useCallback(() => slickRef.current.slickNext(), [slickRef]);

  return (
    <div className="preview_wrap">
      <h2> 진행 중인 경매</h2>
      <Slider {...settings} >
        {bidImgList.map((image, index) => (
          <div key={index}>
            <img src={`${SERVER_URL.SERVER_URL()}/goodsImg/${image.GI_NAME}`} />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default SlickBidImage;
