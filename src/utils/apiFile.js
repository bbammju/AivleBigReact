import axios from 'axios';


// 파일 전용 API 생성 (파일 관련 코드짜는 사람이 업로드/다운로드 함수 바꾸면 됩니다. )
// 요청, 응답 인터셉터는 api와 동일하게 설정(백엔드에서 jwt 인증 통과하기 위해 필요)
const apiFile = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
    withCredentials: true
});

// 요청 인터셉터 
apiFile.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
);

// 응답 인터셉터 (파일 관련 오류 처리 가능)
apiFile.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await axios.post(`${process.env.REACT_APP_API_URL}/users/reissue`, {}, { withCredentials: true });
                return apiFile.request(originalRequest);
            } catch (err) {
                alert('세션이 만료되었습니다. 다시 로그인해주세요.');
                window.location.href = '/';
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

// 🔹 파일 업로드 함수(필요시 변경)
apiFile.uploadFile = async (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await apiFile.post('/files/upload', formData, {
            // 업로드 진행률 표시를 위한 설정 추가
            onUploadProgress: (progressEvent) => {
                const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                onProgress?.(percentage);
            },
        });
        return response.data;
    } catch (error) {
        if (error.response?.status === 413) {
            throw new Error('파일 크기가 너무 큽니다');
        }
        throw error;
    }
};

// 🔹 파일 다운로드 함수(필요시 변경)
apiFile.downloadFile = async (fileId, filename) => {
    
    if (!fileId || !filename) {
        throw new Error('파일 ID와 파일명은 필수입니다');
    }

    try {
        const response = await apiFile.get(`/files/download/${fileId}`, {
            responseType: 'blob',
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error('파일 다운로드 실패:', error);
        throw error;
    }
};

export default apiFile;
