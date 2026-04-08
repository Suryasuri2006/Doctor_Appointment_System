import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doctorAPI, appointmentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const DoctorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await doctorAPI.getById(id);
        setDoctor(response.data);
      } catch (error) {
        console.error('Error fetching doctor:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  useEffect(() => {
    if (doctor && selectedDate) {
      const day = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' });
      const daySlots = doctor.slots.find(s => s.day === day);
      setAvailableSlots(daySlots ? daySlots.times : []);
      setSelectedTime('');
    }
  }, [selectedDate, doctor]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setBooking(true);
    setError('');

    try {
      await appointmentAPI.create({
        doctorId: id,
        date: selectedDate,
        time: selectedTime,
        reason
      });
      setSuccess('Appointment booked successfully!');
      setTimeout(() => {
        navigate('/appointments');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment');
    } finally {
      setBooking(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="container">
        <div className="empty-state">
          <h3>Doctor not found</h3>
          <Link to="/doctors" className="btn btn-primary">Back to Doctors</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="doctor-detail-page">
      <div className="container">
        {/* Doctor Profile Header */}
        <div className="doctor-profile-header">
          <div className="doctor-profile-image">
            <img src={doctor.image} alt={doctor.name} />
          </div>
          <div className="doctor-profile-info">
            <h1 className="doctor-profile-name">{doctor.name}</h1>
            <p className="doctor-profile-specialty">{doctor.specialty}</p>
            <div className="doctor-profile-meta">
              <span className="meta-item">
                <span className="meta-icon">⭐</span>
                {doctor.rating} Rating
              </span>
              <span className="meta-item">
                <span className="meta-icon">💼</span>
                {doctor.experience} years experience
              </span>
              <span className="meta-item">
                <span className="meta-icon">📍</span>
                {doctor.location}
              </span>
            </div>
            <p className="doctor-profile-fee">
              Consultation Fee: <span className="fee-amount">₹{doctor.consultationFee}</span>
            </p>
          </div>
        </div>

        <div className="doctor-detail-content">
          {/* About Section */}
          <div className="doctor-about-section">
            <h2 className="section-heading">About</h2>
            <p className="doctor-bio">{doctor.bio}</p>

            <h2 className="section-heading">Available Days</h2>
            <div className="available-days">
              {doctor.availableDays.map((day) => (
                <span key={day} className="day-badge">{day}</span>
              ))}
            </div>
          </div>

          {/* Booking Section */}
          <div className="booking-section">
            <div className="booking-card">
              <h2 className="booking-title">Book an Appointment</h2>
              
              {success ? (
                <div className="success-message">
                  <span className="success-icon">✓</span>
                  <p>{success}</p>
                </div>
              ) : (
                <form onSubmit={handleBooking} className="booking-form">
                  {error && <div className="form-error mb-2">{error}</div>}
                  
                  <div className="form-group">
                    <label className="form-label">Select Date</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={getMinDate()}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Select Time</label>
                    {availableSlots.length > 0 ? (
                      <div className="time-slots">
                        {availableSlots.map((time) => (
                          <button
                            key={time}
                            type="button"
                            className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                            onClick={() => setSelectedTime(time)}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    ) : selectedDate ? (
                      <p className="text-secondary">No slots available for this date</p>
                    ) : (
                      <p className="text-secondary">Please select a date first</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Reason for Visit</label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Describe your symptoms or reason for visit..."
                      className="form-input"
                      rows="3"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    disabled={booking || !selectedDate || !selectedTime}
                  >
                    {booking ? 'Booking...' : 'Book Appointment'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetail;
