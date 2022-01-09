import React, { useState } from 'react';
import style from "../Css/Main.module.css";

function Input(props) {
  return (
    <div className={style.mainFormItem}>
      <div>{props.label}</div>
      <input 
        className={style.primaryInput}
        {...props}
        {...(typeof props?.register === 'function' ? props?.register(props.formName) : {})}
      />
    </div>
    
  )
}

export default Input;