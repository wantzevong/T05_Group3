async function loadChartData() {
  const [spotPrices, tvEnergy55ByScreenType, tvEnergyAllSizesByScreenType, tvEnergy] =
    await Promise.all([
      d3.csv("data/Ex5_ARE_Spot_Prices.csv", d3.autoType),
      d3.csv("data/Ex5_TV_energy_55inchtv_byScreenType.csv", d3.autoType),
      d3.csv("data/Ex5_TV_energy_Allsizes_byScreenType.csv", d3.autoType),
      d3.csv("data/Ex5_TV_energy.csv", d3.autoType),
    ]);

  return {
    spotPrices,
    tvEnergy55ByScreenType,
    tvEnergyAllSizesByScreenType,
    tvEnergy,
  };
}

window.chartDataPromise = loadChartData()
  .then((datasets) => {
    window.chartData = datasets;
    return datasets;
  })
  .catch((error) => {
    console.error("Unable to load the CSV datasets.", error);
    return null;
  });
