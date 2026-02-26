import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/common/Footer";

function Home() {
  return (
    <div className="bg-dark text-white min-vh-100 d-flex flex-column">
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
        <h1 className="mb-3 text-white">
          Build Stronger Customer Relationships with ClientConnect
        </h1>

        <p className="text-white-50 mb-5">
          ClientConnect is a modern CRM platform to manage leads, customers,
          tasks, and growth — all in one place.
        </p>

        <section className="mb-5">
          <h4 className="text-white">Who We Are</h4>
          <p className="text-white-50">
            ClientConnect helps businesses manage leads, follow-ups,
            and customer data without chaos.
          </p>
        </section>

        <section className="mb-5">
          <h4 className="text-white">What ClientConnect Helps You Do</h4>
          <ul className="text-white-50">
            <li>Capture and convert leads</li>
            <li>Organize customer data</li>
            <li>Track tasks and deadlines</li>
            <li>Improve productivity</li>
          </ul>
        </section>

      </main>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}

export default Home;
