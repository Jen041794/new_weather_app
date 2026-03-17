import React, { useState, useEffect } from 'react';
import { Umbrella, Sun } from 'lucide-react';
import '../src/App.css';

const AUTH_KEY = process.env.REACT_APP_CWA_AUTH_KEY;

function App() {
    const [weather, setWeather] = useState([]);
    const [selectCity, setSelectCity] = useState('');
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const url = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${AUTH_KEY}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            // 氣象局資料解構邏輯
            const locations = data.records.location.map(loc => ({
                name: loc.locationName,
                desc: loc.weatherElement.find(el => el.elementName === 'Wx').time[0].parameter.parameterName,
                temp: loc.weatherElement.find(el => el.elementName === 'MaxT').time[0].parameter.parameterName,
                rain: loc.weatherElement.find(el => el.elementName === 'PoP').time[0].parameter.parameterName,
            }));

            setWeather(locations);

            //預設選擇第一個城市
            if (locations.find(city => city.name === '臺北市')) {
                setSelectCity('臺北市');
            } else if (locations.length > 0) {
                setSelectCity(locations[0].name);
            }
        } catch (error) {
            console.error('抓取失敗:', error);
            alert('讀取資料時發生錯誤');
        } finally {
            setLoading(false);
        }
    };

    //透過filter找出選擇的城市
    const currentCityWeather = weather.find(city => city.name === selectCity);

    //添加偵測溫度改變顏色
    const getColor = rainPercent => {
        const rain = parseInt(rainPercent);
        if (rain === 0) return '#FFF9C4';
        if (rain <= 20) return '#E3F2FD';
        return '#90CAF9';
    };

    return (
        <div
            className='App'
            style={{
                padding: '40px',
                textAlign: 'center',
                fontFamily: 'Arial',
                minHeight: '100vh',
                backgroundColor: currentCityWeather ? getColor(currentCityWeather.rain) : '#f5f5f5',
                transition: 'background-color 0.5s ease',
            }}
        >
            <h1 style={{ textShadow: '1px 1px 2px white' }}>台灣縣市即時預報</h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <select
                    value={selectCity}
                    onChange={e => setSelectCity(e.target.value)}
                    style={{ padding: '10px', fontSize: '16px', borderRadius: '5px' }}
                >
                    <option value='' disabled>
                        請選擇縣市
                    </option>
                    {weather.map(city => (
                        <option key={city.name} value={city.name}>
                            {city.name}
                        </option>
                    ))}
                </select>

                {loading ? (
                    <p>讀取中...</p>
                ) : (
                    currentCityWeather && (
                        <div
                            style={{
                                background: 'rgba(255, 255, 255, 0.8)',
                                padding: '30px',
                                borderRadius: '15px',
                                display: 'inline-block',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                                backdropFilter: 'blur(5px)',
                            }}
                        >
                            <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>{currentCityWeather.name}</h2>
                            <p style={{ fontSize: '1.5rem' }}>狀態: {currentCityWeather.desc}</p>
                            <p style={{ fontSize: '1.5rem' }}>最高氣溫: {currentCityWeather.temp}</p>
                            <p style={{ fontSize: '1.5rem' }}>降雨機率: {currentCityWeather.rain}</p>

                            <p
                                style={{
                                    marginTop: '20px',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                }}
                            >
                                {parseInt(currentCityWeather.rain) > 30 ? (
                                    <>
                                        <Umbrella color='#3b82f6' size={32} />
                                        <span>記得帶傘出門喔！</span>
                                    </>
                                ) : (
                                    <>
                                        <Sun color='#facc15' size={32} className="animate-spin-slow"/>
                                        <span>適合出門走走！</span>
                                    </>
                                )}
                            </p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

export default App;
