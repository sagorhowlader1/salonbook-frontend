import React from 'react';
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const RootLayout = ({ children}: {children: React.ReactNode}) => {
    return (
        <>
            <Navbar />
            {children}
            <Footer />
        </>
    );
};

export default RootLayout;