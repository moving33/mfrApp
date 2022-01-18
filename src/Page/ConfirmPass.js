import React, { useEffect } from 'react';
import qs from 'querystring';
import axios from 'axios';
import { API_URL, PREFIX } from '../config';
import utils from '../utils';
import { useHistory } from 'react-router-dom';
import { encode } from "qs/lib/utils";

const getData = (d, k) => {

  console.log(d);
  console.log(k);

  let base64ToString = JSON.parse(Buffer.from(d, "base64").toString());
  console.log(base64ToString);

  if (k == 'NAME') {
    return decodeURI(base64ToString.NAME,'utf-8');
  }
  if (k == 'MOBILE_NO') {
    return base64ToString.MOBILE_NO;
  }

  /*const a = d.split(':');
  for(const i in a) {
    const _k = a[i].replace(/[\d]+$/, '');
    if(k === _k) {
      const _i = parseInt(i)+1;
      const _d = a[_i];

      return _d.substring(0, _d.length-1);
    }
  }*/

  return null;
}

function ConfirmPass() { // 1. 첫시작 
  const history = useHistory();

  useEffect(() => {
    const p = qs.parse(window.location.search.slice(1));

    let workplace = localStorage.getItem('workplace');
    console.log(workplace);

    try {
      //workplace = JSON.parse(workplace); 
      workplace = JSON.parse(workplace);
    } catch (err) {
      console.log(err);
    }

    const payload = {
      uuid: workplace || null
    }

    //uuid 사업장 호출
    axios.post(`${API_URL}/v1/siteInfo`, payload)

      .then((res) => {
        console.log(res);
        if (res.data === null || res.data.result === '잘못된 요청입니다.') {
          history.replace("/errorpage")
        }
        console.log("intro.js::::")
        //setWorkplace(res.data)
        console.log(res.data);

        const _data = {
          //workplace,
          //resData,
          site_name: res.data.site_name,
          site_idx: res.data.site_idx,
          class_id: res.data.class_id,

          name: getData(p.data, 'NAME'),
          tel: getData(p.data, 'MOBILE_NO'),
        }

        console.log(_data);
        history.replace(`${PREFIX}/info?q=${utils.encode(JSON.stringify(_data))}`);
      })
      .catch((err) => {
        history.replace("/errorpage")
      })

  }, []);

  return (
    <div>ConfirmPass</div>
  )
}

export default ConfirmPass;