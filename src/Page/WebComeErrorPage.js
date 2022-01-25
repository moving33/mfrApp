import React, {useEffect} from 'react';
import '../Css/ErrorPage.css';
const WebComeErrorPage = () => {

  useEffect(() => {
    console.log(window.history.state)
    window.history.pushState(null, document.title, window.location.href); 
    window.addEventListener('popstate', function(event) { window.history.pushState(null, document.title, window.location.href); });
  }, [window.location.href]);

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
