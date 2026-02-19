import React, { useState, useEffect, useCallback, useRef } from "react";
import CustomerList from "../components/customers/CustomerList";
import AddCustomer from "../components/customers/AddCustomer";
import customerService from "../services/customerService";
import { getRole } from "../utils/auth";

function Customers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);

    const role = getRole();
    const [searchKeyword, setSearchKeyword] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const debounceTimerRef = useRef(null);

    const fetchCustomers = useCallback(async (keyword = "") => {
        try {
            setLoading(true);
            setError(null);
            const data = await customerService.getAllCustomers();
            let filteredData = data || [];
            if (keyword.trim()) {
                setIsSearching(true);
                const k = keyword.toLowerCase();
                filteredData = filteredData.filter(c =>
                    c.name?.toLowerCase().includes(k) ||
                    c.company?.toLowerCase().includes(k) ||
                    c.email?.toLowerCase().includes(k)
                );
            } else {
                setIsSearching(false);
            }

            setCustomers(filteredData);
        } catch (err) {
            setError("Failed to load customers from server.");
        } finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        fetchCustomers(searchKeyword);
    }, [fetchCustomers, searchKeyword]);

    const handleCustomerAdded = async () => {
        await fetchCustomers();
        setShowAddForm(false);
    };

    const handleSearchChange = (e) => {
        setSearchKeyword(e.target.value);
    };

    return (
        <div className="customers-page container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-1">Customer Management</h2>
                    <p className="text-secondary small">Maintain and grow your client relationships.</p>
                </div>

                {role !== "EMPLOYEE" && (
                    <button
                        className={`btn ${showAddForm ? "btn-outline-secondary" : "btn-primary shadow-sm"}`}
                        onClick={() => setShowAddForm(!showAddForm)}
                    >
                        {showAddForm ? "Back to List" : (
                            <>
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                Add Customer
                            </>
                        )}
                    </button>
                )}
            </div>

            {error && <div className="alert alert-danger shadow-sm">{error}</div>}

            {showAddForm ? (
                <div className="card shadow-sm border-0">
                    <AddCustomer onCustomerAdded={handleCustomerAdded} />
                </div>
            ) : (
                <CustomerList
                    customers={customers}
                    onRefresh={() => fetchCustomers(searchKeyword)}
                    loading={loading}
                    searchKeyword={searchKeyword}
                    onSearchChange={handleSearchChange}
                    isSearching={isSearching}
                />
            )}
        </div>
    );
}

export default Customers;
