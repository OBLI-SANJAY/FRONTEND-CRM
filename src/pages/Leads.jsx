import React, { useState, useEffect, useCallback, useRef } from "react";
import LeadList from "../components/leads/LeadList";
import AddLead from "../components/leads/AddLead";
import leadService from "../services/leadService";

function Leads() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);

    const [searchKeyword, setSearchKeyword] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const debounceTimerRef = useRef(null);

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

    useEffect(() => {
        fetchLeads();
    }, [fetchLeads]);

    useEffect(() => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            fetchLeads(searchKeyword);
        }, 500);

        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [searchKeyword, fetchLeads]);

    const handleLeadCreatedRefetch = async () => {
        await fetchLeads();
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

            {error && <p className="text-danger">⚠ {error}</p>}

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
