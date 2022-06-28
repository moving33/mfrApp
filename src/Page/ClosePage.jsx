import React from 'react'
import ErrorBox from '../Component/ErrorBox'
import style from "../Css/Main.module.css";
import '../Css/ErrorPage.css'
import { useEffect } from 'react';


const ClosePage = () => {

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
          <p>등록가능한 사업장 주소가 없거나</p>
          <p>운영 중지 상태입니다.</p>
        </div>
      </div>
      {/* <div className={style.errorSubBoxContainer}>
        <p className="ErrorSubscript">담당자에게</p>
        <p className="ErrorSubscript">문의해 주세요.</p>
      </div> */}
    </div>
  )
}

export default ClosePage;
