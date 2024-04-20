import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [pincode, setPincode] = useState('');
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pincode.length !== 6 || isNaN(pincode)) {
      setError('Please enter a valid 6-digit pincode.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();
      if (data && data.length > 0 && data[0].PostOffice) {
        setResults(data[0].PostOffice);
        setError('');
      } else {
        setError('No data found for this pincode.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  useEffect(() => {
    const filtered = results.filter(office => office.Name.toLowerCase().includes(filter.toLowerCase()));
    setFilteredResults(filtered);
  }, [filter, results]);

  return (
    <div className="container">
      <h1>Pincode Lookup</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="Enter 6-digit Pincode" />
        <button type="submit">Lookup</button>
      </form>
      <input type="text" className="filter-input" value={filter} onChange={handleFilterChange} placeholder="Filter by Post Office Name" />
      {loading && <div className="loader"></div>}
      {error && <p className="error">{error}</p>}
      <div className="results-container">
        {filteredResults.map((office, index) => (
          <div key={index} className="result-box">
            <div className="result-content">
              <p><strong>Post Office Name:</strong> {office.Name}</p>
              <p><strong>Pincode:</strong> {office.Pincode}</p>
              <p><strong>District:</strong> {office.District}</p>
              <p><strong>State:</strong> {office.State}</p>
            </div>
          </div>
        ))}
        {!loading && filteredResults.length === 0 && !error && <p>Couldn’t find the postal data you’re looking for…</p>}
      </div>
    </div>
  );
}

export default App;
