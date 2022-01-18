import React, { useEffect, useState, useRef } from "react";
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
import { isMobile, MobileView } from 'react-device-detect';

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


  const [payload, setPayload] = useState();
  const [encData, setEncData] = useState();
  const [defaultState, setDefaultState] = useState();
  let [emNum, setEmNum] = useState('');
  const [isError, setIsError] = useState(false);
  const [siteName, setSiteName] = useState();
  const [inputName, setInputName] = useState()
  const [inputPassword, setInputPassword] = useState()
  const [company, setCompany] = useState([])
  const [selectKey, setSelectKey] = useState()
  let [name, setName] = useState('');
  let [tel, setTel] = useState('');
  const fRef = useRef();
  function nameHandler(e) {
    setName(e.target.value)
  }
  function telHandler(e) {
    setTel(e.target.value)
  }
  function emNumHandler(e) {
    setEmNum(e.target.value)
  }
  function inputPasswordHandler(e) {
    setInputPassword(e.target.value)
  }

  //전 화면에서 받아오는 url q값 지금은 진행을 위해서 주석 처리 웹 접근 분기도 여기서 처리
  useEffect(() => {
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener('popstate', function (event) { window.history.pushState(null, document.title, window.location.href); });
  }, [window.location.href]);

  useEffect(() => {

    if (!isMobile) history.push("/weberrorpage");

    const { workplace } = qs.parse(window.location.search.slice(1));

    const payload = {
      uuid: workplace || null
    };

    axios.post(`${API_URL}/v1/siteInfo`, payload)
      .then((res) => {
        if (res.data === null || res.data.result === '잘못된 요청입니다.') { }
        console.log("intro.js::::");
        console.log(res.data);
        setDefaultState(res.data);

        axios({
          method: 'POST',
          //url: 'http://121.165.242.171:9998/checkplus_json',
          url: `${API_URL}/v1/niceApiCodeController`,
          timeout: 5000,
        }).then((res) => {
          localStorage.setItem('workplace', JSON.stringify(workplace));
          console.log('default', defaultState);
          console.log(res);
          setEncData(res.data.enc_data);
        }).catch(() => {
          // window.location.reload();
        });
      })
      .catch((err) => {
        // history.push("/errorpage")
      });

    //   const { q } = qs.parse(window.location.search.slice(1));

    //   if (!q) {
    //     history.push("/");
    //   }

    //   const data = JSON.parse(utils.decode(q));
    //   setDefaultState(data);

  }, []);

  const PassButton = () => {
    if (tel === '') {
      alert('전화번호를 입력해 주세요');
      return;
    }
    if (name === '') {
      alert('아름을 입력해 주세요');
      return;
    }
    fRef.current.submit();
  }

  const onSubmit = (data) => {

    console.log('formData:', data);
    const { employeeNumber } = data;

    //사번을 입력하지 못하면 못 지나간다.

    if (emNum === '') {
      alert('인증을 먼저해 주세요');
      return;
    }

    // Todo...
    // if (employeeNumber !== "123") {
    //   setIsError(true);
    //   return;
    // }

    const _data = { ...defaultState, employeeNumber };

    console.log('info.js::::::::::::::');
    console.log(_data);

    const userInfo = {
      id: employeeNumber,
      userName: _data.name,
      userPhone: _data.tel,
      site_idx: _data.site_idx
      , company_idx: selectKey
    }
    console.log(userInfo)

    axios.post(`${API_URL}/v1/userBusinessIdInfo`, userInfo)
      .then((res) => {
        let checkEmployeeNumber = res.data.result
        if (checkEmployeeNumber === 'false') {
          history.replace('/Errorpage')
        } else {
          _data.step_idx = res.data.step_idx;
          _data.class_id = res.data.class_id;
          history.replace(`${PREFIX}/agreements?q=${utils.encode(JSON.stringify(_data))}`);
        }
      })
  };


  const handleCloseErrorPage = () => {
    setIsError(false);
  };

  // value={defaultState?.name
  if (isError) return <ErrorPage onClick={handleCloseErrorPage} />;

  return (
    <MobileView>

      <form ref={fRef} action="https://nice.checkplus.co.kr/CheckPlusSafeModel/checkplus.cb">
        <input type="hidden" name="m" value="checkplusSerivce" />
        <input type="hidden" name="EncodeData" value={encData} />
      </form>

      <div className={style.container}>
        <Box step={1} text1="본인 확인을 위해" text2="사번을 입력해주세요" />
        <div className={style.group17} style={{ marginBottom: "10%" }}></div>
        {/* <button onClick={closeBtn}>닫기</button> */}
        {/* <form className={style.mainForm} onSubmit={handleSubmit(onSubmit)}> */}
        <div>
          <Input label="사업장" value={defaultState?.site_name || ""} disable />
          <Input label="이름" value={name} onChange={nameHandler} />
          {//{defaultState?.name || ""}}
          }
          <div style={{ display: "flex" }}>
            <InputTel label="전화번호" value={tel} onChange={telHandler} className={style.inputPhone} type="number" />
            {/* <Input label="전화번호"  onChange={inputPasswordHandler} className={style.inputPhone}/> */}
            {/* <button className={style.sendInfo} onClick={()=>{StartPass()}}>인증요청</button> */}
            <button
              className={style.sendInfo}
              onClick={PassButton}
            >인증하기</button>
          </div>

          <div className={style.companyLabel} style={{ width: "91%", left: "0" }}>회사</div>
          <SeleteComapny company={company} setCompany={setCompany} selectKey={selectKey} setSelectKey={setSelectKey} />
          <Input
            {...{ register, formName: "employeeNumber" }}
            label="사번"
            placeholder="인증을 하셔야 사번입력이 가능합니다"
            value={emNum}
            onChange={emNumHandler}
          />

          <SubmitButton type="submit" label={"다음"} onClick={onSubmit} />
          {/* </form> */}
        </div>
      </div>
    </MobileView>
  );
}

export default Info;
