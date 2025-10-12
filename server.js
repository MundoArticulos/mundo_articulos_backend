require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const QRCode = require('qrcode');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const CULQI_SECRET = process.env.CULQI_SECRET_KEY || '';
const YAPE_PHONE = process.env.YAPE_PHONE || '+51900000000';

app.post('/api/create-order', async (req, res) => {
  try {
    const { items, amount, currency, customer } = req.body;
    const order = {
      id: 'ORDER_' + Date.now(),
      items,
      amount,
      currency: currency || 'PEN',
      customer,
    };
    return res.json({ ok: true, order, culqiPublicKey: process.env.CULQI_PUBLIC_KEY || '' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: 'internal' });
  }
});

app.post('/api/charge-card', async (req, res) => {
  try {
    const { token, amount, currency, orderId, email } = req.body;
    const response = await fetch('https://api.culqi.com/v2/charges', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${CULQI_SECRET}`
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100),
        currency: currency || 'PEN',
        email: email,
        source_id: token,
        metadata: { orderId }
      })
    });
    const data = await response.json();
    return res.json({ ok: true, data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: 'charging_failed' });
  }
});

app.post('/api/yape-payment', async (req, res) => {
  try {
    const { amount, orderId, note } = req.body;
    const payload = `YAPE|phone:${YAPE_PHONE}|amount:${amount}|order:${orderId}|note:${note || ''}`;
    const qrDataUrl = await QRCode.toDataURL(payload);
    return res.json({ ok: true, qrDataUrl, payload });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: 'yape_fail' });
  }
});

const PORT = process.env.BACKEND_PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));