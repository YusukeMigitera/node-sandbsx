import hmacSHA1 from 'crypto-js/hmac-sha1.js';
import Base64 from 'crypto-js/enc-base64.js';
import fetch from 'node-fetch';
// const CryptoJS = require("crypto-js");

const API_KEY = 'G1l2GZKXPMbV8js1PCHEmhuUY';
const API_KEY_SECRET = 'gP3zJObbW9AfLH8bZMPx7Y9wrv7BlNDs9kLaw8bLee2RY0TFIc';

const callback_url = 'https://d-app-starter-project-opal.vercel.app/';

// API Key, API Key Secret, Callback URLを含めてPOSTする
const request_endpoint_url = 'https://api.twitter.com/oauth/request_token';

// +?oauth_token=token文字列を作る これが認証用URL(?)
const authenticate_url = 'https://api.twitter.com/oauth/authenticate';

const nonce = 'aqwsedrftgyhujiko';
const timestamp = 1664013600;
const signatureMethod = 'HMAC-SHA1';
const version = '1.0';

const base =
  'POST&' +
  encodeURIComponent(
    request_endpoint_url +
      '?oauth_callback="https://d-app-starter-project-opal.vercel.app"'
  ) +
  '&' +
  encodeURIComponent(`oauth_consumer_key=${API_KEY}`) +
  encodeURIComponent(`&oauth_nonce=${nonce}`) +
  encodeURIComponent(`&oauth_signature_method=${signatureMethod}`) +
  encodeURIComponent(`&oauth_timestamp=${timestamp}`) +
  encodeURIComponent(`&oauth_version=${version}`);

const hmac = hmacSHA1(base, API_KEY_SECRET + '&');
const signature = Base64.stringify(hmac);
const encodedSignature = encodeURIComponent(signature);

const oauthHeader =
  'OAuth oauth_consumer_key="' +
  API_KEY +
  '",oauth_signature_method="' +
  signatureMethod +
  '",oauth_timestamp="' +
  timestamp +
  '",oauth_nonce="' +
  nonce +
  '",oauth_version="' +
  version +
  '",oauth_signature="' +
  encodedSignature +
  '"';

fetch(
  request_endpoint_url +
    '?oauth_callback="https://d-app-starter-project-opal.vercel.app"',
  {
    method: 'POST',
    headers: {
      Authorization: oauthHeader,
      // 'OAuth oauth_consumer_key="CONSUMER_API_KEY", oauth_nonce="OAUTH_NONCE", oauth_signature="OAUTH_SIGNATURE", oauth_signature_method="HMAC-SHA1", oauth_timestamp="OAUTH_TIMESTAMP", oauth_token="ACCESS_TOKEN", oauth_version="1.0"',
    },
  }
).then((res) => console.log(res));

console.log(request_endpoint_url + '?oauth_callback=' + callback_url);
