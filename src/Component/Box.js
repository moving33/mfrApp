import React from "react";
import style from "../Css/Main.module.css";

const Box = ({ step, text1, text2 }) => {
  return (
    <div className={style.cirtificationList}>
      <div className={style.barContainer}>
        <Bar active={step > 0} />
        <Bar active={step > 1} />
        <Bar active={step > 2} />
        <Bar active={step > 3} />
      </div>
      <div className={style.inputInfo}>
        <p>{text1}</p>
        <p>{text2}</p>
      </div>
    </div>
  );
};

const Bar = ({ active }) => {
  return (
    <div
      className={style.bar}
      style={{ backgroundColor: active ? "#0072ce" : "#dcdcdc" }}
    ></div>
  );
};

export default Box;
