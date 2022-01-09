const PASS_CLIENT_ID = '';
const PASS_CLIENT_SECRET = '';
const PASS_ACCESS_TOKEN = '';
const PASS_PRODUCT_ID = '';

const axios = require('axios');
const moment = require('moment');
const sha256 = require('sha256');
const CryptoJS = require('crypto-js');

// const getBase64Str = (utf8str) => {
//   return Buffer.from(utf8str, 'utf8').toString('base64');
// }

const getBase64Str = (utf8str) => {
  return btoa(utf8str);
}

class PassApiHelper {
  _accessToken;
  _clientId;
  _productId;
  _encryptInfo;
  _tokenVersionId;
  _siteCode;
  _form;
  _returnurl;

  constructor({clientId, productId, accessToken, returnurl}) {
    if(accessToken) {
      this._accessToken = accessToken
    }

    if(clientId) {
      this._clientId = clientId;
    } else {
      console.warn('PassApiHelper ::: no clientId in constructor');
    }

    if(productId) {
      this._productId = productId;
    } else {
      console.warn('PassApiHelper ::: no productId in constructor');
    }

    if(returnurl) {
      this._returnurl = returnurl;
    } else {
      console.warn('PassApiHelper ::: no returnurl in constructor');
    }
  }

  _getAuthorizationForAccessToken(clientId, clientSecret) {
    const authoriztion = getBase64Str(clientId+':'+clientSecret);
    return authoriztion;
  }

  async setAccessTokenToApi(clientId, clientSecret) {
    const res = await axios.post(
      'https://svc.niceapi.co.kr:22001/digital/niceid/oauth/oauth/token', 
      'grant_type=client_credentials&scope=default', 
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${this._getAuthorizationForAccessToken(clientId, clientSecret)}` 
        }
      }
    );

    // console.log(res);
    this._accessToken = res.data.dataBody.access_token;
    this._clientId = clientId;
  }

  _getAuthorizationForEcnryptToken() {
    /*
    * access_token: 토큰 발급 API를 통해 발급 받은 토큰 값(유효기간 존재)
    * current_timestamp: 현재시간 Timestamp (예: new Date().getTime()/1000 )
    * client_id: APP등록 시 생성 값
    */

    const authorization = getBase64Str(this._accessToken+':'+(new Date().getTime()/1000)+':'+this._clientId);
    return authorization;
  }

  async setEncryptInfo() {
    console.log({
      'Content-Type': 'application/json',
      'Authorization': 'bearer ' + this._getAuthorizationForEcnryptToken(),
      'client_id': this._clientId,
      'productID': this._productId,
    });

    const reqDtim = moment().format('YYYYMMDDHHmmsss');
    const reqNo = '1';
    const encMode = '1'; // 암복호화구분(1:AES128/CBC/PKCS7)

    const res = await axios.post(
      `https://svc.niceapi.co.kr:22001/digital/niceid/api/v1.0/common/crypto/token`,
      {
        req_dtim: reqDtim,
        req_no: reqNo,
        enc_mode: encMode
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'bearer ' + this._getAuthorizationForEcnryptToken(),
          'client_id': this._clientId,
          'productID': this._productId,
        }
      }
    );

    console.log(res.data);

    const {token_val, token_version_id, site_code} = res.data.dataBody;

    this._tokenVersionId = token_version_id;
    this._siteCode = site_code;

    const resource = reqDtim.trim()+reqNo.trim()+token_val.trim()
    const b64 = getBase64Str(sha256(resource));

    this._encryptInfo = {
      key: b64.slice(0, 16),
      iv: b64.slice(b64.length-16, b64.length-1),
      hmacKey: b64.slice(0, 32),
    }
  }

  _getRequestNo() {
    // 요청 고유번호 생성
    return 'REQ' + new Date().getTime();
  }

  _getEncryptData() {
    const _data = JSON.stringify({
      requestno: this._getRequestNo(),
      returnurl: this._returnrul,
      sitecode: this._siteCode,
      authtype: 'M'
    });

    
    const {key, iv, hmacKey} = this._encryptInfo;
    const encrypted = CryptoJS.AES.encrypt(_data, key, {iv});
    const integrityValue = CryptoJS.HmacSHA256(_data, hmacKey);

    return {
      encrypted, integrityValue
    }
  }

  createForm() {
    const {encrypted, integrityValue} = this._getEncryptData();

    const f = document.createElement('form');
    f.action = 'https://nice.checkplus.co.kr/CheckPlusSafeModel/service.cb';

    const tokenVersionIdInput = document.createElement('input');
    tokenVersionIdInput.name='token_version_id';
    tokenVersionIdInput.value=this._tokenVersionId;
    f.appendChild(tokenVersionIdInput);

    const encDataInput = document.createElement('input');
    encDataInput.name='enc_data';
    encDataInput.value=encrypted;
    f.appendChild(encDataInput);

    const integrityValueInput = document.createElement('input');
    integrityValueInput.name='integrity_value';
    integrityValueInput.value=integrityValue;
    f.appendChild(integrityValueInput);

    this._form = f;
  }

  submitForm() {
    if(this._form) {
      this._form.submit();
    } else {
      console.error('execute before called createForm');
    }
  }
}


// example...
(async () => {
  // const h = new PassApiHelper();
  // await h.setAccessTokenToApi(PASS_CLIENT_ID, PASS_CLIENT_SECRET);
  // console.log(h._accessToken);

  const h = new PassApiHelper({
    accessToken: PASS_ACCESS_TOKEN,
    productId: PASS_PRODUCT_ID,
    clientId: PASS_CLIENT_ID,
    returnurl: 'https://121.165.242.171:9786/cb',
  });

  // console.log(h._accessToken);
  // console.log(h._getAuthorizationForEcnryptToken())
  // console.log(h._clientId);
  // console.log(h._productId);
  await h.setEncryptInfo();
  h.createForm();
  h.submitForm();
})();