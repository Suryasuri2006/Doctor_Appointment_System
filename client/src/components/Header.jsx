import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notificationAPI } from '../services/api';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await notificationAPI.getAll();
      setNotifications(response.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationAPI.getUnreadCount();
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'appointment_booked': return '✅';
      case 'appointment_cancelled': return '❌';
      case 'appointment_rescheduled': return '📅';
      case 'appointment_reminder': return '⏰';
      default: return '🔔';
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <span className="logo-icon">🏥</span>
          <span className="logo-text">MedBook</span>
        </Link>

        <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          <span className={`hamburger ${menuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        <nav className={`header-nav ${menuOpen ? 'open' : ''}`}>
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/doctors" 
            className={`nav-link ${isActive('/doctors') ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            Doctors
          </Link>
          {user && (
            <Link 
              to="/appointments" 
              className={`nav-link ${isActive('/appointments') ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              My Appointments
            </Link>
          )}
        </nav>

        <div className={`header-auth ${menuOpen ? 'open' : ''}`}>
          {user ? (
            <div className="user-menu-container">
              {/* Notification Bell */}
              <div className="notification-container" ref={notificationRef}>
                <button 
                  className="notification-bell"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  🔔
                  {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="notification-dropdown">
                    <div className="notification-header">
                      <h3>Notifications</h3>
                      {unreadCount > 0 && (
                        <button 
                          className="mark-all-read"
                          onClick={handleMarkAllAsRead}
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="notification-list">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div 
                            key={notification._id} 
                            className={`notification-item ${!notification.read ? 'unread' : ''}`}
                            onClick={() => handleMarkAsRead(notification._id)}
                          >
                            <span className="notification-icon">
                              {getNotificationIcon(notification.type)}
                            </span>
                            <div className="notification-content">
                              <p className="notification-title">{notification.title}</p>
                              <p className="notification-message">{notification.message}</p>
                              <span className="notification-time">
                                {new Date(notification.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="no-notifications">
                          <p>No notifications yet</p>
                        </div>
                      )}
                    </div>
                    <Link 
                      to="/appointments" 
                      className="view-all-notifications"
                      onClick={() => setShowNotifications(false)}
                    >
                      View All Appointments
                    </Link>
                  </div>
                )}
              </div>

              <div className="user-menu">
                <div className="user-info">
                  <span className="user-avatar">{user.name.charAt(0)}</span>
                  <span className="user-name">{user.name}</span>
                </div>
                <button onClick={handleLogout} className="btn btn-ghost">
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary" onClick={() => setMenuOpen(false)}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
