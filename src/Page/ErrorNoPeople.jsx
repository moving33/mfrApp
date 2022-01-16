import React from 'react'
import ErrorBox from '../Component/ErrorBox'
import ErrorSubBox from '../Component/ErrorSubBox'
import style from "../Css/Main.module.css";
import '../Css/ErrorPage.css'
import SubmitButton from '../Component/SubmitButton';


const ErrorNoPeople = () => {
  const closeBtn = () => {
    window.open("about:blank", "_self");
    window.close();
  }
  return (
    <div>
      <div>
        <ErrorBox text1="출입자 명단에" text2="존재하지 않습니다" />
        <div className={style.errorSubBoxContainer}>
          <div className={style.subInputInfo}>
            <p className="ErrorSubscript">출입자명단에 등록된 사용자만</p>
            <p className="ErrorSubscript">얼굴등록을 진행할 수 있습니다.</p>
          </div>
        </div>
      </div>
      <div className={style.submitButtonWrapper}>
        <button className={style.submitButton} onClick={closeBtn} > 닫기 </button>
      </div>
    </div>
  )
}

export default ErrorNoPeople
