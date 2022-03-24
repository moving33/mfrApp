import React from "react";
import style from "../Css/Main.module.css";

const SubBox = ({ text1, text2 }) => {
  return (
    <div className={style.subBoxContainer}>
      <div className={style.subInputInfo}>
        <p>{text1} <br />{text2}</p>
      </div>
    </div>
  );
};

export default SubBox;
