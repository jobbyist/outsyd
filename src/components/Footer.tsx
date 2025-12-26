import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="gradient-brand w-8 h-8 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" className="w-4 h-4 text-foreground">
                  <path fill="currentColor" stroke="currentColor" strokeWidth="0.5" fillRule="evenodd" d="M1.83645 1.83645C3.06046 0.612432 4.82797 0 7 0s3.9395 0.612432 5.1636 1.83645C13.3876 3.06046 14 4.82797 14 7s-0.6124 3.9395 -1.8364 5.1636C10.9395 13.3876 9.17203 14 7 14s-3.93954 -0.6124 -5.16355 -1.8364C0.612432 10.9395 0 9.17203 0 7s0.612432 -3.93954 1.83645 -5.16355ZM5.0769 4.98816c0 -0.34518 -0.27982 -0.625 -0.625 -0.625 -0.34517 0 -0.625 0.27982 -0.625 0.625v0.7c0 0.34518 0.27983 0.625 0.625 0.625 0.34518 0 0.625 -0.27982 0.625 -0.625v-0.7Zm5.0962 0c0 -0.34518 -0.27983 -0.625 -0.625 -0.625 -0.34518 0 -0.625 0.27982 -0.625 0.625v0.7c0 0.34518 0.27982 0.625 0.625 0.625 0.34517 0 0.625 -0.27982 0.625 -0.625v-0.7Zm0.1787 2.42929c0.3217 0.12505 0.4812 0.48724 0.3561 0.80897 -0.2805 0.72182 -0.75537 1.29603 -1.40641 1.68306 -0.64416 0.38292 -1.4264 0.56282 -2.30149 0.56282 -0.34518 0 -0.625 -0.2798 -0.625 -0.62501 0 -0.34518 0.27982 -0.625 0.625 -0.625 0.7083 0 1.25628 -0.14564 1.66273 -0.38728 0.39956 -0.23753 0.69571 -0.58697 0.88012 -1.06143 0.12505 -0.32173 0.48725 -0.48117 0.80895 -0.35613Z" clipRule="evenodd"/>
                </svg>
              </div>
              <span className="text-xl font-medium">OUTSYD</span>
            </div>
            <p className="text-background/70 text-sm max-w-md mb-6">
              Discover and experience the best events across Africa. From music festivals to tech conferences, 
              sports events to cultural celebrations - find your next adventure with OUTSYD.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              <a 
                href="https://tiktok.com/@outsyd" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center border border-background/20 hover:border-background/60 transition-colors"
                aria-label="Follow us on TikTok"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                </svg>
              </a>
              <a 
                href="https://instagram.com/outsyd" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center border border-background/20 hover:border-background/60 transition-colors"
                aria-label="Follow us on Instagram"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="https://facebook.com/outsyd" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center border border-background/20 hover:border-background/60 transition-colors"
                aria-label="Follow us on Facebook"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-medium uppercase tracking-wider mb-4">Explore</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-background/70 hover:text-background transition-colors text-sm">
                  Discover Events
                </Link>
              </li>
              <li>
                <Link to="/create-event" className="text-background/70 hover:text-background transition-colors text-sm">
                  Create Event
                </Link>
              </li>
              <li>
                <Link to="/my-events" className="text-background/70 hover:text-background transition-colors text-sm">
                  My Events
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-sm font-medium uppercase tracking-wider mb-4">Products</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/premium" className="text-background/70 hover:text-background transition-colors text-sm">
                  OUTSYD Premium
                </Link>
              </li>
              <li>
                <Link to="/business" className="text-background/70 hover:text-background transition-colors text-sm">
                  OUTSYD for Business
                </Link>
              </li>
              <li>
                <Link to="/affiliate" className="text-background/70 hover:text-background transition-colors text-sm">
                  Affiliate Program
                </Link>
              </li>
            </ul>

            {/* Legal */}
            <h4 className="text-sm font-medium uppercase tracking-wider mb-4 mt-6">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/terms" className="text-background/70 hover:text-background transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-background/70 hover:text-background transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-background/70 hover:text-background transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* App Store Badges */}
        <div className="mt-12 pt-8 border-t border-background/10">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
            <p className="text-background/70 text-sm">Get the app:</p>
            <div className="flex gap-3">
              {/* Google Play Badge */}
              <div className="flex items-center gap-2 px-4 py-2 border border-background/30 rounded-lg bg-background/5 hover:bg-background/10 transition-colors cursor-not-allowed">
                <svg className="w-5 h-5 text-background/70" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                <div className="flex flex-col">
                  <span className="text-[10px] text-background/50 leading-tight">Coming Soon to</span>
                  <span className="text-xs text-background font-medium leading-tight">Google Play</span>
                </div>
              </div>
              
              {/* App Store Badge */}
              <div className="flex items-center gap-2 px-4 py-2 border border-background/30 rounded-lg bg-background/5 hover:bg-background/10 transition-colors cursor-not-allowed">
                <svg className="w-5 h-5 text-background/70" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z"/>
                </svg>
                <div className="flex flex-col">
                  <span className="text-[10px] text-background/50 leading-tight">Coming Soon to</span>
                  <span className="text-xs text-background font-medium leading-tight">App Store</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Copyright */}
          <p className="text-background/50 text-sm text-center">
            © {currentYear} OUTSYD. All rights reserved. A division of Gravitas Industries.
          </p>
        </div>
      </div>
    </footer>
  );
};