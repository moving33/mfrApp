import React from 'react'
import Box from "../Component/Box";
import style from '../Css/AdminSignup.module.css'

const AdminSignup = () => {
    return (
        <div className={style.container}>
            <Box step={2} text1="관리자 가입 정보를" text2="입력해주세요" />
            <span className={style.text}>아이디</span>
            <div className={style.inputWrapper}>
                <input placeholder="아이디 입력" className={style.signupInput}/>
                <button className={style.validationBtn}>중복확인</button>
            </div>
            <p className={style.ptag}>영문 소문자, 숫자 조합을 4~12자 혼용하여야 합니다.</p>

            <input placeholder="사용자명 입력" className={style.signupInput1}/>
        </div>
    )
}

export default AdminSignup