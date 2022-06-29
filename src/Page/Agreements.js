import React, { useState, useEffect } from "react";
import LoadingPaper from "../Component/loadingPage/LoadingPaper";
import { encrypt } from "../config/encOrdec";
import SubmitButton from "../Component/SubmitButton";
import { PREFIX, API_URL } from "../config";
import style from "../Css/Main.module.css";
import { useHistory } from "react-router";
import { useRecoilState } from "recoil";
import { tokenSaver } from "../atom";
import Box from "../Component/Box";
import utils from "../utils";
import axios from "axios";
import qs from "qs";

const Agreements = () => {
  const [loading, setLoading] = useState(false);
  const [checkedInputs, setCheckedInputs] = useState([]);
  const [sendData, setSendDate] = useState([]);
  const [sendData1, setSendDate1] = useState([]);
  const [token, setToken] = useRecoilState(tokenSaver);
  const history = useHistory();
  const [ScrollY, setScrollY] = useState(0); // 스크롤값을 저장하기 위한 상태

  const handleFollow = () => {
    // window 스크롤 값을 ScrollY에 저장
    setScrollY(window.pageYOffset);
  };

  useEffect(() => {
    const watch = () => {
      window.addEventListener("scroll", handleFollow);
    };
    // addEventListener 함수를 실행
    watch();
    return () => {
      // addEventListener 함수를 삭제
      window.removeEventListener("scroll", handleFollow);
    };
  });

  const changeHandler = (checked, id) => {
    if (checked) {
      //checkedInputs에 id 값을 넣어준다
      setCheckedInputs([...checkedInputs, id]);
    } else {
      //다시한번 클릭시 체크가 해제된다
      setCheckedInputs(checkedInputs.filter((el) => el !== id));
    }
  };

  useEffect(() => {
    const fetchAgreement = async () => {
      //서버에서 데이터를 받아온다
      const { data } = await axios.post(`${API_URL}/v1/codeTextApi`);
      //화면에 문구를 나타낸다
      setSendDate1(data);
      //로딩이 멈춘다
      setLoading(false);
    };
    fetchAgreement();
    const { q } = qs.parse(window.location.search.slice(1));
    setSendDate(JSON.parse(utils.decode(q)));
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const handleClick = () => {
    nextBtn();
  };

  const nextBtn = () => {
    const { q } = qs.parse(window.location.search.slice(1));
    const _data = JSON.parse(utils.decode(q));
    //데이터 오브젝트에 agree를 추가해 준다
    _data.agree = true;
    //서버통신에 사용될 데이터
    let payload = {
      site_manage_phone: sendData.tel,
      site_manage_name: sendData.name,
      site_idx: sendData.site_idx,
      step_idx: sendData.step_idx,
    };
    //json화
    const JsonPayload = JSON.stringify(payload);
    //암호화
    const EncJsonPayload = encrypt(JsonPayload);
    //오브젝트화
    const AxiosSendData = { data: EncJsonPayload };

    axios
      .post(`${API_URL}/v1/info/personalAcceptData`, AxiosSendData, {
        //토큰을 보내기 위한 헤더 설정
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.status === 200) {
          //서버 통신 성공시 데이터를 인코딩해 다음페이지의 url로 보낸다
          history.replace(
            `${PREFIX}/select?q=${utils.encode(JSON.stringify(_data))}`
          );
        } else {
          alert(
            "오류로 인해 요청을 완료할 수 없습니다. 나중에 다시 시도하십시오."
          );
          history.replace("/Errorpage");
        }
      })
      .catch((err) => {
        //통신 실패시 에러페이지로 넘어가는 로직
        console.log(err);
        if (err?.response?.status === 401) {
          alert("유효하지 않은 접근입니다.");
          window.location.href = "https://www.s1.co.kr/";
        } else {
          alert(
            `오류로 인해 요청을 완료할 수 없습니다.나중에 다시 시도하십시오.`
          );
          window.location.href = "https://www.s1.co.kr/";
        }
      });
  };

  useEffect(() => {
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener("popstate", function (event) {
      window.history.pushState(null, document.title, window.location.href);
    });
  }, [window.location.href]);

  return (
    <>
      {loading && <LoadingPaper />}

      <div className={style.container} style={{ height: "110vh" }}>
        <Box step={2} text1="개인정보" text2="수집 • 이용 동의" />
        <div className={style.group17}></div>

        {/* <LoadingPaper /> */}
        <div className={style.agree}>
          <input
            id="check1"
            type="checkbox"
            onChange={(e) => {
              if (checkedInputs.length === 0) {
                setCheckedInputs(["check", "check2"]);
              } else if (checkedInputs.length === 1) {
                setCheckedInputs(["check", "check2"]);
              } else {
                setCheckedInputs([]);
              }
            }}
            checked={checkedInputs.length === 2}
          />
          <label style={{ marginRight: "10px" }} for="check1"></label>
          <div className={style.borderBtm}>전체 동의하기</div>
        </div>

        <div className={style.contentWrapper}>
          <div className={style.secondCheck}>
            <input
              id="check2"
              label="check"
              type="checkbox"
              style={{ marginRight: "10px" }}
              onChange={(e) => {
                changeHandler(e.currentTarget.checked, "check");
              }}
              checked={checkedInputs.includes("check") ? true : false}
            />
            <label style={{ marginRight: "10px" }} for="check2"></label>
            <div style={{ fontSize: "16px", fontWeight: 700 }}>
              얼굴사진 특징정보 수집•이용 동의
              <span style={{ color: "#0172ce" }}>(필수)</span>
            </div>
          </div>

          <table className={style.tableWrapper}>
            <tr>
              <th className={style.agreementsTh}>수집•이용 목적</th>
              <td classNAme={style.agreementsTd}>{sendData1.contents1}</td>
            </tr>
            <tr>
              <th className={style.agreementsTh}>보유 및 이용 기간</th>
              <td classNAme={style.agreementsTd}>{sendData1.contents2}</td>
            </tr>
          </table>

          <div className={style.infoWrapper}>
            <div className={style.info}>{sendData1.contents3}</div>
            <div className={style.info} style={{ marginTop: "3%" }}>
              {sendData1.contents6}
            </div>
          </div>
        </div>

        <div className={style.contentWrapper}>
          <div className={style.secondCheck}>
            <input
              id="check3"
              type="checkbox"
              style={{ marginRight: "10px" }}
              onChange={(e) => {
                changeHandler(e.currentTarget.checked, "check2");
              }}
              checked={checkedInputs.includes("check2") ? true : false}
            />
            <label style={{ marginRight: "10px" }} for="check3"></label>
            <div style={{ fontSize: "16px", fontWeight: 700 }}>
              얼굴사진 원본정보 수집•이용 동의
              <span style={{ color: "#0172ce" }}>(필수)</span>
            </div>
          </div>

          <table className={style.tableWrapper}>
            <tr>
              <th className={style.agreementsTh}>수집•이용 목적</th>
              <td classNAme={style.agreementsTd}>{sendData1.contents4}</td>
            </tr>
            <tr>
              <th className={style.agreementsTh}>보유 및 이용 기간</th>
              <td classNAme={style.agreementsTd}>{sendData1.contents5}</td>
            </tr>
          </table>
        </div>

        {!checkedInputs.includes("check", "check2") ||
        !checkedInputs.includes("check") ||
        !checkedInputs.includes("check2") ? (
          <SubmitButton
            label={"동의합니다"}
            color={"#dcdcdc"}
            borderColor={"#dcdcdc"}
          />
        ) : (
          <SubmitButton label={"동의합니다"} onClick={handleClick} />
        )}
      </div>
    </>
  );
};

export default Agreements;
