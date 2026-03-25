import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PaymentProcessor = ({ caseId, amount, onPaymentSuccess, onPaymentError }) => {
  const [loading, setLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initiatePayment = async () => {
    if (!razorpayLoaded) {
      alert('Payment gateway is loading. Please try again.');
      return;
    }

    setLoading(true);
    try {
      // Create order
      const response = await axios.post('/api/payments/create-order', {
        amount,
        caseId,
        paymentType: 'case_fee'
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const { order, paymentId } = response.data.data;

      // Razorpay options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Advocate Management System',
        description: `Payment for Case ${caseId}`,
        order_id: order.id,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await axios.post('/api/payments/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              paymentId
            }, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });

            if (verifyResponse.data.success) {
              onPaymentSuccess && onPaymentSuccess(verifyResponse.data.data);
            }
          } catch (error) {
            console.error('Payment verification failed:', error);
            onPaymentError && onPaymentError('Payment verification failed');
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        theme: {
          color: '#3399cc'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        onPaymentError && onPaymentError(response.error.description);
      });

      rzp.open();
    } catch (error) {
      console.error('Payment initiation failed:', error);
      onPaymentError && onPaymentError('Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-processor">
      <button
        onClick={initiatePayment}
        disabled={loading || !razorpayLoaded}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Processing...' : `Pay ₹${amount}`}
      </button>
    </div>
  );
};

export default PaymentProcessor;
