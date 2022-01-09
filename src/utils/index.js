import StringCrypto from "string-crypto";
import dateFormat  from "dateformat";

/*****************
 * 
 *****************/
 const {
  encryptString,
  decryptString,
} = new StringCrypto();
const SECRET ='mfr-system';

const encode = (origin) => {
  return encryptString(origin, SECRET);
}

const decode = (encoded) => {
  return decryptString(encoded, SECRET);
}

export default {
  encode, decode,
}