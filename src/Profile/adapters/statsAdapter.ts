
// Fill the profile statistics data based on fetched resources
// We dont use typed here for simplicity, but if needed we can add it
export const createAdaptedResourceStats = (resources: any[], date: string, year: number) => {
  let total = 0;
  let months = 0;
  let resoursesPerMonth = new Array(12).fill(0);

  resources.forEach((resource) => {
    if (resource[date]) {
      const fecha = new Date(resource[date]);
      const month = fecha.getMonth();
      if (fecha.getFullYear() === year) {
        resoursesPerMonth[month]++;
        total++;
      }
    }
  });

  // Total of months we consume a resource to do an average more coherent
  months = resoursesPerMonth.reduce((acc, resOnMonth) => {
    if (resOnMonth != 0) return acc + 1;
    else return acc;
  }, 0);
  
  if (months === 0) months = 1;  // Avoid division by zero

  return {
    total,
    average: parseFloat((total / months).toFixed(1)),
    chartData: resoursesPerMonth,
  };
};