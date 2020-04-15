import axios from 'axios'

export const baseUrl = 'http://192.168.3.57:3333'

const axiosInstance = axios.create({
  baseURL:baseUrl
})

axiosInstance.interceptors.response.use(
  res=>res.data,
  error=>{
    console.log(error,'网络错误')
  }
)

export {
  axiosInstance
}
