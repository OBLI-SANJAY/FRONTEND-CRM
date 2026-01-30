import React from "react";

function Navbar({ title, placeholder = "Search..." }) {
  return (
    <header className="topbar">
      <h3>{title}</h3>
      <input
        type="text"
        placeholder={placeholder}
        className="search-input"
      />
    </header>
  );
}

export default Navbar;
