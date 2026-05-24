---
title: "Visualizing 30 Years of Climate Trends"
subtitle: "Tables, charts, and statistical summaries from NOAA data"
tags: [data, climate, visualization, analysis]
math: true
toc: true
image: "assets/images/posts/global_temperature_rise.webp"
image_alt: "Global Temperature Rise Visualized in Polar Perspective"
description: "A data-rich post exploring temperature and precipitation trends using tables and embedded charts."
---

> **Note:** This post was generated with Gemini for the sole purpose of demonstrating the rich typographic and mathematical capabilities of the Eywan Jekyll template.

## Introduction & Methodology

The study of climate change necessitates rigorous analytical frameworks, moving past anecdotal observations toward empirical, long-term data tracking. As global temperatures continue to fluctuate under the influence of both anthropogenic drivers and natural cyclic oscillations, visualizing multi-decadal trends becomes paramount for both researchers and policymakers. 

This post examines an aggregated dataset spanning exactly 30 years (1996 through 2025). The data utilized for this analysis is compiled from the National Oceanic and Atmospheric Administration (NOAA) Global Historical Climatology Network (GHCN) and regional cooperative observer networks. To ensure localized fidelity alongside broad historical trends, the dataset focuses on mid-latitude anomalies across North America, standardizing daily surface temperature maxima, minima, and cumulative precipitation metrics.

### Data Harmonization and Processing

Raw climate data frequently suffers from spatial gaps, instrument updates, and observation time biases. To account for these systemic discrepancies, the following preprocessing steps were applied to the raw NOAA data stream:
1. **Time-of-Observation Adjustments:** Daily temperature readings were standardized to midnight-to-midnight operational windows to eliminate artificial warming or cooling artifacts introduced by afternoon or morning station resets.
2. **Homogenization:** Neighboring station cross-correlations were utilized to identify and correct step-changes caused by historical station relocations or changes in instrument sheltering hardware.
3. **Missing Value Imputation:** Missing values constituting less than 0.5% of the total dataset were resolved using local spatial kriging, ensuring continuous daily observations across all sample years.

The aggregated dataset contains daily records grouped into three distinct decadal epochs: Epoch I (1996–2005), Epoch II (2006–2015), and Epoch III (2016–2025). By segmenting the 30-year span into clear ten-year blocks, we can observe shifts in structural baselines rather than fleeting annual anomalies.

---

## Statistical Formulas

To establish a mathematical foundation for our observations, we employ standard descriptive statistics. When evaluating climate parameters over multi-decade intervals, tracking the shift in the central tendency alone is insufficient; we must also quantify the dispersion and volatility of these systems.

The arithmetic mean ($\bar{x}$) represents the foundational baseline for decadal averages, calculated as:

$$\bar{x} = \frac{1}{n}\sum_{i=1}^{n} x_i$$

Where $x_i$ denotes an individual annual or seasonal temperature/precipitation metric, and $n$ represents the total number of observed periods within that specific decade ($n = 10$ for annual aggregations within an epoch).

To measure the overall volatility and spread of temperatures within each epoch, we compute the sample standard deviation ($s$):

$$s = \sqrt{\frac{1}{n-1}\sum_{i=1}^{n} (x_i - \bar{x})^2}$$

A rising standard deviation over successive epochs indicates an expanding climate variance, signaling that weather patterns are becoming less predictable and more prone to extreme deviations from the calculated historical baseline.

---

## Decadal Summary Statistics

Applying these formulas to our dataset yields a distinct trajectory. The table below presents the aggregate summary metrics for surface temperatures across the three designated decades.

| Epoch | Time Period | Mean Temp ($\bar{x}$, °C) | Median Temp (°C) | Std Dev ($s$, °C) | Extreme Heat Days ($>35$°C) |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Epoch I** | 1996 – 2005 | 14.21 | 14.15 | 0.62 | 12.4 |
| **Epoch II** | 2006 – 2015 | 14.68 | 14.52 | 0.78 | 18.1 |
| **Epoch III** | 2016 – 2025 | 15.14 | 15.11 | 0.94 | 24.5 |

### Analysis of Decadal Summaries

The tabular data reveals a clear, continuous upward shift in both central tendency metrics and structural volatility. The arithmetic mean ($\bar{x}$) rose by $0.47$°C between Epoch I and Epoch II, followed by an additional increase of $0.46$°C moving into Epoch III. This yields a net warming of $+0.93$°C over the course of the 30-year observation frame. 

Concurrently, the sample standard deviation ($s$) expanded from $0.62$°C to $0.94$°C. This nearly 50% expansion in variance tells us that the climate system is growing increasingly volatile. The most striking real-world consequence of this expanding variance is found in the final column: the average annual number of Extreme Heat Days ($>35$°C) nearly doubled from $12.4$ days per year in the first decade to $24.5$ days per year in the most recent decade.

---

## Comprehensive Annual Climate Record

To observe how these multi-decadal shifts manifest on an annual basis, we must examine the un-aggregated annual results. The following complete multi-column table presents yearly temperature and precipitation anomalies relative to the century-long baseline (1901–2000 standard reference period).

<table>
  <caption>Table 1: Annual Temperature Anomalies, Precipitation Totals, and Climate Variations (1996–2025)</caption>
  <thead>
    <tr>
      <th style="text-align: left;">Year</th>
      <th style="text-align: center;">Mean Max (°C)</th>
      <th style="text-align: center;">Mean Min (°C)</th>
      <th style="text-align: center;">Temp Anomaly (°C)</th>
      <th style="text-align: center;">Annual Precip (mm)</th>
      <th style="text-align: center;">Precip Status</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>1996</td><td style="text-align: center;">19.4</td><td style="text-align: center;">8.8</td><td style="text-align: center;">-0.12</td><td style="text-align: center;">845</td><td style="text-align: center;">Normal</td></tr>
    <tr><td>1997</td><td style="text-align: center;">19.6</td><td style="text-align: center;">9.1</td><td style="text-align: center;">+0.05</td><td style="text-align: center;">892</td><td style="text-align: center;">Above Average</td></tr>
    <tr><td>1998</td><td style="text-align: center;">20.1</td><td style="text-align: center;">9.7</td><td style="text-align: center;">+0.41</td><td style="text-align: center;">780</td><td style="text-align: center;">Below Average</td></tr>
    <tr><td>1999</td><td style="text-align: center;">19.5</td><td style="text-align: center;">8.9</td><td style="text-align: center;">-0.03</td><td style="text-align: center;">830</td><td style="text-align: center;">Normal</td></tr>
    <tr><td>2000</td><td style="text-align: center;">19.3</td><td style="text-align: center;">8.7</td><td style="text-align: center;">-0.15</td><td style="text-align: center;">865</td><td style="text-align: center;">Normal</td></tr>
    <tr><td>2001</td><td style="text-align: center;">19.8</td><td style="text-align: center;">9.2</td><td style="text-align: center;">+0.18</td><td style="text-align: center;">812</td><td style="text-align: center;">Normal</td></tr>
    <tr><td>2002</td><td style="text-align: center;">19.9</td><td style="text-align: center;">9.4</td><td style="text-align: center;">+0.22</td><td style="text-align: center;">795</td><td style="text-align: center;">Below Average</td></tr>
    <tr><td>2003</td><td style="text-align: center;">20.2</td><td style="text-align: center;">9.6</td><td style="text-align: center;">+0.39</td><td style="text-align: center;">850</td><td style="text-align: center;">Normal</td></tr>
    <tr><td>2004</td><td style="text-align: center;">19.5</td><td style="text-align: center;">8.9</td><td style="text-align: center;">-0.01</td><td style="text-align: center;">910</td><td style="text-align: center;">Above Average</td></tr>
    <tr><td>2005</td><td style="text-align: center;">20.4</td><td style="text-align: center;">9.9</td><td style="text-align: center;">+0.51</td><td style="text-align: center;">824</td><td style="text-align: center;">Normal</td></tr>
    <tr><td>2006</td><td style="text-align: center;">20.5</td><td style="text-align: center;">10.1</td><td style="text-align: center;">+0.58</td><td style="text-align: center;">801</td><td style="text-align: center;">Normal</td></tr>
    <tr><td>2007</td><td style="text-align: center;">20.3</td><td style="text-align: center;">9.8</td><td style="text-align: center;">+0.44</td><td style="text-align: center;">742</td><td style="text-align: center;">Deficit</td></tr>
    <tr><td>2008</td><td style="text-align: center;">20.0</td><td style="text-align: center;">9.5</td><td style="text-align: center;">+0.21</td><td style="text-align: center;">885</td><td style="text-align: center;">Normal</td></tr>
    <tr><td>2009</td><td style="text-align: center;">20.2</td><td style="text-align: center;">9.6</td><td style="text-align: center;">+0.32</td><td style="text-align: center;">920</td><td style="text-align: center;">Above Average</td></tr>
    <tr><td>2010</td><td style="text-align: center;">20.8</td><td style="text-align: center;">10.4</td><td style="text-align: center;">+0.74</td><td style="text-align: center;">860</td><td style="text-align: center;">Normal</td></tr>
    <tr><td>2011</td><td style="text-align: center;">20.6</td><td style="text-align: center;">10.2</td><td style="text-align: center;">+0.61</td><td style="text-align: center;">955</td><td style="text-align: center;">Surge</td></tr>
    <tr><td>2012</td><td style="text-align: center;">21.2</td><td style="text-align: center;">10.9</td><td style="text-align: center;">+1.02</td><td style="text-align: center;">698</td><td style="text-align: center;">Severe Deficit</td></tr>
    <tr><td>2013</td><td style="text-align: center;">20.4</td><td style="text-align: center;">9.9</td><td style="text-align: center;">+0.49</td><td style="text-align: center;">872</td><td style="text-align: center;">Normal</td></tr>
    <tr><td>2014</td><td style="text-align: center;">20.7</td><td style="text-align: center;">10.3</td><td style="text-align: center;">+0.68</td><td style="text-align: center;">841</td><td style="text-align: center;">Normal</td></tr>
    <tr><td>2015</td><td style="text-align: center;">21.1</td><td style="text-align: center;">10.8</td><td style="text-align: center;">+0.95</td><td style="text-align: center;">815</td><td style="text-align: center;">Normal</td></tr>
    <tr><td>2016</td><td style="text-align: center;">21.4</td><td style="text-align: center;">11.1</td><td style="text-align: center;">+1.15</td><td style="text-align: center;">790</td><td style="text-align: center;">Below Average</td></tr>
    <tr><td>2017</td><td style="text-align: center;">21.3</td><td style="text-align: center;">11.0</td><td style="text-align: center;">+1.08</td><td style="text-align: center;">934</td><td style="text-align: center;">Above Average</td></tr>
    <tr><td>2018</td><td style="text-align: center;">21.6</td><td style="text-align: center;">11.4</td><td style="text-align: center;">+1.28</td><td style="text-align: center;">982</td><td style="text-align: center;">Surge</td></tr>
    <tr><td>2019</td><td style="text-align: center;">21.5</td><td style="text-align: center;">11.2</td><td style="text-align: center;">+1.19</td><td style="text-align: center;">804</td><td style="text-align: center;">Normal</td></tr>
    <tr><td>2020</td><td style="text-align: center;">21.9</td><td style="text-align: center;">11.8</td><td style="text-align: center;">+1.44</td><td style="text-align: center;">710</td><td style="text-align: center;">Deficit</td></tr>
    <tr><td>2021</td><td style="text-align: center;">21.7</td><td style="text-align: center;">11.5</td><td style="text-align: center;">+1.32</td><td style="text-align: center;">866</td><td style="text-align: center;">Normal</td></tr>
    <tr><td>2022</td><td style="text-align: center;">22.1</td><td style="text-align: center;">12.0</td><td style="text-align: center;">+1.56</td><td style="text-align: center;">1015</td><td style="text-align: center;">Extreme Surge</td></tr>
    <tr><td>2023</td><td style="text-align: center;">22.4</td><td style="text-align: center;">12.3</td><td style="text-align: center;">+1.78</td><td style="text-align: center;">650</td><td style="text-align: center;">Extreme Deficit</td></tr>
    <tr><td>2024</td><td style="text-align: center;">22.2</td><td style="text-align: center;">12.1</td><td style="text-align: center;">+1.62</td><td style="text-align: center;">890</td><td style="text-align: center;">Normal</td></tr>
    <tr><td>2025</td><td style="text-align: center;">22.6</td><td style="text-align: center;">12.5</td><td style="text-align: center;">+1.85</td><td style="text-align: center;">765</td><td style="text-align: center;">Below Average</td></tr>
  </tbody>
</table>

### Interpretation of Year-over-Year Dynamics

Reviewing the micro-level records in Table 1 highlights how climate change disrupts long-term baselines. Early records like 1996 and 2000 display negative temperature anomalies, indicating years that were cooler than the 20th-century average. However, after 2010, negative temperature anomalies disappear completely. 

The year 2012 marks an abrupt shift, where the temperature anomaly crossed the $+1.0$°C threshold ($+1.02$°C) for the first time, coinciding with a severe precipitation deficit ($698$ mm). This layout exposes a concerning correlation: late-epoch warming worsens hydrological extremes. The final five years of the study exhibit structural shifts, culminating in 2025's record temperature anomaly of $+1.85$°C. 

---

## Visualizing Temperature Trends

To translate the tabular historical record into an interpretable continuous visual sequence, the interactive line chart below charts the progression of both Mean Maximum and Mean Minimum surface temperatures over the 30-year timeframe.

<!-- Load Chart.js via reliable CDN -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<div style="position: relative; margin: 30px auto; max-width: 800px; width: 100%;">
  <canvas id="temperatureLineChart"></canvas>
</div>

<script>
  document.addEventListener("DOMContentLoaded", function() {
    const ctx = document.getElementById('temperatureLineChart').getContext('2d');
    const years = [1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
    
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          {
            label: 'Mean Maximum Temp (°C)',
            data: [19.4, 19.6, 20.1, 19.5, 19.3, 19.8, 19.9, 20.2, 19.5, 20.4, 20.5, 20.3, 20.0, 20.2, 20.8, 20.6, 21.2, 20.4, 20.7, 21.1, 21.4, 21.3, 21.6, 21.5, 21.9, 21.7, 22.1, 22.4, 22.2, 22.6],
            borderColor: 'rgba(219, 68, 85, 1)',
            backgroundColor: 'rgba(219, 68, 85, 0.1)',
            borderWidth: 2.5,
            pointRadius: 3.5,
            tension: 0.2,
            fill: false
          },
          {
            label: 'Mean Minimum Temp (°C)',
            data: [8.8, 9.1, 9.7, 8.9, 8.7, 9.2, 9.4, 9.6, 8.9, 9.9, 10.1, 9.8, 9.5, 9.6, 10.4, 10.2, 10.9, 9.9, 10.3, 10.8, 11.1, 11.0, 11.4, 11.2, 11.8, 11.5, 12.0, 12.3, 12.1, 12.5],
            borderColor: 'rgba(66, 133, 244, 1)',
            backgroundColor: 'rgba(66, 133, 244, 0.1)',
            borderWidth: 2.5,
            pointRadius: 3.5,
            tension: 0.2,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Decadal Multi-Class Surface Temperature Trajectories (1996–2025)',
            font: { size: 16, weight: 'bold' }
          },
          legend: { position: 'top' }
        },
        scales: {
          x: {
            title: { display: true, text: 'Observation Year' }
          },
          y: {
            title: { display: true, text: 'Temperature Baseline (°C)' },
            suggestedMin: 7,
            suggestedMax: 24
          }
        }
      }
    });
  });
</script>

### Analysis of the Line Chart Trajectory

The line chart highlights an important climate phenomenon: minimum temperatures are rising faster than maximum temperatures. While the maximum temperature curve (red line) shows clear upward steps, the minimum temperature curve (blue line) displays an even steeper upward slope, rising from $8.8$°C in 1996 to $12.5$°C by 2025. 

This asymmetry stems from greenhouse-gas-induced radiative forcing. Increased atmospheric carbon dioxide and water vapor block outgoing longwave radiation, keeping nighttime temperatures elevated. This prevents the nocturnal cooling cycles that ecosystems rely on to recover from daytime heat stress.

---

## Hydrological Instability: Precipitation Volatility

While temperature metrics follow a steady, upward trajectory, precipitation behaves quite differently. Rather than showing a clean linear increase or decrease, the hydrological cycle reveals expanding volatility, shifting between moisture over-saturation and intense droughts.

The bar chart below aggregates the absolute annual precipitation values, organized into the three decadal blocks to illustrate this growing volatility.

<div style="position: relative; margin: 30px auto; max-width: 800px; width: 100%;">
  <canvas id="precipitationBarChart"></canvas>
</div>

<script>
  document.addEventListener("DOMContentLoaded", function() {
    const ctx = document.getElementById('precipitationBarChart').getContext('2d');
    
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [
          '96', '97', '98', '99', '00', '01', '02', '03', '04', '05',
          '06', '07', '08', '09', '10', '11', '12', '13', '14', '15',
          '16', '17', '18', '19', '20', '21', '22', '23', '24', '25'
        ],
        datasets: [{
          label: 'Annual Precipitation (mm)',
          data: [
            845, 892, 780, 830, 865, 812, 795, 850, 910, 824,
            801, 742, 885, 920, 860, 955, 698, 872, 841, 815,
            790, 934, 982, 804, 710, 866, 1015, 650, 890, 765
          ],
          backgroundColor: function(context) {
            const index = context.dataIndex;
            if (index < 10) return 'rgba(75, 192, 192, 0.7)'; // Epoch I
            if (index < 20) return 'rgba(54, 162, 235, 0.7)'; // Epoch II
            return 'rgba(153, 102, 255, 0.7)';        // Epoch III
          },
          borderColor: function(context) {
            const index = context.dataIndex;
            if (index < 10) return 'rgba(75, 192, 192, 1)';
            if (index < 20) return 'rgba(54, 162, 235, 1)';
            return 'rgba(153, 102, 255, 1)';
          },
          borderWidth: 1.5
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Annual Hydrological Variability & Decadal Shifts (1996–2025)',
            font: { size: 16, weight: 'bold' }
          },
          legend: {
            display: true,
            labels: {
              generateLabels: function(chart) {
                return [
                  { text: 'Epoch I (1996-2005)', fillStyle: 'rgba(75, 192, 192, 0.7)' },
                  { text: 'Epoch II (2006-2015)', fillStyle: 'rgba(54, 162, 235, 0.7)' },
                  { text: 'Epoch III (2016-2025)', fillStyle: 'rgba(153, 102, 255, 0.7)' }
                ];
              }
            }
          }
        },
        scales: {
          x: {
            title: { display: true, text: 'Observation Year (Abbreviated)' }
          },
          y: {
            title: { display: true, text: 'Cumulative Rain/Snowmelt (mm)' },
            suggestedMin: 500,
            suggestedMax: 1100
          }
        }
      }
    });
  });
</script>

### Interpretation of Hydrological Trends

The distribution of precipitation across the three epochs highlights a significant shift in the climate system: the loss of standard, predictable weather patterns. In Epoch I (green bars), precipitation remained relatively stable, fluctuating within a narrow band between $780$ mm and $910$ mm. This represents a predictable hydrological regime.

In Epoch II (blue bars), this predictability breaks down. We see a historic drop to $698$ mm in 2012, flanked by wet spikes like 2011's $955$ mm. This variability intensifies further in Epoch III (purple bars). Epoch III contains both the wettest year on record ($1015$ mm in 2022) and the driest year on record ($650$ mm in 2023). 

This rapid swing from severe flooding potential to extreme drought within a 12-month window confirms a core climate prediction: a warmer atmosphere holds more moisture (roughly 7% per 1°C of warming, following the Clausius-Clapeyron equation). This fuels both heavier downpours and accelerated surface evaporation, drying out soil when it isn't raining.

---

## Limitations & Caveats

While the trends in this post are clear, interpretation must consider several methodological limitations:

* **Spatial Aggregation Constraints:** This data is aggregated across regional mid-latitude stations. It does not reflect macro-scale changes in equatorial regions or the accelerated warming seen in polar zones due to Arctic amplification.
* **Urban Heat Island (UHI) Artifacts:** Although regional homogenization corrections were applied, several monitoring stations are located near expanding suburban corridors. Localized pavement expansion and land-use changes may introduce minor warming biases unrelated to broader atmospheric changes.
* **Precipitation Capture Efficiency:** Standard automated rain gauges often under-report moisture totals during high-wind winter storms or sudden, intense downpours. This introduces a slight dry bias to extreme weather events.

---

## References

1. National Oceanic and Atmospheric Administration (NOAA). (2025). *Global Historical Climatology Network Daily (GHCN-Daily) Version 4.0 Standard Archives*. U.S. Department of Commerce.
2. Intergovernmental Panel on Climate Change (IPCC). (2021). *Climate Change 2021: The Physical Science Basis*. Contribution of Working Group I to the Sixth Assessment Report. Cambridge University Press.
3. Trenberth, K. E. (2011). *Changes in precipitation with climate change*. Climate Research, 47(1), 123-138.
