import React from 'react';
import style from "../Css/Main.module.css";


function SubmitButton(props) {
  return (
    <div className={style.submitButtonWrapper}>
      <input 
        type="submit"
        className={style.submitButton}
        {...props}
        value={props.label}
      />
    </div>
  )
}

export default SubmitButton;

