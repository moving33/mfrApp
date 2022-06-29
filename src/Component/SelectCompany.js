import React, { useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";
import style from "../Css/Main.module.css";
import { decrypt } from "../config/encOrdec";

const SelectCompany = ({
  company,
  setCompany,
  selectKey,
  setSelectKey,
  disabled,
  onClick,
  open,
}) => {
  const selectKeyValue = (e) => {
    //selectKey값에 e.target.value를 넣는다
    setSelectKey(e.target.value);
  };

  useEffect(() => {
    const fetchCompany = async () => {
      //서버에서 data를 받아온다
      const { data } = await axios.post(`${API_URL}/v1/info/companyCode`);
      //받아온 암호화된 데이더
      const EncData = data.data;
      //복호화를 하는 코드
      const decData = decrypt(EncData);
      //복호화 된 json을 오브젝트로 변환한다
      const jsonParseData = JSON.parse(decData);
      setCompany(jsonParseData);
    };
    fetchCompany();
  }, []);

  // useEffect를 설정 해야 useState가 제대로 찍힘
  useEffect(() => {
    console.log(selectKey);
  }, [selectKey]);

  const onClickEvent = () => {
    onClick && onClick(!open);
  };

  return (
    <div onClick={onClickEvent}>
      {disabled ? (
        <div className={style.selectCompany} />
      ) : (
        <select
          className={style.selectCompany}
          label="회사"
          defaultValue={selectKey}
          key={selectKey}
          onChange={selectKeyValue}
        >
          {company.map((item) => {
            return (
              <option value={item.company_idx} key={item.company_idx}>
                {item.company_name}
              </option>
            );
          })}
        </select>
      )}
    </div>
  );
};

export default SelectCompany;
