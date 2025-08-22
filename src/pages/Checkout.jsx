import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { address, auth, product } from '../data/allapi';

const Checkout = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    usertoken,
    quantity,
    setQuantity,
    customMessage,
    setCustomMessage
  } = useContext(AuthContext);
  const {state}=useLocation()
  const {selectedVariantDetails}=state
  console.log("check out page ❤️",selectedVariantDetails)
 
  

  const [userdata, setUserdata] = useState(null);
  const [singleProduct, setSingleProduct] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [deliveryOptions, setDeliveryOptions] = useState([]);

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
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponMessage, setCouponMessage] = useState('');
  const [deliveryCheckStatus, setDeliveryCheckStatus] = useState({ success: true, message: '' });
  const [deliveryMethod,setdeliverymethods]=useState([])

  useEffect(() => {
    if (!usertoken) {
      alert('Please login to proceed to checkout.');
      navigate('/authpage');
      return;
    }

    const fetchUserDataAndAddress = async () => {
      try {
        const userRes = await fetch(auth.GET_USER_PROFILE, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${usertoken}`,
            'Content-Type': 'application/json',
          },
        });
        if (!userRes.ok) throw new Error('Failed to fetch user');
        const { data: userData } = await userRes.json();
        setUserdata(userData);

        const [firstName, ...lastNameArr] = (userData.name || '').split(' ');

        const addressRes = await fetch(address.GET_ADDRESSES, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${usertoken}`,
            'Content-Type': 'application/json',
          },
        });
        if (!addressRes.ok) throw new Error('Failed to fetch addresses');
        const addressData = await addressRes.json();
        setAddresses(addressData);

        const defaultAddress = addressData.find(addr => addr.isDefault);

        if (defaultAddress) {
          const [addrFirstName, ...addrLastNameArr] = (defaultAddress.name || '').split(' ');
          setForm(prev => ({
            ...prev,
            email: userData.email || '',
            firstName: addrFirstName || '',
            lastName: addrLastNameArr.join(' ') || '',
            country: 'India',
            address1: defaultAddress.address || '',
            address2: '',
            city: defaultAddress.city || '',
            state: defaultAddress.state || '',
            postalCode: defaultAddress.pin ? defaultAddress.pin.toString() : '',
            phone: defaultAddress.phone ? defaultAddress.phone.toString() : '',
          }));
        } else {
          setForm(prev => ({
            ...prev,
            email: userData.email || '',
            firstName,
            lastName: lastNameArr.join(' '),
            country: userData.country || 'India',
          }));
        }
      } catch (error) {
        console.error(error);
        alert('Failed to load user or address data.');
      }
    };

    fetchUserDataAndAddress();
  }, [usertoken, navigate]);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const res = await fetch(`${product.GET_SINGLE_PRODUCT}/${id}`);
        if (!res.ok) throw new Error('Failed to fetch product');
        const { data } = await res.json();
        setSingleProduct(data);
      } catch (error) {
        console.error(error);
        alert('Failed to load product.');
      }
    })();
  }, [id]);

  // Run delivery check when postalCode changes
  useEffect(() => {
    if (form.postalCode && singleProduct) {
      checkDeliveryAvailability(form.postalCode);
    }
  }, [form.postalCode, singleProduct]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const incrementQuantity = () => setQuantity(prev => (prev ? prev + 1 : 1));
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const qty = quantity && quantity > 0 ? quantity : 1;
  const selectedDelivery = deliveryOptions.find(opt => opt.type === form.deliveryMethod);
  const shippingCost = selectedDelivery ? selectedDelivery.price : form.deliveryMethod === 'express' ? 15 : 5;

  const variantPrice = selectedVariantDetails?.discountedPrice ?? selectedVariantDetails?.price;
const basePrice = variantPrice ?? singleProduct.discountedPrice ?? singleProduct.price;
const subtotal = basePrice * qty;

  const totalBeforeDiscount = subtotal + shippingCost;
  const discount = discountAmount > totalBeforeDiscount ? totalBeforeDiscount : discountAmount;
  const total = totalBeforeDiscount - discount;

  const applyCoupon = async () => {
    if (!couponCode.trim()) return alert('Enter a coupon code.');

    setLoading(true);
    try {
      const res = await fetch(product.APPLY_COUPON, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${usertoken}`,
        },
        body: JSON.stringify({
          code: couponCode.trim(),
          orderAmount: totalBeforeDiscount,
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.valid) {
        setCouponMessage(result.message || 'Invalid coupon');
        setDiscountAmount(0);
        setCouponApplied(false);
        return;
      }

      setDiscountAmount(result.discount || 0);
      setCouponApplied(true);
      setCouponMessage(result.message || 'Coupon applied!');
    } catch (error) {
      console.error(error);
      setCouponMessage('Failed to apply coupon.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    const requiredFields = ['firstName', 'lastName', 'country', 'address1', 'city', 'state', 'postalCode', 'phone'];
    return requiredFields.every(field => form[field]?.trim());
  };

const checkDeliveryAvailability = async (pinToCheck = form.postalCode) => {
  if (!pinToCheck?.trim() || !singleProduct?._id) {
    return { success: false, message: 'Missing pincode or product info.' }; // ✅ Always return
  }

  try {
    const res = await fetch(`${product.CHECK_PRODUCT_AVAILABILITY_ONPIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${usertoken}`,
      },
      body: JSON.stringify({
        productId: singleProduct._id,
        pincode: pinToCheck.trim(),
      }),
    });

    const result = await res.json();

    if (result.success) {
      const options = result.data?.deliveryOptions || result.data || [];

      setDeliveryOptions(options);
      setDeliveryCheckStatus({ success: true, message: '' });

      if (options.length > 0) {
        setForm(prev => ({ ...prev, deliveryMethod: options[0].type }));
      }

      return { success: true, deliveryOptions: options }; // ✅ Ensure return object
    } else {
      setDeliveryCheckStatus({ success: false, message: result.message || 'Delivery unavailable.' });
      return { success: false, message: result.message || 'Delivery unavailable.' }; // ✅ Ensure return object
    }
  } catch (error) {
    console.error('Delivery check error:', error);
    setDeliveryCheckStatus({ success: false, message: 'Error checking delivery availability.' });
    return { success: false, message: 'Delivery check failed.' }; // ✅ Ensure return object
  }
};

console.log(deliveryOptions)

  const handleContinueToPayment = async () => {
    if (!isFormValid()) {
      alert('Please fill in all required fields.');
      return;
    }

    if (!singleProduct || !userdata) {
      alert('Missing product or user information.');
      return;
    }

    setLoading(true);

    const checkResult = await checkDeliveryAvailability();
    if (!checkResult.success) {
      setLoading(false);
      alert(checkResult.message);
      return;
    }

    const streetAddress = form.address1 + (form.address2 ? `, ${form.address2}` : '');

    const shippingInfo = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      streetAddress: streetAddress.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      postalCode: form.postalCode.trim(),
      country: form.country.trim(),
      phone: form.phone.trim(),
    };

    const orderPayload = {
      user: userdata._id,
      shippingInfo,
      orderItems: [
        {
          product: singleProduct._id,
          quantity: qty,
          price: selectedVariantDetails.price,
          message: singleProduct.isFeatured ? customMessage : '',
          orderedVariant: selectedVariantDetails?.id || '', // << added variant ID here
        },
      ],
      totalAmount: total,
      shippingPrice: shippingCost,
      paymentMethod: 'COD',
      paymentStatus: 'Pending',
      message: singleProduct.isFeatured ? customMessage : '',
    };
  


    try {
      const res = await fetch(product.CREATE_ORDER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${usertoken}`,
        },
        body: JSON.stringify(orderPayload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Order creation failed.');

      alert('Order placed successfully!');
      setCustomMessage("");
      navigate('/category');
    } catch (error) {
      console.error(error);
      alert(error.message || 'Order creation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!userdata || !singleProduct) {
    return <div className="text-center p-10 animate-pulse text-gray-600">Loading your checkout...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white py-12 px-4">
      <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">Secure Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
       <div className="lg:col-span-2 space-y-10">
          <section className="bg-white p-6 rounded-2xl shadow-sm border">
            <h2 className="text-2xl font-semibold mb-6 text-gray-700">Contact Info</h2>
            <input
              type="email"
              value={form.email}
              disabled
              className="w-full p-3 border rounded bg-gray-100 text-gray-700"
              placeholder="Email"
            />
          </section>

          <section className="bg-white p-6 rounded-2xl shadow-sm border">
            <h2 className="text-2xl font-semibold mb-6 text-gray-700">Shipping Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input name="firstName" placeholder="First Name *" value={form.firstName} onChange={handleChange} className="p-3 border rounded" />
              <input name="lastName" placeholder="Last Name *" value={form.lastName} onChange={handleChange} className="p-3 border rounded" />
              <input name="country" placeholder="Country *" value={form.country} onChange={handleChange} className="p-3 border rounded col-span-full" />
              <input name="address1" placeholder="Address Line 1 *" value={form.address1} onChange={handleChange} className="p-3 border rounded col-span-full" />
              <input name="address2" placeholder="Address Line 2 (Optional)" value={form.address2} onChange={handleChange} className="p-3 border rounded col-span-full" />
              <input name="city" placeholder="City *" value={form.city} onChange={handleChange} className="p-3 border rounded" />
              <input name="state" placeholder="State *" value={form.state} onChange={handleChange} className="p-3 border rounded" />
              <input name="postalCode" placeholder="Postal Code *" value={form.postalCode} onChange={handleChange} className="p-3 border rounded" />
              <input name="phone" placeholder="Phone *" value={form.phone} onChange={handleChange} className="p-3 border rounded" />
              {singleProduct.isFeatured && (
                <input
                  name="message"
                  placeholder="Message"
                  value={customMessage}
                  onChange={e => setCustomMessage(e.target.value)}
                  className="p-3 border rounded col-span-full"
                />
              )}
            </div>
          </section>

        <section className="bg-white p-6 rounded-2xl shadow-sm border">
  <h2 className="text-2xl font-semibold mb-6 text-gray-700">Delivery Option</h2>
  <div className="space-y-4">
    {deliveryOptions.length > 0 ? (
      deliveryOptions.map((option) => (
        <label key={option._id} className="flex items-center gap-3">
          <input
            type="radio"
            name="deliveryMethod"
            value={option.type}
            checked={form.deliveryMethod === option.type}
            onChange={handleChange}
          />
          <span className="capitalize">{option.type} (₹{option.price})</span>
        </label>
      ))
    ) : (
      <p className="text-sm text-red-500">No delivery options available.</p>
    )}
  </div>
</section>

        </div>

        {/* Order Summary */}
        <div className="h-fit lg:sticky top-6">
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-gray-200">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">🧾 Order Summary</h2>

            <div className="flex gap-4 items-center mb-6 w-[70px] ">
              <img
  src={(selectedVariantDetails?.images?.[0]?.url || singleProduct.images?.[0]?.url)}
  alt={singleProduct.title}
/>

              <div className="flex-1">
                <h3 className="text-lg font-semibold truncate whitespace-nowrap overflow-hidden max-w-full">
  {singleProduct.title}
</h3>

<p className="text-gray-500 text-sm">
  Price:{' '}
  <span className="line-through text-gray-400">₹{Math.round(selectedVariantDetails?.price || singleProduct.price)}</span>{' '}
  <span className="text-green-600 font-semibold">₹{Math.round(selectedVariantDetails?.discountedPrice ?? singleProduct.discountedPrice ?? singleProduct.price)}</span>
</p>
{selectedVariantDetails?.attributes && (
  <div className="text-sm text-gray-600 mt-1">
    {Object.entries(selectedVariantDetails.attributes).map(([key, value]) => (
      <p key={key}>
        <span className="font-medium ">{key}:</span> {value}
      </p>
    ))}
  </div>
)}

                <div className="flex items-center mt-2">
                  <button onClick={decrementQuantity} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-l">−</button>
                  <span className="px-4 border-y">{qty}</span>
                  <button onClick={incrementQuantity} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-r">+</button>
                </div>
              </div>
            </div>

            {!deliveryCheckStatus.success && (
              <p className="text-red-600 text-sm mb-4">{deliveryCheckStatus.message}</p>
            )}

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Coupon code"
                value={couponCode}
                onChange={e => setCouponCode(e.target.value)}
                disabled={loading}
                className="flex-grow p-2 border rounded focus:outline-none"
              />
              <button
                onClick={applyCoupon}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                Apply
              </button>
            </div>
            {couponMessage && (
              <p className={`text-sm mb-4 ${couponApplied ? 'text-green-600' : 'text-red-600'}`}>{couponMessage}</p>
            )}

            <div className="text-gray-800 space-y-2 border-t pt-4 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>₹{shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-red-500">
                <span>Discount:</span>
                <span>-₹{discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-3">
                <span>Total:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleContinueToPayment}
              disabled={loading || !deliveryCheckStatus.success}
              className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Continue to Payment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;



















