import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import heroImage from '../assets/Hero-Image.png';
import createAccountIcon from '../assets/how-create-account.svg';
import applyIcon from '../assets/how-apply.svg';
import getMoneyIcon from '../assets/how-get-money.svg';
import shapeSpark from '../assets/shape-spark.png';
import feedbackArt from '../assets/feedback-art.png';
import footerMoneyLogo from '../assets/footer-money-logo.png';

const Hero = () => (
  <section className="hero-section">
    <div className="hero-shell">
      <div className="hero-copy">
        <div className="hero-badge">Chamba Loan App</div>

        <h1>
          Fast & Smart
          <span>Loan Decisions</span>
        </h1>

        <p className="hero-subtitle">
          Apply for loans online and receive fast eligibility checks through secure salary and credit
          verification.
        </p>

        <form className="hero-subscribe" onSubmit={(event) => event.preventDefault()}>
          <input type="email" placeholder="Enter Your Email" aria-label="Email address" />
          <button type="submit">Subscribe</button>
        </form>

        <p className="hero-serving">
          Serving <strong>100k+</strong> clients with excellence
        </p>

        <div className="hero-actions">
          <Link to="/register" className="primary-pill">Get Started</Link>
          <button type="button" className="video-pill" aria-label="Watch video">
            <span className="play-icon" />
            Watch Video
          </button>
        </div>
      </div>

      <div className="hero-art" aria-label="Loan customer preview">
        <div className="hero-photo-frame">
          <img src={heroImage} alt="Loan applicant with customer avatars" />
        </div>

        <div className="balance-card">
          <div className="balance-meta">
            <span>Available Balance</span>
            <span>Credit card</span>
          </div>
          <strong>MK 90,507,530</strong>
          <span className="card-label">Card Number</span>
          <div className="card-bottom">
            <span>* * * * * 6428</span>
            <span className="mastercard-mark">
              <i />
              <i />
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const HowItWorks = () => {
  const steps = [
    {
      icon: applyIcon,
      title: 'Create Account',
      description: 'Enter loan amount and repayment period.',
    },
    {
      icon: getMoneyIcon,
      title: 'Apply',
      description: 'We verify salary and credit information securely.',
    },
    {
      icon: createAccountIcon,
      title: 'Get Money',
      description: 'Receive instant eligibility feedback and next steps.',
    },
  ];

  return (
    <section id="how-it-works" className="how-section">
      <h2>How it Works</h2>
      <div className="how-grid">
        {steps.map((step) => (
          <article key={step.title} className="how-card">
            <div className="how-icon">
              <img src={step.icon} alt="" aria-hidden="true" />
            </div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

const Calculator = () => {
  const [amount, setAmount] = useState(100000);
  const [term, setTerm] = useState(8);
  const interestRate = 5;
  const totalInterest = amount * 0.22039 * (term / 8);
  const totalPayment = amount + totalInterest;
  const formatMoney = (value) =>
    new Intl.NumberFormat('en-MW', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  return (
    <section id="calculator" className="calculator-section">
      <div className="section-shell calculator-shell">
        <h2>Calculate your Take</h2>
        <div className="calculator-grid">
          <div className="calculator-controls">
            <label className="calculator-field">
              <span>
                <i className="field-icon">%</i>
                Loan Amount
              </span>
              <strong>MK</strong>
              <input
                type="number"
                min="20000"
                max="10000000"
                step="10000"
                value={amount}
                onChange={(event) => setAmount(Number(event.target.value))}
              />
              <small>Min: 20000 - Max: 10,000,000</small>
            </label>

            <div className="calculator-row">
              <span>
                <i className="field-icon">I</i>
                Interest
              </span>
              <strong>{interestRate}%</strong>
            </div>

            <div className="calculator-row">
              <span>
                <i className="field-icon">T</i>
                Loan Term
              </span>
              <strong className="term-pill">Monthly</strong>
            </div>

            <div className="term-slider">
              <input
                type="range"
                min="3"
                max="18"
                value={term}
                onChange={(event) => setTerm(Number(event.target.value))}
              />
              <span style={{ left: `${((term - 3) / 15) * 100}%` }}>{term}</span>
            </div>

            <button type="button" className="calculate-button">Calculate Payment</button>
          </div>

          <aside className="calculator-summary">
            <span>Initial Amount</span>
            <strong>MK{formatMoney(amount)}</strong>
            <dl>
              <div>
                <dt>Interest Rate</dt>
                <dd>{interestRate}%</dd>
              </div>
              <div>
                <dt>Rate Accounting</dt>
                <dd>Monthly</dd>
              </div>
              <div>
                <dt>Period</dt>
                <dd>{term} Months</dd>
              </div>
              <div>
                <dt>Total Repayment</dt>
                <dd>MWK{formatMoney(totalPayment)}</dd>
              </div>
              <div>
                <dt>Total Interest</dt>
                <dd>MWK {formatMoney(totalInterest)}</dd>
              </div>
            </dl>
            <Link to="/register">Apply Now</Link>
          </aside>
        </div>
      </div>
    </section>
  );
};

const Stats = () => {
  const stats = [
    {
      value: '9.5/10',
      label: 'Rating',
      desc: 'We strive in efficiency and effectiveness ensuring seamless and enjoyable service.',
    },
    {
      value: '0.6m',
      label: 'Clients',
      desc: 'Our company has over 1.8 million clients, showcasing exceptional trust and service.',
    },
    {
      value: '4k',
      label: 'Expert Members',
      desc: 'Our company boasts over 13,000 expert members, ensuring top-tier knowledge and service.',
    },
  ];

  return (
    <section id="about" className="about-section">
      <div className="section-shell">
        <div className="about-card">
          <div className="about-header">
            <h2>
              Always Protecting
              <span>Life, Business.</span>
            </h2>
            <div>
              <p>We help individuals access fair and transparent digital loan services.</p>
              <Link to="/register">About Us</Link>
            </div>
          </div>

          <div className="about-stats">
            {stats.map((stat) => (
              <article key={stat.label}>
                <p>{stat.label}</p>
                <strong>{stat.value}</strong>
                <span>{stat.desc}</span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const faqs = [
    {
      question: 'What payment options are available?',
      answer: 'We offer various payment methods like credit cards and Paychangu, prioritizing secure transactions for your information.',
    },
    {
      question: 'Do you offer Refunds',
      answer: 'Refunds are handled case by case. Please contact support for help with a specific payment.',
    },
    {
      question: 'Is this secure for residential use',
      answer: 'Yes. We use secure API requests and authenticated account access to protect your information.',
    },
    {
      question: 'How long does it take to process?',
      answer: 'The app is designed to provide quick eligibility feedback after your application details are submitted.',
    },
  ];

  return (
    <section className="faq-section">
      <div className="section-shell faq-shell">
        <h2>
          Frequently
          <span>Asked Questions</span>
        </h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <article key={faq.question} className={openIndex === index ? 'faq-item open' : 'faq-item'}>
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                type="button"
              >
                <span>{faq.question}</span>
                <i>{openIndex === index ? '-' : '+'}</i>
              </button>
              {openIndex === index && (
                <p>{faq.answer}</p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTA = () => (
  <section className="account-cta">
    <img className="cta-spark cta-spark-left" src={shapeSpark} alt="" aria-hidden="true" />
    <div className="section-shell">
      <h2>
        Create Account Now &
        <span>Get a loan Today!</span>
      </h2>
      <Link to="/register">Create Account</Link>
    </div>
    <img className="cta-spark cta-spark-right" src={shapeSpark} alt="" aria-hidden="true" />
  </section>
);

const Feedback = () => (
  <section className="feedback-section">
    <div className="section-shell feedback-shell">
      <div className="feedback-copy">
        <h2>Feedback</h2>
        <article className="testimonial-card">
          <span className="quote-mark">"</span>
          <p>
            Ehh ndi ngini yoti ndiya fast, Komaso ma interest ake ndi a fair
            breddah...
          </p>
          <strong>Russell Mpaka, Mzuzu</strong>
          <div className="testimonial-rating">
            <span>* * * * *</span>
            <small>5.0 (77k reviews)</small>
          </div>
          <button type="button" aria-label="Next feedback">
            <span />
          </button>
        </article>
      </div>

      <div className="feedback-art-wrap">
        <img src={feedbackArt} alt="Customer feedback rating illustration" />
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="footer-section">
    <div className="section-shell footer-shell">
      <div className="footer-main">
        <div className="footer-brand">
          <img src={footerMoneyLogo} alt="Chamba logo" />
          <p>
            Choose us for reliable, detail-oriented loan services that meet your financial needs.
          </p>
          <nav>
            <a href="#how-it-works">How it Works</a>
            <a href="#calculator">Calculator</a>
            <a href="#about">About</a>
          </nav>
        </div>

        <div className="footer-newsletter">
          <h3>Newsletter</h3>
          <form onSubmit={(event) => event.preventDefault()}>
            <input type="email" placeholder="Enter Your Email" aria-label="Newsletter email" />
            <button type="submit">Subscribe</button>
          </form>
          <div className="footer-socials" aria-label="Social links">
            <a href="#" aria-label="Instagram" />
            <a href="#" aria-label="Facebook" />
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>Powered by Jester Chamba</p>
        <div>
          <a href="#">Terms and Conditions</a>
          <a href="#">Privacy Policy</a>
        </div>
      </div>
    </div>
  </footer>
);

const LandingPage = () => (
  <main className="landing-page">
    <Navbar />
    <Hero />
    <HowItWorks />
    <Calculator />
    <Stats />
    <FAQ />
    <CTA />
    <Feedback />
    <Footer />
  </main>
);

export default LandingPage;
