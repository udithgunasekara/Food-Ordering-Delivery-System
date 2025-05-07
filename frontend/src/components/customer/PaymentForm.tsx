import React, { useState } from 'react';
import { CreditCard, CheckCircle, AlertCircle, X } from 'lucide-react';

interface PaymentFormProps {
  amount: number;
  onSuccess: (paymentResponse: any) => void;
  onError: (error: string) => void;
  deliveryAddress: string;
  customerEmail?: string;
  customerPhone?: string;
}

const CustomAlert = ({ 
  type, 
  message, 
  onClose 
}: { 
  type: 'success' | 'error', 
  message: string, 
  onClose: () => void 
}) => {
  return (
    <div 
      className={`mb-4 p-4 rounded-md flex items-start justify-between ${
        type === 'success' 
          ? 'bg-green-50 border border-green-200 text-green-800' 
          : 'bg-red-50 border border-red-200 text-red-800'
      }`}
      role="alert"
    >
      <div className="flex items-center">
        {type === 'success' ? (
          <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
        ) : (
          <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
        )}
        <span className="text-sm font-medium">{message}</span>
      </div>
      <button 
        onClick={onClose} 
        className="ml-4"
        aria-label="Close alert"
      >
        <X className="w-4 h-4 text-gray-500 hover:text-gray-700" />
      </button>
    </div>
  );
};

const PaymentForm: React.FC<PaymentFormProps> = ({ 
  amount, 
  onSuccess, 
  onError, 
  deliveryAddress,
  customerEmail = '',
  customerPhone = ''
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    cardholderName: ''
  });
  const [email, setEmail] = useState(customerEmail);
  const [alertState, setAlertState] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  }>({
    show: false,
    type: 'success',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails({
      ...cardDetails,
      [name]: value
    });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlertState({
      show: true,
      type,
      message
    });
    
    if (type === 'success') {
      setTimeout(() => {
        setAlertState(prev => ({ ...prev, show: false }));
      }, 5000);
    }
  };

  const hideAlert = () => {
    setAlertState(prev => ({ ...prev, show: false }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvc || !cardDetails.cardholderName || !email) {
      showAlert('error', 'Please fill in all payment details');
      onError('Please fill in all payment details');
      return;
    }

    setIsProcessing(true);

    const amountInCents = Math.round(amount * 100);
    
    try {
      const paymentData = {
        amount: amountInCents,
        currency: 'usd',
        paymentMethodId: 'pm_card_visa',
        orderId: `order_${Date.now()}`,
        customerEmail: email,
        customerPhone: customerPhone,
        deliveryAddress: deliveryAddress
      };
      
      console.log('Sending payment request:', paymentData);
      
      const response = await fetch('http://localhost:3000/api/payments/charge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();
      
      if (result.success) {
        showAlert('success', 'Payment successful! Thank you for your purchase.');
        onSuccess(result.charge);
      } else {
        showAlert('error', result.error || 'Payment failed. Please try again.');
        onError(result.error || 'Payment failed. Please try again.');
      }
    } catch (err) {
      showAlert('error', 'Payment failed. Please try again.');
      onError('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative">
      {alertState.show && (
        <CustomAlert 
          type={alertState.type} 
          message={alertState.message} 
          onClose={hideAlert} 
        />
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="flex items-center mb-2">
            <CreditCard className="w-5 h-5 text-gray-500 mr-2" />
            <label className="text-gray-700 font-medium">Payment Details</label>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleEmailChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Email address"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Cardholder Name</label>
              <input
                type="text"
                name="cardholderName"
                value={cardDetails.cardholderName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Name on card"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">Card Number</label>
              <input
                type="text"
                name="cardNumber"
                value={cardDetails.cardNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Expiry Date</label>
                <input
                  type="text"
                  name="expiryDate"
                  value={cardDetails.expiryDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="MM/YY"
                  maxLength={5}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-1">CVC</label>
                <input
                  type="text"
                  name="cvc"
                  value={cardDetails.cvc}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="123"
                  maxLength={4}
                  required
                />
              </div>
            </div>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isProcessing}
          className="w-full bg-orange-500 text-white py-3 px-4 rounded-md hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;