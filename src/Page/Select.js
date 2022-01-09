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

  const [isGlass, setIsGlass] = useState(false);

  const handleClick = () => {
    const {q} = qs.parse(window.location.search.slice(1));
    const _data = JSON.parse(utils.decode(q));
    _data.isGlass = isGlass;

    history.push(`${PREFIX}/camera?q=${utils.encode(JSON.stringify(_data))}`);
  }

  return (
    <div className={style.container}>
      <Box step={3} text1="안경을" text2="쓰고 있나요?" />
      <SubBox text1="인식률을 높이기 위해" text2="안경 쓴 등록자는 두번 촬영합니다."/>
      <div className={style.group17}></div>
      <div className={style.glassImgContainer}>
        {isGlass && <img className={style.glassImage} src={glassPng} alt="glassimage" />}
        {!isGlass && <img className={style.glassImage} src={noGlassPng} alt="noglassimage" />}
      </div>
      <div className={style.toggleButtonWrapper}>
        <Button active={isGlass} onClick={() => {setIsGlass(true)}} label="네" />
        <Button active={!isGlass} onClick={() => {setIsGlass(false)}} label="아니오" />
      </div>
      <SubmitButton label={'다음'} onClick={handleClick} />
    </div>
  )
}

export default Select;