import { DEMO_MODE, demoFertilizerSchedules } from '../config/demoData';

const normalizeValue = (value, min, max) => {
  if (value === undefined || value === null) return 0.5;
  const clamped = Math.min(Math.max(value, min), max);
  return ((clamped - min) / (max - min)) * 100;
};

export const generateFertilizerPlan = (cropName = '', soilData) => {
  const key = cropName?.toLowerCase();
  if (DEMO_MODE) {
    return demoFertilizerSchedules[key] || demoFertilizerSchedules.default;
  }

  const nitrogen = soilData?.soil_properties?.nitrogen?.mean ?? 0.4;
  const ph = soilData?.soil_properties?.phh2o?.mean ?? 6.5;
  const soc = soilData?.soil_properties?.soc?.mean ?? 0.8;

  return [
    {
      day: 0,
      title: 'Basal Dose',
      tasks: [
        `${(normalizeValue(nitrogen, 0.2, 0.8) * 0.3).toFixed(0)} kg N`,
        `pH ${ph.toFixed(1)} adjusted`,
        `${(normalizeValue(soc, 0.2, 1.5) * 0.2).toFixed(0)} kg organic carbon`
      ],
      highlight: nitrogen < 0.35
    },
    {
      day: 25,
      title: 'Vegetative Boost',
      tasks: ['Split urea application', 'Micronutrient spray'],
      highlight: nitrogen < 0.35
    },
    {
      day: 45,
      title: 'Flowering Push',
      tasks: ['Potash + calcium mix', 'Silicon foliar spray'],
      highlight: ph > 8 || ph < 5.8
    },
    {
      day: 60,
      title: 'Grain / Pod Fill',
      tasks: ['Low-N boost', 'Bio stimulant drench'],
      highlight: soc < 0.6
    }
  ];
};

export const isNitrogenLow = (soilData) => {
  const nitrogen = soilData?.soil_properties?.nitrogen?.mean;
  return typeof nitrogen === 'number' ? nitrogen < 0.4 : false;
};

