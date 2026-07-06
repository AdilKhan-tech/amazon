"use client";

import Link from "next/link";

export default function GiftCardsPage() {
  const giftCards = [
    {
      id: 1,
      title: "SohailVerse Gift Card",
      description: "The perfect gift for any occasion",
      amounts: [25, 50, 100, 200],
      image: "https://images.unsplash.com/photo-1549465220-1a8b9238f760?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      title: "Birthday Gift Card",
      description: "Make their birthday special",
      amounts: [25, 50, 100],
      image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      title: "Holiday Gift Card",
      description: "Spread holiday cheer",
      amounts: [50, 100, 200],
      image: "https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=400&h=300&fit=crop",
    },
    {
      id: 4,
      title: "Thank You Gift Card",
      description: "Show your appreciation",
      amounts: [25, 50, 100],
      image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=400&h=300&fit=crop",
    },
  ];

  return (
    <div className="gift-cards-page">
      <div className="container">
        {/* Header */}
        <div className="gift-header">
          <div className="gift-icon-wrapper">
            <i className="bi bi-gift-fill"></i>
          </div>
          <h1>Gift Cards</h1>
          <p>The perfect gift for every occasion</p>
        </div>

        {/* Features */}
        <div className="gift-features">
          <div className="gift-feature">
            <i className="bi bi-envelope-paper"></i>
            <div>
              <strong>Email Delivery</strong>
              <small>Instant delivery to inbox</small>
            </div>
          </div>
          <div className="gift-feature">
            <i className="bi bi-calendar-event"></i>
            <div>
              <strong>Schedule Send</strong>
              <small>Choose delivery date</small>
            </div>
          </div>
          <div className="gift-feature">
            <i className="bi bi-shield-check"></i>
            <div>
              <strong>Secure</strong>
              <small>Safe & encrypted</small>
            </div>
          </div>
        </div>

        {/* Gift Cards Grid */}
        <div className="gift-grid">
          {giftCards.map((card) => (
            <div key={card.id} className="gift-card-item">
              <div className="gift-card-image">
                <img src={card.image} alt={card.title} />
                <div className="gift-overlay">
                  <i className="bi bi-gift"></i>
                </div>
              </div>
              <div className="gift-card-info">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                <div className="gift-amounts">
                  {card.amounts.map((amount) => (
                    <span key={amount} className="amount-btn">${amount}</span>
                  ))}
                </div>
                <button className="gift-buy-btn">
                  <i className="bi bi-cart-plus"></i> Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Amount */}
        <div className="custom-amount-section">
          <h2>Custom Amount</h2>
          <p>Choose your own amount between $10 - $500</p>
          <div className="custom-amount-form">
            <div className="amount-input-wrapper">
              <span className="dollar-sign">$</span>
              <input type="number" className="amount-input" placeholder="Enter amount" min="10" max="500" />
            </div>
            <button className="custom-buy-btn">
              <i className="bi bi-gift"></i> Purchase Gift Card
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
