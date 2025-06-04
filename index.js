const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/meesho-login', async (req, res) => {
  const { username, password } = req.body;

  const browser = await puppeteer.launch({
    headless: false, // set to true after debugging
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: null,
  });

  const page = await browser.newPage();
  try {
    await page.goto('https://supplier.meesho.com/panel/v3/new/root/login', { waitUntil: 'domcontentloaded', timeout: 0 });

    // Wait for the main login input to appear
    await page.waitForSelector('input[name="emailOrPhone"]', { timeout: 15000 });
    await page.type('input[name="emailOrPhone"]', username);
    await page.click('button[type="submit"]');

    await page.waitForSelector('input[type="password"]', { timeout: 10000 });
    await page.type('input[type="password"]', password);
    await page.click('button[type="submit"]');

    await page.waitForTimeout(5000);

    // Save screenshot for confirmation
    await page.screenshot({ path: 'meesho_login.png' });

    res.json({ status: 'success', message: 'Login script executed', screenshot: 'meesho_login.png' });
  } catch (err) {
    // Save screenshot if error occurs
    await page.screenshot({ path: 'error.png' });
    res.status(500).json({ error: err.message, screenshot: 'error.png' });
  } finally {
    // Comment this out during debugging to see browser
    // await browser.close();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
