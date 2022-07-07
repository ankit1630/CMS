/**
 * Convert passed object to query string format
 * @param {Object} obj - data for the XHR
 * @returns {String} - query string
 */
 export const queryStringify = (obj) => {
  const qs = [];
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      qs.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]));
    }
  }
  return qs.join("&");
};

/**
 * Check if given status indicates success or not.
 */
const isSuccess = (statusCode) => statusCode >= 200 && statusCode < 300;

/**
 * XHR Util
 */
// eslint-disable-next-line import/no-anonymous-default-export
export default function (params) {
  const x = new XMLHttpRequest();
  let url = params.route;
  let formParams;
  params.method = params.method || "GET";
  params.parse = typeof params.parse === "boolean" ? params.parse : true;

  if (params.method === "GET" && params.data) {
    url += "?" + queryStringify(params.data);
  }

  x.open(params.method, url, true);

  if (params.method === "POST" || params.method === "PUT") {
    params.data = params.data || {};
    formParams = queryStringify(params.data);
    x.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  }

  x.setRequestHeader("X-Requested-With", "XMLHttpRequest");

  const headers = params.headers;
  if (headers) {
    for (const key in headers) {
      if (headers.hasOwnProperty(key)) {
        x.setRequestHeader(key, headers[key]);
      }
    }
  }

  x.onreadystatechange = function () {
    let response;

    if (x.readyState === 4) {
      if (isSuccess(x.status) && params.onSuccess) {
        response = params.parse && x.responseText ? JSON.parse(x.responseText) : x.responseText;
        params.onSuccess.call(params.context || null, response, x, x.status);
      } else if (!isSuccess(x.status)) {
        if (x.status === 0) {
          if (params.onAbort) {
            params.onAbort.call(params.context || null, x, x.status);
          }
        } else if (params.onFailure) {
          params.onFailure.call(params.context || null, x, x.status);
        }
      }

      if (params.onEnd) {
        params.onEnd.call(params.context, x.responseText);
      }
    }
  };

  x.send(formParams);

  return x;
}
