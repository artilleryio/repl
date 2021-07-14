const BASE_URL = '';
const POST_ENDPOINT = `${BASE_URL}/save`;
const GET_ENDPOINT = `${BASE_URL}/get`;
const BASE_DOMAIN = 'superrepl.com';

export const base64encode = (str = '') => {
  let encode = encodeURIComponent(str).replace(/%([a-f0-9]{2})/gi, (m, $1) =>
    String.fromCharCode(parseInt($1, 16)),
  );

  return btoa(encode);
};

export const base64decode = (str = '') => {
  let decode = atob(str).replace(
    /[\x80-\uffff]/g,
    (m) => `%${m.charCodeAt(0).toString(16).padStart(2, '0')}`,
  );

  return decodeURIComponent(decode);
};

export const getScenarioUrl = (key) => `https://${BASE_DOMAIN}/?s=${key}`

export const copyToClipBoard = async (value) => {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(value);
  } else {
    console.log('cannot copy to clipboard');
  }
};

export const saveScenario = async (code, items) => {
  try {
    const scenario = btoa(code);
    const output = items.reduce((s, item) => {
      if (item.data) {
        return `${s}${item.data}`;
      }

      return s;
    }, '');

    const response = await fetch(POST_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify({
        scenario,
        output: base64encode(output),
      }),
    });

    if (response.ok) {
      const { key } = await response.json();

      console.log(`response key`, key);

      return getScenarioUrl(key);
    }
  } catch (err) {
    console.log('saveScenario error', err);
  }
};

export const getScenario = async (key) => {
  if (!key) {
    return;
  }

  const response = await fetch(`${GET_ENDPOINT}/${key}`);
  const data = await response.json();

  return {
    scenario: base64decode(data.scenario),
    output: base64decode(data.output),
    url: getScenarioUrl(key)
  };
};

export const getScenarioKey = (query = {}, path = '') => {
  if (query.s) {
    return query.s;
  }

  // backward compatible with the format /#/key
  const [, , key] = path.split('/');

  return key;
};
