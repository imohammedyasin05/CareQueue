const pool = require('../db');

// Predict wait time and save prediction to Postgres
exports.predictWaitTime = async (req, res) => {
  try {
    const { patients, doctors, avg_time } = req.body;

    // 1. Basic validation
    if (patients === undefined || doctors === undefined || avg_time === undefined) {
      return res.status(400).json({ error: 'Please provide patients, doctors, and avg_time' });
    }

    if (doctors <= 0) {
      return res.status(400).json({ error: 'Number of doctors must be greater than 0' });
    }

    // 2. Logic calculation
    // wait_time = (patients / doctors) * avg_time
    const wait_time = (patients / doctors) * avg_time;

    // 3. Save data to database
    const text = `
      INSERT INTO queue_data (patients, doctors, avg_time, wait_time)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [patients, doctors, avg_time, wait_time];
    
    // Execute query
    const result = await pool.query(text, values);

    // 4. Return result
    res.status(201).json({
      message: 'Prediction successful and saved to database',
      wait_time,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error predicting wait time:', error);
    res.status(500).json({ error: 'Server error during prediction' });
  }
};

// Fetch all stored data
exports.getAllData = async (req, res) => {
  try {
    const text = 'SELECT * FROM queue_data ORDER BY created_at DESC;';
    const result = await pool.query(text);

    // Return the rows fetched from the table
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Server error fetching data' });
  }
};
