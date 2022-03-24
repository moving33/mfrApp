import React, { useState } from 'react';
import style from "../Css/Main.module.css";
import "../Css/Main.module.css";

function Input(props) {

  return (
    <div className={style.mainFormItem}>
      <div>{props.label}</div>
      <div className={style.inputTeam}>
        <input
          className={style.primaryInput}
          placeholder={props?.placeholder}
          style={{ background: props?.background || '#fff', color: props?.color || '#000', pointerEvents: (props?.title && 'none') }}
          //onFocus={ ()=>{props?.setValueOn(!props?.valueOn) || console.log('hello')} }
          {...props}
          {...(typeof props?.register === 'function' ? props?.register(props.formName) : {})}
        />
        {/* {
          props?.valueOn && <span className={style.clearMe} onClick={()=>{props?.setValue(''); props?.setValueOn(!props?.valueOn)}}><img src={'./image/clearButton.png'} /></span>
        } */}
      </div>
    </div>

  )
}

export default Input;