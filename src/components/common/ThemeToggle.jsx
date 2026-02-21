import React from "react";
import { useTheme } from "../../context/ThemeContext";
import "./ThemeToggle.css";

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="theme-toggle-container" onClick={toggleTheme}>
            <div className="theme-toggle-bg">
                <div className="theme-toggle-day-bg">
                    <div className="cloud cloud-1"></div>
                    <div className="cloud cloud-2"></div>
                </div>
                <div className="theme-toggle-night-bg">
                    <div className="star star-1"></div>
                    <div className="star star-2"></div>
                </div>
            </div>

            <div className="theme-toggle-thumb">
                <div className="sun-icon">☀️</div>
                <div className="moon-icon">🌙</div>
            </div>
        </div>
    );
};

export default ThemeToggle;
