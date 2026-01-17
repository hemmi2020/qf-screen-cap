'use client';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

export default function PayPalProvider({ children }) {
  const initialOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
    vault: true,
    intent: 'subscription',
    currency: 'CAD',
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      {children}
    </PayPalScriptProvider>
  );
}