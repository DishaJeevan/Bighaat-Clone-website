import { useEffect, useState } from "react";
import "../App.css";

function Hero({ images }) {
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const slideRight = () => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const slideLeft = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setTimeout(() => {
      slideRight();
    }, 2500);

    return () => clearTimeout(timer);
  }, [current, autoPlay]);

  return (
    <div className="hero_container">
      <div
        className="carousel"
        onMouseEnter={() => setAutoPlay(false)}
        onMouseLeave={() => setAutoPlay(true)}
      >
        <div className="carousel_wrapper">
          {images.map((image, index) => (
            <div
              key={index}
              className={
                index === current ? "carousel_card carousel_card-active" : "carousel_card"
              }
            >
              <img className="card_image" src={image.image} alt="" />
            </div>
          ))}

          <div className="carousel_arrow_left" onClick={slideLeft}>
            &lsaquo;
          </div>

          <div className="carousel_arrow_right" onClick={slideRight}>
            &rsaquo;
          </div>
        </div>
      </div>

      <div className="carousel_pagination">
        {images.map((_, index) => (
          <div
            key={index}
            className={
              index === current ? "pagination_dot pagination_dot-active"  : "pagination_dot"
            }
            onClick={() => setCurrent(index)}
          ></div>
        ))}
      </div>
    </div>
  );
}
export default Hero;
