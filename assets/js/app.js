const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.nav-menu');

const updateHeader = () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
};

window.addEventListener('scroll', updateHeader, {passive: true});
updateHeader();

menuToggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});

menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
        menu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open navigation');
    });
});

const currentDateTime = document.querySelector('#currentDateTime');

const updateDateTime = () => {
    const now = new Date();
    currentDateTime.dateTime = now.toISOString();
    currentDateTime.textContent = now.toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
    });
};

updateDateTime();
window.setInterval(updateDateTime, 60000);

const stationName = document.querySelector('#stationName');
const gaugeHeight = document.querySelector('#gaugeHeight');
const flowValue = document.querySelector('#flowValue');
const datumValue = document.querySelector('#datumValue');
const previousStation = document.querySelector('#previousStation');
const nextStation = document.querySelector('#nextStation');
const gagePlot = document.querySelector('#gagePlot');
const gageMaxLabel = document.querySelector('#gageMaxLabel');
const gageMinLabel = document.querySelector('#gageMinLabel');
const stations = [
    {id: '02292900', label: 'Caloosahatchee River · S-79', datum: 'NAVD88'},
    {id: '02276998', label: 'St. Lucie Canal · S-80', datum: 'Not listed'},
    {id: '02281200', label: 'Hillsboro Canal · S-6', datum: 'NAVD88'},
    {id: '02291500', label: 'Imperial River · Bonita Springs', datum: 'Not listed'},
    {id: '02296750', label: 'Peace River · Arcadia', datum: 'NGVD29'}
];
let currentStationIndex = 0;

const drawGagePlot = (values) => {
    if (!gagePlot || values.length < 2) {
        return;
    }

    const numbers = values.map((item) => Number(item.value));
    const minimum = Math.min(...numbers);
    const maximum = Math.max(...numbers);
    const range = maximum - minimum || 1;
    const points = numbers.map((value, index) => {
        const x = 28 + (index / (numbers.length - 1)) * 192;
        const y = 56 - ((value - minimum) / range) * 46;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    gagePlot.setAttribute('points', points);
    gageMaxLabel.textContent = maximum.toFixed(2);
    gageMinLabel.textContent = minimum.toFixed(2);
};

const updateWaterData = async () => {
    const station = stations[currentStationIndex];
    stationName.textContent = station.label;
    gaugeHeight.textContent = 'Loading water data...';
    flowValue.textContent = '';
    datumValue.textContent = '';

    try {
        const usgsUrl = `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${station.id}&parameterCd=00065,00060&period=P1D&siteStatus=all`;
        const response = await fetch(usgsUrl);
        if (!response.ok) {
            throw new Error('USGS request failed');
        }

        const payload = await response.json();
        const series = payload.value.timeSeries;
        const gageSeries = series.find((item) => item.variable.variableCode[0].value === '00065');
        const flowSeries = series.find((item) => item.variable.variableCode[0].value === '00060');
        const gageValues = gageSeries.values.flatMap((group) => group.value).filter((item) => Number(item.value) > -999000);
        const flowValues = flowSeries.values.flatMap((group) => group.value).filter((item) => Number(item.value) > -999000);
        const gage = gageValues.at(-1);
        const flow = flowValues.at(-1);
        const observedAt = new Date(gage.dateTime).toLocaleTimeString('en-US', {hour: 'numeric', minute: '2-digit'});

        gaugeHeight.textContent = `${gage.value} ft gage height`;
        flowValue.textContent = `${flow.value} ft³/s flow · ${observedAt}`;
        datumValue.textContent = `Datum: ${station.datum} · provisional data`;
        drawGagePlot(gageValues);
    } catch (error) {
        gaugeHeight.textContent = 'Water data unavailable';
        datumValue.textContent = 'Try again later';
        gagePlot.setAttribute('points', '');
    }
};

const moveStation = (direction) => {
    currentStationIndex = (currentStationIndex + direction + stations.length) % stations.length;
    updateWaterData();
};

previousStation.addEventListener('click', () => moveStation(-1));
nextStation.addEventListener('click', () => moveStation(1));
updateWaterData();
window.setInterval(() => moveStation(1), 10000);
window.setInterval(updateWaterData, 900000);