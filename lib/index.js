import * as https from 'node:https';
import * as http from 'node:http';

export class SimpleHttpResponse {
  constructor(res) {
    /**
     * @type {http.IncomingMessage}
     */
    this.res = res;
  }
}

export class SimpleHttpRequest {
  /**
   *
   * @param {string} url
   */
  constructor(url) {
    this.url = url;
    this.headers = {};
    this.queries = {};
  }

  setHeader(key, val) {
    this.headers[key] = val;
    return this;
  }

  setHeaders(headers) {
    Object.assign(this.headers, headers);
    return this;
  }

  setQuery(key, val) {
    this.queries[key] = val;
    return this;
  }

  setQueries(queries) {
    Object.assign(this.queries, queries);
    return this;
  }
}

export class SimpleHttpClient {
  /**
   *
   * @param {SimpleHttpRequest} request
   */
  constructor(request) {
    this.request = request;
  }

  getOptions() {
    const url = new URL(this.request.url);

    return {
      hostname: url.hostname,
      path: url.pathname,
      searchParams:
        url.searchParams.size === 0 ? url.searchParams : this.request.queries,
    };
  }

  /**
   * 
   * @returns {Promise<SimpleHttpResponse>}
   */
  get() {
    return new Promise((resolve, reject) => {
      const module = /^https/i.test(this.request.url) ? https : http;
      const req = module.get(this.getOptions(), (res) => {
        resolve(new SimpleHttpResponse(res));
      });
      req.on('error', reject);
    });
  }
}
