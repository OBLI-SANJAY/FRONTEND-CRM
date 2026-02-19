import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

function Layout() {
    const [showSidebar, setShowSidebar] = useState(false);

    const toggleSidebar = () => setShowSidebar(!showSidebar);

    return (
        <div className="d-flex w-100 vh-100 overflow-hidden bg-main">
            <div className="d-none d-md-block" style={{ width: "280px" }}>
                <Sidebar />
            </div>

            {showSidebar && (
                <div
                    className="position-fixed top-0 start-0 h-100 w-100 bg-secondary bg-opacity-25 d-md-none"
                    style={{ zIndex: 1040 }}
                    onClick={toggleSidebar}
                >
                    <div
                        className="h-100 bg-sidebar position-relative border-end border-soft"
                        style={{ width: "280px", maxWidth: "80%" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="btn-close ms-auto m-3 d-flex"
                            style={{ filter: "var(--close-btn-filter)" }}
                            onClick={toggleSidebar}
                        ></button>
                        <Sidebar />
                    </div>
                </div>
            )}

            <div className="flex-grow-1 d-flex flex-column h-100 overflow-hidden">
                <nav
                    className="navbar d-md-none border-bottom border-soft px-3"
                    style={{ backgroundColor: "var(--bg-sidebar)" }}
                >
                    <button
                        className="btn text-main p-0"
                        onClick={toggleSidebar}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                    </button>
                    <span className="navbar-brand mb-0 h1 ms-2 text-main">ClientConnect</span>
                </nav>

                <main className="flex-grow-1 overflow-auto p-4">
                    <Outlet />
                    <Footer />
                </main>
            </div>
        </div>
    );
}

export default Layout;
