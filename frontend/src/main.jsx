import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import { HelmetProvider } from 'react-helmet-async';
import { loadStripe } from '@stripe/stripe-js'; // <-- Import loadStripe
import { Elements } from '@stripe/react-stripe-js'; // <-- Import Elements
import { Toaster, toast } from 'sonner';

import App from './App.jsx';
import './index.css';

// Load Stripe outside of component render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <HelmetProvider>
            {/* Wrap App with Elements provider */}
            <Elements stripe={stripePromise}>
                <Toaster expand={true}  position="top-center" closeButton richColors  />
              <App />
            </Elements>
          </HelmetProvider>
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  </React.StrictMode>
);