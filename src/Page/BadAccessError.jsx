import React from 'react'
import ErrorBox from '../Component/ErrorBox'
import ErrorSubBox from '../Component/ErrorSubBox'
import style from "../Css/Main.module.css";
import '../Css/ErrorPage.css'
import SubmitButton from '../Component/SubmitButton';


const BadAccessError = () => {
  const closeBtn = () => {
    window.open("about:blank", "_self");
    window.close();
  }
  return (
    <div>
      <div>
        <ErrorBox text1="옳바르지 않은" text2="접근입니다" />
        <div className={style.errorSubBoxContainer} styled={{ textAlign: "center" }}>
          <div className={style.subInputInfo}>
            <p className="ErrorSubscript">옳바르지 않은 접근은</p>
            <p className="ErrorSubscript">허용되지 않습니다</p>
          </div>
        </div>
      </div>
      <div className={style.submitButtonWrapper}>
        <button className={style.submitButton} onClick={closeBtn} > 닫기 </button>
      </div>
    </div>
  )
}

export default BadAccessError