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

// 클리언트측에서 미리 토큰 만료 체크
const handleTokenExpiration = (token) => {
    try {
        const tokenPayload = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(tokenPayload));
        return decodedPayload.exp * 1000 < Date.now();
    } catch (error) {
        return true;
    }
};

const clearAuthAndRedirect = () => {
    localStorage.clear();  // 인증 정보 완전 삭제
    alert('세션이 만료되었습니다. 다시 로그인해주세요.');
    window.location.href = '/';
};


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
    (response) => {
        // 응답 헤더에서 새로운 토큰 확인
        const newAccessToken = response.headers['authorization'];        
        
        if (newAccessToken && newAccessToken.includes('Bearer ')) {
            const token = newAccessToken.replace('Bearer ', '').trim();
            if (token.includes('.')) {  // JWT 형식 검증
                localStorage.setItem('accessToken', token);
            }
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 
                && error.response?.data?.message?.includes('토큰이 만료되었습니다') 
                && !originalRequest._retry) {
            
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');

            if (!refreshToken || !refreshToken.includes('.') || handleTokenExpiration(refreshToken)) {
                clearAuthAndRedirect();
                return Promise.reject(error);
            }

            try {
                // 기존의 토큰 재발급 요청 로직
                const response = await refreshApi.post('/users/reissue', null, {
                    headers: { 
                        Authorization: `Bearer ${refreshToken.trim()}`                        
                    }
                });

                // 헤더에서 새로운 토큰 확인
                const newAccessToken = response.headers['authorization'];
                if (newAccessToken) {
                    const token = newAccessToken.replace('Bearer ', '');
                    localStorage.setItem('accessToken', token);
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api.request(originalRequest);
                }
                
                throw new Error('새로운 액세스 토큰을 받지 못했습니다.');
            } catch (err) {
                console.error('토큰 갱신 실패:', err);
                clearAuthAndRedirect();
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default api;