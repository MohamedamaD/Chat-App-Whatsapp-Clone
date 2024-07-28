import React from "react";
import "./ImagePreview.scss";

const ImagePreview = ({ data }) => {
  return (
    <div className="image-preview">
      <img src={URL.createObjectURL(data)} alt="" />
    </div>
  );
};

export default React.memo(ImagePreview);
