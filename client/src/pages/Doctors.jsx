import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doctorAPI } from '../services/api';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [specialties, setSpecialties] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const params = {};
        if (specialty) params.specialty = specialty;
        const response = await doctorAPI.getAll(params);
        setDoctors(response.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [specialty]);

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const response = await doctorAPI.getSpecialties();
        setSpecialties(response.data);
      } catch (error) {
        console.error('Error fetching specialties:', error);
      }
    };
    fetchSpecialties();
  }, []);

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="doctors-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Find a Doctor</h1>
          <p className="page-subtitle">Browse our network of qualified medical professionals</p>
        </div>

        {/* Search and Filter */}
        <div className="filters-section">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input search-input"
            />
          </div>
          <div className="filter-box">
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="form-input"
            >
              <option value="">All Specialties</option>
              {specialties.map((spec) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="results-info">
          <p>Showing {filteredDoctors.length} doctors</p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3 className="empty-state-title">No doctors found</h3>
            <p className="empty-state-text">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          /* Doctors Grid */
          <div className="doctors-grid">
            {filteredDoctors.map((doctor) => (
              <div key={doctor._id} className="doctor-card">
                <div className="doctor-image">
                  <img src={doctor.image} alt={doctor.name} />
                  <span className="doctor-rating">★ {doctor.rating}</span>
                </div>
                <div className="doctor-info">
                  <h3 className="doctor-name">{doctor.name}</h3>
                  <p className="doctor-specialty">{doctor.specialty}</p>
                  <p className="doctor-experience">{doctor.experience} years experience</p>
                  <p className="doctor-location">{doctor.location}</p>
                  <div className="doctor-footer">
                    <span className="doctor-fee">₹{doctor.consultationFee}</span>
                    <Link to={`/doctors/${doctor._id}`} className="btn btn-sm btn-primary">
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors;
