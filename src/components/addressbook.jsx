import React, { useState, useEffect, useContext } from 'react';
import { Plus, Edit3, Trash2, MapPin, Home, Briefcase } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { address } from '../data/allapi';

const AddressBook = () => {
  const [addresses, setAddresses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const { usertoken } = useContext(AuthContext);

  const normalizeAddress = (item) => ({
    id: item._id,
    type: item.addressType?.toLowerCase() || 'other',
    name: item.addressType || 'Other',
    fullName: item.name,
    address: item.address,
    city: item.city,
    state: item.state,
    pincode: item.pin?.toString() || '',
    phone: item.phone?.toString() || '',
    isDefault: item.isDefault
  });

  // Fetch addresses
  useEffect(() => {
    fetch(address.GET_ADDRESSES, {
      headers: {
        Authorization: `Bearer ${usertoken}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        setAddresses(data.map(normalizeAddress));
      })
      .catch(console.error);
  }, [usertoken]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      const res = await fetch(`${address.DELETE_ADDRESS}/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${usertoken}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) throw new Error(await res.json().then(d => d.message));
      setAddresses(prev => prev.filter(a => a.id !== id));
    } catch (e) {
      console.error(e);
      alert(e.message);
    }
  };

  const updateAddressFlag = async (id, flag) => {
    try {
      const res = await fetch(`${address.UPDATE_ADDRESS}/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${usertoken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isDefault: flag })
      });
      if (!res.ok) throw new Error(await res.json().then(d => d.message));
      const updated = await res.json();

      // Preserve addressType if missing in response
      const existing = addresses.find(a => a.id === id);
      const normalized = normalizeAddress({ ...existing, ...updated });

      setAddresses(prev => prev.map(a => a.id === id ? normalized : a));
      return normalized;
    } catch (e) {
      console.error(e);
      alert(e.message);
      return null;
    }
  };

  const handleSetDefault = async (id) => {
    const current = addresses.find(a => a.isDefault);
    if (current?.id !== id) {
      if (current) {
        const r = await updateAddressFlag(current.id, false);
        if (!r) return;
      }
      const r2 = await updateAddressFlag(id, true);
      if (!r2) return;
      setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
    }
  };

  const handleRemoveDefault = async (id) => {
    const r = await updateAddressFlag(id, false);
    if (r) {
      setAddresses(prev => prev.map(a => a.id === id ? { ...a, isDefault: false } : a));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const type = formData.get('type');
    const payload = {
      name: formData.get('fullName'),
      addressType: type === 'home' ? 'Home' : type === 'work' ? 'Work' : 'Other',
      address: formData.get('address'),
      city: formData.get('city'),
      state: formData.get('state'),
      pin: Number(formData.get('pincode')),
      phone: Number(formData.get('phone')),
      isDefault: formData.get('default') === 'on'
    };

    try {
      const url = editAddress
        ? `${address.UPDATE_ADDRESS}/${editAddress.id}`
        : address.CREATE_ADDRESS;
      const method = editAddress ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${usertoken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(await res.json().then(d => d.message));
      const data = await res.json();
      const normalized = normalizeAddress(data);

      if (payload.isDefault && !editAddress) {
        const current = addresses.find(a => a.isDefault);
        if (current) await updateAddressFlag(current.id, false);
      }

      setAddresses(prev => {
        if (editAddress) {
          return prev.map(a => a.id === editAddress.id ? normalized : a);
        }
        return [...prev, normalized];
      });

      setShowAddForm(false);
      setEditAddress(null);
    } catch (e) {
      console.error(e);
      alert(e.message);
    }
  };

  const getIcon = (type) => {
    if (type === 'home') return Home;
    if (type === 'work') return Briefcase;
    return MapPin;
  };

  const getColor = (type) => {
    if (type === 'home') return 'bg-blue-500';
    if (type === 'work') return 'bg-purple-500';
    return 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <button
          onClick={() => { setEditAddress(null); setShowAddForm(true); }}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition shadow-lg hover:shadow-xl"
        >
          <Plus className="h-4 w-4" /><span>Add New Address</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {addresses.map(addr => {
          const Icon = getIcon(addr.type);
          return (
            <div key={addr.id} className="bg-white/30 backdrop-blur-lg p-6 border border-white/40 shadow-lg hover:shadow-xl transition duration-300">
              <div className="flex justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`${getColor(addr.type)} p-2 rounded-lg shadow-md`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{addr.name}</h3>
                    {addr.isDefault && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Default</span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => { setEditAddress(addr); setShowAddForm(true); }} className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-white/30 rounded-lg transition-colors">
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(addr.id)} className="p-2 text-gray-600 hover:text-red-600 hover:bg-white/30 rounded-lg transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-700">
                <p className="font-medium">{addr.fullName}</p>
                <p>{addr.address}</p>
                <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                <p className="font-medium">Phone: {addr.phone}</p>
              </div>
              <div className="mt-4">
                {!addr.isDefault ? (
                  <button onClick={() => handleSetDefault(addr.id)} className="text-indigo-600 hover:underline text-sm font-semibold">
                    Set as default
                  </button>
                ) : (
                  <button onClick={() => handleRemoveDefault(addr.id)} className="text-red-600 hover:underline text-sm font-semibold">
                    Remove from default
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 border border-white/40 shadow-2xl overflow-auto w-full max-w-md max-h-[90vh]">
            <h3 className="text-xl font-bold text-gray-800 mb-6">{editAddress ? 'Edit Address' : 'Add New Address'}</h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
                <select name="type" defaultValue={editAddress?.type || 'home'} className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input name="fullName" defaultValue={editAddress?.fullName || ''} type="text" className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea name="address" defaultValue={editAddress?.address || ''} rows="3" className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input name="city" defaultValue={editAddress?.city || ''} type="text" className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input name="state" defaultValue={editAddress?.state || ''} type="text" className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                  <input name="pincode" defaultValue={editAddress?.pincode || ''} type="text" className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input name="phone" defaultValue={editAddress?.phone || ''} type="tel" className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" name="default" id="default" defaultChecked={editAddress?.isDefault} className="rounded" />
                <label htmlFor="default" className="text-sm text-gray-700">Set as default address</label>
              </div>
              <div className="flex space-x-4 pt-4">
                <button type="button" onClick={() => { setShowAddForm(false); setEditAddress(null); }} className="flex-1 px-4 py-3 bg-gray-500 text-white hover:bg-gray-600 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition shadow-lg hover:shadow-xl">{editAddress ? 'Update Address' : 'Save Address'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressBook;
