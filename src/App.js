import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const filterOptions = [
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'numbers', label: 'Numbers' },
    { value: 'highest_lowercase_alphabet', label: 'Highest lowercase alphabet' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const parsedInput = JSON.parse(jsonInput);
      const { data } = parsedInput;

      // Filter data to separate numbers and alphabets
      const numbers = data.filter(item => !isNaN(item));
      const alphabets = data.filter(item => isNaN(item) && item.length === 1);

      // Send data to backend if needed
      const response = await axios.post('http://localhost:4000/bfhl', { numbers, alphabets });
      setResponseData(response.data);
      setError('');
    } catch (err) {
      setError('Invalid JSON format');
    }
  };

  const renderResponse = () => {
    if (!responseData) return null;

    let filteredResponse = {};
    if (selectedFilters.some((filter) => filter.value === 'alphabets')) {
      filteredResponse.alphabets = responseData.alphabets || [];
    }
    if (selectedFilters.some((filter) => filter.value === 'numbers')) {
      filteredResponse.numbers = responseData.numbers || [];
    }
    if (selectedFilters.some((filter) => filter.value === 'highest_lowercase_alphabet')) {
      filteredResponse.highest_lowercase_alphabet = responseData.highest_lowercase_alphabet || [];
    }

    return (
      <div>
        <h3>Filtered Response</h3>
        {Object.keys(filteredResponse).map((key) => (
          <p key={key}>
            {key.charAt(0).toUpperCase() + key.slice(1)}: {filteredResponse[key].join(', ')}
          </p>
        ))}
      </div>
    );
  };

  useEffect(() => {
    document.title = '21BCE3094'; // Replace with your actual roll number
  }, []);

  return (
    <div>
      <h1>21BCE3094</h1>

      {/* API Input Section */}
      <div>
        <h2>API Input</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='Enter JSON, e.g. {"data": ["M", "1", "334", "4", "B"]}'
          />
          <button type="submit">Submit</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>

      {/* Multi-Filter Section */}
      <div>
        <h2>Multi Filter</h2>
        <Select
          options={filterOptions}
          isMulti
          onChange={setSelectedFilters}
          placeholder="Select filters..."
        />
        {renderResponse()}
      </div>
    </div>
  );
}

export default App;
