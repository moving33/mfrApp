import React, { useEffect, useState, useRef } from "react";
import style from "../Css/Main.module.css";
import Box from "../Component/Box";
import Input from "../Component/Input";
import InputTel from "../Component/InputTel";
import SubmitButton from "../Component/SubmitButton";
import { useHistory } from "react-router";
import { useForm } from "react-hook-form";
import Errorpage from './Errorpage'

import UsefulModal from "../Component/UsefulModal";

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

function PassAfterInfo() {

  const history = useHistory();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [emnumOn, setEmnumOn] = useState(false);
  const [payload, setPayload] = useState();
  const [encData, setEncData] = useState();
  const [defaultState, setDefaultState] = useState();
  const [isError, setIsError] = useState(false);
  const [siteName, setSiteName] = useState();
  const [inputName, setInputName] = useState();
  const [inputPassword, setInputPassword] = useState();
  const [company, setCompany] = useState([]);
  const [selectKey, setSelectKey] = useState();

  const [nameOn, setNameOn] = useState(false);
  const [telOn, setTelOn] = useState(false);

  const [openAfterPassModal, setOpenAfterPassModal] = useState(false);
  const [openEmNumModal, setOpenEmNumModal] = useState(false);
  const [openSelectKeyUndefinedModal, setOpenSelectKeyUndefinedModal] = useState(false);

  let [name, setName] = useState('');
  let [tel, setTel] = useState('');
  let [emNum, setEmNum] = useState('');
  const fRef = useRef();

  function nameHandler(e) {
    setName(e.target.value)
  }
  function telHandler(e) {
    setTel(e.target.value)
  }
  const emNumHandler = (e) => {
    setEmNum(e.target.value)
  }
  function inputPasswordHandler(e) {
    setInputPassword(e.target.value)
  }
  useEffect(() => {
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener('popstate', function (event) { window.history.pushState(null, document.title, window.location.href); });
  }, [window.location.href]);

  //전 화면에서 받아오는 url q값 지금은 진행을 위해서 주석 처리 웹 접근 분기도 여기서 처리
  useEffect(() => {

    // if (!isMobile) history.replace("/weberrorpage");

    const { q } = qs.parse(window.location.search.slice(1));

    if (!q) {
      history.replace("/");
    }

    const data = JSON.parse(utils.decode(q));

    console.log('data : ', data);

    setDefaultState(data);

    console.log(defaultState);

  }, []);

  //인증완료 클릭시
  const PassButton = () => {
    setOpenAfterPassModal(!openAfterPassModal);
  }
  //다음 버튼 클릭시
  const onSubmit = (data) => {

    console.log('data', data);
    console.log('defaultState', defaultState);

    const { employeeNumber } = data;

    if (selectKey === undefined || company.company_idx === 0) {
      setOpenSelectKeyUndefinedModal(!openSelectKeyUndefinedModal);
      return;
    }

    if (emNum === '') {
      setOpenEmNumModal(!openEmNumModal);
      return;

    } else {

      //const _data = { ...defaultState, employeeNumber };
      const _data = { ...defaultState, emNum };

      console.log('_data : ', _data);

      console.log('info.js::::::::::::::');

      const userInfo = {
        id: emNum,
        userName: _data.name,
        userPhone: _data.tel,
        site_idx: _data.site_idx,
        company_idx: selectKey,
        classId: _data.class_id,
      }

      console.log('userInfo : ', userInfo);

      axios.post(`${API_URL}/v1/userBusinessIdInfo`, userInfo)
        .then((res) => {
          console.log('res.data in info : ', res.data);
          let checkEmployeeNumber = res.data.result
          if (checkEmployeeNumber === 'true') {
            _data.step_idx = res.data.step_idx;
            // _data.class_id = res.data.class_id;
            console.log('pass _data to info : ', _data);
            history.replace(`${PREFIX}/agreements?q=${utils.encode(JSON.stringify(_data))}`);
          } else {
            history.replace('/errornopeople');
          }
        })
    }
  };

  const handleCloseErrorPage = () => {
    setIsError(false);
  };

  if (isError) return <ErrorPage onClick={handleCloseErrorPage} />;

  return (
    <div>
      <form ref={fRef} action="https://nice.checkplus.co.kr/CheckPlusSafeModel/checkplus.cb">
        <input type="hidden" name="m" value="checkplusSerivce" />
        <input type="hidden" name="EncodeData" value={encData} />
      </form>

      <div className={style.container}>
        <Box step={1} text1="본인 확인을 위해" text2="사번을 입력해주세요" />


        <div>

          <Input label="사업장" value={defaultState?.site_name || ""} disable background={'#F2F2F2'} color={'#B2B2B2'} title='true' />

          <Input label="이름" value={defaultState?.name || name} onChange={nameHandler} setValue={setName} />

          <div style={{ marginBottom: '1%' ,  marginTop:'5%'}}>
            <label>전화번호</label>
            <div style={{ display: "flex", width: '100%' }}>
                <input label="전화번호" value={defaultState?.tel || tel} id='telInput' 
                onChange={telHandler} placeholder={"숫자만 입력해 주세요"} className={style.inputPhone} type="number" style={{ width: '70%' }} />
              <button className={style.sendInfoSuccess} onClick={PassButton}>인증 완료</button>
            </div>
          </div>

          <div className={style.companyLabel} style={{ width: "91%", left: "0", marginTop:'5%' }}>회사</div>
          <SeleteComapny company={company} setCompany={setCompany} selectKey={selectKey} setSelectKey={setSelectKey} />

          <div className={style.companyLabel} style={{ width: "91%", left: "0", marginBottom: "2%",  marginTop:'5%' }}>사번</div>
          <div className={style.inputTeam}>
            <input className={style.inputPhone} placeholder="사번을 입력해주세요" value={emNum} onChange={emNumHandler} />
          </div>

          <div className={style.submitButtonWrapper} style={{ position: 'relative', marginTop: '8%' }}>
            <button className={style.submitButton}
              style={{ width: '100%' }}
              type="submit"
              label={"다음"}
              onClick={() => { onSubmit(defaultState?.site_name, defaultState?.name, defaultState?.tel, company, emNum) }}
            >
              다음
            </button>
          </div>
        </div>
        {/* </form> */}
      </div>
      {
        openAfterPassModal === true
          ? (<UsefulModal text1='이미 인증 하셨습니다.' Disagree={setOpenAfterPassModal} open={openAfterPassModal} />)
          : null
      }
      {
        openEmNumModal === true
          ? (<UsefulModal text1='사번을 입력해 주세요' Disagree={setOpenEmNumModal} open={openEmNumModal} />)
          : null
      }
      {
        openSelectKeyUndefinedModal === true
          ? (<UsefulModal text1='회사를 선택해 주세요' Disagree={setOpenSelectKeyUndefinedModal} open={openSelectKeyUndefinedModal} />)
          : null
      }

    </div>
  );
}

export default PassAfterInfo;
