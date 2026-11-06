// State Management
let currentItems = [];
let currentBillNumber = parseInt(localStorage.getItem('lastBillNo') || '101');
let shopConfig = JSON.parse(localStorage.getItem('shopConfig') || JSON.stringify({
  name: 'Sharma Stores',
  upi: 'sharma@upi'
}));

// DOM Elements
const shopNameElem = document.getElementById('displayShopName');
const shopUPIElem = document.getElementById('displayShopUPI');
const receiptShopTitle = document.getElementById('receiptShopTitle');
const currentBillIdElem = document.getElementById('currentBillId');
const receiptBillNo = document.getElementById('receiptBillNo');
const receiptDate = document.getElementById('receiptDate');
const billItemsTable = document.getElementById('billItemsTable');
const subTotalVal = document.getElementById('subTotalVal');
const discountInput = document.getElementById('discountInput');
const taxInput = document.getElementById('taxInput');
const grandTotalVal = document.getElementById('grandTotalVal');
const todayTotalElem = document.getElementById('todayTotal');
const billCountElem = document.getElementById('billCount');
const billHistoryList = document.getElementById('billHistoryList');

// Initialize Shop Info
function initApp() {
  shopNameElem.innerText = shopConfig.name;
  receiptShopTitle.innerText = shopConfig.name;
  shopUPIElem.innerText = `UPI: ${shopConfig.upi}`;
  currentBillIdElem.innerText = `#${currentBillNumber}`;
  receiptBillNo.innerText = `#${currentBillNumber}`;
  receiptDate.innerText = new Date().toLocaleString();

  updateTotals();
  renderHistory();
}

// Add Item
document.getElementById('addItemBtn').addEventListener('click', () => {
  const name = document.getElementById('itemName').value.trim();
  const price = parseFloat(document.getElementById('itemPrice').value);
  const qty = parseInt(document.getElementById('itemQty').value) || 1;

  if (!name || isNaN(price) || price <= 0) {
    alert('Please enter valid item name and price.');
    return;
  }

  currentItems.push({ name, price, qty, total: price * qty });
  
  // Clear inputs
  document.getElementById('itemName').value = '';
  document.getElementById('itemPrice').value = '';
  document.getElementById('itemQty').value = '1';

  renderCurrentTable();
  updateTotals();
});

function renderCurrentTable() {
  billItemsTable.innerHTML = '';
  currentItems.forEach((item, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.name}</td>
      <td>${item.qty}</td>
      <td>₹${item.price}</td>
      <td>₹${item.total}</td>
    `;
    billItemsTable.appendChild(tr);
  });
}

function updateTotals() {
  const subTotal = currentItems.reduce((acc, itm) => acc + itm.total, 0);
  const discount = parseFloat(discountInput.value) || 0;
  const taxPercent = parseFloat(taxInput.value) || 0;

  const afterDiscount = Math.max(0, subTotal - discount);
  const taxAmount = (afterDiscount * taxPercent) / 100;
  const grandTotal = Math.round(afterDiscount + taxAmount);

  subTotalVal.innerText = subTotal.toFixed(2);
  grandTotalVal.innerText = grandTotal;

  generateUPIQR(grandTotal);
}

// Generate UPI QR Code
function generateUPIQR(amount) {
  const qrContainer = document.getElementById('qrcode');
  qrContainer.innerHTML = '';

  if (amount <= 0) return;

  // Format: upi://pay?pa=VPA&pn=NAME&am=AMOUNT&cu=INR
  const upiUrl = `upi://pay?pa=${encodeURIComponent(shopConfig.upi)}&pn=${encodeURIComponent(shopConfig.name)}&am=${amount}&cu=INR`;

  if (typeof QRCode !== 'undefined') {
    new QRCode(qrContainer, {
      text: upiUrl,
      width: 128,
      height: 128,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.M
    });
  }
}

discountInput.addEventListener('input', updateTotals);
taxInput.addEventListener('input', updateTotals);

// Save Bill to LocalStorage
document.getElementById('saveBillBtn').addEventListener('click', () => {
  if (currentItems.length === 0) {
    alert('Add at least one item to save the bill.');
    return;
  }

  const grandTotal = parseFloat(grandTotalVal.innerText);
  const billRecord = {
    id: currentBillNumber,
    date: new Date().toISOString(),
    displayDate: new Date().toLocaleDateString(),
    items: [...currentItems],
    total: grandTotal
  };

  const history = JSON.parse(localStorage.getItem('billHistory') || '[]');
  history.unshift(billRecord);
  localStorage.setItem('billHistory', JSON.stringify(history));

  currentBillNumber++;
  localStorage.setItem('lastBillNo', currentBillNumber.toString());

  // Reset current bill
  currentItems = [];
  discountInput.value = '0';
  taxInput.value = '0';
  renderCurrentTable();
  initApp();
  alert('Bill Saved Successfully!');
});

// Render History & Dashboard Stats
function renderHistory() {
  const history = JSON.parse(localStorage.getItem('billHistory') || '[]');
  billHistoryList.innerHTML = '';

  const todayStr = new Date().toLocaleDateString();
  let todaySales = 0;

  history.forEach(bill => {
    if (bill.displayDate === todayStr) {
      todaySales += bill.total;
    }

    const div = document.createElement('div');
    div.className = 'history-item';
    div.innerHTML = `
      <div>
        <strong>#${bill.id}</strong> - ${bill.items.length} items
        <div style="font-size:12px; color:#64748b">${new Date(bill.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
      </div>
      <div><strong>₹${bill.total}</strong></div>
    `;
    billHistoryList.appendChild(div);
  });

  todayTotalElem.innerText = `₹${todaySales}`;
  billCountElem.innerText = history.length;
}

// Download Bill as Image
document.getElementById('downloadImgBtn').addEventListener('click', () => {
  const billArea = document.getElementById('billPreviewArea');
  if (typeof html2canvas !== 'undefined') {
    html2canvas(billArea).then(canvas => {
      const link = document.createElement('a');
      link.download = `Bill_${currentBillNumber}.png`;
      link.href = canvas.toDataURL();
      link.click();
    });
  } else {
    alert('Screenshot engine loading...');
  }
});

// Share on WhatsApp
document.getElementById('shareWhatsappBtn').addEventListener('click', () => {
  if (currentItems.length === 0) {
    alert('Add items before sharing.');
    return;
  }
  let message = `*${shopConfig.name} - Bill #${currentBillNumber}*\n`;
  message += `Date: ${new Date().toLocaleDateString()}\n`;
  message += `------------------------\n`;
  currentItems.forEach(i => {
    message += `${i.name} x ${i.qty} = ₹${i.total}\n`;
  });
  message += `------------------------\n`;
  message += `*Total Amount: ₹${grandTotalVal.innerText}*\n\n`;
  message += `Pay via UPI to: ${shopConfig.upi}`;

  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
});

// Settings Modal Controls
const modal = document.getElementById('settingsModal');
document.getElementById('settingsBtn').addEventListener('click', () => modal.classList.remove('hidden'));
document.getElementById('closeSettingsBtn').addEventListener('click', () => modal.classList.add('hidden'));
document.getElementById('saveSettingsBtn').addEventListener('click', () => {
  const name = document.getElementById('shopNameInput').value.trim();
  const upi = document.getElementById('shopUPIInput').value.trim();
  if (name && upi) {
    shopConfig = { name, upi };
    localStorage.setItem('shopConfig', JSON.stringify(shopConfig));
    modal.classList.add('hidden');
    initApp();
  }
});

// Service Worker for Offline Execution
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(err => console.log('SW registration failed', err));
}

initApp();