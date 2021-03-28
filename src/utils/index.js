
export const toQueryParams = params => Object.keys(params)
.map((k) => {
    let value = params[k];
    if (Object.isObject(value)) {
        if (Object.isEmpty(value)) {
            value = '';
        } else {
            value = JSON.stringify(value);
        }
    }
    if (value) {
        return `${k}=${value}`;
    }
    return '';
})
.join('&');
