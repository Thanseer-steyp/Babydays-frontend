import React from "react";

const BabydayFooter: React.FC = () => {
  return (
    <footer className="w-full bg-gray-50 font-sans">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand & Contact */}
          <div className="flex flex-col gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <img src="/icons/logo.png" alt="Babyday Logo" className="h-14 w-32" />
            </div>

            {/* Contact Info */}
            <div className="flex flex-col gap-3 mt-2">
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <svg
                  className="w-4 h-4 mt-0.5 text-teal-500 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  <strong className="text-gray-800">Address:</strong>{" "}
                  osperb edisonvalley, NH-966, Up hill
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg
                  className="w-4 h-4 text-teal-500 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>
                  <strong className="text-gray-800">Call Us :</strong>{" "}
                  +91 8593904040
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg
                  className="w-4 h-4 text-teal-500 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>
                  <strong className="text-gray-800">Email :</strong>{" "}
                  info@babyday.com
                </span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-4">
              Company
            </h3>
            <ul className="flex flex-col gap-3">
              {["Privacy Policy", "Terms", "Return Policy", "Contact Us"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-gray-500 hover:text-teal-500 transition-colors duration-200"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-4">
              Account
            </h3>
            <ul className="flex flex-col gap-3">
              {["Sign In", "View Cart", "My wish list", "My Order"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-gray-500 hover:text-teal-500 transition-colors duration-200"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: copyright */}
        <div className="text-xs text-gray-400 text-center md:text-left">
          <p>
            From{" "}
            <a href="#" className="text-teal-500 hover:underline font-medium">
              osperb
            </a>
          </p>
          <p>© 2026 zicato innovations All rights reserved</p>
        </div>

        {/* Center: Coupon Banner */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-orange-50 border border-orange-100 rounded-full px-4 py-1.5">

          <span>
            Apply coupon{" "}
            <strong className="text-orange-500">FIRST20</strong> to get{" "}
            <strong className="text-orange-500">20% OFF</strong> on your first
            purchase!
          </span>
        </div>

        {/* Right: Social Icons */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600 mr-1">
            Follow Us
          </span>
          {/* Facebook */}
          <a
            href="#"
            className="w-8 h-8 rounded-full bg-teal-500 hover:bg-teal-600 transition-colors duration-200 flex items-center justify-center"
            aria-label="Facebook"
          >
            <svg
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
            </svg>
          </a>
          {/* Instagram */}
          <a
            href="#"
            className="w-8 h-8 rounded-full bg-teal-500 hover:bg-teal-600 transition-colors duration-200 flex items-center justify-center"
            aria-label="Instagram"
          >
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default BabydayFooter;