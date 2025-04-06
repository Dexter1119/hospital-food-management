import React from 'react';

const HeroSection = () => {
  return (
    <section
      style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '90vh',
        color: 'white',
        overflow: 'hidden',
        backgroundImage: 'url("/backgound.jpg")',  // Inline background image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.4)' }}></div> */}

      <div style={{ position: 'relative', textAlign: 'center', zIndex: 2 }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '1rem' }}>
          Streamline Hospital Food Management with Ease
        </h1>
        <p style={{ fontSize: '1.25rem', marginBottom: '2rem', opacity: 0.8 }}>
          Efficiently manage patient diets, pantry operations, and meal deliveries.
        </p>
        <a href="#login" style={{
          display: 'inline-block', padding: '15px 30px', backgroundColor: '#1e40af', color: 'white',
          fontWeight: '600', borderRadius: '50px', textDecoration: 'none', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
        }}>
          Get Started
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
