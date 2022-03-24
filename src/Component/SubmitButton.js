import React from 'react';
import style from "../Css/Main.module.css";


function SubmitButton(props) {
  
  return (
    <div className={style.submitButtonWrapper}>
      <input 
        type="submit"
        onClick={props.onClick}
        className={style.submitButton}
        {...props}
        value={props.label}
        style={{backgroundColor:props?.color || '#0072ce', border:props.borderColor || '#0072ce', }}
      />
    </div>
  )
}

export default SubmitButton;

