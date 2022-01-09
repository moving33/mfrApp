import React from 'react';
import style from "../Css/Main.module.css";

function Button(props) {
  return (
    <button 
      className={style.primaryButton}
      {...props}
    >
      {props.children}
    </button>
  )
}

export default Button;