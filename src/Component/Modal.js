import React from 'react';
import style from '../Css/Main.module.css'


const Modal = ({ setOpen, open }) => {

  const text = [
    `2.타인얼굴 등록 관련 \n
    -> 얼굴등록 팝업메세지를 통해 타인 \n
    얼굴등록시 문제 발생에 따른사항들은 본인 \n
    귀책사유 명시`,
    "내용 협의 필요"
  ];

  return (
    <div className={style.Modal} >
    <div className={style.ModalWrapper}>
      <div className={style.ModalTextWrapper}>
        <p>{text[0]}</p>
        <p style={{ color: "red" }}>{text[1]}</p>
      </div>

      <div className={style.ButtonWrapper}>
        <button className={style.NasoantralModalButton} onClick={() => { setOpen(!open) }} >미동의</button>
        <button className={style.ModalButton} >동의</button>
      </div>
    </div>
    </div>
  )
};

export default Modal;
