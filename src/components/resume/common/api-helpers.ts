import axios, { AxiosResponse } from "axios";


export const compCreate = (urlPath: string, data: any, callback = (response: AxiosResponse<any, any>) => {}) => {
    axios({
        url: `/api/resume/${urlPath}`,
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

export const compGet = (urlPath: string, compId: any, callback = (response: AxiosResponse<any, any>) => {}) => {
    axios({
        url: `/api/resume/${urlPath}/${compId}`,
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

export const compUpdate = (urlPath: string, data: any, compId: any, callback = (response: AxiosResponse<any, any>) => {}) => {
    axios({
        url: `/api/resume/${urlPath}/${compId}`,
        method: "post",
        data: data,
        headers: {
            "Content-type": "application/json",
        },
    }).then(callback);
}

export const compDelete = (urlPath: string, compId: any, callback = (response: AxiosResponse<any, any>) => {}) => {
    axios({
        url: `/api/resume/${urlPath}/${compId}`,
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


export const uploadFile = (urlPath: string, data: any, callback = (response: AxiosResponse<any, any>) => {}) => {
    axios.post(`/api/resume/${urlPath}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
    }).then((response) => {
        if (response.status === 200) {
            callback(response);
        }
    });
}
