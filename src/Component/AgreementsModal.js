import React from 'react';
import style from '../Css/Main.module.css'

const AgreementsModal = ({ text1, text2, setOpen, open, nextBtn, title }) => {

  return (
    <div className={style.Modal} >
      <div className={style.ModalWrapper}>
        <div className={style.agreeModalTitle}>{title}</div>
        <div className={style.ModalTextWrapper}>
          <p>{text1}</p>
          <p>{text2}</p>
        </div>

        <div className={style.ButtonWrapper}>
          <button className={style.NasoantralModalButton} onClick={() => { setOpen(!open) }} >뒤로가기</button>
          <button className={style.ModalButton} onClick={nextBtn}>계속진행</button>
        </div>
      </div>
    </div>
  )
};

export default AgreementsModal;
