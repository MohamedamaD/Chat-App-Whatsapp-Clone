import React from "react";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { asideOptions, setAside } from "../../store/slices/appSlice";

const ArrowBack = ({ to = asideOptions.users }) => {
  const dispatch = useDispatch();

  return (
    <div
      className="arrow-back pointer"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <BiArrowBack size={25} onClick={() => dispatch(setAside(to))} />
    </div>
  );
};

export default React.memo(ArrowBack);
