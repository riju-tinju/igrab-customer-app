import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

export interface Branch {
    _id: string;
    name: string;
    address: string;
    contactNumber?: string;
    isActive: boolean;
}

interface BranchContextType {
    selectedBranch: Branch | null;
    branches: Branch[];
    selectBranch: (branch: Branch) => void;
    isLoading: boolean;
    error: string | null;
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

export const BranchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBranches = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/branches`);
            const data = response.data;
            setBranches(data);
            localStorage.setItem('cached_branches', JSON.stringify(data));

            // Logic: if no branch selected, pick the first one
            const savedBranchId = localStorage.getItem('selectedBranchId');
            if (savedBranchId) {
                const found = data.find((b: Branch) => b._id === savedBranchId);
                if (found) {
                    setSelectedBranch(found);
                } else if (data.length > 0) {
                    setSelectedBranch(data[0]);
                    localStorage.setItem('selectedBranchId', data[0]._id);
                }
            } else if (data.length > 0) {
                setSelectedBranch(data[0]);
                localStorage.setItem('selectedBranchId', data[0]._id);
            }
        } catch (err: any) {
            console.error('Error fetching branches:', err);
            setError(err.message || 'Failed to fetch branches');

            // Try to load from cache
            const cached = localStorage.getItem('cached_branches');
            if (cached) {
                const parsed = JSON.parse(cached);
                setBranches(parsed);

                const savedBranchId = localStorage.getItem('selectedBranchId');
                if (savedBranchId) {
                    const found = parsed.find((b: Branch) => b._id === savedBranchId);
                    if (found) setSelectedBranch(found);
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBranches();
    }, []);

    const selectBranch = (branch: Branch) => {
        setSelectedBranch(branch);
        localStorage.setItem('selectedBranchId', branch._id);
    };

    return (
        <BranchContext.Provider value={{ selectedBranch, branches, selectBranch, isLoading, error }}>
            {children}
        </BranchContext.Provider>
    );
};

export const useBranch = () => {
    const context = useContext(BranchContext);
    if (context === undefined) {
        throw new Error('useBranch must be used within a BranchProvider');
    }
    return context;
};
