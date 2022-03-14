const fs = require('fs');
const axios = require('axios');


class Busqueda {
    dbPath = './db/database.json';

    constructor() {
        this.historial = [];
        //TODO: leer BD si existe
        this.leerDB();
    }
    get paramsMapbox() {
        return {
            'limit': 5,
            'language': 'es',
            'access_token': process.env.MAPBOX_KEY
        }
    }

    get paramsOpenWeather() {
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es'
        }
    }

    async ciudad(lugar = '') {
        try {
            //peticion http
            const intanceAxios = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox

            })
            // console.log('ciudad:', lugar);
            const resp = await intanceAxios.get();
            return resp.data.features.map(lugar => {
                return {
                    id: lugar.id,
                    nombre: lugar.place_name,
                    lng: lugar.center[0],
                    lat: lugar.center[1]
                }
            });
        } catch (error) {
            return [];
        }
    }

    async climaLugar(lat = '', long = '') {
        try {
            const intanceAxios = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramsOpenWeather, lat: lat, lon: long }
            })

            const { weather, main } = (await intanceAxios.get()).data;

            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }

        } catch (error) {
            console.log(error)
        }

    }

    agregarHistorial(lugar = '') {
        //prevenir duplicados
        if (this.historial.includes(lugar.toLocaleLowerCase())) {
            return;
        }
        this.historial = this.historial.splice(0,4)
        this.historial.unshift(lugar.toLocaleLowerCase());
        this.guardarDB();
        // grabar en DB

    }
    guardarDB() {
        const payload = {
            historial: this.historial
        }
        fs.writeFileSync(this.dbPath, JSON.stringify(payload));

    }

    leerDB() {
        if (!fs.existsSync(this.dbPath)) return;
        const data = JSON.parse(fs.readFileSync(this.dbPath, { encoding: 'utf-8' }));
        this.historial = data.historial
    }

    get historialCapitalizado() {
        return this.historial.map((lugar) => {
            let palabras = lugar.split(' ');
            palabras = palabras.map((p) => {
                return p[0].toLocaleUpperCase() + p.substring(1)
            })
            return palabras.join(' ');
        })
    }
}


module.exports = Busqueda;