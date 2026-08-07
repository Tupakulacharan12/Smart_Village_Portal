import { useEffect, useState } from 'react';
import { Cloud, CloudRain, Sun, Wind, Droplets, CloudSun } from 'lucide-react';
import { VILLAGE_INFO } from '@/lib/data';
import { useLanguage } from '@/contexts/LanguageContext';

interface WeatherData {
  temp: number;
  condition: string;
  icon: 'sun' | 'cloud' | 'rain' | 'cloud-sun';
  humidity: number;
  wind: number;
}

const MOCK: WeatherData = {
  temp: 32,
  condition: 'Partly Cloudy',
  icon: 'cloud-sun',
  humidity: 68,
  wind: 12,
};

export function WeatherWidget() {
  const { t, lang } = useLanguage();
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    // Simulated weather for the Krishna delta region (Gudlavalleru ~16.36N, 81.08E)
    // A real weather API would be proxied through an edge function.
    const conditions: WeatherData[] = [
      { ...MOCK, temp: 32, condition: lang === 'te' ? 'పాక్షిక మేఘాలు' : 'Partly Cloudy', icon: 'cloud-sun' },
      { ...MOCK, temp: 35, condition: lang === 'te' ? 'ఎండ' : 'Sunny', icon: 'sun', humidity: 55 },
      { ...MOCK, temp: 28, condition: lang === 'te' ? 'వర్షం' : 'Rainy', icon: 'rain', humidity: 85, wind: 18 },
      { ...MOCK, temp: 30, condition: lang === 'te' ? 'మేఘావృతం' : 'Cloudy', icon: 'cloud', humidity: 75 },
    ];
    const idx = new Date().getHours() % conditions.length;
    setWeather(conditions[idx]);
  }, [lang]);

  const Icon = weather?.icon === 'sun' ? Sun : weather?.icon === 'rain' ? CloudRain : weather?.icon === 'cloud' ? Cloud : CloudSun;

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Cloud className="w-5 h-5 text-govt-500" />
          {t('weather')}
        </h3>
        <span className="text-xs text-slate-400">{lang === 'te' ? VILLAGE_INFO.name_te : VILLAGE_INFO.name}</span>
      </div>
      {weather ? (
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-govt-100 to-govt-200 dark:from-govt-900/40 dark:to-govt-800/40 flex items-center justify-center">
            <Icon className="w-8 h-8 text-govt-600 dark:text-govt-300" />
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">{weather.temp}</span>
              <span className="text-lg text-slate-500">°C</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">{weather.condition}</p>
          </div>
        </div>
      ) : (
        <div className="h-16 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-xl" />
      )}
      {weather && (
        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-sm">
            <Droplets className="w-4 h-4 text-govt-500" />
            <span className="text-slate-500">{lang === 'te' ? 'తేమ' : 'Humidity'}</span>
            <span className="font-semibold text-slate-700 dark:text-slate-200">{weather.humidity}%</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Wind className="w-4 h-4 text-govt-500" />
            <span className="text-slate-500">{lang === 'te' ? 'గాలి' : 'Wind'}</span>
            <span className="font-semibold text-slate-700 dark:text-slate-200">{weather.wind} km/h</span>
          </div>
        </div>
      )}
    </div>
  );
}
