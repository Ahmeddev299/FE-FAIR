/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { CancelTokenStatic, CancelTokenSource } from "axios";
import Config from "../config/index";

export class HttpService {
  CancelToken: CancelTokenStatic;
  source: CancelTokenSource;

  constructor() {
    this.CancelToken = axios.CancelToken;
    this.source = this.CancelToken.source();
  }

  /**
   * Set Token On Header
   * @param token
   */
  static setToken(token: string): void {
    axios.defaults.headers["Authorization"] = token;
  }

  /**
   * Fetch data from server
   * @param url Endpoint link
   * @return Promise
   */
  protected get = async (url: string, params: object): Promise<any> => {
    try {
      const response = await axios.get(`${Config.API_ENDPOINT}/${url}`, {
        params,
        cancelToken: this.source.token,
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  };

  /**
   * Write data over server
   * @param url Endpoint link
   * @param body Data to send over server
   * @return Promise
   */
  protected post = async (url: string, body: object, options = {}): Promise<any> => {
    try {
      const response = await axios.post(`${Config.API_ENDPOINT}/${url}`, body, {
        ...options,
        cancelToken: this.source.token,
      });
      return response.data; // Return only the data part
    } catch (error: any) {
      // Re-throw the error with the response data
      throw error;
    }
  };


  protected custom_post = (
    url: string,
    body: object,
    options = {}
  ): Promise<any> =>
    axios.post(`${url}`, body, {
      ...options,
      cancelToken: this.source.token,
    });

  /**
   * Delete Data From Server
   * @param url Endpoint link
   * @param params Embed as query params
   * @return Promise
   */
  protected delete = (
    url: string,
    params?: object,
    data?: object
  ): Promise<any> =>
    axios.delete(`${Config.API_ENDPOINT}/${url}`, { params, data });

  /**
   * Update data on server
   * @param url Endpoint link
   * @param body Data to send over server
   * @param params Embed as query params
   * @return Promise
   */
  protected put = (url: string, body?: object, params?: object): Promise<any> =>
    axios.put(`${Config.API_ENDPOINT}/${url}`, body, {
      ...params,
      cancelToken: this.source.token,
    });

  private updateCancelToken() {
    this.source = this.CancelToken.source();
  }

  cancel = () => {
    this.source.cancel("Explicitly cancelled HTTP request");
    this.updateCancelToken();
  };
}
