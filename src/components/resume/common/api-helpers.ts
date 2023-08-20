import axios, { AxiosResponse } from "axios";


export const compCreate = (component: string, urlPath: string, data: any, callback = (response: AxiosResponse<any, any>) => {}) => {
    axios({
        url: `/api/${component}/${urlPath}`,
        method: "post",
        data: data,
        headers: {
            "Content-type": "application/json",
        },
    }).then((response) => {
        if (response.status === 201) {
            callback(response);
        }
    });
}

export const compGet = (component: string, urlPath: string, compId: any, callback = (response: AxiosResponse<any, any>) => {}) => {
    axios({
        url: `/api/${component}/${urlPath}/${compId}`,
        method: "get",
        headers: {
            "Content-type": "application/json",
        },
    }).then((response) => {
        if (response.status === 200) {
            callback(response);
        }
    });
}

export const compUpdate = (component: string, urlPath: string, data: any, compId: any, callback = (response: AxiosResponse<any, any>) => {}) => {
    axios({
        url: `/api/${component}/${urlPath}/${compId}`,
        method: "post",
        data: data,
        headers: {
            "Content-type": "application/json",
        },
    }).then(callback);
}

export const compDelete = (component: string, urlPath: string, compId: any, callback = (response: AxiosResponse<any, any>) => {}) => {
    axios({
        url: `/api/${component}/${urlPath}/${compId}`,
        method: "delete",
        headers: {
            "Content-type": "application/json",
        },
    }).then((response) => {
        if (response.status === 200) {
            callback(response);
        }
    });
}


export const uploadFile = (component: string, urlPath: string, data: any, callback = (response: AxiosResponse<any, any>) => {}) => {
    axios.post(`/api/${component}/${urlPath}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
    }).then((response) => {
        if (response.status === 200) {
            callback(response);
        }
    });
}
