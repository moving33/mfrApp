import React from 'react';
import style from "../Css/Main.module.css";


function SubmitButton(props) {

  console.log(props.onClick);
  
  return (
    <div className={style.submitButtonWrapper}>
      <input 
        type="submit"
        onClick={props.onClick}
        className={style.submitButton}
        {...props}
        value={props.label}
      />
    </div>
  )
}

export default SubmitButton;

