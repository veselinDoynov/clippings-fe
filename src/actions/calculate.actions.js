import { CalculateService as services } from '../services';
import { message } from 'antd';

class CalculateActions {

    static calculate = (data) => services.calculate(data)
        .then(data => data)
        .catch(error => message.error(error.message))
}


export default CalculateActions;
