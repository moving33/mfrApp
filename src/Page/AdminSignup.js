import { axesAreInnerMostDims } from '@tensorflow/tfjs-core/dist/ops/axis_util';
import React, { useState, useRef } from 'react'
import Box from "../Component/Box";
import style from '../Css/AdminSignup.module.css';

const AdminSignup = () => {

  let [id, setId] = useState('');
  let [password, setPassword] = useState('');
  let [passwordCheck, setPasswordCheck] = useState('');
  let [nickname, setNickname] = useState('');
  let [phoneNum, setPhoneNum] = useState('');
  let [passwordCheckFlag, setPasswordCheckFlag] = useState(false);
  let passwordCheckRef = useRef()
  const [openModal, setOpenModal] = useState(false);

  function inputIdHandler(e) {
    setId(e.target.value);
    console.log(id)
  }

  const payload = {
    id,
    password,
  }

  function inputPasswordHandler(e) {
    setPassword(e.target.value)
  }

  function inputNickNameHandler(e) {
    setNickname(e.target.value)
  }

  function inputPhoneNumberHandler(e) {
    setPhoneNum(e.target.value)
  }

  function inputConfirmPasswordHandler(e) {
    setPasswordCheck(e.target.value);
    passwordCheckRef.current.focus();
  }

  const checkdIdBtn = () => {
    setOpenModal(true);
  }

  const formSubmitBtn = () => {
    if (openModal === true && passwordRegCheck.test(passwordCheck) === false && password === "" && passwordCheck === "") {
      console.log("땡");
      console.log(openModal);
      console.log(passwordRegCheck.test(passwordCheck));
      console.log(password);
      console.log(passwordCheck);
    }
    console.log("굿");
  }

  let idRegCheck = /^(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{4,12}$/;

  let passwordRegCheck = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,12}$/;

  return (
    <div className={style.container}>
      <Box step={2} text1="관리자 가입 정보를" text2="입력해주세요" />
      <span className={style.text}>아이디</span>

      <div className={style.inputWrapper}>

        {
          idRegCheck.test(id) === true || id === ""
            ? <input placeholder="아이디 입력" className={style.successInput} onChange={inputIdHandler} value={id} />
            : <input placeholder="아이디 입력" className={style.redInput} onChange={inputIdHandler} value={id} />
        }

        <button className={style.validationBtn} onClick={checkdIdBtn}>중복확인</button>
      </div>

      {//정규식 수정 완료
        idRegCheck.test(id) === true
          ? <p className={style.ptag}>사용 가능합니다.</p>
          : <p className={style.ptag}>영문 소문자, 숫자 조합을 4~12자 혼용하여야 합니다.</p>
      }

      <span className={style.text1}>사용자명</span>
      <input placeholder="사용자명 입력" className={style.fullSizeInput} onChange={inputNickNameHandler} value={nickname} />


      <div className={style.text2}>휴대전화 번호</div>
      <input placeholder="숫자만 입력" type="number" className={style.fullSizeInput} onChange={inputPhoneNumberHandler} value={phoneNum} />

      {passwordRegCheck.test(password) === true || password === "" || passwordCheck === "" || password === passwordCheck
        ?
        (
          <>
            <div className={style.text2}>비밀번호</div>
            <div className={style.inputWrapper}>
              <input placeholder="비밀번호 입력" type="password" className={style.fullSizeSuccessInput} onChange={inputPasswordHandler} value={password} />
            </div>
            <div className={style.text2}>비밀번호 확인</div>
            <div className={style.inputWrapper}>
              <input ref={passwordCheckRef} placeholder="비밀번호 확인" type="password" className={style.fullSizeSuccessInput} onChange={inputConfirmPasswordHandler} value={passwordCheck} />
            </div>
            <div style={{ marginTop: '10px' }}>
              <p className={style.ptag1}>같은 문자와 숫자를 3번 이상 반복할 수 없습니다.</p>
              <p className={style.ptag3}>기존 비밀번호와 달라야 하고 ID가 포함되면 안됩니다.</p>
              <p className={style.ptag2}>영문 대/소문자,숫자,특수문자를 8~12자 혼용하여야 합니다.</p>
            </div>
          </>
        )
        :
        (
          <>
            <div className={style.text2}>비밀번호</div>
            <div className={style.inputWrapper}>
              <input placeholder="비밀번호 입력" type="password" className={style.fullSizeRedInput} onChange={inputPasswordHandler} value={password} />
            </div>
            <div className={style.text2}>비밀번호 확인</div>
            <div className={style.inputWrapper}>
              <input placeholder="비밀번호 확인" type="password" className={style.fullSizeRedInput} onChange={inputConfirmPasswordHandler} value={passwordCheck} />
            </div>
            <div style={{ marginTop: '10px' }}>
              <p className={style.ptag1}>비밀번호가 다릅니다.</p>
            </div>
          </>
        )
      }

      <button className={style.nextBtn} onClick={() => { formSubmitBtn() }}>다음</button>

    </div>
  )
}

export default AdminSignup