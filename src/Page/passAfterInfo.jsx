import React, { useEffect, useState, useRef } from "react";
import style from "../Css/Main.module.css";
import Box from "../Component/Box";
import Input from "../Component/Input";
import { useHistory } from "react-router";
import { useForm } from "react-hook-form";
import LoadingPaper from "../Component/loadingPage/LoadingPaper";
import UsefulModal from "../Component/UsefulModal";
import { useRecoilState } from "recoil";
import qs from "qs";
import utils from "../utils";
import { PREFIX, API_URL } from "../config";
import axios from "axios";
import SeleteComapny from "../Component/SelectCompany";
import { tokenSaver } from "../atom";
import { encrypt, decrypt } from "../config/encOrdec";

function PassAfterInfo() {
  const history = useHistory();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [token, setToken] = useRecoilState(tokenSaver);

  const [defaultState, setDefaultState] = useState();
  const [selectKey, setSelectKey] = useState();
  const [encData, setEncData] = useState();

  const [company, setCompany] = useState([]);

  const [openAfterPassModal, setOpenAfterPassModal] = useState(false);
  const [openEmNumModal, setOpenEmNumModal] = useState(false);
  const [openSelectKeyUndefinedModal, setOpenSelectKeyUndefinedModal] =
    useState(false);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  let [emNum, setEmNum] = useState("");
  let [name, setName] = useState("");
  let [tel, setTel] = useState("");

  const fRef = useRef();

  const emNumHandler = (e) => {
    //enNum값을 e.target.value값으로 변경해준다
    setEmNum(e.target.value);
  };

  useEffect(() => {
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener("popstate", function (event) {
      window.history.pushState(null, document.title, window.location.href);
    });
  }, [window.location.href]);

  useEffect(() => {
    //url에서 한 블럭을 잘라내어 q값에 담는다.
    const { q } = qs.parse(window.location.search.slice(1));
    //q가 없으면 메인페이지로 이동시킨다.
    if (!q) {
      history.replace("/");
    }
    //q에서 받아온 값을 data에 넣는다
    const data = JSON.parse(utils.decode(q));
    //data를 defaultData에 넣어준다
    setDefaultState(data);
    //화면 로드시 상단 위치 고정
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  //인증완료 클릭시
  const PassButton = () => {
    //openAfterPassModal 값을 변경하면서 모달이 나타난다.
    setOpenAfterPassModal(!openAfterPassModal);
  };

  //다음 버튼 클릭시
  const onSubmit = (data) => {
    //회사가 선택되지 않았다면 회사를 선택해 달라는 모달이 나온다
    if (selectKey === undefined || company.company_idx === 0) {
      setOpenSelectKeyUndefinedModal(!openSelectKeyUndefinedModal);
      return;
    }
    //사번값이 비어있다면 모달이 나타난다.
    if (emNum === "") {
      setOpenEmNumModal(!openEmNumModal);
      return;
    } else {
      //모든 조건을 통과했다면 defaultState에 사번을 추가해준다
      const _data = { ...defaultState, emNum };
      //다음 페이지로 넘어가기 위해 해당 사용자가 등록이 되어있는지 확인하기 위한 데이터를 생성한다
      const userInfo = {
        id: emNum,
        userName: _data.name,
        userPhone: _data.tel,
        site_idx: _data.site_idx,
        company_idx: selectKey,
        classId: _data.class_id,
      };
      //제이슨으러 변경
      const jsonUserInfo = JSON.stringify(userInfo);
      //암호화
      const jsonEncUserInfo = encrypt(jsonUserInfo);
      //암호화 된 값 오브젝트화
      const sendUserInfo = { data: jsonEncUserInfo || null };
      //통신 중에는 로딩페이지를 보여준다
      setLoading(true);
      axios
        .post(`${API_URL}/v1/userBusinessIdInfo`, sendUserInfo)
        .then((res) => {
          if (res.status === 200) {
            //암호화된 데이터 복호화
            const decryptData = decrypt(res.data.data);
            //복호화된 제이슨 오브젝트화
            const realData = JSON.parse(decryptData);
            //_data오브젝트 안에 step_idx값을 만들어 realData.step_idx를 넣어준다
            _data.step_idx = realData.step_idx;
            //서버에서 날려준 데이터를 recoil기반의 토큰 저장소에 넣어준다
            setToken(realData.jwt);
            //모든 값을 url에 넣어주고 다음 페이지로 넘어간다.
            history.replace(
              `${PREFIX}/agreements?q=${utils.encode(JSON.stringify(_data))}`
            );
          } else {
            history.replace("/errornopeople");
          }
        })
        .catch((err) => {
          //통신 실패시 에러페이지로 넘어가는 로직
          if (err?.response?.status === 401) {
            history.replace("/errornopeople");
          } else if (err?.response?.status === 400) {
            history.replace("/errornopeople");
          } else {
            history.replace("/errornopeople");
          }
        });
    }
  };

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
        {loading && <LoadingPaper />}
        <Box step={1} text1="본인 확인을 위해" text2="정보를 입력해주세요" />
        <div>
          <Input
            label="사업장"
            value={defaultState?.site_name || ""}
            disable
            background={"#F2F2F2"}
            color={"#B2B2B2"}
            title="true"
          />
          <Input
            label="이름"
            value={defaultState?.name || name}
            setValue={setName}
          />
          <div style={{ marginTop: "5%" }}>
            <div className={style.inputLabelStyle}>전화번호</div>
            <div style={{ display: "flex", width: "100%" }}>
              <input
                label="전화번호"
                value={defaultState?.tel || tel}
                id="telInput"
                placeholder={"숫자만 입력해주세요"}
                className={style.inputPhone}
                type="number"
                style={{ width: "70%" }}
              />
              <button
                className={style.sendInfoSuccess}
                onClick={PassButton}
                style={{ fontSize: "15px", width: "28%" }}
              >
                인증 완료
              </button>
            </div>
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
            disabled={false}
          />
          <div
            className={style.inputLabelStyle}
            style={{
              width: "91%",
              left: "0",
              marginBottom: "2%",
              marginTop: "5%",
            }}
          >
            사번
          </div>
          <div className={style.inputTeam}>
            <input
              className={style.inputPhone}
              placeholder="사번을 입력해주세요"
              value={emNum}
              onChange={emNumHandler}
            />
          </div>
          <div
            className={style.submitButtonWrapper}
            style={{ position: "relative" }}
          >
            <button
              className={style.submitButton}
              style={{ width: "100%" }}
              type="submit"
              label={"다음"}
              onClick={() => {
                onSubmit(
                  defaultState?.site_name,
                  defaultState?.name,
                  defaultState?.tel,
                  company,
                  emNum
                );
              }}
            >
              다음
            </button>
          </div>
        </div>
        {/* </form> */}
      </div>
      {openAfterPassModal === true ? (
        <UsefulModal
          text1="이미 인증 하셨습니다."
          Disagree={setOpenAfterPassModal}
          open={openAfterPassModal}
        />
      ) : null}
      {openEmNumModal === true ? (
        <UsefulModal
          text1="사번을 입력해 주세요"
          Disagree={setOpenEmNumModal}
          open={openEmNumModal}
        />
      ) : null}
      {openSelectKeyUndefinedModal === true ? (
        <UsefulModal
          text1="회사를 선택해 주세요"
          Disagree={setOpenSelectKeyUndefinedModal}
          open={openSelectKeyUndefinedModal}
        />
      ) : null}
    </div>
  );
}

export default PassAfterInfo;
