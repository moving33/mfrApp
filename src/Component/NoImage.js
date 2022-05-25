import React from 'react';
import style from '../Css/Main.module.css';

import plusPng from '../assets/plus.png';

function NoImage({onClick, height}) {

  // console.log('height',height);

  return (
    <div className={style.noImageContainer} onClick={onClick} style={{height:`${height}px`, width:`${height}px`}}>
      <img src={plusPng} className={style.plusIcon}/>
      <div>추가 촬영하면</div>
      <div>인식률이 향상됩니다</div>
    </div>
  )
}

export default NoImage;