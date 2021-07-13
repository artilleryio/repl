export function base64encode(str) {
  let encode = encodeURIComponent(str).replace(/%([a-f0-9]{2})/gi, (m, $1) =>
    String.fromCharCode(parseInt($1, 16)),
  );
  return btoa(encode);
}

export function base64decode(str) {
  let decode = atob(str).replace(
    /[\x80-\uffff]/g,
    (m) => `%${m.charCodeAt(0).toString(16).padStart(2, '0')}`,
  );
  return decodeURIComponent(decode);
}
