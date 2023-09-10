import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost',
  timeout: 5000
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || '오류가 발생했습니다.')
);

export default axiosInstance;
