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
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  try {
    await page.goto('https://supplier.meesho.com/panel/v3/new/root/login', { waitUntil: 'networkidle2' });

    // Use the updated selector for email/phone
    await page.waitForSelector('input[name="emailOrPhone"]', { timeout: 5000 });
    await page.type('input[name="emailOrPhone"]', username);
    await page.click('button[type="submit"]');

    // Wait and use updated selector for password field
    await page.waitForSelector('input[type="password"]', { timeout: 5000 });
    await page.type('input[type="password"]', password);
    await page.click('button[type="submit"]');

    await page.waitForTimeout(3000);
    res.json({ status: 'success', message: 'Login attempted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await browser.close();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
