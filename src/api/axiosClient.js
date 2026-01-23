import api from './axiosInstance'; // el archivo anterior

const dataFromApi = async (method, url, endpoint = "", body) => {
    try {
        const response = await api({
            url: `${url}${endpoint}`,
            method,
            data: body,
        });
        return response;
    } catch (err) {
        throw err;
    }
};

export default dataFromApi;
