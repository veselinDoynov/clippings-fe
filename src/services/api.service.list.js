import { toQueryParams } from '../utils';

const transformSort = (sorter) => {
    if (Object.isEmpty(sorter)) return '';
    const dir = sorter.order === 'descend' ? 'DESC' : 'ASC';
    return `${sorter.field}+${dir}`;
};

const transformFilters = (data) => {
    const res = {};
    Object.keys(data)
        .forEach((key) => {
            const value = data[key];
            if (value && Array.isArray(value)) {
                const pattern = value[0];
                const values = value.slice(1, value.length);

                switch (pattern) {
                    case 'BETWEENDATE': {
                        res[key] = {
                            startRange: values[0].format('YYYY-MM-DD 00:00:00'),
                            endRange: values[1].format('YYYY-MM-DD 23:59:59'),
                            pattern: 'BETWEEN'
                        };
                        break;
                    }
                    case 'BETWEEN': {
                        res[key] = {
                            startRange: values[0].toString(),
                            endRange: values[1].toString(),
                            pattern
                        };
                        break;
                    }
                    case 'LIKE': {
                        res[key] = {
                            value: encodeURIComponent(values.toString().toLowerCase()),
                            pattern
                        };
                        break;
                    }
                    default: {
                        res[key] = {
                            value: value.map(val => (val === 'null' ? null : val)),
                            pattern: 'IN'
                        };
                    }
                }
            } else if (value) {
                res[key] = value;
            }
        });
    return res;
};

const apiList = (
    api, apiUrl, 
    page = 1, take = 500, filters = {}, sort = {}, 
    params = {}
) => {
    const query = toQueryParams({
        page,
        perPage: take,
        order_by: transformSort(sort),
        filters: transformFilters(filters),
    });

    const url = `${apiUrl}?${query}`;
    return api.get(url, params);
};

export default apiList;
