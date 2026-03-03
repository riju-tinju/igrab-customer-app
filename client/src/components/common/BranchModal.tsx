import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useBranch, Branch } from '../../contexts/BranchContext';

interface BranchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const BranchModal: React.FC<BranchModalProps> = ({ isOpen, onClose }) => {
    const { branches, selectedBranch, selectBranch, isLoading } = useBranch();
    const [tempSelectedId, setTempSelectedId] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && selectedBranch) {
            setTempSelectedId(selectedBranch._id);
        }

        // Lock body scroll when open
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => { document.body.style.overflow = ''; };
    }, [isOpen, selectedBranch]);

    const handleApply = () => {
        const found = branches.find(b => b._id === tempSelectedId);
        if (found) {
            selectBranch(found);
            onClose();
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/60 z-[3000] transition-opacity duration-300 flex items-end justify-center md:items-center p-0 md:p-4"
                onClick={onClose}
            >
                {/* Modal Content */}
                <div
                    className="bg-white w-full rounded-t-[32px] md:rounded-[32px] md:max-w-[450px] p-8 animate-slide-up-modal md:animate-scale-in shadow-2xl"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center pb-6 border-b border-gray-100 mb-6">
                        <div>
                            <h2 className="text-2xl font-bold font-chillax text-text-black">Select Branch</h2>
                            <p className="text-xs text-gray-400 font-inter mt-1">Choose your preferred store location</p>
                        </div>
                        <button onClick={onClose} className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
                            <i className="fas fa-times text-xl"></i>
                        </button>
                    </div>

                    <div className="max-h-[50vh] overflow-y-auto no-scrollbar py-2">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                <p className="mt-4 text-gray-500 font-inter">Loading branches...</p>
                            </div>
                        ) : branches.length === 0 ? (
                            <div className="text-center py-12">
                                <i className="fas fa-store-slash text-5xl text-gray-200 mb-4"></i>
                                <p className="text-gray-500 font-inter">No branches available.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {branches.map((branch) => (
                                    <div
                                        key={branch._id}
                                        onClick={() => setTempSelectedId(branch._id)}
                                        className={`flex items-center p-5 rounded-[24px] cursor-pointer transition-all border-2 ${tempSelectedId === branch._id
                                            ? 'border-primary bg-primary/5 shadow-md scale-[1.02]'
                                            : 'border-transparent bg-muted hover:border-gray-100 hover:bg-gray-100/50'
                                            }`}
                                    >
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mr-4 shrink-0 shadow-sm ${tempSelectedId === branch._id ? 'bg-primary text-white' : 'bg-white text-gray-400'
                                            }`}>
                                            <i className="fas fa-store text-xl"></i>
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <h3 className="font-bold text-text-black font-inter text-lg">{branch.name}</h3>
                                            <p className="text-xs text-gray-500 line-clamp-1 font-inter mt-0.5">{branch.address}</p>
                                        </div>
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ml-2 ${tempSelectedId === branch._id ? 'border-primary bg-primary' : 'border-gray-300'
                                            }`}>
                                            {tempSelectedId === branch._id && <i className="fas fa-check text-[10px] text-white"></i>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleApply}
                        disabled={!tempSelectedId || isLoading}
                        className="w-full mt-8 py-5 bg-primary text-white rounded-[24px] font-bold font-dmsans text-lg shadow-xl shadow-primary/20 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
                    >
                        Apply Selection
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes slide-up-modal {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes scale-in {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-slide-up-modal {
                    animation: slide-up-modal 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .animate-scale-in {
                    animation: scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </>,
        document.body
    );
};

export default BranchModal;
