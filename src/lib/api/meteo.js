const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export const fetchCurrentForecast = async ({ lat, lon }) => {
  const response = await fetch(
    `${BASE_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode&timezone=auto`
  );
  if (!response.ok) throw new Error('Failed to fetch daily weather');

  const data = await response.json();
  const current = data?.current;

  return {
    time: current?.time?.split('T')[1],
    temp: current?.temperature_2m,
    code: current?.weathercode,
  };
};

export const fetchDailyForecast = async ({ lat, lon }) => {
  const response = await fetch(
    `${BASE_URL}?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`
  );
  if (!response.ok) throw new Error('Failed to fetch daily weather');
  const data = await response.json();

  return data.daily.time.slice(0, 5).map((_, i) => {
    const [year, month, day] = data.daily.time[i].split('-');
    const fullDate = new Date(year, month - 1, day);
    return {
      day: fullDate.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
      date: fullDate.getDate(),
      temp: data.daily.temperature_2m_max[i],
      weatherCode: data.daily.weathercode[i],
      rawDate: data.daily.time[i],
    };
  });
};

export const fetchHourForcast = async (params) => {
  const { date, lat, lon } = params;
  if (!date) {
    console.error('No date on fetching 3-hour forecast: ', date);
    return;
  }

  let data;
  console.log('📅 API called with date:', date);

  try {
    const response = await fetch(
      `${BASE_URL}?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weathercode&start_date=${date}&end_date=${date}&timezone=auto`
    );
    if (!response.ok) throw new Error('❌ Failed to fetch weather data.');
    data = await response.json();
  } catch (error) {
    console.error('⚠️ Weather API error:', error);
    data = null;
  }

  const fullHours = data?.hourly?.time || [];
  const fullTemps = data?.hourly?.temperature_2m || [];
  const fullCodes = data?.hourly?.weathercode || [];

  const hours = fullHours.filter((_, i) => i % 3 === 0);
  const temps = fullTemps.filter((_, i) => i % 3 === 0);
  const codes = fullCodes.filter((_, i) => i % 3 === 0);

  return {
    hours,
    temps,
    codes,
  };
};
