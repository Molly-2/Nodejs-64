const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000; // Dynamic port or fallback to 3000

// Pinterest API key
const pinterestApiKey = 'r-dd95304fa1b0aa6872a12f88';
const baseURL = 'https://for-devs.onrender.com/api/pin';

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to fetch Pinterest data
app.get('/pinterest', async (req, res) => {
    const query = req.query.query;

    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    // Extract search term and number of images from the query string
    const [searchTerm, countStr] = query.split('-');
    const count = parseInt(countStr, 10) || 10; // Default to 10 images if not specified

    try {
        const response = await axios.get(baseURL, {
            params: {
                search: searchTerm,
                apikey: pinterestApiKey,
                limit: count  // Assuming the API supports a 'limit' parameter
            },
            headers: {
                'accept': '*/*',
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching Pinterest data' });
    }
});

// Serve index.html as the default route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
