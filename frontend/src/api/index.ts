import axios, {AxiosRequestConfig} from "axios";


export const SERVER_URL = `https://07e2-77-95-92-110.ngrok-free.app/tg-bot/`;

const axiosConfig: AxiosRequestConfig = {
    baseURL: SERVER_URL,
    headers: { 'ngrok-skip-browser-warning': true, }
}

const $server = axios.create(axiosConfig);

export {
    $server
}
