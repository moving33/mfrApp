import React from "react";
import style from "../Css/Main.module.css";

const ErrorBox = ({ step, text1, text2 }) => {
  return (
    <div className={style.errorBoxContainer}>
      <div className={style.inputInfo}>
        <p>{text1}</p>
        <p>{text2}</p>
      </div>
    </div>
  );
};

export default ErrorBox;
