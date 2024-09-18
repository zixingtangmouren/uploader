// import { UploadState } from '../types';
// import { callAPI } from '../../../src/modules/app/helpers/api';
// import { cookie } from 'cookie_js';
// import { MD5 } from 'crypto-js';
// import { decrypt } from '../../../helpers/crypto';

export async function getAuthToken() {
  // try {
  //   let uploadState: UploadState | null = null;
  //   const cryptUploadState = await callAPI('GET_CSTORE_UPLOADPOLICY', {});
  //   const cryptData = cryptUploadState.data;
  //   if (cryptData && cryptData.length > 32) {
  //     // 计算原始加密数据
  //     const sourceCryptData = cryptData.slice(0, -32);
  //     // 计算解密key
  //     const md5Timmstamp = cryptData.slice(-32);
  //     const key = MD5(
  //       'easicare-web' + cookie.get('uid') + md5Timmstamp,
  //     ).toString();
  //     // 计算真实返回
  //     uploadState = JSON.parse(decrypt(sourceCryptData, key));
  //   } else {
  //     uploadState = cryptUploadState;
  //   }
  //   if (!uploadState || !uploadState.policyList.length) {
  //     return null;
  //   }
  //   return uploadState;
  // } catch (error) {
  //   return null;
  // }
  return {};
}
