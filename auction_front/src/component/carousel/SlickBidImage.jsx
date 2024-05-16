import React, { useCallback, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../../css/carousel/SlickBidImage.css';

function SlickBidImage() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 2000,
    draggable: true,
  };

  const slickRef = useRef(null);

  const previous = useCallback(() => slickRef.current.slickPrev(), [slickRef]);
  const next = useCallback(() => slickRef.current.slickNext(), [slickRef]);

  return (
    <div>
    <h2> 진행 중인 경매</h2>
    <Slider {...settings} ref={slickRef} >
      <div>
      {/* <div onClick={previous}>
        <img
            src={"/img/arrow_left.png"}
        />
      </div> */}
        <h3>1</h3>
      </div>
      <div>
        <h3>2</h3>
      </div>
      <div>
        <h3>3</h3>
      </div>
      <div>
        <h3>4</h3>
      </div>
      <div>
        <h3>5</h3>
      </div>
      <div>
        <h3>6</h3>
      </div>
      <div>
        <h3>7</h3>
      </div>
      <div>
        <h3>8</h3>
      </div>
      <div>
        <h3>9</h3>
      </div>
      {/* <div onClick={next}>
      <img
        src={"/img/arrow_left.png"}
      />
    </div> */}
      
    </Slider>
  </div>
  );
}

export default SlickBidImage;
