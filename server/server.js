const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 5000; // Change the port number if needed
app.use(cors());
app.use(express.json());

// MongoDB connection configuration
mongoose.connect("mongodb+srv://kunaljha2214:kunal2214@cluster0.pg4hce5.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const tickerSchema = new mongoose.Schema({
    name: String,
    last: Number,
    buy: Number,
    sell: Number,
    volume: Number,
    base_unit: String
  });
  
const Ticker = mongoose.model('Ticker', tickerSchema);

app.get('/data', async (req, res) => {
    try {
      // Fetch data from the API
      const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
  
      // Extract the top 10 tickers
      const tickers = Object.values(response.data).slice(0, 10);
  
      // Store tickers in the database
      await Ticker.insertMany(tickers);
  
      res.status(200).json({ message: 'Tickers stored successfully.' });
    } catch (error) {
      console.error('Error fetching and storing tickers:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/',async(req,res) => {
  try {
    const Tickers = await Ticker.find();

    res.status(200).json(Tickers);
} catch (error) {
    res.status(404).json({ message: error.message });
}
})
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
