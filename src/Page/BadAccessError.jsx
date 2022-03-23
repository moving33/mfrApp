import React from 'react'
import ErrorBox from '../Component/ErrorBox'
import ErrorSubBox from '../Component/ErrorSubBox'
import style from "../Css/Main.module.css";
import '../Css/ErrorPage.css'
import SubmitButton from '../Component/SubmitButton';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';

const BadAccessError = () => {

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
      <ErrorBox text1="옳바르지 않은" text2="접근입니다" />
      <div className={style.errorSubBoxContainer}>
        <p className="ErrorSubscript">
          옳바르지 않은 접근은<br />
          허용되지 않습니다
        </p>
      </div>
    </div>
  )
}

export default BadAccessError