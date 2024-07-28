import { Autoplay, Pagination, Navigation } from "swiper/modules";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Avatar from "../../components/Avatar/Avatar";
import { Swiper, SwiperSlide } from "swiper/react";
import { BiArrowBack, BiX } from "react-icons/bi";
import { Loading } from "../Loading/Loading";
import { useSelector } from "react-redux";
import { formatDate } from "../../utils";
import "./StatusCarousel.scss";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

export const StatusCarousel = () => {
  const { userID } = useParams();
  const connection = useSelector((state) => state.app.connection);
  const go = useNavigate();

  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log(userID);

  const handleStatusChange = useCallback((data) => {
    console.log(data);
    if (data.success) {
      setStatuses(data.statuses);
    }
    setLoading(false);
  }, []);
  useEffect(() => {
    if (connection) {
      connection.emit("my-status", { user: userID }, handleStatusChange);
    }
    return () => {};
  }, [connection, handleStatusChange, userID]);

  if (loading) return <Loading />;
  return (
    <div id="status-carousel-page">
      <div className="top-bar shadow">
        <BiArrowBack className="pointer" size={25} onClick={() => go(-1)} />
        <BiX className="pointer" size={25} onClick={() => go("/")} />
      </div>

      <Swiper
        spaceBetween={30}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation
        className="swiper-container"
        modules={[Autoplay, Pagination, Navigation]}
      >
        {statuses.map((status) => (
          <SwiperSlide
            key={status._id}
            className="status-slide"
            style={
              status?.color
                ? { backgroundColor: status?.color }
                : { backgroundColor: "#000000e8" }
            }
          >
            <div className="floating-bar">
              <Avatar user={status?.user} />
              <div className="text-container">
                <p>{status?.user?.name}</p>
                <p className="status-date">{formatDate(status.createdAt)}</p>
              </div>
            </div>

            {status.imageUrl && <img src={status.imageUrl} alt="Status" />}
            {status.videoUrl && (
              <video controls>
                <source src={status.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
            {status.text && <p className="text">{status.text}</p>}
          </SwiperSlide>
        ))}
      </Swiper>
      {/* <div className="status-carousel">
        <Slider {...settings}>
          {statuses.map((status) => (
            <div key={status._id} className="status-slide">
              {status.imageUrl && <img src={status.imageUrl} alt="Status" />}
              {status.videoUrl && (
                <video controls>
                  <source src={status.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
              {status.text && <p>{status.text}</p>}
              <p className="status-date">{formatDate(status.createdAt)}</p>
            </div>
          ))}
        </Slider>
      </div> */}
    </div>
  );
};
