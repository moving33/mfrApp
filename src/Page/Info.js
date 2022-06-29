import React, { useEffect, useState, useRef } from "react";
import AgreementsModal from "../Component/AgreementsModal";
import SeleteComapny from "../Component/SelectCompany";
import { decrypt, encrypt } from "../config/encOrdec";
import SubmitButton from "../Component/SubmitButton";
import UsefulModal from "../Component/UsefulModal";
import ErrorSubBox from "../Component/ErrorSubBox";
import ErrorBox from "../Component/ErrorBox";
import { API_URL } from "../config";
import style from "../Css/Main.module.css";
import { useHistory } from "react-router";
import { useForm } from "react-hook-form";
import Input from "../Component/Input";
import Box from "../Component/Box";
import "../Css/Main.module.css";
import axios from "axios";
import qs from "qs";

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
  const [selectKey, setSelectKey] = useState();
  const [encData, setEncData] = useState();
  const [openEmptyPhoneNumModal, setOpenEmptyPhoneNumModal] = useState(false);
  const [employeeNumberModal, setEmployeeNumberModal] = useState(false);
  const [openEmptyNameModal, setOpenEmptyNameModal] = useState(false);
  const [openNxtBtnModal, setOpenNxtBtnModal] = useState(false);
  const [openPassModal, setOpenPassModal] = useState(false);
  const [isError, setIsError] = useState(false);
  const [company, setCompany] = useState([]);
  let [emNum, setEmNum] = useState("");
  let [name, setName] = useState("");
  let [tel, setTel] = useState("");
  const fRef = useRef();

  const passModaltext =
    "국내 통신사로만 본인인증이 가능하며 해당 URL접속 시 데이터 통신비용이 발생할 수 있습니다.";
  const nextBtnModalText = "인증을 먼저해 주셔야 합니다.";
  const emptyPhoneNum = "전화번호를 입력해 주세요";
  const emptyName = "이름을 입력해 주세요";

  function nameHandler(e) {
    setName(e.target.value);
  }
  function telHandler(e) {
    setTel(e.target.value);
  }
  function emNumHandler(e) {
    setEmNum(e.target.value);
  }

  useEffect(() => {
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener("popstate", function (event) {
      window.history.pushState(null, document.title, window.location.href);
    });
  }, [window.location.href]);

  //전 화면에서 받아오는 url q값을 복호화 및 서버로 post요청
  useEffect(() => {
    //url의 뒤에서 부터 한 블럭을 잘라내어 워크플레이스의 값을 가져온다
    const { workplace } = qs.parse(window.location.search.slice(1));
    //인코딩 워크플레이스에 uuid:workplace 형태의 오브젝트를 만들어 넣어준다
    const enworkplace = { uuid: workplace || null };
    //인코딩 워크플레이스를 제이슨형식으로 만들어 준다
    const jsonPayload = JSON.stringify(enworkplace);
    //해당 제이슨 형식의 워크플레이스를 암호화해준다
    const eworkplace = encrypt(jsonPayload);
    //암호화된 워크 플레이스를 다시한번 오브젝트 형식으로 담아준다
    const payload = { data: eworkplace || null };

    axios
      .post(`${API_URL}/v1/siteInfo`, payload)
      .then((res) => {
        if (res.data === null || res.data.result === "잘못된 요청입니다.") {
          alert(
            "오류로 인해 요청을 완료할 수 없습니다. 나중에 다시 시도하십시오."
          );
          history.push("/errorpage");
        }
        //요청에 성공했다면 암호화된 데이터를 받아 복호화해 준다
        const decryptData = decrypt(res.data.data);
        //복호화된 데이터를 제이슨 형태에서 오브젝트형태로 바꿔준다
        const realData = JSON.parse(decryptData);
        //데이터를 state 안에 답아준다
        setDefaultState(realData);
        //복호화된 데이터의 사이트 아이디엑스값을 변수로 지정한다
        const siteIdx = realData.site_idx;
        axios({
          method: "POST",
          data: { siteIdx: siteIdx },
          url: `${API_URL}/v1/niceApiCodeController`,
          timeout: 5000,
        })
          .then((res) => {
            //요청에 성공했다면 로컬스토리지 워크플레이스를 담는다
            localStorage.setItem("workplace", JSON.stringify(workplace));
            //암호화된 데이터를 받아 state에 저장한다
            setEncData(res.data.enc_data);
          })
          .catch((err) => {
            //에러가 나면서 status값이 423이면 에러페이지로 이동
            if (err?.response?.status === 423) history.push("/closepage");
          });
      })
      .catch((err) => {
        //에러가 나면서 status값이 423이면 에러페이지로 이동
        if (err?.response?.status === 423) history.push("/closepage");
      });

    //페이지 로드시 윈도우 위치를 상단에 고정하는 함수
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const PassButton = () => {
    //tel이 비었으면 모달을 띄우고 함수를 리턴한다
    if (tel === "") {
      setOpenEmptyPhoneNumModal(!openEmptyPhoneNumModal);
      return;
    }
    //name이 비었으면 모달을 띄우고 함수를 리턴한다
    if (name === "") {
      setOpenEmptyNameModal(!openEmptyNameModal);
      return;
    }
    //두 값이 모두 있으면 패스라이브러리로 이어지는 모달을 띄운다
    setOpenPassModal(!openPassModal);
  };

  const passAgree = () => {
    //동의 버튼을 눌렀을 때 fRef가 참조인 요소의 버튼 클릭 이벤트를 발생시킨다.
    fRef.current.submit();
  };

  const handleCloseErrorPage = () => {
    //isError 값을 false로 바꿔준다
    setIsError(false);
  };

  if (isError) return <ErrorPage onClick={handleCloseErrorPage} />;

  return (
    <div>
      <form
        ref={fRef}
        action="https://nice.checkplus.co.kr/CheckPlusSafeModel/checkplus.cb"
      >
        <input type="hidden" name="m" value="checkplusSerivce" />
        <input type="hidden" name="EncodeData" value={encData} />
      </form>
      <div className={style.container}>
        <Box step={1} text1="본인 확인을 위해" text2="정보를 입력해주세요" />
        <div>
          <Input
            label="개발계 빌드 테스트"
            value={defaultState?.site_name || ""}
            disable="true"
            background={"#F2F2F2"}
            color={"#B2B2B2"}
            title="true"
          />
          <Input
            label="이름"
            placeholder={"이름을 입력해주세요"}
            value={name}
            setValue={setName}
            onChange={nameHandler}
          />
          <div
            className={style.inputLabelStyle}
            style={{ marginTop: "5%", bottom: "2%" }}
          >
            전화번호
          </div>
          <div style={{ display: "flex", width: "100%" }}>
            <input
              value={tel}
              onChange={telHandler}
              placeholder={"숫자만 입력해주세요"}
              className={style.inputPhone}
              type="number"
              style={{ width: "70%" }}
            />
            <button
              className={style.sendInfo}
              onClick={PassButton}
              style={{
                fontFamily: "Noto Sans KR",
                width: "28%",
                backgroundColor: "white",
                color: "#808080",
                border: "1px solid #DCDCDC",
                fontSize: "15px",
                fontWeight: 500,
              }}
            >
              인증 요청
            </button>
          </div>

          <div
            className={style.inputLabelStyle}
            style={{
              width: "91%",
              left: "0",
              marginTop: "5%",
              color: "#808080",
            }}
          >
            본인인증 완료 후 입력가능합니다.{" "}
          </div>
          <div
            className={style.inputLabelStyle}
            style={{ width: "91%", left: "0", marginTop: "5%" }}
          >
            회사
          </div>
          <SeleteComapny
            company={company}
            setCompany={setCompany}
            selectKey={selectKey}
            setSelectKey={setSelectKey}
            disabled={true}
          />

          <Input
            {...{ register, formName: "employeeNumber" }}
            label="사번"
            placeholder="사번을 입력해주세요"
            value={emNum}
            onChange={emNumHandler}
            disabled={true}
          />

          <SubmitButton
            type="submit"
            label={"다음"}
            style={{ backgroun: "#dcdcdc", width: "100%" }}
          />
        </div>
        {openPassModal === true ? (
          <AgreementsModal
            title={"인증 요청"}
            text1={passModaltext}
            setOpen={setOpenPassModal}
            open={openPassModal}
            nextBtn={passAgree}
          />
        ) : null}
        {openNxtBtnModal === true ? (
          <UsefulModal
            text1={nextBtnModalText}
            Disagree={setOpenNxtBtnModal}
            open={openNxtBtnModal}
          />
        ) : null}
        {openEmptyPhoneNumModal === true ? (
          <UsefulModal
            text1={emptyPhoneNum}
            Disagree={setOpenEmptyPhoneNumModal}
            open={openEmptyPhoneNumModal}
          />
        ) : null}
        {openEmptyNameModal === true ? (
          <UsefulModal
            text1={emptyName}
            Disagree={setOpenEmptyNameModal}
            open={openEmptyNameModal}
          />
        ) : null}
        {employeeNumberModal ? (
          <UsefulModal
            text1={"본인인증 후 정보를 입력해주시기 바랍니다."}
            Disagree={setEmployeeNumberModal}
            open={employeeNumberModal}
          />
        ) : null}
      </div>
    </div>
  );
}

export default Info;
