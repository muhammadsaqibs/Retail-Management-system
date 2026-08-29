    import axios from 'axios'


    const axiosInstance = axios.create({
      // baseURL : 'http://localhost:5000/api',
    baseURL : 'https://retail-management-system-production-f5b3.up.railway.app/api',
        withCredentials : true
    }) 

    export default axiosInstance