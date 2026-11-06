# 🧾 Bill Book - Offline Billing & UPI App

A lightweight, fast, and offline-capable billing progressive web app (PWA) designed for small retail stores and local shops[cite: 9]. Built with pure HTML, CSS, and Vanilla JavaScript, it works completely without internet or external server dependencies[cite: 9].

---

## 🌟 Key Features

- **Shop Customization:** Configure shop name and UPI VPA directly from settings[cite: 9].
- **Fast Itemized Billing:** Add items with custom names, quantities, and individual prices[cite: 9].
- **Dynamic Calculation:** Automatic subtotal calculation with support for flat discounts and GST/Tax percentage[cite: 9].
- **Dynamic UPI QR Code:** Generates a real-time scannable UPI QR code encoded with the exact bill amount and payee details[cite: 9].
- **Share & Export:** 
  - Download the receipt directly as an image (PNG)[cite: 9].
  - One-click share itemized bill summary on WhatsApp[cite: 9].
- **Offline & Flight Mode Ready:** Powered by Service Workers and LocalStorage to run fully in flight mode with no data loss[cite: 9].
- **Sales Analytics:** Displays today's total sales and saves persistent bill history[cite: 9].

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Storage:** Browser LocalStorage (No login or database server required)[cite: 2]
- **Offline Engine:** Service Worker & Web App Manifest (PWA)
- **Libraries used (via CDN):**
  - [qrcode.js](https://davidshimjs.github.io/qrcodejs/) for client-side QR generation
  - [html2canvas](https://html2canvas.hertzen.com/) for capturing receipt screenshots

---

## 🚀 How to Run Locally

1. Clone or download this repository:
   ```bash
   git clone [https://github.com/](https://github.com/)<your-username>/bill-book.git
   cd bill-book
