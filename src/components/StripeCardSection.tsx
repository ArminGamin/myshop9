import React from 'react';
import { CardElement } from '@stripe/react-stripe-js';

export default function StripeCardSection(): JSX.Element {
  return (
    <div className="space-y-3">
      <div className="border rounded-lg p-3">
        <CardElement options={{ hidePostalCode: true }} />
      </div>
      <div className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-800">
        <span className="font-semibold">256-bit SSL Secure Checkout</span>
        <span>Jūsų mokėjimo informacija yra visiškai saugi</span>
      </div>
    </div>
  );
}


