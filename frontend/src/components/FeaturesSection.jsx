import React from 'react';
import '../styles/FeaturesSection.css'; // Import the custom CSS file

const FeaturesSection = () => {
  const features = [
    {
      icon: '📋', // Icon for "Manage Patient Diet Charts"
      title: 'Manage Patient Diet Charts',
      description: 'Create and update detailed diet plans tailored to patient needs.',
    },
    {
      icon: '🍴', // Icon for "Oversee Pantry Operations"
      title: 'Oversee Pantry Operations',
      description: 'Streamline food preparation and assign tasks efficiently.',
    },
    {
      icon: '🚚', // Icon for "Track Deliveries in Real-Time"
      title: 'Track Deliveries in Real-Time',
      description: 'Monitor meal delivery statuses with up-to-date tracking.',
    },
    {
      icon: '🔔', // Icon for "Real-Time Notifications" (optional)
      title: 'Real-Time Notifications',
      description: 'Stay updated with instant alerts for meal preparation and delivery.',
    },
  ];

  return (
    <section className="features-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Section Title */}
        <h2 className="features-title">
          Key Features
        </h2>
        {/* Features Grid */}
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              {/* Icon */}
              <div className="feature-icon">{feature.icon}</div>
              {/* Title */}
              <h3 className="feature-title">{feature.title}</h3>
              {/* Description */}
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
