import React from 'react';
import { Link } from "react-router-dom";
import '../styles/aboutuscss.css';

export default function ABOUTUS() {
  return (
    <div className="about-wrapper">
      {/* 1. Breadcrumb Navigation */}
      <nav className="about-breadcrumb">
        <Link to="/">Home</Link> / <span>About us</span>
      </nav>

      <div className="about-container">
        
        {/* 2. Hero Section */}
        <section className="about-hero">
          <div className="hero-img-container">
            {/* Replace with your local path or URL */}
            <img src="https://via.placeholder.com/300x300?text=Pill+Icon" alt="Truemeds Icon" className="pill-icon" />
          </div>
          <div className="hero-content">
            <h1>Truemeds, an e-pharmacy and telehealth platform, focuses on providing <span className="highlight-blue">affordable substitute medicines</span></h1>
            <p>
              We focus on making essential medicines affordable and accessible through our proprietary algorithm & pan India reach, 
              reducing monthly medical bills for chronic patients by up to 51%. These affordable alternatives are sourced from 
              top 1% pharmaceutical manufacturers in the country.
            </p>
            <p>
              Our platform also addresses patients' concerns around information about affordable medicines, the quality, and 
              accessibility of these medicines, and empowers patients to make informed decisions before transitioning to 
              such affordable 'substitute' medicines.
            </p>
          </div>
        </section>

        {/* 3. Vision Section */}
        <section className="about-vision">
          <div className="vision-text">
            <span className="label-grey">OUR VISION</span>
            <h2>The vision is to make <strong>healthcare affordable and accessible to all</strong></h2>
            <p>
              We are a technology driven, tele-health platform that aims to reduce healthcare expenses and 
              improve healthcare outcomes by democratising medicine purchase in India.
            </p>
          </div>
          <div className="vision-img-container">
            <img src="https://via.placeholder.com/400x300?text=Healthcare+Vision" alt="Healthcare kit" />
          </div>
        </section>

        {/* 4. Statistics Grid */}
        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-card"><h3>70 lakh+</h3><p>mobile app installs</p></div>
            <div className="stat-card"><h3>10 lakh+</h3><p>unique users</p></div>
            <div className="stat-card"><h3>150Cr+</h3><p>savings</p></div>
            <div className="stat-card"><h3>1.8L+</h3><p>products</p></div>
            <div className="stat-card"><h3>30 lakh+</h3><p>doctor consultations</p></div>
            <div className="stat-card"><h3>600+</h3><p>doctors</p></div>
            <div className="stat-card"><h3>100+</h3><p>pharmacists</p></div>
            <div className="stat-card"><h3>20K+</h3><p>pincodes</p></div>
          </div>
        </section>

        {/* 5. Founders Section */}
        <section className="founders-section">
          <span className="label-grey">FOUNDERS</span>
          <div className="founders-layout">
            <div className="founder-image-box">
              <img src="https://via.placeholder.com/400x300?text=Founders" alt="Founders" />
              <div className="founder-name">Akshat Nayyar & Kunal Wani</div>
            </div>
            <div className="founder-quote">
              <blockquote>
                India has over 25 crores chronic patients who require monthly medication. With soaring medical costs 
                pushing many into poverty, it's crucial to offer accessible solutions.
              </blockquote>
              <p>Truemeds bridges affordability and accessibility, making healthcare a right for every Indian.</p>
            </div>
          </div>
        </section>

        {/* 6. Life at Truemeds */}
        <section className="culture-section">
          <div className="culture-layout">
            <div className="culture-text">
              <span className="label-grey">LIFE AT TRUEMEDS</span>
              <p>
                We're a tight-knit team of process-oriented & agile professionals dedicated to 'Thinking Big'. 
                Our corporate culture values pragmatism, integrity, flexibility, efficiency, innovation & collaboration 
                ensuring every task is done Right-First-Time. Led by dynamic leaders who champion "intrapreneurship," 
                we prioritize quick decision-making that is a well-brewed combination of data, experience, and 
                high-impact deliverables.
              </p>
            </div>
            <div className="culture-gallery">
              <img src="https://via.placeholder.com/500x300?text=Team+Group" alt="Team" className="main-team-img" />
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}