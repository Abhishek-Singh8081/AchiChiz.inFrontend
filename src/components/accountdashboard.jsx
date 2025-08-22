import React, { useContext, useEffect, useState } from 'react';
import { User, ShoppingBag, Heart, TrendingUp, Award } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { auth } from '../data/allapi';

const AccountDashboard = () => {
  const { usertoken } = useContext(AuthContext);
  const [userdata, setUserdata] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(auth.GET_USER_PROFILE, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${usertoken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserdata(data.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (usertoken) {
      fetchUserData();
    }
  }, [usertoken]);

  if (!userdata) {
    return <div className="text-center py-10">Loading user data...</div>;
  }

  const order = userdata?.orders?.length || 0;
  const wishlist = userdata?.addtowishlist?.length || 0;

  const stats = [
    { icon: ShoppingBag, label: 'Total Orders', value: order, color: 'bg-blue-500' },
    { icon: Heart, label: 'Wishlist Items', value: wishlist, color: 'bg-pink-500' },
    { icon: Award, label: 'Loyalty Points', value: '1,250', color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-10">
      <div className="text-center p-8 bg-[#F6F5F5] border border-white/40 shadow-[8px_8px_20px_rgba(0,0,0,0.05)] backdrop-blur-md">
        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
          <User className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          Welcome back, {userdata.name}!
        </h2>
        <p className="text-gray-600 text-sm">
          Manage your account and track your activities from here.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white/30 backdrop-blur-xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.color} shadow-md`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white/30 backdrop-blur-xl p-6 border border-white/50 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-indigo-600" />
          Recent Orders
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Order ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
              </tr>
            </thead>
            <tbody>
              {userdata.orders?.slice(0, 5).map((order, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="py-3 px-4 font-medium text-gray-800">
                    #{order._id.slice(-6).toUpperCase()}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.orderStatus === 'Delivered'
                          ? 'bg-green-100 text-green-700'
                          : order.orderStatus === 'Processing'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-gray-800">
                    ₹{order.totalAmount}
                  </td>
                </tr>
              ))}
              {userdata.orders?.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center text-gray-500 py-4">
                    No recent orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AccountDashboard;
