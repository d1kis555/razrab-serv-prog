const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(bodyParser.json());

const clinics = [
  { id: 1, name: 'На Богаткова', lat: 55.023613, lon: 82.960126, phone: '+79991112233', open: [8, 22], address: 'Улица Бориса Богаткова, 138' },
  { id: 2, name: 'На Добролюбова', lat: 55.010479, lon: 82.9487, phone: '+79992223344', open: [8, 22], address: 'Добролюбова, 31 к8 ' },
  {id: 3, name: 'На Студенческой', lat: 54.989351, lon: 82.905467, phone: '+79992223344', open: [0, 24], address: 'Улица Геодезическая, 9 ' },
  { id: 4, name: 'На Калинина', lat: 55.061224, lon: 82.909966, phone: '+79992223344', open: [8, 22], address: 'ул. Красный проспект, 161/1' }
];

function isOpen(clinic, hour) {
  return hour >= clinic.open[0] && hour < clinic.open[1];
}

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

app.get('/api/clinics', (req, res) => {
  res.json(clinics);
});

app.post('/api/emergency', (req, res) => {
  const { lat, lon } = req.body;
  const hour = new Date().getHours();

  let nearest = null;
  let minDist = Infinity;

  for (const clinic of clinics) {
    if (isOpen(clinic, hour)) {
      const dist = getDistance(lat, lon, clinic.lat, clinic.lon);
      if (dist < minDist) {
        minDist = dist;
        nearest = clinic;
      }
    }
  }

  if (nearest) {
    res.json(nearest);
  } else {
    res.status(404).json({ error: 'Нет доступных клиник' });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});
