import React, { useState } from 'react';
import style from "../Css/Main.module.css";

import Button from './Button';

function InputTel(props) {
  return (
    <div className={style.mainFormItem}>
      <div>{props.label}</div>
      <div>
        <input 
          className={style.primaryInputTel}
          {...props}
          {...(typeof props?.register === 'function' ? props?.register(props.formName) : {})}
        />
      </div>
    </div>
    
  )
}

export default InputTel;