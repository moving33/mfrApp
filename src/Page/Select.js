import React, { useEffect, useState } from 'react';
import style from "../Css/Main.module.css";
import glassPng from '../assets/glass.png';
import noGlassPng from '../assets/no-glass.png';
import utils from '../utils';
import qs from 'qs';
import { useHistory } from 'react-router';
import Box from '../Component/Box';
import SubmitButton from '../Component/SubmitButton';
import SubBox from '../Component/SubBox';
import { PREFIX, API_URL } from '../config';

const Button = (props) => {
  return (
    <button type="button" onClick={props?.onClick} className={`${style.toggleButton} ${props.active ? style.active : ''}`}>
      {props.label}
    </button>
  )
}

function Select() {
  const history = useHistory();

  const [isGlass, setIsGlass] = useState(null);
  const [btnAble, setBtnAble] = useState(false);

  const handleClick = () => {
    console.log('asdasdadsadad');
    const { q } = qs.parse(window.location.search.slice(1));
    const _data = JSON.parse(utils.decode(q));
    console.log("_data :", _data);
    _data.isGlass = isGlass;
    history.replace(`${PREFIX}/camera?q=${utils.encode(JSON.stringify(_data))}`);
  }

//뒤로가기 방지
  useEffect(() => {
    window.history.pushState(null, document.title, window.location.href); 
    window.addEventListener('popstate', function(event) { window.history.pushState(null, document.title, window.location.href); });
  }, [window.location.href]);
  
  return (
    <div className={style.container} style={{alignItems:'center', paddingTop:'10%' }}>

      <Box step={3} text1="안경을" text2="쓰고 있나요?" />
      <SubBox text1="인식률을 높이기 위해" text2="안경 쓴 등록자는 두번 촬영합니다." />
      <div className={style.group17}></div>

      <div className={style.glassImgContainer}>
        { isGlass && <img className={style.glassImage} src={glassPng}   alt="glassimage" />}
        {!isGlass && <img className={style.glassImage} src={noGlassPng} alt="noglassimage" />}
      </div>

      <div className={style.toggleButtonWrapper}>

        {btnAble === false
        ?
        <>
        <Button onClick={() => { setIsGlass(true);  setBtnAble(true)}}  label="네" />
        <Button onClick={() => { setIsGlass(false); setBtnAble(true) }} label="아니오" />
        </>
        :
        <>
        <Button active={isGlass}  onClick={() => { setIsGlass(true);  setBtnAble(true)}}  label="네" />
        <Button active={!isGlass} onClick={() => { setIsGlass(false); setBtnAble(true) }} label="아니오" />
        </>
        }
        
      </div>
      <div style={{marginTop:'5%'}}>
      {
        btnAble === false
        ?<SubmitButton label={'다음'} style={{backgroundColor:"#dcdcdc", borderColor:"#dcdcdc"}} />
        :<SubmitButton label={'다음'} onClick={handleClick} />
      }
      </div>

    </div>
  )
}

export default Select;