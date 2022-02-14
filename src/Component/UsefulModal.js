import React from 'react'
import style from '../Css/Main.module.css'

const UsefulModal = ({ text1, text2, text3, Disagree, open }) => {
  return (
    <div className={style.Modal} >
      <div className={style.ModalWrapper}>
        <div className={style.ModalTextWrapper}>
          <p style={{margin:'auto'}}>{text1}</p>
          <p>{text2}</p>
          <p>{text3}</p>
        </div>
        <div className={style.ButtonWrapper}>
          <button className={style.NasoantralModalButton} onClick={() => { Disagree(!open) }} >뒤로가기</button>
        </div>
      </div>
    </div>
  )
}

export default UsefulModal