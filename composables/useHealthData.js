import healthData from '../src/data/health-data.json';

export const useHealthData = () => {
  const data = ref(healthData[0].data.metrics);

  const metrics = healthData[0].data.metrics.map((metric) => metric.name);

  // const todayData = computed(() => {
  //   return data.value[0].data.metrics.map((metric) => {
  //     const metricDate = metric.date // like "2023-10-26 00:00:00 -0400",
  //     const isToday = new Date(metricDate).getDate() === new Date().getDate();
  //     return {
  //       name: metric.name,
  //       value: metric.value,
  //       isToday,
  //     };
  // });

  return { data, metrics } 
}
