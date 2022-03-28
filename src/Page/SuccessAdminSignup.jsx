import React, { useEffect } from 'react';
import ErrorBox from '../Component/ErrorBox'
import style from "../Css/Main.module.css";
import '../Css/ErrorPage.css'

const SuccessAdminSignup = () => {

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
          <p>가입이 완료되었습니다</p>
        </div>
      </div>
      <div className={style.errorSubBoxContainer}>
          <p className="ErrorSubscript">관리자로부터 최종 승인을 받으신 후 <br /> 사용하실 수 있습니다.</p>
      </div>
    </div>
  );
};

export default SuccessAdminSignup;
