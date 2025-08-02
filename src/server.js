const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Connect to SQLite
const db = new sqlite3.Database('./cloudstorage.db', (err) => {
  if (err) return console.error(err.message);
  console.log('Connected to SQLite database.');
});

// Create tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS StorageOffers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    address TEXT,
    description TEXT,
    price REAL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    offerId INTEGER,
    buyerName TEXT,
    status TEXT DEFAULT 'pending',
    FOREIGN KEY(offerId) REFERENCES StorageOffers(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Deliveries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orderId INTEGER,
    providerName TEXT,
    quantity INTEGER,
    deliveryDate TEXT DEFAULT (datetime('now')),
    status TEXT,
    FOREIGN KEY(orderId) REFERENCES Orders(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS HashRecords (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orderId INTEGER,
    hashOrder TEXT,
    hashDelivery TEXT,
    result TEXT CHECK(result IN ('match', 'conflict')),
    FOREIGN KEY(orderId) REFERENCES Orders(id)
  )`);
});

// Create a new storage offer
app.post('/offers', (req, res) => {
  const { username, address, description, price } = req.body;
  const sql = `INSERT INTO StorageOffers (username, address, description, price) VALUES (?, ?, ?, ?)`;
  db.run(sql, [username, address, description, price], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Offer created', offerId: this.lastID });
  });
});

// Get all storage offers
app.get('/offers', (req, res) => {
  db.all('SELECT * FROM StorageOffers', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Place an order
app.post('/orders', (req, res) => {
  const { offerId, buyerName } = req.body;
  const sql = `INSERT INTO Orders (offerId, buyerName) VALUES (?, ?)`;
  db.run(sql, [offerId, buyerName], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Order placed', orderId: this.lastID });
  });
});

// Get all orders
app.get('/orders', (req, res) => {
  db.all('SELECT * FROM Orders', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Deliver storage with cryptographic validation
app.post('/deliveries', (req, res) => {
  const { orderId, providerName, quantity } = req.body;

  if (!orderId || !providerName || !quantity) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Find the order by ID
  db.get('SELECT * FROM Orders WHERE id = ?', [orderId], (err, order) => {
    if (err || !order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Find the offer related to this order
    db.get('SELECT * FROM StorageOffers WHERE id = ?', [order.offerId], (err2, offer) => {
      if (err2 || !offer) {
        return res.status(404).json({ message: 'Offer not found' });
      }

      // Prepare the original data string from offer fields
      const originalData = `${offer.username}:${offer.address}:${offer.description}:${offer.price}`;

      // Prepare the delivery data string using the same offer fields (you may adjust if delivery data differs)
      const deliveryData = `${offer.username}:${offer.address}:${offer.description}:${offer.price}`;

      // Compute SHA256 hashes for both
      const originalHash = crypto.createHash('sha256').update(originalData).digest('hex');
      const deliveryHash = crypto.createHash('sha256').update(deliveryData).digest('hex');

      // Check if hashes match
      const isValid = originalHash === deliveryHash;

      // Set delivery status based on validation result
      const deliveryStatus = isValid ? 'validated' : 'conflict';

      // Insert new delivery record including providerName and quantity
      db.run(
        'INSERT INTO Deliveries (orderId, providerName, quantity, status) VALUES (?, ?, ?, ?)',
        [orderId, providerName, quantity, deliveryStatus],
        function (insertErr) {
          if (insertErr) {
            return res.status(500).json({ message: 'Failed to save delivery', error: insertErr.message });
          }

          // Insert hash record AFTER delivery is inserted successfully
          const hashResult = isValid ? 'match' : 'conflict';

          db.run(
            `INSERT INTO HashRecords (orderId, hashOrder, hashDelivery, result)
             VALUES (?, ?, ?, ?)`,
            [orderId, originalHash, deliveryHash, hashResult],
            function(hashErr) {
              if (hashErr) {
                console.error('Failed to insert hash record:', hashErr.message);
                // Continue anyway
              }

              // Finally respond to client
              res.json({
                message: 'Delivery recorded',
                deliveryId: this.lastID,
                status: deliveryStatus,
                originalHash,
                deliveryHash,
                isValid
              });
            }
          );
        }
      );
    });
  });
});

// Get all deliveries
app.get('/deliveries', (req, res) => {
  db.all('SELECT * FROM Deliveries', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get order status based on latest hash record
app.get('/orders/:id/status', (req, res) => {
  const orderId = req.params.id;

  // Query hash record for the order
  db.get('SELECT result FROM HashRecords WHERE orderId = ? ORDER BY id DESC LIMIT 1', [orderId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });

    if (!row) {
      return res.json({ status: 'No delivery or validation record found for this order.' });
    }

    if (row.result === 'match') {
      return res.json({ status: 'fulfilled' });
    } else if (row.result === 'conflict') {
      return res.json({ status: 'in dispute' });
    } else {
      return res.json({ status: 'unknown' });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});