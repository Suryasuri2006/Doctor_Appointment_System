import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doctorAPI } from '../services/api';

const Home = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await doctorAPI.getAll();
        setDoctors(response.data.slice(0, 6)); // Get first 6 doctors
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="hero-shape shape-1"></div>
          <div className="hero-shape shape-2"></div>
          <div className="hero-shape shape-3"></div>
        </div>
        <div className="container hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Your Health, <span className="text-primary">Our Priority</span>
            </h1>
            <p className="hero-subtitle">
              Book appointments with top-rated doctors instantly. 
              Quality healthcare just a click away.
            </p>
            <div className="hero-buttons">
              <Link to="/doctors" className="btn btn-primary btn-lg">
                Find a Doctor
              </Link>
              <Link to="/register" className="btn btn-secondary btn-lg">
                Get Started
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-card">
              <div className="hero-card-icon">🏥</div>
              <div className="hero-card-text">
                <span className="hero-card-number">500+</span>
                <span className="hero-card-label">Verified Doctors</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Doctors</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Patients</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50K+</span>
              <span className="stat-label">Appointments</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">4.9</span>
              <span className="stat-label">Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works section">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-icon">🔍</div>
              <h3 className="step-title">Search Doctor</h3>
              <p className="step-description">
                Browse through our verified doctors by specialty, location, or availability.
              </p>
            </div>
            <div className="step-card">
              <div className="step-icon">📅</div>
              <h3 className="step-title">Book Appointment</h3>
              <p className="step-description">
                Choose a convenient time slot and book your appointment instantly.
              </p>
            </div>
            <div className="step-card">
              <div className="step-icon">💊</div>
              <h3 className="step-title">Get Treated</h3>
              <p className="step-description">
                Visit the doctor at the scheduled time and get quality healthcare.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Doctors */}
      <section className="featured-doctors section">
        <div className="container">
          <h2 className="section-title">Our Featured Doctors</h2>
          <p className="section-subtitle">
            Meet some of our top-rated medical professionals
          </p>
          
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="doctors-grid">
              {doctors.map((doctor) => (
                <div key={doctor._id} className="doctor-card">
                  <div className="doctor-image">
                    <img src={doctor.image} alt={doctor.name} />
                    <span className="doctor-rating">★ {doctor.rating}</span>
                  </div>
                  <div className="doctor-info">
                    <h3 className="doctor-name">{doctor.name}</h3>
                    <p className="doctor-specialty">{doctor.specialty}</p>
                    <p className="doctor-experience">{doctor.experience} years experience</p>
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
          
          <div className="section-cta">
            <Link to="/doctors" className="btn btn-secondary">
              View All Doctors
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Book Your Appointment?</h2>
            <p className="cta-text">
              Join thousands of patients who trust MedBook for their healthcare needs.
            </p>
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started Today
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
