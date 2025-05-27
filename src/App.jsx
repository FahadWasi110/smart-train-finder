import { useState } from 'react';
import './App.css';
import { mockResults } from './mockResults';

function App() {
  const [tripType, setTripType] = useState('oneway');
  const [departureDate, setDepartureDate] = useState('');
  const [overnightStays, setOvernightStays] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);
  const [sortOption, setSortOption] = useState('');

  const handleSearch = () => {
    let results = [...mockResults];
    if (sortOption === 'fastest') {
      results.sort((a, b) => parseDuration(a.duration) - parseDuration(b.duration));
    } else if (sortOption === 'cheapest') {
      results.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    } else if (sortOption === 'leastChanges') {
      results.sort((a, b) => a.changes - b.changes);
    }
    setFilteredResults(results);
    setShowResults(true);
  };

  const parseDuration = (duration) => {
    const [h, m] = duration.split('h').map(s => s.trim().replace('m', ''));
    return parseInt(h) * 60 + parseInt(m);
  };

  const parsePrice = (price) => {
    return parseFloat(price.replace('€', ''));
  };

  const getReturnDate = () => {
    if (!departureDate || !overnightStays) return null;
    const date = new Date(departureDate);
    date.setDate(date.getDate() + parseInt(overnightStays));
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="App">
      <h1>🚄 Smart Train Finder</h1>
      <div className="form-group">
        <label>
          Trip Type:
          <select onChange={(e) => setTripType(e.target.value)} value={tripType}>
            <option value="oneway">One-way</option>
            <option value="roundtrip">Roundtrip</option>
          </select>
        </label>
      </div>
      <div className="form-group">
        <label>
          Departure Date:
          <input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} />
        </label>
      </div>
      {tripType === 'roundtrip' && (
        <div className="form-group">
          <label>
            Nights in Amsterdam:
            <input type="number" value={overnightStays} onChange={(e) => setOvernightStays(e.target.value)} />
          </label>
        </div>
      )}
      <div className="form-group">
        <label>Filter:</label>
        <select onChange={(e) => setSortOption(e.target.value)} value={sortOption}>
          <option value="">-- None --</option>
          <option value="fastest">Fastest</option>
          <option value="cheapest">Cheapest</option>
          <option value="leastChanges">Least Changes</option>
        </select>
      </div>
      <button onClick={handleSearch}>Search</button>
      {showResults && (
        <>
          <h2>Outbound Trip: {departureDate}</h2>
          <TrainTable results={filteredResults} prefix="outbound" />
          {tripType === 'roundtrip' && (
            <>
              <h2>Return Trip: {getReturnDate()}</h2>
              <TrainTable results={filteredResults} prefix="return" />
            </>
          )}
        </>
      )}
    </div>
  );
}

function TrainTable({ results, prefix }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Option</th>
          <th>Duration</th>
          <th>Price</th>
          <th>Changes</th>
          <th>Departure</th>
          <th>Arrival</th>
          <th>Train Type</th>
        </tr>
      </thead>
      <tbody>
        {results.map((res) => (
          <tr key={`${prefix}-${res.option}`}>
            <td>{res.option}</td>
            <td>{res.duration}</td>
            <td>{res.price}</td>
            <td>{res.changes}</td>
            <td>{res.departure}</td>
            <td>{res.arrival}</td>
            <td>{res.type}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default App;
