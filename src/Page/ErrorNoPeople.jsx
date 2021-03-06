import React from 'react'
import ErrorBox from '../Component/ErrorBox'
import style from "../Css/Main.module.css";
import '../Css/ErrorPage.css'
import { useEffect } from 'react';


const ErrorNoPeople = () => {

  useEffect(() => {
    console.log(window.history.state)
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener('popstate', function (event) { window.history.pushState(null, document.title, window.location.href); });
  }, [window.location.href]);

  useEffect(() => {
    setTimeout(() => {
      window.location.href = 'https://www.s1.co.kr/';
    }, 2000)
  });

  return (
    <div>
      <div className={style.errorBoxContainer}>
        <div className={style.inputInfo}>
          <p>출입자 명단에</p>
          <p>존재하지 않거나,</p>
          <p>본인인증 정보와</p> 
          <p>출입자 명단의 정보가</p>
          <p>일치하지 않습니다.</p>
        </div>
      </div>

      <div className={style.errorSubBoxContainer} style={{marginTop:'-2%'}}>
        <p className="ErrorSubscript">
          출입자명단에 등록된 사용자만<br />
          얼굴등록을 진행할 수 있습니다.
        </p>
      </div>
    </div>
  )
}

export default ErrorNoPeople
