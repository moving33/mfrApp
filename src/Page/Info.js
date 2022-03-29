import React, { useEffect, useState, useRef } from "react";
import qs from "qs";
import { useHistory } from "react-router";
import { useForm } from "react-hook-form";
import axios from "axios";
import { isMobile, MobileView, BrowserView } from 'react-device-detect';

import style from "../Css/Main.module.css";
import Box from "../Component/Box";
import Input from "../Component/Input";
import InputTel from "../Component/InputTel";
import SubmitButton from "../Component/SubmitButton";

import "../Css/Main.module.css";


import UsefulModal from "../Component/UsefulModal";
import AgreementsModal from "../Component/AgreementsModal";
import Errorpage from './Errorpage'
import utils from "../utils";
import ErrorBox from "../Component/ErrorBox";
import ErrorSubBox from "../Component/ErrorSubBox";
import { PREFIX, API_URL } from "../config";
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

  const [payload, setPayload] = useState();
  const [encData, setEncData] = useState();
  const [defaultState, setDefaultState] = useState();
  let [emNum, setEmNum] = useState('');
  const [isError, setIsError] = useState(false);
  const [siteName, setSiteName] = useState();
  const [inputName, setInputName] = useState();
  const [inputPassword, setInputPassword] = useState();

  const [openPassModal, setOpenPassModal] = useState(false);
  const [openNxtBtnModal, setOpenNxtBtnModal] = useState(false);
  const [openEmptyPhoneNumModal, setOpenEmptyPhoneNumModal] = useState(false);
  const [openEmptyNameModal, setOpenEmptyNameModal] = useState(false);

  const [telOn, setTelOn] = useState(false);
  const [nameOn, setNameOn] = useState(false);

  const [company, setCompany] = useState([]);
  const [selectKey, setSelectKey] = useState();
  let [name, setName] = useState('');
  let [tel, setTel] = useState('');
  const fRef = useRef();

  const passModaltext = '국내 통신사로만 본인인증이 가능하며 해당 URL접속 시 데이터 통신비용이 발생할 수 있습니다.';
  const nextBtnModalText = '인증을 먼저해 주셔야 합니다.';
  const emptyPhoneNum = '전화번호를 입력해 주세요'
  const emptyName = '이름을 입력해 주세요';

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

    // if (!isMobile) history.push("/weberrorpage");
    //css수정
    const { workplace } = qs.parse(window.location.search.slice(1));

    console.log(" workplace : ", workplace);

    // if (workplace === null || workplace === undefined || workplace === "") history.push("/errorpage");

    const payload = {
      uuid: workplace || null
    };

    axios.post(`${API_URL}/v1/siteInfo`, payload)
      .then((res) => {
        if (res.data === null || res.data.result === '잘못된 요청입니다.') { history.push("/errorpage") }
        console.log("intro.js::::");
        console.log(res.data);

        console.log(res.data.site_idx);

        setDefaultState(res.data);

        const siteIdx = res.data.site_idx;

        axios({
          method: 'POST',
          data: { "siteIdx": siteIdx },
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
        //css
        //history.push("/errorpage")
      });

  }, []);

  const PassButton = () => {
    if (tel === '') {
      setOpenEmptyPhoneNumModal(!openEmptyPhoneNumModal);
      return;
    }
    if (name === '') {
      setOpenEmptyNameModal(!openEmptyNameModal);
      return;
    }
    setOpenPassModal(!openPassModal)
  }
  const passAgree = () => {
    fRef.current.submit();
  }

  const onSubmit = (data) => {

    console.log('formData:', data);
    const { employeeNumber } = data;

    //사번을 입력하지 못하면 못 지나간다.

    if (emNum === '') {
      setOpenNxtBtnModal(!openNxtBtnModal)
      return;
    }

    const _data = { ...defaultState, employeeNumber };

    console.log('info.js::::::::::::::');
    console.log(_data);

    const userInfo = {
      id: employeeNumber,
      userName: _data.name,
      userPhone: _data.tel,
      site_idx: _data.site_idx,
      company_idx: selectKey
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

  if (isError) return <ErrorPage onClick={handleCloseErrorPage} />;

  return (
    // <MobileView></MobileView>
    <div>
      <form ref={fRef} action="https://nice.checkplus.co.kr/CheckPlusSafeModel/checkplus.cb">
        <input type="hidden" name="m" value="checkplusSerivce" />
        <input type="hidden" name="EncodeData" value={encData} />
      </form>

      <div className={style.container}>
        <Box step={1} text1="본인 확인을 위해" text2="사번을 입력해주세요" />


        <div>
          <Input label="사업장" value={defaultState?.site_name || ""} disable="true" background={'#F2F2F2'} color={'#B2B2B2'}  title='true' />

          <Input label="이름" placeholder={"이름을 입력해 주세요"} value={name} setValue={setName} onChange={nameHandler} />

          <div style={{ marginTop:'5%' }}><label>전화번호</label>
            <div style={{ display: "flex", width: '100%' }}>
              <input label="전화번호" value={tel} onChange={telHandler} placeholder={"숫자만 입력해 주세요"} className={style.inputPhone} type="number" style={{ width: '70%' }} />
              <button
                className={style.sendInfo}
                onClick={PassButton}
                style={{ backgroundColor: "white", color: "#808080", border: "1px solid #DCDCDC"}}
              >인증 요청</button>
            </div>
          </div>

          <div className={style.companyLabel} style={{ width: "91%", left: "0", marginTop:'5%' }}>회사</div>
          <SeleteComapny company={company} setCompany={setCompany} selectKey={selectKey} setSelectKey={setSelectKey} />

          <Input {...{ register, formName: "employeeNumber" }} label="사번" placeholder="사번을 입력해 주세요" value={emNum} onChange={emNumHandler} />

          <SubmitButton type="submit" label={"다음"} onClick={onSubmit} style={{ backgroun: "#dcdcdc", width: '100%' }} />

          {/* </form> */}
        </div>
        {
          openPassModal === true
            ? (<AgreementsModal title={'인증 요청'} text1={passModaltext} setOpen={setOpenPassModal} open={openPassModal} nextBtn={passAgree} />)
            : null
        }
        {
          openNxtBtnModal === true
            ? (<UsefulModal text1={nextBtnModalText} Disagree={setOpenNxtBtnModal} open={openNxtBtnModal} />)
            : null
        }
        {
          openEmptyPhoneNumModal === true
            ? (<UsefulModal text1={emptyPhoneNum} Disagree={setOpenEmptyPhoneNumModal} open={openEmptyPhoneNumModal} />)
            : null
        }
        {
          openEmptyNameModal === true
            ? (<UsefulModal text1={emptyName} Disagree={setOpenEmptyNameModal} open={openEmptyNameModal} />)
            : null
        }
      </div>
    </div>
  );
}

export default Info;
