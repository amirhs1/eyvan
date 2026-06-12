/*
Demo climate charts
Purpose:
Render the demo climate line and bar charts with Chart.js, using Eyvan theme
tokens from CSS custom properties.
*/

(() => {
  "use strict";

  const years = [
    1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005,
    2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015,
    2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025
  ];

  const maxTemps = [
    19.4, 19.6, 20.1, 19.5, 19.3, 19.8, 19.9, 20.2, 19.5, 20.4,
    20.5, 20.3, 20.0, 20.2, 20.8, 20.6, 21.2, 20.4, 20.7, 21.1,
    21.4, 21.3, 21.6, 21.5, 21.9, 21.7, 22.1, 22.4, 22.2, 22.6
  ];

  const minTemps = [
    8.8, 9.1, 9.7, 8.9, 8.7, 9.2, 9.4, 9.6, 8.9, 9.9,
    10.1, 9.8, 9.5, 9.6, 10.4, 10.2, 10.9, 9.9, 10.3, 10.8,
    11.1, 11.0, 11.4, 11.2, 11.8, 11.5, 12.0, 12.3, 12.1, 12.5
  ];

  const precipitation = [
    845, 892, 780, 830, 865, 812, 795, 850, 910, 824,
    801, 742, 885, 920, 860, 955, 698, 872, 841, 815,
    790, 934, 982, 804, 710, 866, 1015, 650, 890, 765
  ];

  let temperatureChart = null;
  let precipitationChart = null;

  function getTheme() {
    const styles = getComputedStyle(document.documentElement);

    const getColor = (name, fallback) =>
      styles.getPropertyValue(name).trim() || fallback;

    return {
      background: getColor("--color-ui-bg", "#ffffff"),
      text: getColor("--color-ui-text", "#1f2937"),
      muted: getColor("--color-ui-text-muted", "#6b7280"),
      border: getColor("--color-ui-border", "#e5e7eb"),
      accentPrimary: getColor("--color-accent-primary", "#4B3049"),
      accentSecondary: getColor("--color-accent-secondary", "#C9A0C4"),
      warning: getColor("--color-state-warning", "#f59e0b")
    };
  }

  function transparentize(color, alpha) {
    if (!color || !color.startsWith("#")) {
      return color;
    }

    const hex = color.replace("#", "");
    const fullHex =
      hex.length === 3
        ? hex.split("").map((char) => char + char).join("")
        : hex;

    const value = parseInt(fullHex, 16);
    const red = (value >> 16) & 255;
    const green = (value >> 8) & 255;
    const blue = value & 255;

    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }

  const chartCanvasBackground = {
    id: "chartCanvasBackground",

    beforeDraw(chart, args, options) {
      const { ctx, canvas } = chart;

      ctx.save();
      ctx.globalCompositeOperation = "destination-over";
      ctx.fillStyle = options.color || "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    }
  };

  function getBaseOptions(theme) {
    return {
      responsive: true,
      maintainAspectRatio: false,

      interaction: {
        mode: "index",
        intersect: false
      },

      layout: {
        padding: {
          top: 8,
          right: 12,
          bottom: 4,
          left: 4
        }
      },

      plugins: {
        chartCanvasBackground: {
          color: theme.background
        },

        title: {
          display: false
        },

        legend: {
          position: "bottom",
          align: "center",
          labels: {
            color: theme.text,
            boxWidth: 14,
            boxHeight: 14,
            padding: 18,
            usePointStyle: true,
            pointStyle: "circle"
          }
        },

        tooltip: {
          backgroundColor: theme.text,
          titleColor: theme.background,
          bodyColor: theme.background,
          borderColor: theme.border,
          borderWidth: 1,
          padding: 12,
          displayColors: true
        }
      }
    };
  }

  function prepareChartFrame(canvas) {
    const frame = canvas.parentElement;

    if (!frame) {
      return;
    }

    frame.style.position = frame.style.position || "relative";
    frame.style.minHeight = frame.style.minHeight || "360px";
  }

  function destroyCharts() {
    if (temperatureChart) {
      temperatureChart.destroy();
      temperatureChart = null;
    }

    if (precipitationChart) {
      precipitationChart.destroy();
      precipitationChart = null;
    }
  }

  function drawTemperatureChart(theme) {
    const canvas = document.getElementById("temperatureLineChart");

    if (!canvas) {
      return;
    }

    prepareChartFrame(canvas);

    const ctx = canvas.getContext("2d");
    const baseOptions = getBaseOptions(theme);

    temperatureChart = new window.Chart(ctx, {
      type: "line",
      plugins: [chartCanvasBackground],

      data: {
        labels: years,

        datasets: [
          {
            label: "Mean Maximum Temp (°C)",
            data: maxTemps,
            borderColor: theme.accentPrimary,
            backgroundColor: transparentize(theme.accentPrimary, 0.12),
            borderWidth: 2.5,
            pointRadius: 2.75,
            pointHoverRadius: 5,
            pointBorderWidth: 1.5,
            tension: 0.32,
            fill: false
          },
          {
            label: "Mean Minimum Temp (°C)",
            data: minTemps,
            borderColor: theme.accentSecondary,
            backgroundColor: transparentize(theme.accentSecondary, 0.12),
            borderWidth: 2.5,
            pointRadius: 2.75,
            pointHoverRadius: 5,
            pointBorderWidth: 1.5,
            tension: 0.32,
            fill: false
          }
        ]
      },

      options: {
        ...baseOptions,

        scales: {
          x: {
            ticks: {
              color: theme.muted,
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 8
            },
            grid: {
              color: transparentize(theme.border, 0.45),
              drawBorder: false
            },
            title: {
              display: true,
              text: "Observation Year",
              color: theme.text,
              font: {
                size: 14,
                weight: "500"
              },
              padding: {
                top: 12
              }
            }
          },

          y: {
            suggestedMin: 7,
            suggestedMax: 24,
            ticks: {
              color: theme.muted,
              callback: (value) => `${value}°C`
            },
            grid: {
              color: transparentize(theme.border, 0.55),
              drawBorder: false
            },
            title: {
              display: true,
              text: "Temperature Baseline (°C)",
              color: theme.text,
              font: {
                size: 14,
                weight: "500"
              },
              padding: {
                bottom: 12
              }
            }
          }
        }
      }
    });
  }

  function drawPrecipitationChart(theme) {
    const canvas = document.getElementById("precipitationBarChart");

    if (!canvas) {
      return;
    }

    prepareChartFrame(canvas);

    const ctx = canvas.getContext("2d");
    const baseOptions = getBaseOptions(theme);

    const epochOne = theme.accentSecondary;
    const epochTwo = theme.accentPrimary;
    const epochThree = theme.warning;

    precipitationChart = new window.Chart(ctx, {
      type: "bar",
      plugins: [chartCanvasBackground],

      data: {
        labels: years.map((year) => String(year).slice(2)),

        datasets: [
          {
            label: "Annual Precipitation (mm)",
            data: precipitation,

            backgroundColor(context) {
              const index = context.dataIndex;

              if (index < 10) {
                return transparentize(epochOne, 0.7);
              }

              if (index < 20) {
                return transparentize(epochTwo, 0.7);
              }

              return transparentize(epochThree, 0.7);
            },

            borderColor(context) {
              const index = context.dataIndex;

              if (index < 10) {
                return epochOne;
              }

              if (index < 20) {
                return epochTwo;
              }

              return epochThree;
            },

            borderWidth: 1.25,
            borderRadius: 4,
            borderSkipped: false,
            barPercentage: 0.82,
            categoryPercentage: 0.92
          }
        ]
      },

      options: {
        ...baseOptions,

        plugins: {
          ...baseOptions.plugins,

          legend: {
            position: "bottom",
            align: "center",

            labels: {
              color: theme.text,
              boxWidth: 14,
              boxHeight: 14,
              padding: 18,

              generateLabels() {
                return [
                  {
                    text: "Epoch I (1996–2005)",
                    fillStyle: transparentize(epochOne, 0.7),
                    strokeStyle: epochOne,
                    lineWidth: 1.25
                  },
                  {
                    text: "Epoch II (2006–2015)",
                    fillStyle: transparentize(epochTwo, 0.7),
                    strokeStyle: epochTwo,
                    lineWidth: 1.25
                  },
                  {
                    text: "Epoch III (2016–2025)",
                    fillStyle: transparentize(epochThree, 0.7),
                    strokeStyle: epochThree,
                    lineWidth: 1.25
                  }
                ];
              }
            }
          },

          tooltip: {
            ...baseOptions.plugins.tooltip,

            callbacks: {
              title(items) {
                const item = items[0];
                return `Year ${years[item.dataIndex]}`;
              },

              label(item) {
                return `Annual precipitation: ${item.parsed.y} mm`;
              }
            }
          }
        },

        scales: {
          x: {
            ticks: {
              color: theme.muted,
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 10
            },
            grid: {
              display: false
            },
            title: {
              display: true,
              text: "Observation Year (Abbreviated)",
              color: theme.text,
              font: {
                size: 14,
                weight: "500"
              },
              padding: {
                top: 12
              }
            }
          },

          y: {
            suggestedMin: 500,
            suggestedMax: 1100,
            ticks: {
              color: theme.muted,
              callback: (value) => `${value} mm`
            },
            grid: {
              color: transparentize(theme.border, 0.55),
              drawBorder: false
            },
            title: {
              display: true,
              text: "Cumulative Rain/Snowmelt (mm)",
              color: theme.text,
              font: {
                size: 14,
                weight: "500"
              },
              padding: {
                bottom: 12
              }
            }
          }
        }
      }
    });
  }

  function drawCharts() {
    if (!window.Chart) {
      return;
    }

    const theme = getTheme();

    destroyCharts();
    drawTemperatureChart(theme);
    drawPrecipitationChart(theme);
  }

  function observeThemeChanges() {
    const observer = new MutationObserver(drawCharts);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme", "data-persona"]
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (!window.Chart) {
      console.error(
        "Climate demo charts were not rendered because Chart.js is unavailable."
      );
      return;
    }

    drawCharts();
    observeThemeChanges();
  });
})();
