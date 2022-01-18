import React, {useEffect} from 'react'
import ErrorBox from '../Component/ErrorBox'
import ErrorSubBox from '../Component/ErrorSubBox'

const Errorpage = () => {

  useEffect(()=>{
    setTimeout(()=>{
    window.location.href='https://www.s1.co.kr/';
  },2000)});
  
  return (
        <div>
          <ErrorBox text1="사업장이 없습니다"  text2="" />
          <ErrorSubBox
            text1="등록 된 사업장만"
            text2="사용 가능합니다"
          />
        </div>
      );
}

export default Errorpage
