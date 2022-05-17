import React, { useEffect, useState, Suspense } from 'react';
import style from "../Css/Main.module.css";
import glassPng from '../assets/Group.svg';
import noGlassPng from '../assets/Group2.svg';
import utils from '../utils';
import qs from 'qs';
import { useHistory } from 'react-router';
import Box from '../Component/Box';
import SubmitButton from '../Component/SubmitButton';
import SubBox from '../Component/SubBox';
import { PREFIX, API_URL } from '../config';
import LoadingPaper from "../Component/loadingPage/LoadingPaper";

const Button = (props) => {
  return (
    <button type="button" onClick={props?.onClick} className={`${style.toggleButton} ${props.active ? style.active : ''}`} style={props?.border}>
      {props.label}
    </button>
  )
}

function Select() {
  const history = useHistory();

  const [isGlass, setIsGlass] = useState(null);
  const [btnAble, setBtnAble] = useState(false);

  const handleClick = () => {
    const { q } = qs.parse(window.location.search.slice(1));
    console.log("_data :", q);
    const _data = JSON.parse(utils.decode(q));
    _data.isGlass = isGlass;
    history.replace(`${PREFIX}/camera?q=${utils.encode(JSON.stringify(_data))}`);
  }
  //뒤로가기 방지
  
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener('popstate', function (event) { window.history.pushState(null, document.title, window.location.href); });
  }, [window.location.href]);

  return (
    <Suspense fallback={<LoadingPaper />} >
    <div className={style.container}>

      <Box step={3} text1="안경을" text2="쓰고 있나요?" />
      <div className={style.subBoxContainer}>
        <div className={style.subInputInfo} style={{ marginTop: '-5%' }}>
          <p>인식률을 높이기 위해<br />안경을 쓴 등록자는 두번 촬영합니다.</p>
        </div>
      </div>
      {/* <div style={{marginTop:'-30px'}}><SubBox text1="인식률을 높이기 위해" text2="안경을 쓴 등록자는 두번 촬영합니다." /></div> */}
      <div className={style.group17}></div>

      <div className={style.glassImgContainer}>
        {isGlass && <img className={style.glassImage} src={glassPng} alt="glassimage" />}
        {!isGlass && <img className={style.glassImage} src={noGlassPng} alt="noglassimage" />}
      </div>

      <div className={style.toggleButtonWrapper}>
        {btnAble === false
          ?
          <>
            <Button onClick={() => { setIsGlass(true); setBtnAble(true) }} label="네" border={{ borderRight: '0.5px' }} />
            <Button onClick={() => { setIsGlass(false); setBtnAble(true) }} label="아니오" border={{ borderLeftt: '0.5px' }} />
          </>
          :
          <>
            <Button active={isGlass} onClick={() => { setIsGlass(true); setBtnAble(true) }} label="네" />
            <Button active={!isGlass} onClick={() => { setIsGlass(false); setBtnAble(true) }} label="아니오" />
          </>
        }

      </div>
      <div>
        {
          btnAble === false
            ? <SubmitButton label={'다음'} color={"#dcdcdc"} borderColor={"#dcdcdc"} />
            : <SubmitButton label={'다음'} onClick={handleClick} />
        }
      </div>

    </div>
    </Suspense>
  )
}

export default Select;