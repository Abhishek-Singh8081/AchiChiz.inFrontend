import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import { FiChevronLeft, FiMail, FiTruck, FiUser, FiPlus, FiMinus, FiTag } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import { auth, address, product } from '../data/allapi';

const Checkouts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { products = [] } = location.state || {};
  const { usertoken } = useContext(AuthContext);

  const [userdata, setUserdata] = useState(null);
  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    country: 'India',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    phone: '',
    deliveryMethod: 'standard',
  });

  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponMessage, setCouponMessage] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState({}); // { [productId]: { 
  // success: boolean, message: string } }
  const [availableShippingMethods, setAvailableShippingMethods] = useState([]);
console.log(availableShippingMethods)

  // Fetch user data
  useEffect(() => {
    if (!usertoken) {
      alert('Please login to proceed to checkout.');
      navigate('/login');
    }
  }, [usertoken]);

  useEffect(() => {
    if (!usertoken) return;
    (async () => {
      try {
        const res = await fetch(auth.GET_USER_PROFILE, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${usertoken}`,
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) throw new Error('Failed to fetch user');
        const { data: u } = await res.json();
        setUserdata(u);
        setForm(prev => ({ ...prev, email: u.email || '' }));
      } catch (err) {
        console.error(err);
        alert('Failed to load user data.');
      }
    })();
  }, [usertoken]);

  // Fetch default address
  useEffect(() => {
    if (!usertoken) return;
    (async () => {
      try {
        const res = await fetch(address.GET_ADDRESSES, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${usertoken}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch addresses');
        const defaultAddress = data.find(addr => addr.isDefault);
        if (defaultAddress) {
          const [fn, ...rest] = defaultAddress.name.trim().split(' ');
          const ln = rest.length ? rest.join(' ') : '';
          setForm(prev => ({
            ...prev,
            firstName: fn,
            lastName: ln,
            address1: defaultAddress.address || '',
            city: defaultAddress.city || '',
            state: defaultAddress.state || '',
            postalCode: defaultAddress.pin?.toString() || '',
            phone: defaultAddress.phone?.toString() || '',
            country: 'India',
          }));
        }
      } catch (error) {
        console.error('Error fetching default address:', error);
      }
    })();
  }, [usertoken]);

  // Check delivery availability whenever postal code or product list changes
 useEffect(() => {
  const checkDelivery = async () => {
    if (!form.postalCode || products.length === 0) return;

    const updatedStatus = {};
    let shippingMethodsCaptured = false; // to store shipping methods only once

    for (let item of products) {
      try {
        const res = await fetch(product.CHECK_PRODUCT_AVAILABILITY_ONPIN, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${usertoken}`,
          },
          body: JSON.stringify({
            productId: item._id,
            pincode: form.postalCode.trim(),
          }),
        });

        const result = await res.json();

        updatedStatus[item._id] = {
          success: result.success && result?.data?.availability,
          message: result.success ? '' : (result.message || 'Delivery unavailable'),
        };

        // ✅ Store deliveryOptions in state if available and not already captured
        if (
          result.success &&
          result?.data?.deliveryOptions &&
          !shippingMethodsCaptured
        ) {
          setAvailableShippingMethods(result.data.deliveryOptions);
          shippingMethodsCaptured = true;
        }

      } catch (err) {
        updatedStatus[item._id] = {
          success: false,
          message: 'Failed to check delivery',
        };
      }
    }

    setDeliveryStatus(updatedStatus);
  };

  checkDelivery();
}, [form.postalCode, products, usertoken]);


  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    const required = ['firstName', 'lastName', 'country', 'address1', 'city', 'state', 'postalCode', 'phone'];
    const deliveryOk = products.every(p => deliveryStatus[p._id]?.success === true);
    return required.every(f => form[f]?.trim()) && deliveryOk;
  };

  const updateQuantity = (id, delta) => {
    const updated = products.map(item =>
      item._id === id
        ? { ...item, quantity: Math.max(1, (item.quantity || 1) + delta) }
        : item
    );
    navigate('.', { state: { products: updated } });
  };

const subtotal = products.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);

// Find selected shipping method safely
const selectedShippingMethod = availableShippingMethods.find(
  method => method.type === form.deliveryMethod
);

const shippingCost = selectedShippingMethod?.price || 0;

const totalBeforeDiscount = subtotal + shippingCost;
const total = Math.max(0, totalBeforeDiscount - discount);


  const handleApplyCoupon = async () => {
    const trimmed = coupon.trim();
    if (!trimmed) {
      setCouponError('Please enter a coupon code');
      return;
    }

    try {
      const res = await fetch(product.APPLY_COUPON, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${usertoken}`,
        },
        body: JSON.stringify({ code: trimmed, orderAmount: total }),
      });

      const result = await res.json();
      if (!res.ok || !result.valid) {
        setDiscount(0);
        setCouponError(result.message || 'Invalid coupon');
        setCouponMessage('');
      } else {
        setDiscount(result.discount);
        setCouponMessage(result.message);
        setCouponError('');
      }
    } catch (err) {
      console.error('Coupon error:', err);
      setCouponError('Failed to apply coupon');
      setCouponMessage('');
    }
  };

  const handleContinueToPayment = async () => {
    if (!isFormValid() || !userdata) {
      alert('Please fill all required fields.');
      return;
    }

    setLoading(true);

    try {
      const streetAddress = form.address1 + (form.address2 ? ', ' + form.address2 : '');

      const shippingInfo = {
        firstName: form.firstName,
        lastName: form.lastName,
        streetAddress,
        apartment: '',
        landmark: '',
        city: form.city,
        state: form.state,
        postalCode: form.postalCode,
        phone: form.phone,
        type: 'Home',
      };

      const orderItems = products.map(item => ({
        product: item._id,
        quantity: item.quantity || 1,
        price: item.price,
      }));

      const payload = {
        orderItems,
        shippingInfo,
        paymentMethod: 'COD',
        totalAmount: total,
        shippingPrice: shippingCost,
      };

      const res = await fetch(product.CREATE_ORDER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${usertoken}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Order failed');

      alert('Order placed successfully!');
      navigate('/category');
    } catch (err) {
      console.error('Order creation error:', err);
      alert(err.message || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  if (!userdata || products.length === 0) {
    return <div className="text-center py-10">Loading or no products...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="mb-8">
          <NavLink to="/cartpage" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
            <FiChevronLeft />
            <span>Back to Cart</span>
          </NavLink>
          <div className="text-center mt-4">
            <h1 className="text-4xl font-bold">Secure Checkout</h1>
            <p className="text-gray-600">Complete your purchase safely</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Info */}
            <div className="bg-white p-6 rounded-xl shadow border">
              <div className="flex items-center mb-4">
                <FiMail className="text-blue-600 w-6 h-6 mr-2" />
                <h2 className="text-xl font-semibold">Contact Information</h2>
              </div>
              <input
                name="email"
                type="email"
                value={form.email}
                disabled
                className="w-full border rounded-lg px-4 py-3"
              />
            </div>

            {/* Delivery Address */}
            <div className="bg-white p-6 rounded-xl shadow border">
              <div className="flex items-center mb-4">
                <FiTruck className="text-green-600 w-6 h-6 mr-2" />
                <h2 className="text-xl font-semibold">Delivery Address</h2>
              </div>
              <select
                name="country"
                value={form.country}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 mb-4"
              >
                <option>India</option>
                <option>USA</option>
                <option>Canada</option>
              </select>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" className="border rounded-lg px-4 py-3" />
                <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" className="border rounded-lg px-4 py-3" />
              </div>
              <input name="address1" value={form.address1} onChange={handleChange} placeholder="Street Address" className="border rounded-lg px-4 py-3 w-full mb-4" />
              <input name="address2" value={form.address2} onChange={handleChange} placeholder="Apt, suite (optional)" className="border rounded-lg px-4 py-3 w-full mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="city" value={form.city} onChange={handleChange} placeholder="City" className="border rounded-lg px-4 py-3" />
                <input name="state" value={form.state} onChange={handleChange} placeholder="State" className="border rounded-lg px-4 py-3" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <input name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="Postal Code" className="border rounded-lg px-4 py-3" />
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="border rounded-lg px-4 py-3" />
              </div>
            </div>

            {/* Shipping Method */}
           <div className="bg-white p-6 rounded-xl shadow border">
  <h3 className="text-lg font-semibold mb-4">Shipping Method</h3>
  {availableShippingMethods.map(method => (
    <label
      key={method._id}
      className="flex items-center mb-2 border rounded-lg p-3 cursor-pointer"
    >
      <input
        type="radio"
        name="deliveryMethod"
        value={method.type}
        checked={form.deliveryMethod === method.type}
        onChange={handleChange}
        className="mr-3"
      />
      <span className="flex-1 capitalize">
        {method.type === 'standard' ? 'Standard Shipping' :
         method.type === 'oneDay' ? 'One-Day Shipping' :
         method.type}
      </span>
      <span className="text-green-600 font-semibold">₹{method.price}</span>
    </label>
  ))}
</div>

          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow border sticky top-6 space-y-6">
              <div className="flex items-center mb-4">
                <FiUser className="text-purple-600 w-6 h-6 mr-2" />
                <h2 className="text-xl font-semibold">Order Summary</h2>
              </div>

              {products.map(item => (
                <div key={item._id} className="flex flex-col gap-2 bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-4">
                    <img src={item.images?.[0]?.url} alt={item.title} className="w-16 h-16 object-cover rounded-lg" />
                    <div className="flex-1">
                      <p className="font-semibold">{item.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <button onClick={() => updateQuantity(item._id, -1)} disabled={item.quantity <= 1} className="p-1 border rounded"> <FiMinus /> </button>
                        <span className="px-3 py-1 border rounded">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, 1)} className="p-1 border rounded"> <FiPlus /> </button>
                      </div>
                    </div>
                    <p className="font-semibold">₹{item.price}</p>
                  </div>
                  {deliveryStatus[item._id] && !deliveryStatus[item._id].success && (
                    <p className="text-red-600 text-sm">{deliveryStatus[item._id].message}</p>
                  )}
                </div>
              ))}

              {/* Coupon and Summary */}
              <div className="pt-3 border-t">
                <label className="flex items-center gap-2 font-medium mb-2">
                  <FiTag className="text-blue-600" />
                  Apply Coupon
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={coupon}
                    onChange={e => setCoupon(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 border rounded px-3 py-2"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-red-500 text-sm mt-1">{couponError}</p>}
                {couponMessage && <p className="text-green-600 text-sm mt-1">{couponMessage}</p>}
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>₹{shippingCost.toFixed(2)}</span></div>
                {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-₹{discount.toFixed(2)}</span></div>}
                <div className="flex justify-between font-bold"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
              </div>

              <button
                disabled={!isFormValid() || loading}
                onClick={handleContinueToPayment}
                className={`w-full py-3 rounded-lg font-semibold ${
                  isFormValid() && !loading
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {loading ? 'Processing...' : 'Continue to BUY'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkouts;
