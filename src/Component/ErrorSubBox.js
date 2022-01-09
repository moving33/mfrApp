import React from "react";
import style from "../Css/Main.module.css";

const ErrorSubBox = ({ step, text1, text2 }) => {
  return (
    <div className={style.errorSubBoxContainer}>
      <div className={style.subInputInfo}>
        <p>{text1}</p>
        <p>{text2}</p>
      </div>
    </div>
  );
};

export default ErrorSubBox;
