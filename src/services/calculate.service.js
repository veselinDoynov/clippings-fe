import { api } from '.';


class CalculateServices {

  static calculate = (data) => api.upload(process.env.REACT_APP_API_CALCULATE, data);
}

export default CalculateServices;

