(() => {
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

  function getTheme() {
    const styles = getComputedStyle(document.documentElement);
    const getColor = (name, fallback) =>
      styles.getPropertyValue(name).trim() || fallback;

    return {
      background: getColor("--color-ui-bg", "#ffffff"),
      text: getColor("--color-ui-text", "#1f2937"),
      muted: getColor("--color-ui-text-muted", "#6b7280"),
      border: getColor("--color-ui-border", "#e5e7eb"),
      accentPrimary: getColor("--color-accent-primary", "#32127A"),
      accentSecondary: getColor("--color-accent-secondary", "#3FE0D0"),
      warning: getColor("--color-state-warning", "#f59e0b")
    };
  }

  function transparentize(color, alpha) {
    if (!color.startsWith("#")) return color;

    const hex = color.replace("#", "");
    const fullHex = hex.length === 3
      ? hex.split("").map((char) => char + char).join("")
      : hex;
    const bigint = parseInt(fullHex, 16);

    return `rgba(${(bigint >> 16) & 255}, ${(bigint >> 8) & 255}, ${bigint & 255}, ${alpha})`;
  }

  function setupCanvas(canvas) {
    const frame = canvas.parentElement;
    const width = Math.max(frame.clientWidth, 320);
    const height = Math.round(Math.min(Math.max(width * 0.56, 320), 480));
    const ratio = window.devicePixelRatio || 1;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);

    const ctx = canvas.getContext("2d");
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    return { ctx, width, height };
  }

  function drawGrid(ctx, plot, theme, yTicks, xTickLabels, yLabel, xLabel) {
    ctx.fillStyle = theme.background;
    ctx.fillRect(0, 0, plot.canvasWidth, plot.canvasHeight);

    ctx.strokeStyle = theme.border;
    ctx.lineWidth = 1;
    ctx.fillStyle = theme.muted;
    ctx.font = "12px sans-serif";

    yTicks.forEach((tick) => {
      const y = plot.y(tick);
      ctx.beginPath();
      ctx.moveTo(plot.left, y);
      ctx.lineTo(plot.right, y);
      ctx.stroke();
      ctx.fillText(String(tick), 10, y + 4);
    });

    xTickLabels.forEach(({ index, label }) => {
      const x = plot.x(index);
      ctx.beginPath();
      ctx.moveTo(x, plot.top);
      ctx.lineTo(x, plot.bottom);
      ctx.stroke();
      ctx.fillText(label, x - 10, plot.bottom + 22);
    });

    ctx.fillStyle = theme.text;
    ctx.font = "13px sans-serif";
    ctx.fillText(xLabel, plot.left + (plot.right - plot.left) / 2 - 55, plot.canvasHeight - 14);

    ctx.save();
    ctx.translate(18, plot.top + (plot.bottom - plot.top) / 2 + 75);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(yLabel, 0, 0);
    ctx.restore();
  }

  function makePlot(width, height, min, max, count) {
    const plot = {
      canvasWidth: width,
      canvasHeight: height,
      left: 58,
      right: width - 24,
      top: 48,
      bottom: height - 58
    };

    plot.x = (index) => plot.left + (index / (count - 1)) * (plot.right - plot.left);
    plot.y = (value) => plot.bottom - ((value - min) / (max - min)) * (plot.bottom - plot.top);

    return plot;
  }

  function drawLegend(ctx, items, theme, x, y) {
    ctx.font = "13px sans-serif";
    items.forEach((item, index) => {
      const offset = index * 190;

      ctx.strokeStyle = item.color;
      ctx.fillStyle = item.fill || item.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x + offset, y);
      ctx.lineTo(x + offset + 26, y);
      ctx.stroke();
      ctx.fillRect(x + offset, y - 5, 10, 10);
      ctx.fillStyle = theme.text;
      ctx.fillText(item.label, x + offset + 34, y + 4);
    });
  }

  function drawLineChart() {
    const canvas = document.getElementById("temperatureLineChart");
    if (!canvas) return;

    const theme = getTheme();
    const { ctx, width, height } = setupCanvas(canvas);
    const plot = makePlot(width, height, 7, 24, years.length);

    drawGrid(ctx, plot, theme, [8, 12, 16, 20, 24], [
      { index: 0, label: "1996" },
      { index: 9, label: "2005" },
      { index: 19, label: "2015" },
      { index: 29, label: "2025" }
    ], "Temperature Baseline (C)", "Observation Year");

    [
      { values: maxTemps, color: theme.accentPrimary },
      { values: minTemps, color: theme.accentSecondary }
    ].forEach((series) => {
      ctx.strokeStyle = series.color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      series.values.forEach((value, index) => {
        const point = [plot.x(index), plot.y(value)];
        if (index === 0) ctx.moveTo(...point);
        else ctx.lineTo(...point);
      });
      ctx.stroke();

      ctx.fillStyle = series.color;
      series.values.forEach((value, index) => {
        ctx.beginPath();
        ctx.arc(plot.x(index), plot.y(value), 3, 0, Math.PI * 2);
        ctx.fill();
      });
    });

    drawLegend(ctx, [
      { label: "Mean Maximum Temp (C)", color: theme.accentPrimary },
      { label: "Mean Minimum Temp (C)", color: theme.accentSecondary }
    ], theme, plot.left, 24);
  }

  function drawBarChart() {
    const canvas = document.getElementById("precipitationBarChart");
    if (!canvas) return;

    const theme = getTheme();
    const { ctx, width, height } = setupCanvas(canvas);
    const plot = makePlot(width, height, 500, 1100, precipitation.length);
    const colors = [theme.accentSecondary, theme.accentPrimary, theme.warning];
    const barWidth = Math.max((plot.right - plot.left) / precipitation.length - 4, 5);

    drawGrid(ctx, plot, theme, [500, 700, 900, 1100], [
      { index: 0, label: "96" },
      { index: 9, label: "05" },
      { index: 19, label: "15" },
      { index: 29, label: "25" }
    ], "Cumulative Rain/Snowmelt (mm)", "Observation Year");

    precipitation.forEach((value, index) => {
      const color = colors[Math.floor(index / 10)];
      const x = plot.x(index) - barWidth / 2;
      const y = plot.y(value);

      ctx.fillStyle = transparentize(color, 0.7);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.fillRect(x, y, barWidth, plot.bottom - y);
      ctx.strokeRect(x, y, barWidth, plot.bottom - y);
    });

    drawLegend(ctx, [
      { label: "Epoch I (1996-2005)", color: theme.accentSecondary, fill: transparentize(theme.accentSecondary, 0.7) },
      { label: "Epoch II (2006-2015)", color: theme.accentPrimary, fill: transparentize(theme.accentPrimary, 0.7) },
      { label: "Epoch III (2016-2025)", color: theme.warning, fill: transparentize(theme.warning, 0.7) }
    ], theme, plot.left, 24);
  }

  function drawCharts() {
    drawLineChart();
    drawBarChart();
  }

  document.addEventListener("DOMContentLoaded", drawCharts);
  window.addEventListener("resize", drawCharts);
})();
