const express = require('express');
const cors = require('cors');
const path = require('path'); // Import 'path' for better file path handling
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Route to serve processed_data.json
app.get('/api/data', (req, res) => {
    const dataPath = path.join(__dirname, 'data', 'processed_data.json'); // Correct path
    try {
        const data = require(dataPath);
        res.json(data);
    } catch (error) {
        console.error('Error reading data file:', error);
        res.status(500).json({ error: 'Failed to load data' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
