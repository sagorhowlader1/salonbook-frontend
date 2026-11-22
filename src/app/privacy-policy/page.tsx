
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const sections = [
    { id: "introduction", title: "Introduction" },
    { id: "information", title: "Information We Collect" },
    { id: "google-auth", title: "Google Authentication" },
    { id: "appointments", title: "Appointment Information" },
    { id: "payments", title: "Payment Information" },
    { id: "cookies", title: "Cookies & Sessions" },
    { id: "sharing", title: "Information Sharing" },
    { id: "security", title: "Data Security" },
    { id: "retention", title: "Data Retention" },
    { id: "rights", title: "Your Privacy Rights" },
    { id: "third-party", title: "Third-Party Services" },
    { id: "changes", title: "Policy Updates" },
    { id: "contact", title: "Contact Us" },
];

export default function PrivacyPolicyPage() {
    const [activeSection, setActiveSection] = useState("introduction");

    useEffect(() => {
        const handleScroll = () => {
            let current = "introduction";

            sections.forEach((section) => {
                const element = document.getElementById(section.id);

                if (element && element.getBoundingClientRect().top <= 160) {
                    current = section.id;
                }
            });

            setActiveSection(current);
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (

        <main className="min-h-screen bg-slate-50 dark:bg-slate-950">

            {/* Hero */}
            <section className="relative overflow-hidden border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                <div className="absolute -right-20 -top-28 h-80 w-80 rounded-full bg-emerald-100/60 blur-3xl dark:bg-emerald-900/20" />

                <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
                    
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400">
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
                            <path d="m9 12 2 2 4-4" />
                        </svg>
                        Your Privacy Matters
                    </div>

                    <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
                        Privacy <span className="text-emerald-600">Policy</span>
                    </h1>

                    <p className="mt-6 max-w-2xl text-base leading-8 text-slate-500 dark:text-slate-400 sm:text-lg">
                        Your trust is important to us. Learn how SalonBook collects,
                        uses, stores, and protects your personal information when
                        you use our salon booking platform.
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            Last Updated: November 22, 2026
                        </span>
                        <span className="hidden h-4 w-px bg-slate-300 sm:block" />
                        <span>Privacy & Data Protection</span>
                    </div>
                </div>
            </section>

            {/* Content */}
            <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-10 lg:py-16">

                {/* Sidebar */}
                <aside className="h-fit lg:sticky lg:top-24">
                    <div className="mb-8">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400"
                        >
                            <svg
                                className="h-4 w-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="m15 18-6-6 6-6" />
                            </svg>
                            Back to Home
                        </Link>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                            On This Page
                        </h2>

                        <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
                            {sections.map((section) => (
                                <a
                                    key={section.id}
                                    href={`#${section.id}`}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`shrink-0 rounded-lg px-3 py-2.5 text-sm font-medium transition lg:shrink ${activeSection === section.id
                                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                                        }`}
                                >
                                    {section.title}
                                </a>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* Policy Content */}
                <article className="min-w-0 space-y-12">

                    <section id="introduction" className="scroll-mt-28">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            01. Introduction
                        </h2>
                        <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
                            Welcome to SalonBook. We respect your privacy and are
                            committed to protecting your personal information.
                            This Privacy Policy explains how we collect, use, store,
                            and share information when you access or use our website
                            and appointment booking services.
                        </p>
                        <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
                            By using SalonBook, you acknowledge that you have read
                            this Privacy Policy. If you do not agree with our
                            practices, please discontinue using our services.
                        </p>
                    </section>

                    <section id="information" className="scroll-mt-28">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            02. Information We Collect
                        </h2>
                        <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
                            We collect information that you provide when creating
                            an account, signing in, booking an appointment, or
                            making a payment.
                        </p>

                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                            {[
                                ["Account Information", "Your name, email address, and account identification details."],
                                ["Appointment Information", "Selected service, appointment date, time slot, and any message you submit."],
                                ["Payment Information", "Payment status, transaction reference, amount, currency, and related payment records."],
                                ["Technical Information", "Information necessary to operate, maintain, and secure our website and authentication sessions."],
                            ].map(([title, description]) => (
                                <div key={title} className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                                    <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
                                    <p className="mt-2 text-sm leading-7 text-slate-500 dark:text-slate-400">{description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section id="google-auth" className="scroll-mt-28">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            03. Google Authentication
                        </h2>
                        <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
                            SalonBook provides Google Sign-In as an authentication
                            option. When you choose to sign in with Google, Google
                            may share account information such as your name and
                            email address with us, subject to your Google account
                            permissions.
                        </p>
                        <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
                            We use this information to create or authenticate your
                            SalonBook account and provide access to your account.
                            Your use of Google services is also subject to Google's
                            own privacy practices.
                        </p>
                        <a
                            href="https://policies.google.com/privacy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex text-sm font-semibold text-emerald-600 hover:underline"
                        >
                            Google Privacy Policy →
                        </a>
                    </section>

                    <section id="appointments" className="scroll-mt-28">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            04. Appointment Information
                        </h2>
                        <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
                            When you book an appointment through SalonBook, we
                            collect the information needed to process and manage
                            your booking, including:
                        </p>
                        <ul className="mt-4 list-disc space-y-3 pl-6 leading-7 text-slate-600 marker:text-emerald-600 dark:text-slate-400">
                            <li>Your account identification and selected service.</li>
                            <li>Your preferred appointment date and time slot.</li>
                            <li>Any additional message you provide with your booking.</li>
                            <li>Appointment and payment status.</li>
                        </ul>
                        <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
                            We use this information to create, manage, verify, and
                            display your appointments.
                        </p>
                    </section>

                    <section id="payments" className="scroll-mt-28">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            05. Payment Information
                        </h2>
                        <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
                            SalonBook uses Stripe to process online payments.
                            When you make a payment, you are directed to Stripe
                            Checkout to complete the transaction.
                        </p>
                        <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
                            We store relevant transaction information such as
                            payment references, appointment identifiers, payment
                            status, amount, currency, and transaction dates for
                            verification, record-keeping, and customer support.
                        </p>
                        <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
                            Your payment card details are submitted to Stripe.
                            Based on our current integration, SalonBook does not
                            directly store your full card number or card security code.
                            Stripe processes payment information under its own
                            privacy and security practices.
                        </p>
                        <a
                            href="https://stripe.com/privacy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex text-sm font-semibold text-emerald-600 hover:underline"
                        >
                            Stripe Privacy Policy →
                        </a>
                    </section>

                    <section id="cookies" className="scroll-mt-28">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            06. Cookies & Sessions
                        </h2>
                        <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
                            SalonBook uses authentication technology to help
                            maintain secure user sessions and keep users signed in.
                            This may involve essential cookies or similar browser
                            storage technologies.
                        </p>
                        <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
                            We do not currently use dedicated analytics or
                            advertising tracking tools as part of the implementation
                            described in this policy.
                        </p>
                        <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
                            If we introduce optional analytics, marketing, or other
                            non-essential cookies in the future, we will update
                            this policy and provide appropriate choices or consent
                            mechanisms where required by applicable law.
                        </p>
                    </section>

                    <section id="sharing" className="scroll-mt-28">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            07. Information Sharing
                        </h2>
                        <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
                            We do not sell your personal information. We may share
                            relevant information with service providers when
                            necessary to operate SalonBook, including:
                        </p>
                        <ul className="mt-4 list-disc space-y-3 pl-6 leading-7 text-slate-600 marker:text-emerald-600 dark:text-slate-400">
                            <li>Google, for authentication when you choose Google Sign-In.</li>
                            <li>Stripe, for processing and verifying payments.</li>
                            <li>Infrastructure and hosting providers necessary to operate the website and database.</li>
                        </ul>
                        <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
                            We may also disclose information when required by
                            applicable law or when necessary to protect the security
                            and integrity of our services.
                        </p>
                    </section>

                    <section id="security" className="scroll-mt-28">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            08. Data Security
                        </h2>
                        <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
                            We use technical and organizational measures intended
                            to protect personal information against unauthorized
                            access, loss, misuse, alteration, or disclosure.
                            Our application uses authentication controls,
                            server-side payment verification, and protected
                            communication between application services.
                        </p>
                        <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
                            However, no method of online transmission or electronic
                            storage can be guaranteed to be completely secure.
                        </p>
                    </section>

                    <section id="retention" className="scroll-mt-28">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            09. Data Retention
                        </h2>
                        <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
                            We retain personal information for as long as reasonably
                            necessary to provide our services, manage accounts and
                            appointments, maintain payment records, resolve disputes,
                            and meet applicable legal or operational requirements.
                        </p>
                        <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
                            Retention periods may vary depending on the type of
                            information and the reason it was collected.
                        </p>
                    </section>

                    <section id="rights" className="scroll-mt-28">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            10. Your Privacy Rights
                        </h2>
                        <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
                            Depending on applicable law, you may have the right to
                            request access to, correction of, or deletion of your
                            personal information. You may also ask questions about
                            how your information is used.
                        </p>
                        <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
                            To make a privacy-related request, please contact us
                            using the contact information provided below. We may
                            need to verify your identity before processing a request.
                            Some information may need to be retained where required
                            for legal, security, or payment-record purposes.
                        </p>
                    </section>

                    <section id="third-party" className="scroll-mt-28">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            11. Third-Party Services
                        </h2>
                        <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
                            Our website may link to third-party services or websites.
                            Those services operate under their own privacy policies
                            and terms. We encourage you to review their policies
                            before providing information to them.
                        </p>
                    </section>

                    <section id="changes" className="scroll-mt-28">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            12. Changes to This Policy
                        </h2>
                        <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
                            We may update this Privacy Policy from time to time
                            to reflect changes to our services, technology, or
                            applicable requirements. Any updates will be published
                            on this page with a revised Last Updated date.
                        </p>
                    </section>

                    <section id="contact" className="scroll-mt-28">
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900 dark:bg-emerald-950/30 sm:p-8">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white">
                                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="5" width="18" height="14" rx="2" />
                                    <path d="m3 7 9 6 9-6" />
                                </svg>
                            </div>

                            <h2 className="mt-5 text-2xl font-bold text-slate-900 dark:text-white">
                                13. Contact Us
                            </h2>

                            <p className="mt-3 leading-8 text-slate-600 dark:text-slate-400">
                                If you have questions, concerns, or requests regarding
                                this Privacy Policy or the handling of your personal
                                information, please contact our privacy support team.
                            </p>

                            <div className="mt-6 rounded-xl border border-emerald-200 bg-white p-5 dark:border-emerald-900 dark:bg-slate-900">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                    SalonBook Privacy Support
                                </p>
                                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                    Email: [Your Official Support Email]
                                </p>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    Website: SalonBook
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Footer */}
                    <div className="border-t border-slate-200 pt-8 dark:border-slate-800">
                        <p className="text-sm leading-7 text-slate-500 dark:text-slate-400">
                            Thank you for trusting SalonBook. We are committed to
                            handling your information responsibly and transparently.
                        </p>

                        <Link
                            href="/"
                            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 transition hover:gap-3"
                        >
                            <span>←</span> Back to Home
                        </Link>
                    </div>
                </article>
            </div>
        </main>
    );
}
