import React from 'react';
import DashboardSidebar from "@/components/dashboard/shared/DashboardSidebar";

const DashboardLayout = ({children}: {children: React.ReactNode}) => {
    return (
        <div className="flex min-h-screen">
            <DashboardSidebar role="customer" />
            <div className="flex min-w-0 flex-1 flex-col">
                {children}
            </div>
        </div>
    );
};

export default DashboardLayout;
