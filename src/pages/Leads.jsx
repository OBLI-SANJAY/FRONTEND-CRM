import React, { useState, useEffect, useCallback, useRef } from "react";
import LeadList from "../components/leads/LeadList";
import AddLead from "../components/leads/AddLead";
import leadService from "../services/leadService";

/**
 * Leads Container Component
 * Handles state management, search logic, and UI synchronization.
 */
function Leads() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);

    // Search State
    const [searchKeyword, setSearchKeyword] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const debounceTimerRef = useRef(null);

    // 1. Fetch function (General fetch/Search fetch)
    const fetchLeads = useCallback(async (keyword = "") => {
        try {
            setLoading(true);
            setError(null);

            let data;
            if (keyword.trim()) {
                setIsSearching(true);
                data = await leadService.searchLeads(keyword);
            } else {
                setIsSearching(false);
                data = await leadService.getAllLeads();
            }

            setLeads(data || []);
        } catch (err) {
            setError(keyword.trim() ? "Failed to perform search. Please try again." : "Failed to load leads from server.");
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial load
    useEffect(() => {
        fetchLeads();
    }, [fetchLeads]);

    // Debounced Search Effect
    useEffect(() => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            fetchLeads(searchKeyword);
        }, 500); // 500ms debounce

        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [searchKeyword, fetchLeads]);

    const handleLeadCreatedRefetch = async () => {
        await fetchLeads(); // Re-fetch everything
        setShowAddForm(false);
    };

    const handleSearchChange = (e) => {
        setSearchKeyword(e.target.value);
    };

    return (
        <div className="leads-container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Lead Management</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowAddForm(!showAddForm)}
                >
                    {showAddForm ? "View List" : "Add New Lead"}
                </button>
            </div>

            {error && <div className="alert alert-danger mb-3">{error}</div>}

            {showAddForm ? (
                <div className="card shadow-sm p-4">
                    <AddLead onLeadAdded={handleLeadCreatedRefetch} />
                </div>
            ) : (
                <LeadList
                    leads={leads}
                    onRefresh={() => fetchLeads(searchKeyword)}
                    loading={loading}
                    searchKeyword={searchKeyword}
                    onSearchChange={handleSearchChange}
                    isSearching={isSearching}
                />
            )}
        </div>
    );
}

export default Leads;
