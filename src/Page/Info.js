import React, { useEffect, useState } from "react";
import style from "../Css/Main.module.css";
import Box from "../Component/Box";
import Input from "../Component/Input";
import InputTel from "../Component/InputTel";
import SubmitButton from "../Component/SubmitButton";
import { useHistory } from "react-router";
import { useForm } from "react-hook-form";
import Errorpage from './Errorpage'

import qs from "qs";
import utils from "../utils";
import ErrorBox from "../Component/ErrorBox";
import ErrorSubBox from "../Component/ErrorSubBox";
import { PREFIX, API_URL } from "../config";
import axios from "axios";
import { faUserInjured } from "@fortawesome/free-solid-svg-icons";
import SeleteComapny from '../Component/SelectCompany'

function ErrorPage({ onClick }) {
  return (
    <div>
      <ErrorBox text1="출입자 명단에" text2="존재하지 않습니다" />
      <SubmitButton label="닫기" onClick={onClick} />
      <ErrorSubBox
        text1="출입자 명단에 등록된 사용자만"
        text2="얼굴등록을 진행할 수 있습니다."
      />
    </div>
  );
}

function Info() {
  const history = useHistory();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [defaultState, setDefaultState] = useState();
  const [isError, setIsError] = useState(false);
  const [siteName, setSiteName] = useState();
  const [inputName, setInputName] = useState()
  const [inputPassword, setInputPassword] = useState()
  const [company, setCompany] = useState([])
  const [selectKey, setSelectKey] = useState()

  function inputNameHandler(e) {
    setInputName(e.target.value)
  }

  function inputPasswordHandler(e) {
    setInputPassword(e.target.value)
  }
  
  

  useEffect(() => {
    const { q } = qs.parse(window.location.search.slice(1));

    if (!q) {
      history.push("/");
    }

    const data = JSON.parse(utils.decode(q));
    setDefaultState(data);
  }, []);

  const onSubmit = (data) => {
    
    const { employeeNumber } = data;

    // Todo...
    // if (employeeNumber !== "123") {
    //   setIsError(true);
    //   return;
    // }
    const _data = { ...defaultState, employeeNumber };

    console.log('info.js::::::::::::::');
    console.log(_data);
    
    

    const userInfo = {
      id:employeeNumber,
      userName:  _data.name,
      userPhone: _data.tel,
      site_idx :_data.site_idx
      ,company_idx:selectKey
    }
    console.log(userInfo)
    
    axios.post(`${API_URL}/v1/userBusinessIdInfo`, userInfo)
    .then((res) => {
      let checkEmployeeNumber = res.data.result
      if (checkEmployeeNumber === 'false') {
        history.push('/Errorpage')
      } else {
        _data.step_idx = res.data.step_idx;
        _data.class_id = res.data.class_id;

        history.push(
          `${PREFIX}/agreements?q=${utils.encode(JSON.stringify(_data))}`
        );
      }
    })
  };
  
  const handleCloseErrorPage = () => {
    setIsError(false);
  };

  // value={defaultState?.name
  if (isError) return <ErrorPage onClick={handleCloseErrorPage} />;

  return (
    <div className={style.container}>
      <Box step={1} text1="본인 확인을 위해" text2="사번을 입력해주세요" />
      <div className={style.group17}></div>
      <form className={style.mainForm} onSubmit={handleSubmit(onSubmit)}>        
         <Input label="사업장" value={defaultState?.site_name || ""} disable />
         <Input label="이름" value={defaultState?.name || ""}  disable/>     
        <div style={{display:"flex"}}>
         <InputTel label="전화번호" value={defaultState?.tel || ''} className={style.inputPhone} disabled />
         {/* <Input label="전화번호"  onChange={inputPasswordHandler} className={style.inputPhone}/> */}
          <button className={style.sendInfo}>인증요청</button>
          </div>
        <div>회사</div>
        <SeleteComapny company={company} setCompany={setCompany} selectKey={selectKey} setSelectKey={setSelectKey}/>
        <Input
          {...{ register, formName: "employeeNumber" }}
          label="사번"
          placeholder="사번을 입력해주세요"
        />
        <SubmitButton type="submit" label={"제출"} onClick={onSubmit}/>
      </form>
    </div>
  );
}

export default Info;
