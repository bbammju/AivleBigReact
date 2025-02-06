import axios from 'axios';
<<<<<<< HEAD
// import Client from 'ftp';
=======
import api from './api'; // api.js를 가져와서 사용용
>>>>>>> a7a0e213b7f212c49f456d9c7c2caafef9a1a6c9

// // FTP 서버 정보
// const FTP_CONFIG = {
//     host: '4.217.186.166',
//     port: 21,
//     user: 'aivler',
//     password: 'aivle202406'
//   };

// 파일 전용 API 생성
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

// 🔹 파일 업로드 함수 (FTP 서버에 저장 후 MySQL에 주소 저장)
apiFile.uploadFile = async (file, refTable = 'board', refSn = 0) => {
    // if (!file) throw new Error('파일이 필요합니다.');

    // const ftpClient = new Client();
    // const filePath = `/uploads/${file.name}`;
    
    // return new Promise((resolve, reject) => {
    //     ftpClient.on('ready', () => {
    //     ftpClient.put(file, filePath, async (err) => {
    //         if (err) {
    //         reject(err);
    //         } else {
    //         ftpClient.end();
    //         const fileUrl = `http://ftp.example.com/uploads/${file.name}`;

    //         try {
    //             // MySQL에 파일 주소 저장 요청
    //             await apiFile.post('/files/save', {
    //             fileUrl,
    //             refTable,
    //             refSn
    //             });
    //             resolve(fileUrl);
    //         } catch (dbError) {
    //             reject(dbError);
    //         }
    //         }
    //     });
    //     });

    //     ftpClient.on('error', reject);
    //     ftpClient.connect(FTP_CONFIG);
    // });
    const formData = new FormData();
    formData.append('file', file);
    formData.append("refTable", refTable); // 🔥 필요한 테이블 이름 전달
    formData.append("refSn", refSn)
    try {
        const response = await apiFile.post('/files/upload', formData, {
            // 업로드 진행률 표시를 위한 설정 추가
            onUploadProgress: (progressEvent) => {
                const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                // onProgress?.(percentage);
            },
        });
        return response.data;
    } catch (error) {
        if (error.response?.status === 413) {
            throw new Error('파일 크기가 너무 큽니다');
        }
        throw error;
    }
    // const ftpClient = new Client();
    // return new Promise((resolve, reject) => {
    //     ftpClient.on('ready', () => {
    //     const filePath = `/uploads/${file.name}`;
    //     ftpClient.put(file, filePath, (err) => {
    //         if (err) {
    //         reject(err);
    //         } else {
    //         // 성공적으로 업로드된 파일의 URL 반환
    //         resolve(`http://ftp.example.com/uploads/${file.name}`);
    //         }
    //         ftpClient.end();
    //     });
    //     });

    //     ftpClient.on('error', reject);
    //     ftpClient.connect(FTP_CONFIG);
    // });
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
