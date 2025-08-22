import React, { useState, useEffect, useContext } from 'react';
import { Package, Truck, CheckCircle, Clock, Eye, Download } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { auth } from '../data/allapi';

const MyOrders = () => {
  const { usertoken } = useContext(AuthContext);
  const [selectedTab, setSelectedTab] = useState('all');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!usertoken) return;

    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${auth.GET_USER_PROFILE}`, {
          headers: {
            Authorization: `Bearer ${usertoken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();

        const mappedOrders = (data.data?.orders || []).map(order => ({
          ...order,
          id: order._id,
          date: formatDate(order.createdAt),
          deliveryDate: formatDate(order.deliveredAt),
          estimatedDelivery: formatDate(order.estimatedDelivery),
          items: order.orderItems || [],
          status: order.orderStatus?.toLowerCase() || 'pending',
          total: order.totalAmount || 0,
        }));

        setOrders(mappedOrders);
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [usertoken]);

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'delivered':
        return { icon: CheckCircle, color: 'bg-green-500', text: 'Delivered', textColor: 'text-green-800' };
      case 'shipped':
        return { icon: Truck, color: 'bg-blue-500', text: 'Shipped', textColor: 'text-blue-800' };
      case 'processing':
        return { icon: Clock, color: 'bg-yellow-500', text: 'Processing', textColor: 'text-yellow-800' };
      case 'pending':
        return { icon: Package, color: 'bg-gray-500', text: 'Pending', textColor: 'text-gray-800' };
      default:
        return { icon: Package, color: 'bg-gray-500', text: 'Unknown', textColor: 'text-gray-800' };
    }
  };

  const filteredOrders = selectedTab === 'all'
    ? orders
    : orders.filter(order => order.status === selectedTab);

  const tabs = [
    { id: 'all', label: 'All Orders', count: orders.length },
    { id: 'processing', label: 'Processing', count: orders.filter(o => o.status === 'processing').length },
    { id: 'shipped', label: 'Shipped', count: orders.filter(o => o.status === 'shipped').length },
    { id: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length },
    { id: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'pending').length },
  ];

  if (loading) return <div className="text-center py-12 text-gray-600">Loading orders...</div>;
  if (error) return <div className="text-center py-12 text-red-600">Error: {error}</div>;

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Header and Summary */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Total Orders: <span className="font-semibold">{orders.length}</span>
        </div>
      </div>

      {/* Mobile Filter */}
      <div className="md:hidden mb-4">
        <select
          value={selectedTab}
          onChange={(e) => setSelectedTab(e.target.value)}
          className="w-60 border border-gray-300 rounded px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {tabs.map((tab) => (
            <option key={tab.id} value={tab.id}>
              {tab.label} ({tab.count})
            </option>
          ))}
        </select>
      </div>

      {/* Desktop Tabs */}
      <div className="hidden md:flex flex-wrap gap-28 bg-white/30 p-2 backdrop-blur-md border border-white/40 rounded-xl shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-300
              ${
                selectedTab === tab.id
                  ? 'bg-white text-indigo-700 shadow-md ring-2 ring-indigo-300'
                  : 'text-gray-700 hover:bg-white/40 hover:text-indigo-600'
              }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Scrollable Orders List */}
      <div className="flex-1 overflow-y-auto max-h-[70vh] pr-1">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No orders found for the selected filter.</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            const StatusIcon = statusInfo.icon;

            return (
              <div
                key={order.id}
                className="bg-white/30 backdrop-blur-lg p-6 border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 rounded-md mb-4"
              >
                {/* Order Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 space-y-2 md:space-y-0">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${statusInfo.color} shadow-md`}>
                      <StatusIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{order.id}</h3>
                      <p className="text-sm text-gray-600">Ordered on {order.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${statusInfo.color.split('-')[1]}-100 ${statusInfo.textColor}`}>
                      {statusInfo.text}
                    </span>
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-white/30 rounded-lg transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-white/30 rounded-lg transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-3 mb-4">
                  {(order.items || []).map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-white/20 rounded">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Package className="h-6 w-6 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{item.name}</h4>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">${item.price?.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="flex flex-col md:flex-row md:items-center justify-between pt-4 border-t border-white/30 space-y-2 md:space-y-0">
                  <div className="text-sm text-gray-600">
                    {order.status === 'delivered' ? (
                      <span>Delivered on {order.deliveryDate}</span>
                    ) : (
                      <span>Estimated delivery: {order.estimatedDelivery}</span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-800">Total: ${order.total?.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MyOrders;
