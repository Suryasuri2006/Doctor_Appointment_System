import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { appointmentAPI } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await appointmentAPI.getAll();
        // Get only upcoming appointments
        const upcoming = response.data
          .filter(apt => new Date(apt.date) >= new Date() && apt.status !== 'cancelled')
          .slice(0, 3);
        setAppointments(upcoming);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  return (
    <div className="dashboard-page">
      <div className="container">
        {/* Welcome Section */}
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1 className="welcome-title">
              Welcome back, <span className="text-primary">{user?.name}</span>!
            </h1>
            <p className="welcome-subtitle">
              Here's an overview of your healthcare journey
            </p>
          </div>
          <Link to="/doctors" className="btn btn-primary">
            Book New Appointment
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-card-icon">📅</div>
            <div className="stat-card-content">
              <span className="stat-card-value">{appointments.length}</span>
              <span className="stat-card-label">Upcoming Appointments</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon">✅</div>
            <div className="stat-card-content">
              <span className="stat-card-value">0</span>
              <span className="stat-card-label">Completed Visits</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon">🏥</div>
            <div className="stat-card-content">
              <span className="stat-card-value">0</span>
              <span className="stat-card-label">Total Doctors</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2 className="section-heading">Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/doctors" className="action-card">
              <div className="action-icon">🔍</div>
              <span className="action-label">Find a Doctor</span>
            </Link>
            <Link to="/appointments" className="action-card">
              <div className="action-icon">📋</div>
              <span className="action-label">View All Appointments</span>
            </Link>
            <Link to="/doctors" className="action-card">
              <div className="action-icon">📅</div>
              <span className="action-label">Book Appointment</span>
            </Link>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="upcoming-appointments">
          <div className="section-header">
            <h2 className="section-heading">Upcoming Appointments</h2>
            <Link to="/appointments" className="view-all-link">View All</Link>
          </div>
          
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
            </div>
          ) : appointments.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📅</div>
              <h3 className="empty-state-title">No upcoming appointments</h3>
              <p className="empty-state-text">Book your first appointment today!</p>
              <Link to="/doctors" className="btn btn-primary mt-2">
                Find a Doctor
              </Link>
            </div>
          ) : (
            <div className="appointments-list">
              {appointments.map((appointment) => (
                <div key={appointment._id} className="appointment-item">
                  <div className="appointment-doctor">
                    <img 
                      src={appointment.doctor?.image} 
                      alt={appointment.doctor?.name}
                      className="appointment-doctor-image"
                    />
                    <div className="appointment-doctor-info">
                      <h4 className="appointment-doctor-name">
                        {appointment.doctor?.name}
                      </h4>
                      <p className="appointment-doctor-specialty">
                        {appointment.doctor?.specialty}
                      </p>
                    </div>
                  </div>
                  <div className="appointment-details">
                    <div className="appointment-date">
                      <span className="detail-icon">📅</span>
                      {new Date(appointment.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="appointment-time">
                      <span className="detail-icon">⏰</span>
                      {appointment.time}
                    </div>
                  </div>
                  <div className="appointment-status">
                    <span className={`badge badge-${appointment.status}`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
