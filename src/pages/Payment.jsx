import React, { useState } from 'react';
import { useLocation,NavLink } from 'react-router-dom';
import { 
  CreditCard, 
  CheckCircle, 
  Lock, 
  Shield, 
  ArrowLeft, 
  ChevronRight,
  Wallet,
  Smartphone,
  Check
} from 'lucide-react';

const Payment = () => {
  const location = useLocation();
  const { formData, cartItems = [], total = 0 } = location.state || {};


  const [selectedPayment, setSelectedPayment] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  if (!formData || !cartItems) {
    return <div className="p-10 text-center text-red-500">Missing checkout data.</div>;
  }

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardForm(prev => ({ ...prev, [name]: value }));
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : v;
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    navigate('/order-confirmation', {
      state: {
        formData,
        cartItems,
        total
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium">
              <ArrowLeft className="w-5 h-5" />
              <NavLink to="/checkout">
              Back to Shipping
              </NavLink>
            </button>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Payment Details</h1>
            <p className="text-gray-600">Complete your secure payment</p>
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-blue-600">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium hidden sm:block">Cart</span>
            </div>
            <div className="w-8 sm:w-12 h-0.5 bg-blue-600"></div>
            <div className="flex items-center gap-2 text-blue-600">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium hidden sm:block">Shipping</span>
            </div>
            <div className="w-8 sm:w-12 h-0.5 bg-blue-600"></div>
            <div className="flex items-center gap-2 text-blue-600">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">3</span>
              </div>
              <span className="font-medium hidden sm:block">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Methods - Left Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Method Selection */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
                  <p className="text-sm text-gray-500">Choose your preferred payment option</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Credit/Debit Card */}
                <div className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                  selectedPayment === 'card' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={selectedPayment === 'card'}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Credit/Debit Card</span>
                  </label>
                  
                  {selectedPayment === 'card' && (
                    <div className="mt-4 space-y-4 pl-7">
                      <div className="relative">
                        <input
                          type="text"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={cardForm.cardNumber}
                          onChange={(e) => handleCardChange({
                            ...e,
                            target: { ...e.target, value: formatCardNumber(e.target.value) }
                          })}
                          maxLength="19"
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                        />
                        <div className="absolute right-3 top-3 flex gap-1">
                          <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">VISA</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="expiry"
                          placeholder="MM/YY"
                          value={cardForm.expiry}
                          onChange={handleCardChange}
                          maxLength="5"
                          className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                        />
                        <input
                          type="text"
                          name="cvv"
                          placeholder="CVV"
                          value={cardForm.cvv}
                          onChange={handleCardChange}
                          maxLength="3"
                          className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                        />
                      </div>
                      
                      <input
                        type="text"
                        name="name"
                        placeholder="Name on card"
                        value={cardForm.name}
                        onChange={handleCardChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                      />
                    </div>
                  )}
                </div>

                {/* PayPal */}
                <div className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                  selectedPayment === 'paypal' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="paypal"
                      checked={selectedPayment === 'paypal'}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <Wallet className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-900">PayPal</span>
                    <div className="ml-auto text-xs text-gray-500">Express checkout</div>
                  </label>
                </div>

                {/* Google Pay */}
                <div className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                  selectedPayment === 'googlepay' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="googlepay"
                      checked={selectedPayment === 'googlepay'}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <Smartphone className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-900">Google Pay</span>
                    <div className="ml-auto text-xs text-gray-500">One-tap payment</div>
                  </label>
                </div>

                {/* UPI */}
                <div className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                  selectedPayment === 'upi' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="upi"
                      checked={selectedPayment === 'upi'}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div className="w-5 h-5 bg-orange-500 rounded text-white text-xs flex items-center justify-center font-bold">₹</div>
                    <span className="font-medium text-gray-900">UPI</span>
                    <div className="ml-auto text-xs text-gray-500">PhonePe, GPay, Paytm</div>
                  </label>
                </div>
              </div>
            </div>

            {/* Security Features */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-green-800">Your Payment is Secure</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-green-700">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>256-bit SSL encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>PCI DSS compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Money-back guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>24/7 fraud monitoring</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary - Right Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                
                <div className="space-y-4 border-b border-gray-200 pb-4 mb-4">
  {cartItems.map((item) => (
    <div key={item.id} className="flex gap-3">
      <img
        src={item.image}
        alt={item.name}
        className="w-12 h-12 rounded-lg object-cover"
      />
      <div className="flex-1">
        <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
        <p className="text-xs text-gray-500">{item.color}</p>
        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
      </div>
      <div className="text-right">
        <p className="font-semibold text-gray-900">₹{item.price.toFixed(2)}</p>
      </div>
    </div>
  ))}
</div>


                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{(total - 5).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">₹5.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">₹0.00</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-gray-900">₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-3 ${
                  isProcessing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Complete Order
                  </>
                )}
              </button>

              {/* Security Notice */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-2">
                  <Lock className="w-4 h-4" />
                  <span>Secure 256-bit SSL encryption</span>
                </div>
                <p className="text-xs text-gray-400">
                  Your payment information is encrypted and secure
                </p>
              </div>

              {/* Customer Support */}
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <h4 className="font-medium text-gray-900 mb-2">Need Help?</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Our customer support team is here to help
                </p>
                <button className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200 flex items-center gap-1 mx-auto">
                  Contact Support
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;