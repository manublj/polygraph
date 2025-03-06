import React from 'react';
import { Container } from 'react-bootstrap';

const TimelinesPage = () => {
  return (
    <Container fluid className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Timelines</h2>
      </div>
      <div style={{ height: "calc(100vh - 120px)" }}>
        <iframe 
          src="https://time.graphics/embed"  // Replace with your time.graphics timeline URL
          frameBorder="0"
          width="100%"
          height="100%"
          allowFullScreen
        />
      </div>
    </Container>
  );
};

export default TimelinesPage;
