import axios from 'axios';

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


// 응답 인터셉터 
api.interceptors.response.use(
    (response) => {       
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // 자동으로 refresh 토큰이 쿠키에 포함되어 전송됨
                await api.post('/users/reissue');
                // 새로운 액세스 토큰은 쿠키로 자동 설정됨
                return api.request(originalRequest);
            } catch (err) {
                // 리프레시 토큰도 만료된 경우
                alert('세션이 만료되었습니다. 다시 로그인해주세요.');
                window.location.href = '/';
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default api;