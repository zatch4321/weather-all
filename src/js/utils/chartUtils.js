import Chart from 'chart.js/auto';

let tempChart = null;

export function createTemperatureChart(data, chartId) {
    if (tempChart) {
        tempChart.destroy();
    }

    const ctx = document.getElementById(chartId).getContext('2d');
    
    tempChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(item => item.time),
            datasets: [
                {
                    label: 'Temperature (°C)',
                    data: data.map(item => item.temp),
                    borderColor: '#00feba',
                    backgroundColor: 'rgba(0, 254, 186, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 2,
                    pointBackgroundColor: '#00feba',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#00feba',
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: 'Feels Like (°C)',
                    data: data.map(item => item.feels_like),
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    backgroundColor: 'transparent',
                    borderDash: [5, 5],
                    tension: 0.4,
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(255, 255, 255, 0.5)',
                    pointBorderColor: '#fff',
                    pointRadius: 3,
                    pointHoverRadius: 5
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: 'rgba(255, 255, 255, 0.8)',
                        font: {
                            family: 'Poppins',
                            size: 12
                        },
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                }
            },
            scales: {
                y: {
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.6)',
                        callback: value => `${value}°C`,
                        font: {
                            family: 'Poppins',
                            size: 11
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        drawBorder: false
                    }
                },
                x: {
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.6)',
                        font: {
                            family: 'Poppins',
                            size: 11
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        drawBorder: false
                    }
                }
            },
            interaction: {
                mode: 'index',
                intersect: false
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            }
        }
    });
}