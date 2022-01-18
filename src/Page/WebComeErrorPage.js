import React, {useEffect} from 'react';
import '../Css/ErrorPage.css';
const WebComeErrorPage = () => {
  useEffect(()=>{
    setTimeout(()=>{
    window.location.href='https://www.s1.co.kr/';
  },2000)});
  return (
    <div className="ErrorPageTitle">
      Please connect Mobile...
    </div>
  )
}

export default WebComeErrorPage
