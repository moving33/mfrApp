import React, { useState } from 'react';
import style from "../Css/Main.module.css";
import "../Css/Main.module.css";

function Input(props) {

  const onClickEvent = () => {
    props.onClick && props.onClick(!props.open)
  }

  return (
    <div className={style.mainFormItem}>
      <div className={style.inputLabelStyle}>{props.label}</div>
      {props.disabled 
      ?
      <div className={style.primaryInput} style={{padding:'0px 13px 0px 13px', color:'#adb5bd'}} onClick={onClickEvent}> {props.placeholder}</div>
      :
        <input
        className={style.primaryInput}
        placeholder={props?.placeholder}
        style={{ background: props?.background || '#fff', color: props?.color || '#000', pointerEvents: (props?.title && 'none') }}
        {...props}
        {...(typeof props?.register === 'function' ? props?.register(props.formName) : {})}
        />
      }
    </div>

  )
}

export default Input;