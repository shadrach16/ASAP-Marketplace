import React, { useState, useEffect } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import Button from '../../common/Button';

const CheckoutForm = ({ clientSecret, onPaymentSuccess, onPaymentError, amount, currency }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe || !clientSecret) {
      return;
    }
    // Optional: Retrieve PaymentIntent status if needed, though clientSecret usually sufficient
    // stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
    //   switch (paymentIntent.status) { /* ... handle existing status ... */ }
    // });
  }, [stripe, clientSecret]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      setMessage("Stripe is not ready. Please wait a moment.");
      return;
    }

    setIsLoading(true);
    setMessage(null); // Clear previous messages

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Return URL is needed if not handling result immediately (e.g., 3D Secure)
        // Adjust this URL to where you want Stripe to redirect back to.
        return_url: `${window.location.origin}/payment-complete`, // Example redirect URL
      },
      // Prevent automatic redirection if you want to handle success/failure here directly
      redirect: 'if_required', // Only redirect for off-session / 3D Secure
    });

    // Handle result after confirmation (if no immediate redirect happened)
    if (error) {
      // This point will only be reached if there is an immediate error when confirming the payment.
      // Otherwise, Stripe redirects or shows error within PaymentElement.
      // Common errors: invalid card details, insufficient funds.
      console.error("Stripe confirmPayment error:", error);
      setMessage(error.message || "An unexpected error occurred.");
      if (onPaymentError) onPaymentError(error.message);
      setIsLoading(false);
    } else if (paymentIntent) {
       // Payment succeeded (or requires further action like 3D Secure)
      console.log("PaymentIntent Status:", paymentIntent.status);
      switch (paymentIntent.status) {
        case 'succeeded':
          setMessage('Payment successful!');
          if (onPaymentSuccess) onPaymentSuccess(paymentIntent);
          break;
        case 'processing':
          setMessage('Payment processing. We will update you when payment is received.');
          // You might still call onPaymentSuccess or handle differently
          if (onPaymentSuccess) onPaymentSuccess(paymentIntent);
          break;
        case 'requires_payment_method':
          // Card failed, allow user to try again
          setMessage('Payment failed. Please try another payment method.');
           if (onPaymentError) onPaymentError('Payment failed.');
          break;
        case 'requires_action':
           // Typically handled by redirect, but if not:
           setMessage('Further action required to complete payment.');
           // You might need to handle SCA prompts here if not using redirects
           break;
        default:
          setMessage('Something went wrong.');
           if (onPaymentError) onPaymentError('Unknown payment status.');
          break;
      }
      setIsLoading(false); // Stop loading unless still processing/requires_action?
    } else {
        // Fallback case, should ideally not happen with 'if_required' redirect
        setMessage("Checking payment status...");
        // You might poll the PaymentIntent status here or rely on webhooks
    }
  };

  const paymentElementOptions = {
    layout: "tabs", // Or "accordion"
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-4">
       <h3 className="text-lg font-semibold text-text-primary text-center mb-4">
            Complete Payment
       </h3>
        {amount && currency && (
            <p className="text-center text-xl font-bold text-primary mb-4">
                 {new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.toUpperCase() }).format(amount)}
            </p>
        )}
      {/* Stripe Payment Element */}
      <PaymentElement id="payment-element" options={paymentElementOptions} />

      {/* Pay Button */}
      <Button
        fullWidth
        disabled={isLoading || !stripe || !elements || !clientSecret}
        type="submit"
        variant="primary"
        id="submit"
      >
        <span id="button-text">
          {isLoading ? "Processing…" : "Pay Now"}
        </span>
      </Button>

      {/* Show any error or success messages */}
      {message && <div id="payment-message" className={`text-sm text-center mt-2 ${message.includes('failed') || message.includes('error') ? 'text-red-600' : 'text-green-600'}`}>{message}</div>}
    </form>
  );
};

export default CheckoutForm;