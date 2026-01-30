import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="bg-dark text-white min-vh-100">
      <header className="border-bottom border-success">
        <div className="container d-flex justify-content-between align-items-center py-3">
          <div className="d-flex align-items-center gap-2">
            <span
              className="rounded-circle bg-success"
              style={{ width: "12px", height: "12px" }}
            ></span>
            <h4 className="mb-0">ClientConnect</h4>
          </div>

          <Link to="/login" className="btn btn-success rounded-pill px-4">
            Login
          </Link>
        </div>
      </header>

      <main className="container py-5">
        <h1 className="mb-3">
          Build Stronger Customer Relationships with ClientConnect
        </h1>

        <p className="text-secondary mb-5">
          ClientConnect is a modern CRM platform to manage leads, customers,
          tasks, and growth — all in one place.
        </p>

        <section className="mb-5">
          <h4>Who We Are</h4>
          <p className="text-secondary">
            ClientConnect helps businesses manage leads, follow-ups,
            and customer data without chaos.
          </p>
        </section>

        <section className="mb-5">
          <h4>What ClientConnect Helps You Do</h4>
          <ul className="text-secondary">
            <li>Capture and convert leads</li>
            <li>Organize customer data</li>
            <li>Track tasks and deadlines</li>
            <li>Improve productivity</li>
          </ul>
        </section>

        <section className="bg-success bg-opacity-10 p-4 rounded text-center">
          <h4>Get Started with ClientConnect</h4>
          <p className="text-secondary">
            Join businesses already boosting productivity.
          </p>
          <Link to="/signup" className="btn btn-success rounded-pill px-4">
            Create Your Account
          </Link>
        </section>
      </main>
    </div>
  );
}

export default Home;
