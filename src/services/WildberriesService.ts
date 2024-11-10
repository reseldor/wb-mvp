import axios from "axios";

export class WildberriesService {
    static apiToken = process.env.WB_API_TOKEN;
    static apiUrl = "https://common-api.wildberries.ru/api/v1/tariffs/box?date="

    public static async fetchData(date: string): Promise<any> {
        return await axios.get(`${process.env.WB_URL}${date}` || `${this.apiUrl}${date}`, {
        headers: { 'Authorization': `Bearer ${this.apiToken}` },
        })
    }
}
