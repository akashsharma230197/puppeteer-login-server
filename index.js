const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/meesho-login', async (req, res) => {
  const { username, password } = req.body;

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  try {
    await page.goto('https://supplier.meesho.com/panel/v3/new/root/login', { waitUntil: 'networkidle2' });

    await page.type('input[type="email"]', username);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    await page.type('input[type="password"]', password);
    await page.click('button[type="submit"]');

    await page.waitForTimeout(3000);
    res.json({ status: 'success' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await browser.close();
  }
});

// ✅ Use 0.0.0.0 for Fly.io
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
