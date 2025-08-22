import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { product } from '../data/allapi';

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'shipped': return 'bg-blue-100 text-blue-800';
    case 'delivered': return 'bg-green-100 text-green-800';
    case 'processing': return 'bg-yellow-100 text-yellow-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const TabButton = ({ id, label, active, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`px-4 py-2 rounded-lg transition-all ${
      active ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`}
  >
    {label}
  </button>
);

const OrderDetailsPage = () => {
  const { usertoken } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${product.GET_SINGLE_ORDER}/${id}`, {
          headers: { Authorization: `Bearer ${usertoken}` },
        });
        const data = await res.json();
        if (!data.success) throw new Error('Fetch failed');

        const api = data.order;

        // Map items from your structure
        const items = api.orderItems.map(i => ({
          id: i._id,
          name: i.product.title,
          image: i.product.images?.[0]?.url || '',
          price: `₹${i.price}`,
          quantity: i.quantity,
          sku: i.product._id,
        }));

        // Since shippingAddress is just an ID in your data, we can just show the ID or leave empty
        // You might want to fetch the full shipping address separately if needed
        const shippingInfo = {
          name: api.user.name || 'N/A',
          phone: 'N/A',
          address: api.shippingAddress || 'N/A',
          email: api.user.email || 'N/A',
        };

        const placed = new Date(api.createdAt);
        const delivered = api.deliveredAt ? new Date(api.deliveredAt) : null;

        // Progress steps simplified based on your orderStatus and dates
        const progress = [
          { step: 'Order Placed', date: placed, completed: true },
          { step: 'Payment Completed', date: placed, completed: api.isPaid },
          { step: 'Order Processing', date: placed, completed: /processing|shipped|delivered/i.test(api.orderStatus) },
          { step: 'Shipped', date: placed, completed: /shipped|delivered/i.test(api.orderStatus) },
          { step: 'Delivered', date: delivered, completed: !!delivered },
        ];

        setOrder({
          id: api._id,
          date: placed.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          status: api.orderStatus,
          total: `₹${api.totalAmount}`,
          subtotal: `₹${api.totalAmount}`, // no separate subtotal in data, so same as total
          shipping: '₹0', // not in data, assuming free shipping
          tax: '₹0', // no tax info
          discount: '₹0', // no discount info
          payment: api.paymentMethod,
          paymentId: api.paymentStatus,
          items,
          shippingInfo,
          delivery: delivered
            ? `Delivered on ${delivered.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
            : /delivered|cancelled/i.test(api.orderStatus)
            ? api.orderStatus
            : `Expected soon`,
          tracking: api._id,
          orderProgress: progress.map(({ step, date, completed }) => ({
            step,
            date: date ? date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Pending',
            time: date ? date.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric', hour12: true }) : 'Pending',
            completed,
          })),
        });

        setLoading(false);
      } catch (e) {
        setError('Error fetching order details.');
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, usertoken]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-600 text-lg">Loading order details...</p></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center"><p className="text-red-600 text-lg">{error}</p></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Orders</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Order Details</h1>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
          <TabButton id="overview" label="Overview" active={activeTab === 'overview'} onClick={setActiveTab} />
          <TabButton id="tracking" label="Tracking" active={activeTab === 'tracking'} onClick={setActiveTab} />
          <TabButton id="shipping" label="Shipping" active={activeTab === 'shipping'} onClick={setActiveTab} />
        </div>

        {/* Tab Content */}
        <div className="mb-8">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">Order #{order.id}</h2>
                    <p className="text-gray-600">Placed on {order.date}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>{order.status}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Payment Information</h3>
                    <p className="text-sm text-gray-600">Method: {order.payment}</p>
                    <p className="text-sm text-gray-600">Status: {order.paymentId}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Delivery Information</h3>
                    <p className="text-sm text-gray-600">{order.delivery}</p>
                    <p className="text-sm text-gray-600">Tracking: {order.tracking}</p>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Items Ordered</h3>
                <div className="space-y-4">
                  {order.items.map(item => (
                    <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                      ) : (
                        <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center text-gray-500 text-xs">No Image</div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{item.name}</h4>
                        <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span className="text-gray-800">{order.subtotal}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span className="text-gray-800">{order.shipping}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Tax</span><span className="text-gray-800">{order.tax}</span></div>
                  {order.discount !== '₹0' && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{order.discount}</span></div>}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-semibold text-lg"><span>Total</span><span>{order.total}</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tracking' && (
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Order Tracking</h3>
              <div className="space-y-4">
                {order.orderProgress.map((step, idx) => (
                  <div key={idx} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className={`w-4 h-4 rounded-full ${step.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h4 className={`font-medium ${step.completed ? 'text-gray-800' : 'text-gray-500'}`}>{step.step}</h4>
                        <span className={`text-sm ${step.completed ? 'text-gray-600' : 'text-gray-400'}`}>{step.date}{step.time !== 'Pending' ? ` • ${step.time}` : ''}</span>
                      </div>
                      {idx < order.orderProgress.length - 1 && (
                        <div className={`w-0.5 h-8 ml-2 mt-2 ${step.completed ? 'bg-green-200' : 'bg-gray-200'}`} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Shipping Information</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium text-gray-800">{order.shippingInfo.name}</p>
                  <p className="text-gray-600">{order.shippingInfo.address}</p>
                  <p className="text-gray-600">{order.shippingInfo.phone}</p>
                  <p className="text-gray-600">{order.shippingInfo.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button onClick={() => navigate(`/return-refund/${id}`)} className="flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg transition-colors shadow-md">
              Return/Refund
            </button>
            <NavLink to={`/category`} className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors shadow-md">
              Reorder Items
            </NavLink>
          </div>
        </div>

        {/* Customer Support */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Need Help?</h3>
          <p className="text-gray-600 mb-4">Our customer support team is here to help with any questions about your order.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
              Live Chat
            </button>
            <button className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors">
              Call Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
