import React from 'react';
import style from '../Css/Main.module.css'

const AgreementsModal = ({ setOpen, open, nextBtn }) => {

  const text = [
    "얼굴사진 원본 정보 수집 이용 미동의 시 아래와 같이 일부 기능이 제한 됩니다",
    '01.\n 리더기가 업테이트 되는 경우 얼굴 인증 불가능 (얼굴 재 등록 필요)',
    '02.\n 다른 리더기에 매니저를 통한 사용자 정보 전송 불가능',
    "동의하시겠습니까?"
  ];

  return (
    <div className={style.Modal} >
      <div className={style.ModalWrapper}>
        <div className={style.ModalTextWrapper}>
          <p>{text[0]}</p>
          <p>{text[1]}</p>
          <p>{text[2]}</p>
          <p>{text[3]}</p>
        </div>

        <div className={style.ButtonWrapper}>
          <button className={style.NasoantralModalButton} onClick={() => { setOpen(!open) }} >미동의</button>
          <button className={style.ModalButton} onClick={nextBtn}>동의</button>
        </div>
      </div>
    </div>
  )
};

export default AgreementsModal;
