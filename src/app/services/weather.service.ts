import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private http: HttpClient) { }

  getWeather(city) {
    let url = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&APPID=06af1932f756e5657151ef97230adf1c';

    return this.http.get(url);
  }
}
