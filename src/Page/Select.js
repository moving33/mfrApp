import React, { useEffect, useState, Suspense } from "react";
import LoadingPaper from "../Component/loadingPage/LoadingPaper";
import SubmitButton from "../Component/SubmitButton";
import noGlassPng from "../assets/Group2.svg";
import { PREFIX } from "../config";
import style from "../Css/Main.module.css";
import glassPng from "../assets/Group.svg";
import { useHistory } from "react-router";
import Box from "../Component/Box";
import utils from "../utils";
import qs from "qs";

const Button = (props) => {
  return (
    <button
      type="button"
      onClick={props?.onClick}
      className={`${style.toggleButton} ${props.active ? style.active : ""}`}
      style={props?.border}
    >
      {props.label}
    </button>
  );
};

function Select() {
  const history = useHistory();

  const [btnAble, setBtnAble] = useState(false);
  const [isGlass, setIsGlass] = useState(null);

  const handleClick = () => {
    //url에서 암호화된 데이터를 가져온다
    const { q } = qs.parse(window.location.search.slice(1));
    //데이터를 복호화한다
    const _data = JSON.parse(utils.decode(q));
    //데이터에 안경 착용 여부를 넣어준다
    _data.isGlass = isGlass;
    history.replace(
      `${PREFIX}/camera?q=${utils.encode(JSON.stringify(_data))}`
    );
  };

  //뒤로가기 방지
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener("popstate", function (event) {
      window.history.pushState(null, document.title, window.location.href);
    });
  }, [window.location.href]);

  return (
    <Suspense fallback={<LoadingPaper />}>
      <div className={style.container}>
        <Box step={3} text1="안경을" text2="쓰고 있나요?" />
        <div className={style.subBoxContainer}>
          <div className={style.subInputInfo} style={{ marginTop: "-5%" }}>
            <p>
              인식률을 높이기 위해
              <br />
              안경을 쓴 등록자는 두번 촬영합니다.
            </p>
          </div>
        </div>
        <div className={style.group17}></div>

        <div className={style.glassImgContainer}>
          {isGlass && (
            <img className={style.glassImage} src={glassPng} alt="glassimage" />
          )}
          {!isGlass && (
            <img
              className={style.glassImage}
              src={noGlassPng}
              alt="noglassimage"
            />
          )}
        </div>

        <div className={style.toggleButtonWrapper}>
          {btnAble === false ? (
            <>
              <Button
                onClick={() => {
                  setIsGlass(true);
                  setBtnAble(true);
                }}
                label="네"
                border={{ borderRight: "0.5px" }}
              />
              <Button
                onClick={() => {
                  setIsGlass(false);
                  setBtnAble(true);
                }}
                label="아니오"
                border={{ borderLeftt: "0.5px" }}
              />
            </>
          ) : (
            <>
              <Button
                active={isGlass}
                onClick={() => {
                  setIsGlass(true);
                  setBtnAble(true);
                }}
                label="네"
              />
              <Button
                active={!isGlass}
                onClick={() => {
                  setIsGlass(false);
                  setBtnAble(true);
                }}
                label="아니오"
              />
            </>
          )}
        </div>
        <div>
          {btnAble === false ? (
            <SubmitButton
              label={"다음"}
              color={"#dcdcdc"}
              borderColor={"#dcdcdc"}
            />
          ) : (
            <SubmitButton label={"다음"} onClick={handleClick} />
          )}
        </div>
      </div>
    </Suspense>
  );
}

export default Select;
