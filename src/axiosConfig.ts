import axios, { AxiosInstance } from "axios";

const instance: AxiosInstance = axios.create({
  baseURL: "https://api.example.com", // API'nizin temel URL'si
  timeout: 5000, // İstek zaman aşımı süresi (ms cinsinden)
  headers: {
    "Content-Type": "application/json", // İstek başlığı
    // Diğer özel başlıkları burada ekleyebilirsiniz
  },
});

export default instance;