'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Phone, User, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useOrders, OrdersProvider } from '@/contexts/OrdersContext';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';

const OrdersPageContent = () => {
  const { state, dispatch } = useCart();
  const { addOrder } = useOrders();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [orderData, setOrderData] = useState({
    customerName: '',
    customerAddress: '',
    customerPhone: ''
  });

  // If no items in cart, redirect to products
  if (state.items.length === 0) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="text-8xl mb-8">📋</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">No Items to Order</h1>
            <p className="text-xl text-gray-600 mb-8">
              Your cart is empty. Add some delicious items first!
            </p>
            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-8 rounded-full text-lg shadow-xl transition-all duration-300"
              >
                <span className="flex items-center space-x-2">
                  <ShoppingBag className="w-5 h-5" />
                  <span>Start Shopping</span>
                </span>
              </motion.button>
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate form data
    if (!orderData.customerName.trim() || !orderData.customerPhone.trim() || !orderData.customerAddress.trim()) {
      alert('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }
    
    // Validate cart items
    if (state.items.length === 0) {
      alert('Your cart is empty');
      setIsSubmitting(false);
      return;
    }
    
    console.log('Cart state:', state);
    console.log('Cart items:', state.items);
    
    // Log each item for debugging
    state.items.forEach((item, index) => {
      console.log(`Item ${index}:`, item);
      console.log(`Item ${index} product:`, item.product);
      if (item.product) {
        console.log(`Item ${index} product.id:`, item.product.id);
      }
    });

    try {
      // Create order object for MongoDB - send cart items directly
      const newOrder = {
        customerName: orderData.customerName.trim(),
        customerPhone: `+20${orderData.customerPhone.trim()}`,
        customerAddress: orderData.customerAddress.trim(),
        items: state.items,  // Send cart items directly with product objects
        totalAmount: total,
        paymentMethod: 'cash',
        status: 'pending',
        createdAt: new Date()
      };

      console.log('Submitting order:', newOrder);
      
      // Save order to MongoDB
      const orderId = await addOrder(newOrder);
      
      console.log('Order saved with ID:', orderId);
      
      // Success message
      alert(`شكراً ${orderData.customerName}! تم تأكيد طلبك بنجاح 🎉\n\nرقم الطلب: ${orderId.slice(-6).toUpperCase()}\nإجمالي المطلوب: ${total} جنيه\nسيتم التوصيل خلال 30-45 دقيقة إلى:\n${orderData.customerAddress}\nسنتواصل معك على: +20${orderData.customerPhone}`);
      
      // Clear cart and redirect
      dispatch({ type: 'CLEAR_CART' });
      router.push('/');
      
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('حدث خطأ في تأكيد الطلب. حاول مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const total = state.total + 35; // Add delivery fee

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Complete Your Order</h1>
            <p className="text-gray-600">Review your items and provide delivery details</p>
          </div>
          <Link href="/cart">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Cart</span>
            </motion.button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              {/* Items List */}
              <div className="space-y-4 mb-6">
                {state.items.map((item, index) => (
                  <motion.div
                    key={item.product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-gray-900">{item.product.name}</h3>
                      <p className="text-sm text-gray-600">{item.product.price} LE × {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-orange-600">
                        {(item.product.price * item.quantity).toFixed(0)} LE
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>{state.total.toFixed(0)} LE</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee:</span>
                  <span>35 LE</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                  <span>Total:</span>
                  <span>{total.toFixed(0)} LE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Details Form */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Delivery Details</h2>
              
              <form onSubmit={handleSubmitOrder} className="space-y-6">
                {/* Customer Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={orderData.customerName}
                    onChange={(e) => setOrderData({...orderData, customerName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>

                {/* Delivery Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Delivery Address
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={orderData.customerAddress}
                    onChange={(e) => setOrderData({...orderData, customerAddress: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="أدخل عنوانك بالتفصيل (الشارع، المنطقة، المعالم القريبة)"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone Number
                  </label>
                  <div className="flex">
                    <div className="flex items-center px-3 py-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-xl">
                      <span className="text-gray-700 font-medium">🇪🇬 +20</span>
                    </div>
                    <input
                      type="tel"
                      required
                      value={orderData.customerPhone}
                      onChange={(e) => setOrderData({...orderData, customerPhone: e.target.value.replace(/\D/g, '')})}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-r-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="1012345678"
                      maxLength={10}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">أدخل رقمك بدون مفتاح الدولة</p>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-full text-lg shadow-xl transition-all duration-300"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Submitting Order...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center space-x-2">
                      <ShoppingBag className="w-5 h-5" />
                      <span>Confirm Order ({total.toFixed(0)} LE)</span>
                    </span>
                  )}
                </motion.button>
              </form>

              <p className="text-xs text-gray-500 mt-4 text-center">
                🚚 Expected delivery time: 30-45 minutes<br/>
                💳 Payment on delivery (Cash only)
              </p>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const OrdersPage = () => {
  return (
    <OrdersProvider>
      <OrdersPageContent />
    </OrdersProvider>
  );
};

export default OrdersPage; 