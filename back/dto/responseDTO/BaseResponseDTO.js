export class BaseResponseDTO {
  #resultCode = '';
  #resultMsg = '';
  #body = null;

  /**
   * 
   * @param {string} code 
   * @param {string} msg 
   * @param {any} body
   */
  constructor(code, msg, body = null) {
    this.#resultCode = code;
    this.#resultMsg = msg;
    this.#body = body;
  }

  getResponse() {
    const response = {
      response: {
        header: {
          resultCode: this.#resultCode,
          resultMsg: this.#resultMsg
        }
      }
    }

    if(this.#body) {
      response.response.body = this.#body;
    }

    return response;
  }
}