import axios from 'axios';
import { useStore } from '../zustand/store';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});


// 요청 인터셉터
api.interceptors.request.use(
    (config) => {
        return config; // 쿠키는 자동으로 전송되므로 별도 헤더 설정 불필요
    },
    (error) => Promise.reject(error)
);

let isRefreshing = false; // 중복 요청 방지
let refreshSubscribers = []; // 재발급 후 원래 요청 재시도할 리스트

// 응답 인터셉터
api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        const { setUserAuth } = useStore.getState();

        if (error.response?.status === 401) {
            console.warn('🔄 401 오류 발생! 재발급 또는 로그아웃 확인');

            // ✅ Refresh Token 만료 시 로그아웃 처리
            const errorCode = error.response.data?.message;

            // Refresh Token 없음 또는 만료 시 로그아웃 처리
            if (errorCode === "NO_REFRESH_TOKEN" || errorCode === "EXPIRED_REFRESH_TOKEN") {
                console.warn('❌ Refresh Token 없음 또는 만료됨. 강제 로그아웃');

                // ✅ Zustand 상태 초기화
                setUserAuth(null, null);

                // ✅ 메인 페이지로 이동
                window.location.href = '/';
                return Promise.reject(error);
            }

            // // ✅ ❗ 로그아웃 요청일 경우, reissue 요청 X
            // if (originalRequest.url.includes('/users/logout')) {
            //     console.warn('❌ 로그아웃 요청이므로 reissue 요청 생략');
            //     return Promise.reject(error);
            // }

            // ✅ Access Token이 만료된 경우 Refresh Token으로 재발급 요청
            if (!originalRequest._retry) {
                originalRequest._retry = true;

                if (isRefreshing) {
                    // 이미 재발급 요청이 진행 중이면 기존 요청을 큐에 넣고 대기
                    return new Promise((resolve) => {
                        refreshSubscribers.push((token) => {
                            resolve(api(originalRequest));
                        });                        
                    });
                }

                isRefreshing = true;
                try {
                    console.info('🔄 Access Token 재발급 시도...');
                    const refreshResponse = await api.post('/users/reissue');

                    if (refreshResponse.data.success) {
                        console.info('✅ 새 Access Token 발급 성공! 원래 요청 재시도');

                        isRefreshing = false;
                        refreshSubscribers.forEach(callback => callback());
                        refreshSubscribers = [];

                        return api(originalRequest); // 원래 요청 재시도
                    }
                } catch (refreshError) {
                    console.error('❌ Refresh Token도 만료됨. 로그아웃 진행.');
                    setUserAuth(null, null);
                    window.location.href = '/';
                    return Promise.reject(refreshError);
                }
            }
        }

        return Promise.reject(error);
    }
);

export default api;