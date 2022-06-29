import React, { useEffect } from "react";
import qs from "querystring";
import axios from "axios";
import { API_URL, PREFIX } from "../config";
import utils from "../utils";
import { useHistory } from "react-router-dom";
import { encrypt, decrypt } from "../config/encOrdec";

const getData = (d, k) => {
  //받아온 매게변수 d를 버퍼에 저장합니다
  let base64ToString = JSON.parse(Buffer.from(d, "base64").toString());
  //매게변수 k가 NAME일 경우 base64ToString.NAME을 utf-8로 decodeURI해준 값을 리턴 해줍니다.
  if (k === "NAME") {
    return decodeURI(base64ToString.NAME, "utf-8");
  }
  //매게변수 k가 MOBILE_NO일 경우 해당값을 리턴 해줍니다.
  if (k === "MOBILE_NO") {
    return base64ToString.MOBILE_NO;
  }
  return null;
};

function ConfirmPass() {
  // 1. 첫시작
  const history = useHistory();

  useEffect(() => {
    //url에 마지막 한 블럭을 가져와 파싱한다
    const p = qs.parse(window.location.search.slice(1));
    //로컬 스토리지 워크 플레이스에 담긴 값을 가져온다
    let workplace = localStorage.getItem("workplace");
    //워크 플레이스의 제일 앞 한글자와 제일 마지막 한 글자를 잘라낸다
    let cutplace = workplace.slice(1, workplace.length - 1);

    const enworkplace = { uuid: cutplace || null };
    const jsonPayload = JSON.stringify(enworkplace);
    const eworkplace = encrypt(jsonPayload);
    const payload = { data: eworkplace || null };

    // uuid 사업장 호출
    axios
      .post(`${API_URL}/v1/siteInfo`, payload)
      .then((res) => {
        if (res.data === null || res.data.result === "잘못된 요청입니다.") {
          // history.replace("/errorpage")
          console.log("failed Connected");
        }
        const decryptData = decrypt(res.data.data);
        const realData = JSON.parse(decryptData);
        //서버 통신에서 받아온 데이터를 사용에 맞게 변경해준다
        const _data = {
          site_name: realData.site_name,
          site_idx: realData.site_idx,
          class_id: realData.class_id,
          //상단 getData을 이용하여 NAME, MOBILE_NO값을 가져와 준다
          name: getData(p.data, "NAME"),
          tel: getData(p.data, "MOBILE_NO"),
        };
        //값들을 인코딩해 다음페이지의 url로 넘겨준다.
        history.replace(
          `${PREFIX}/info?q=${utils.encode(JSON.stringify(_data))}`
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return <div>ConfirmPass</div>;
}

export default ConfirmPass;
