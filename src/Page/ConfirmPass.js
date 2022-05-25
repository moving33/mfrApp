import React, { useEffect } from 'react';
import qs from 'querystring';
import axios from 'axios';
import { API_URL, PREFIX } from '../config';
import utils from '../utils';
import { useHistory } from 'react-router-dom';
import { encode } from "qs/lib/utils";
import { encrypt, decrypt } from '../config/encOrdec';

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
    let cutplace = workplace.slice(1, workplace.length - 1);

    const enworkplace = { uuid : cutplace || null }
    const jsonPayload = JSON.stringify(enworkplace);
    const eworkplace = encrypt(jsonPayload);
    const payload = { data : eworkplace || null };

    // uuid 사업장 호출
    axios.post(`${API_URL}/v1/siteInfo`, payload)

      .then((res) => {
        if (res.data === null || res.data.result === '잘못된 요청입니다.') {
          // history.replace("/errorpage")
        }
        //setWorkplace(res.data)
        const { data } = res.data.data
        const decryptData = decrypt(res.data.data)
        const realData = JSON.parse(decryptData);
        const _data = {
          // workplace,
          // resData,
          site_name: realData.site_name,
          site_idx:  realData.site_idx,
          class_id:  realData.class_id,
          name: getData(p.data, 'NAME'),
          tel: getData(p.data, 'MOBILE_NO'),
        }
        history.replace(`${PREFIX}/info?q=${utils.encode(JSON.stringify(_data))}`);
      })
      .catch((err) => {
        // history.replace("/errorpage")
      })

  }, []);

  return (
    <div>ConfirmPass</div>
  )
}

export default ConfirmPass;