import React from 'react';

const LoadingOverlay: React.FC = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="flex items-center justify-center h-full">
                <div className="w-16 h-16 border-4 border-[#34a853] border-t-transparent rounded-full animate-spin"></div>
            </div>
        </div>
    );
};

export default LoadingOverlay;
