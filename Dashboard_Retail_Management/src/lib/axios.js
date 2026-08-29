    import axios from 'axios'


    const axiosInstance = axios.create({
      // baseURL : 'http://localhost:5000/api',
    baseURL : 'https://backend-virid-alpha-46.vercel.app/api',
        withCredentials : true
    }) 

    export default axiosInstance