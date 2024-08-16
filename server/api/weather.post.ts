export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  const apiKey = runtimeConfig.WEATHER_KEY;
  const body = await readBody(event);
  const { lat, lon } = body;
  const builtUrl = `https://api.pirateweather.net/forecast/${apiKey}/${lat}%2C${lon}`;

  const response = await fetch(builtUrl);

  const data = await response.json();

  return data;
});
