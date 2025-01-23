import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

// 토큰 재발급을 위한 별도의 인스턴스
const refreshApi = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

// 요청 인터셉터 추가 (토큰 자동 추가)
api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            const refreshToken = localStorage.getItem('refreshToken');
            console.log('401 에러 발생, refreshToken:', refreshToken);

            if (!refreshToken || !refreshToken.includes('.')) {
                console.log('유효하지 않은 리프레시 토큰');
                localStorage.clear();
                window.location.href = '/';
                return Promise.reject(error);
            }

            try {
                const response = await refreshApi.post('/users/reissue', null, {
                    headers: { Authorization: `Bearer ${refreshToken}` },
                });
                console.log('재발급 응답:', response.data);

                // 서버 응답 구조에 맞게 수정
                if (response.data.token?.accessToken) {
                    localStorage.setItem('accessToken', response.data.token.accessToken);
                    error.config.headers.Authorization = `Bearer ${response.data.token.accessToken}`;
                    return api.request(error.config);
                } else {
                    throw new Error('새로운 액세스 토큰이 없습니다.');
                }
            } catch (err) {
                console.error('토큰 갱신 실패:', err);
                localStorage.clear();
                alert('세션이 만료되었습니다. 다시 로그인해주세요.');
                window.location.href = '/';
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default api;