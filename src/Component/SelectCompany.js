import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { PREFIX, API_URL } from "../config";
import style from "../Css/Main.module.css";

const SelectCompany = ({ company, setCompany, selectKey, setSelectKey, disabled, onClick, open }) => {


  const selectKeyValue = (e) => {
    setSelectKey(e.target.value);
    //console.log(selectKey);
  }

  //   useEffect(() => {
  //  axios.post(`${API_URL}/v1/info/companyCode`)
  //  .then((res) => {
  //    setCompany(res.data)
  //  })
  //   }, []);


  // 페이지에서 비동기 요청이 필요할 때 useEffect 안에서 async await 처리를 해 데이터를 받아와야함
  useEffect(() => {
    const fetchCompany = async () => {
      const { data } = await axios.post(`${API_URL}/v1/info/companyCode`)
      setCompany(data)
      console.log(data)
    }
    fetchCompany()
  }, [])

  // useEffect를 설정 해야 useState가 제대로 찍힘
  useEffect(() => {
    //console.log(selectKey)
  }, [selectKey])
  const onClickEvent = () => {
    onClick && onClick(!open)
  }

  return (
    <div onClick={onClickEvent}>
      {disabled
        ?
        <div className={style.selectCompany} />
        :
        <select className={style.selectCompany} label="회사" defaultValue={selectKey} key={selectKey} onChange={selectKeyValue} >
          {
            company.map((item) => {
              return (
                <option value={item.company_idx} key={item.company_idx} >{item.company_name}</option>
              )
            })
          }
        </select>
      }
    </div>
  )
}

export default SelectCompany