import React, { useState } from 'react';
import { Table, Button, Spin, Input, Form, Divider, message, Upload } from 'antd';
import 'antd/dist/antd.css';
import { UploadOutlined } from '@ant-design/icons';

import { CalculateActions as actions } from '../../actions';

const { Item } = Form;

const HomePage = () => {
    const [form] = Form.useForm();
    const [state, setState] = useState({
        loading: false,
        currencies: '',
        outputCurrency: '',
        vatNumber: '',
        file: '',
    });

    const calculate = (data) => {

        actions.calculate(data)
            .then((result) => {
                message.success(result.data);
            })
            .catch((error) => {
                message.error(error);
            });
    }

    const handleCalculate = (event) => {

        const formData = new FormData();

        formData.append('file', state.file);
        formData.append('currencies', state.currencies);
        formData.append('outputCurrency', state.outputCurrency);
        formData.append('vatNumber', state.vatNumber);


        setState((prevState) => ({ ...prevState, loading: true }))
        calculate(formData);
    }



    const handleCurrencyListChange = (value) => setState((prevState) => ({ ...prevState, currencies: value }));
    const handleOutputCurrencyChange = (value) => setState((prevState) => ({ ...prevState, outputCurrency: value }));
    const handleVatNumberChange = (value) => setState((prevState) => ({ ...prevState, vatNumber: value }));
    const handleFileUpload = (value) => {
        setState((prevState) => ({ ...prevState, file: '' }));
        if(value) {
            if(value.type != 'application/vnd.ms-excel')
            {
                message.error('Not supported file');
            } else {
                setState((prevState) => ({ ...prevState, file: value }));
            }
        }
    }

    return (
        <>
            <Form
                onFinish={handleCalculate}
                layout="vertical"
                form={form}
            >
                <Item
                    name="currencies"
                    label='Currency list (example: {"EUR":1,"USD":0.846405,"LV":0.51129188,"GBP":0.878} )'
                    rules={[{required:true}]}
                >
                    <Input onChange={event => handleCurrencyListChange(event.target.value)}  />
                </Item>
                <Item
                    name="outputCurrency"
                    label="Your output currency (example: 'GBD')"
                    rules={[{required:true}]}
                >
                    <Input onChange={event => handleOutputCurrencyChange(event.target.value)} />
                </Item>
                <Item
                    name="vatNumber"
                    label="Vat number (optional)"
                >
                    <Input onChange={event => handleVatNumberChange(event.target.value)} />
                </Item>

                <Item
                    name="file"
                    label="Upload csv file"
                >
                    <Input type="file" onChange={event => handleFileUpload(event.target.files[0])} />
                </Item>

                <Button type="primary" htmlType="submit"> Calculate </Button>
            </Form>
        </>
    )
}

export default HomePage;


