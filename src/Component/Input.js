import React, { useState } from 'react';
import style from "../Css/Main.module.css";
import "../Css/Main.module.css";

function Input(props) {
  return (
    <div className={style.mainFormItem}>
      <div>{props.label}</div>
      <input
        className={style.primaryInput}
        placeholder={props?.placeholder}
        style={{background:props?.background || '#fff', color: props?.color || '#000', pointerEvents: ( props?.title &&'none')  }}

        {...props}
        {...(typeof props?.register === 'function' ? props?.register(props.formName) : {})}
      />
    </div>
    
  )
}

export default Input;