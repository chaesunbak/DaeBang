import axios, { AxiosInstance } from 'axios';
import { SiseApiResponseAll } from '../models/Sise.model';
import {
    BaseSiseAPIResponse,
    OneTwoSise,
    OfficetelSise,
    AptSise,
} from '../models/Sise.model';

interface ApiParams {
    LAWD_CD: number;
    DEAL_YMD: number;
    pageNo: number;
    numOfRows: number;
}

export const SiseApi = (params: ApiParams): AxiosInstance => {
    return axios.create({
        baseURL:
            'http://apis.data.go.kr/1613000/RTMSDataSvcRHRent/getRTMSDataSvcRHRent',
        params: {
            serviceKey: process.env.REACT_APP_Sise_API_KEY,

            ...params,
        },
    });
};

export const fetchSiseData = async (
    params: ApiParams,
): Promise<SiseApiResponseAll> => {
    const api = SiseApi(params);
    const response = await api.get<SiseApiResponseAll>('');
    return response.data;
};

export const fetchSiseDataThatThrowsError = async <T>(
    url: string,
    params: ApiParams,
    signal?: AbortSignal,
): Promise<BaseSiseAPIResponse<T>> => {
    try {
        const response = await axios.get<BaseSiseAPIResponse<T>>(url, {
            params: {
                serviceKey: process.env.REACT_APP_Sise_API_KEY,
                ...params,
            },
            signal,
        });
        return response.data;
    } catch (error) {
        if ((error as any).message === 'canceled') {
            console.error(`${params.LAWD_CD} 요청을 취소했습니다`);
        }
        console.error(error);
        throw error;
    }
};

export const fetchOneTwoSiseData = (
    params: ApiParams,
    signal?: AbortSignal,
): Promise<BaseSiseAPIResponse<OneTwoSise>> => {
    return fetchSiseDataThatThrowsError<OneTwoSise>(
        'http://apis.data.go.kr/1613000/RTMSDataSvcRHRent/getRTMSDataSvcRHRent',
        params,
        signal,
    );
};

export const fetchOfficetelSiseData = (
    params: ApiParams,
    signal?: AbortSignal,
): Promise<BaseSiseAPIResponse<OfficetelSise>> => {
    return fetchSiseDataThatThrowsError<OfficetelSise>(
        'http://apis.data.go.kr/1613000/RTMSDataSvcAptRent/getRTMSDataSvcAptRent',
        params,
        signal,
    );
};

export const fetchAptSiseData = (
    params: ApiParams,
    signal?: AbortSignal,
): Promise<BaseSiseAPIResponse<AptSise>> => {
    return fetchSiseDataThatThrowsError<AptSise>(
        'http://apis.data.go.kr/1613000/RTMSDataSvcAptRent/getRTMSDataSvcAptRent',
        params,
        signal,
    );
};
