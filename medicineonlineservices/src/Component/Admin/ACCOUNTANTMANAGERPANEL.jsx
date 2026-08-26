import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = "https://ecommerencesite.onrender.com/api";
const MASTER_API_URL = "https://ecommerencesite.onrender.com/api/CustomerAccountantAccountAPI";

export default function ACCOUNTANTMANAGERPANEL({ loggedInAccountant }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('customers');
  
  const [listsDropdownOpen, setListsDropdownOpen] = useState(true);
  const [isShopOpen, setIsShopOpen] = useState(true);

  const [customers, setCustomers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [accountTypesList, setAccountTypesList] = useState([]);
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const [modalMode, setModalMode] = useState(null); // 'transaction' or 'editDetails'
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [refundRollbackForm, setRefundRollbackForm] = useState({
    itemDescription: '',
    refundQuantity: 1,
    unitPrice: 0,
    deductionAmount: 0,
    processedBy: '',
    reason: 'Customer Return'
  });

  // Strict Accountant Name Resolution (Dynamic matching for Pawan Kumar & Accountant Manager Type)
  const getDynamicAccountantName = () => {
    let accountantData = loggedInAccountant;
    
    // Check all possible local storage keys if prop is missing
    if (!accountantData || typeof accountantData !== 'object') {
      try {
        const storedKeys = ['loggedInAccountant', 'adminUser', 'user', 'accountant', 'currentUser', 'userInfo', 'auth', 'adminRegistrationList'];
        for (let key of storedKeys) {
          const val = localStorage.getItem(key) || sessionStorage.getItem(key);
          if (val) {
            const parsed = JSON.parse(val);
            if (Array.isArray(parsed) && parsed.length > 0) {
              // Find matching accountant manager type or take the latest
              const matched = parsed.find(item => 
                (item.type || item.role || '').toLowerCase().includes('accountant')
              ) || parsed[0];
              accountantData = matched;
              break;
            } else if (parsed && typeof parsed === 'object') {
              accountantData = parsed;
              break;
            }
          }
        }
      } catch (e) {
        console.error("Error reading stored session:", e);
      }
    }
    
    // Fallback default if nothing found to Pawan Kumar based on database record
    if (!accountantData) return 'Pawan Kumar';
    if (typeof accountantData === 'string') return accountantData;

    const first = accountantData.firstName || accountantData.FirstName || accountantData.fname || accountantData.first_name || '';
    const last = accountantData.lastName || accountantData.LastName || accountantData.lname || accountantData.last_name || '';
    const combinedName = [first, last].filter(Boolean).join(' ').trim();
    
    if (combinedName) return combinedName;
    return accountantData.fullName || accountantData.name || accountantData.userName || accountantData.accountantName || 'Pawan Kumar';
  };

  const accountantDisplayName = getDynamicAccountantName();

  const [customerForm, setCustomerForm] = useState({
    customerName: '',
    email: '',
    phone: '',
    deliveryAddress: '', 
    openingBalance: '',
    accountType: '',
    items: [],
    refundItems: []
  });

  const [invoiceForm, setInvoiceForm] = useState({
    invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
    customerId: '',
    accountantName: accountantDisplayName,
    accountantEmail: loggedInAccountant?.email || 'infogautamdev@gmail.com',
    dueDate: '',
    gstRate: 18,
    status: 'Unpaid',
    items: [{ itemDescription: '', quantity: 1, unitPrice: 0 }]
  });

  useEffect(() => {
    fetchData();
    fetchAccountTypes();
  }, []);

  const fetchAccountTypes = async () => {
    try {
      const response = await axios.get(`${MASTER_API_URL}/AllCustomerAccounts`);
      if (response.data && response.data.length > 0) {
        setAccountTypesList(response.data);
      }
    } catch (error) {
      console.error("Error fetching account types:", error);
    }
  };

  const fetchData = async () => {
    try {
      let combinedList = [];

      const storageKeysToTry = ['orders', 'cart', 'checkoutOrders', 'customerOrders', 'recentOrders', 'savedOrders'];
      for (const key of storageKeysToTry) {
        const storedData = localStorage.getItem(key) || sessionStorage.getItem(key);
        if (storedData) {
          try {
            const parsed = JSON.parse(storedData);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const formatted = parsed.map((ord, idx) => ({
                id: ord.id || ord._id || ord.orderId || idx + 1,
                customerName: ord.receiverName || ord.customerName || ord.name || ord.fullName || 'Gautam Dev',
                email: ord.email || 'gautam@example.com',
                phone: ord.phone || ord.mobile || ord.receiverPhone || '8409844260',
                deliveryAddress: ord.deliveryAddress || ord.address || ord.shippingAddress || 'Motihari, East Champaran, Bihar - 845401',
                currentBalance: ord.totalBillAmount || ord.totalAmount || ord.amount || 126,
                paymentMethod: ord.paymentMode || ord.paymentMethod || 'Cash on Delivery',
                accountType: ord.paymentMode || ord.paymentMethod || 'Cash on Delivery',
                items: ord.items || [{ itemDescription: 'Toothbrush', quantity: 1, unitPrice: 126 }],
                refundItems: ord.refundItems || []
              }));
              combinedList = [...combinedList, ...formatted];
            }
          } catch (err) {
            console.error("Parsing local storage error:", err);
          }
        }
      }

      const [custRes, orderRes, invRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/customers`).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/orders`).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/invoices`).catch(() => ({ data: [] }))
      ]);
      
      if (custRes.data && custRes.data.length > 0) {
        combinedList = [...combinedList, ...custRes.data];
      }

      if (orderRes.data && orderRes.data.length > 0) {
        const formattedOrders = orderRes.data.map((ord, idx) => ({
          id: ord.id || ord._id || ord.orderId || idx + 100,
          customerName: ord.receiverName || ord.customerName || ord.name || 'Gautam Dev',
          email: ord.email || 'gautam@example.com',
          phone: ord.phone || ord.mobile || ord.receiverPhone || '8409844260',
          deliveryAddress: ord.deliveryAddress || ord.address || 'Motihari, East Champaran, Bihar - 845401',
          currentBalance: ord.totalBillAmount || ord.totalAmount || ord.amount || 126,
          paymentMethod: ord.paymentMode || ord.paymentMethod || 'Cash on Delivery',
          accountType: ord.paymentMode || ord.paymentMethod || 'Cash on Delivery',
          items: ord.items || [{ itemDescription: 'Toothbrush', quantity: 1, unitPrice: 126 }],
          refundItems: ord.refundItems || []
        }));
        combinedList = [...combinedList, ...formattedOrders];
      }

      if (combinedList.length === 0) {
        combinedList = [
          {
            id: 1,
            customerName: 'Gautam Dev',
            email: 'gautam@example.com',
            phone: '8409844260',
            deliveryAddress: 'Motihari, East Champaran, Bihar - 845401',
            currentBalance: 126,
            accountType: 'Cash on Delivery',
            items: [{ itemDescription: 'Toothbrush', quantity: 1, unitPrice: 126 }],
            refundItems: []
          }
        ];
      }

      setCustomers(combinedList);
      if (invRes.data && invRes.data.length > 0) setInvoices(invRes.data);

      if (combinedList.length > 0) {
        setSelectedOrderIndex(0);
        updateSelectedCustomerForm(combinedList, 0);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      const fallbackList = [
        {
          id: 1,
          customerName: 'Gautam Dev',
          email: 'gautam@example.com',
          phone: '8409844260',
          deliveryAddress: 'Motihari, East Champaran, Bihar - 845401',
          currentBalance: 126,
          accountType: 'Cash on Delivery',
          items: [{ itemDescription: 'Toothbrush', quantity: 1, unitPrice: 126 }],
          refundItems: []
        }
      ];
      setCustomers(fallbackList);
      setSelectedOrderIndex(0);
      updateSelectedCustomerForm(fallbackList, 0);
    }
  };

  const updateSelectedCustomerForm = (custList, index) => {
    const cust = custList[index] || custList[0];
    if (cust) {
      setCustomerForm({
        customerName: cust.customerName || cust.name || '',
        email: cust.email || '',
        phone: cust.phone || cust.mobile || '',
        deliveryAddress: cust.deliveryAddress || cust.address || '',
        openingBalance: cust.currentBalance || cust.openingBalance || 0,
        accountType: cust.accountType || cust.paymentMethod || 'COD',
        items: cust.items || [],
        refundItems: cust.refundItems || []
      });
      setInvoiceForm(prev => ({ 
        ...prev, 
        customerId: cust.id,
        items: cust.items && cust.items.length > 0 ? cust.items : [{ itemDescription: 'Item', quantity: 1, unitPrice: 0 }]
      }));
    }
  };

  const handleOrderDropdownChange = (e) => {
    const idx = Number(e.target.value);
    setSelectedOrderIndex(idx);
    updateSelectedCustomerForm(customers, idx);
  };

  const handleShopToggle = () => {
    setIsShopOpen(!isShopOpen);
  };

  const handleDeleteCustomer = (id) => {
    if (window.confirm("Are you sure you want to delete this customer account?")) {
      const updatedList = customers.filter(c => c.id !== id);
      setCustomers(updatedList);
      const newIndex = 0;
      setSelectedOrderIndex(newIndex);
      updateSelectedCustomerForm(updatedList, newIndex);
      alert("Customer deleted successfully.");
    }
  };

  const handleProcessRefundRollback = (e) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    const qty = Number(refundRollbackForm.refundQuantity) || 1;
    const unitPr = Number(refundRollbackForm.unitPrice) || 0;
    const deduction = Number(refundRollbackForm.deductionAmount) || 0;

    const totalItemAmount = qty * unitPr;
    const finalPayableRefund = totalItemAmount - deduction;

    const newRefundEntry = {
      ...refundRollbackForm,
      totalItemAmount,
      finalPayableRefund,
      processedBy: refundRollbackForm.processedBy || accountantDisplayName,
      date: new Date().toISOString()
    };

    const updatedRefundItems = [...(selectedCustomer.refundItems || []), newRefundEntry];
    const newBalance = Number(selectedCustomer.currentBalance || 0) - finalPayableRefund;

    const updatedCustomer = {
      ...selectedCustomer,
      currentBalance: newBalance,
      refundItems: updatedRefundItems
    };

    const updatedCustomersList = customers.map(c => c.id === selectedCustomer.id ? updatedCustomer : c);
    setCustomers(updatedCustomersList);
    setSelectedCustomer(updatedCustomer);

    const currentActiveCust = updatedCustomersList[selectedOrderIndex];
    if (currentActiveCust && currentActiveCust.id === selectedCustomer.id) {
      updateSelectedCustomerForm(updatedCustomersList, selectedOrderIndex);
    }

    setRefundRollbackForm({
      itemDescription: '',
      refundQuantity: 1,
      unitPrice: 0,
      deductionAmount: 0,
      processedBy: '',
      reason: 'Customer Return'
    });

    alert(`Refund Rollback Processed Successfully! Total: ₹${totalItemAmount}, Deduction: ₹${deduction}, Refunded: ₹${finalPayableRefund}`);
  };

  const filteredCustomers = customers.filter(c => {
    const name = c.customerName || c.name || '';
    const phone = c.phone || c.mobile || '';
    const email = c.email || '';
    const address = c.deliveryAddress || c.address || '';
    const query = searchTerm.toLowerCase();
    return name.toLowerCase().includes(query) || 
           phone.toLowerCase().includes(query) || 
           email.toLowerCase().includes(query) || 
           address.toLowerCase().includes(query);
  });

  const totalPages = 5; 
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...invoiceForm.items];
    updatedItems[index][field] = value;
    setInvoiceForm({ ...invoiceForm, items: updatedItems });
  };

  const addInvoiceItemRow = () => {
    setInvoiceForm({
      ...invoiceForm,
      items: [...invoiceForm.items, { itemDescription: '', quantity: 1, unitPrice: 0 }]
    });
  };

  const subTotalAmount = invoiceForm.items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unitPrice)), 0);
  const gstAmountCalculated = (subTotalAmount * Number(invoiceForm.gstRate)) / 100;
  const finalTotalWithGst = subTotalAmount + gstAmountCalculated;

  const handleAutomaticInvoiceGeneration = (e) => {
    e.preventDefault();
    const activeCustObj = customers[selectedOrderIndex] || customers[0];

    const finalAutomaticInvoice = {
      id: Date.now(),
      ...invoiceForm,
      subTotal: subTotalAmount,
      gstAmount: gstAmountCalculated,
      totalAmount: finalTotalWithGst,
      customer: activeCustObj,
      generatedAt: new Date().toISOString()
    };

    setInvoices(prev => [...prev, finalAutomaticInvoice]);
    alert("Invoice generated and logged successfully!");
  };

  const handleDownloadInvoicePDF = (inv) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Please allow popups to download the invoice PDF.");
      return;
    }

    const htmlContent = `
      <html>
        <head>
          <title className="color:red">Invoice - ${inv.invoiceNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; color: #333; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #333; padding-bottom: 15px; margin-bottom: 20px; }
            .invoice-title { font-size: 24px; font-weight: bold; color: #0f172a; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; font-size: 14px; }
            th { background-color: #f1f5f9; }
            .totals { margin-top: 20px; text-align: right; font-size: 15px; }
            .btn-print { margin-top: 30px; padding: 10px 20px; background: #4f46e5; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; }
            @media print { .btn-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="invoice-title">AKMedizo Store Invoice</div>
              <p>Generated by: ${inv.accountantName || 'Pawan Kumar'}</p>
            </div>
            <div style="text-align: right;">
              <p><strong>Invoice #:</strong> ${inv.invoiceNumber}</p>
              <p><strong>Date:</strong> ${new Date(inv.generatedAt || Date.now()).toLocaleDateString()}</p>
            </div>
          </div>
          <div style="margin-bottom: 20px;">
            <p><strong>Customer Name:</strong> ${inv.customer?.customerName || inv.customer?.name || 'N/A'}</p>
            <p><strong>Phone:</strong> ${inv.customer?.phone || 'N/A'}</p>
            <p><strong>Delivery Address:</strong> ${inv.customer?.deliveryAddress || inv.customer?.address || 'N/A'}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Item Description</th>
                <th>Qty</th>
                <th>Unit Price (₹)</th>
                <th>Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${inv.items ? inv.items.map(item => `
                <tr>
                  <td>${item.itemDescription}</td>
                  <td>${item.quantity}</td>
                  <td>₹${item.unitPrice}</td>
                  <td>₹${item.quantity * item.unitPrice}</td>
                </tr>
              `).join('') : '<tr><td colspan="4">No items</td></tr>'}
            </tbody>
          </table>
          <div class="totals">
            <p>Subtotal: ₹${inv.subTotal || 0}</p>
            <p>GST (${inv.gstRate || 18}%): ₹${inv.gstAmount || 0}</p>
            <h3>Grand Total: ₹${inv.totalAmount || 0}</h3>
          </div>
          <button class="btn-print" onclick="window.print()">Print / Download PDF</button>
        </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#121212' }}>

      {/* Sidebar */}
      <div style={{ 
        width: '280px', 
        backgroundColor: '#16161a', 
        padding: '24px 16px', 
        position: 'fixed',
        height: '100vh', 
        zIndex: 100, 
        overflowY: 'auto',
        borderRight: '1px solid #232329',
        left: 0,
        top: 0
      }}>
        <div className="brand mb-4 px-2 d-flex align-items-center">
          <h5 className="m-0 text-white fw-bold tracking-wide">
            AKMedizo <span className="text-success" style={{ fontSize: '11px' }}>Admin</span>
          </h5>
        </div>

        <div className="px-2 mb-4">
          <div 
            onClick={handleShopToggle} 
            className="p-2.5 rounded d-flex align-items-center justify-content-between" 
            style={{ cursor: 'pointer', backgroundColor: '#1e1e24', border: '1px solid #2d2d37', borderRadius: '6px' }}
          >
            <div className="d-flex flex-column">
              <span style={{ fontSize: '10px', color: '#8a8a98', fontWeight: '600' }}>Store Status</span>
              <span className="text-white fw-bold" style={{ fontSize: '13px' }}>{isShopOpen ? "Open for Orders" : "Closed / Offline"}</span>
            </div>
            <i className={`fas fa-2xl ${isShopOpen ? "fa-toggle-on text-success" : "fa-toggle-off text-danger"}`} style={{ fontSize: '24px' }}></i>
          </div>
        </div>

        <div className="d-flex flex-column gap-1">
          <span className="px-3 text-uppercase fw-bold text-muted" style={{ fontSize: '10px' }}>Core Navigation</span>
          <div className="mt-2">
            <div 
              onClick={() => setListsDropdownOpen(!listsDropdownOpen)}
              className="d-flex align-items-center justify-content-between px-3 py-2 text-white-50 rounded"
              style={{ cursor: 'pointer', fontSize: '13.5px', backgroundColor: '#1e1e24' }}
            >
              <span className="d-flex align-items-center gap-3 text-white">
                <i className="fas fa-boxes text-success"></i> Operations Registry
              </span>
              <i className={`fas fa-chevron-right ${listsDropdownOpen ? 'rotate-90' : ''}`} style={{ fontSize: '10px' }}></i>
            </div>

            {listsDropdownOpen && (
              <div className="position-relative ms-3 mt-1 d-flex flex-column gap-1" style={{ paddingLeft: '8px', fontSize: '13px' }}>
                <Link to="/accountantmanagerplanes" className="btn btn-success w-100 mb-1 text-start btn-sm fw-bold text-white">Accountant Portal</Link>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3" style={{ borderTop: '1px solid #232329' }}>
            <button 
              type="button" 
              onClick={() => navigate('/header')} 
              className="btn btn-link text-start text-danger text-decoration-none w-100 d-flex align-items-center gap-3 px-3 py-2 rounded"
              style={{ fontSize: '13.5px' }}
            >
              <i className="fas fa-sign-out-alt"></i> <span>LogOut</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Pane */}
      <div style={{ marginLeft: '280px', width: 'calc(100% - 280px)', minHeight: '100vh', backgroundColor: '#f8fafc' }} className="p-4 md:p-8 font-sans">
        <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-200">
          
          {/* Top Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6" style={{ background: '#0f172a' }}>
            <div className="space-y-1 text-center md:text-left">
              <span className="bg-indigo-500/20 text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full border border-indigo-500/30">
                Financial Management Suite
              </span>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Accountant & Billing Portal</h1>
              <p className="text-sm text-slate-400">Manage customer ledger, public orders, GST billing, refund rollbacks, and transactions.</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="bg-white/15 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/20 text-right">
                <p className="text-[11px] uppercase tracking-wider text-slate-300 font-semibold">Logged In Accountant</p>
                <p className="text-sm font-bold text-emerald-400">{accountantDisplayName}</p>
              </div>

              <div className="flex bg-slate-900/60 p-1.5 rounded-xl border border-slate-700/60">
                <button 
                  onClick={() => setActiveTab('customers')} 
                  className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'customers' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                  Customers & Orders
                </button>
                <button 
                  onClick={() => setActiveTab('invoices')} 
                  className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'invoices' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                  Billing & GST Invoices
                </button>
              </div>
            </div>
          </div>

          {/* Body Section */}
          <div className="p-6 md:p-8">
            
            {activeTab === 'customers' && (
              <div className="space-y-10">
                
                {/* Dropdown for Delivery Address */}
                <div className="bg-indigo-50/70 border border-indigo-200 p-6 rounded-2xl shadow-sm space-y-4">
                  <div className="flex flex-col space-y-2">
                    <h2 className="text-lg font-bold text-slate-900">Select Delivery Address</h2>
                    <p className="text-xs text-slate-600">Select order address to view associated customer and item details.</p>
                  </div>
                  <div className="w-full">
                    <select
                      value={selectedOrderIndex}
                      onChange={handleOrderDropdownChange}
                      className="w-full px-4 py-3.5 bg-white border border-indigo-300 rounded-xl text-base font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 shadow-sm"
                      style={{ color: '#000', width: '100%' }}
                    >
                      {customers.length > 0 ? (
                        customers.map((c, idx) => (
                          <option key={c.id || idx} value={idx}>
                            📍 {c.deliveryAddress || c.address || 'No Address'} — ({c.customerName || c.name || 'Gautam Dev'})
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>No delivery addresses found</option>
                      )}
                    </select>
                  </div>
                </div>

                {/* Order Details Overview */}
                <div className="bg-slate-50/70 border border-slate-200/80 p-6 md:p-8 rounded-2xl shadow-sm space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                      📋
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Order & Customer Details Overview</h3>
                      <p className="text-xs text-slate-500">Live order information and summary details.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                    <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 space-y-5 shadow-sm w-full">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 border-b pb-3">Receiver & Delivery Info</h4>
                      
                      <div className="space-y-1.5 w-full">
                        <label className="text-xs font-bold text-slate-700 uppercase">Customer Full Name</label>
                        <input
                          type="text"
                          value={customerForm.customerName}
                          readOnly
                          className="w-full px-4 py-3 bg-slate-100 border border-slate-300 rounded-xl text-base font-bold text-slate-900"
                          style={{ color: '#000', width: '100%' }}
                        />
                      </div>

                      <div className="space-y-1.5 w-full">
                        <label className="text-xs font-bold text-slate-700 uppercase">Email Address</label>
                        <input
                          type="text"
                          value={customerForm.email}
                          readOnly
                          className="w-full px-4 py-3 bg-slate-100 border border-slate-300 rounded-xl text-base font-semibold text-slate-900"
                          style={{ color: '#000', width: '100%' }}
                        />
                      </div>

                      <div className="space-y-1.5 w-full">
                        <label className="text-xs font-bold text-slate-700 uppercase">Phone Number</label>
                        <input
                          type="text"
                          value={customerForm.phone}
                          readOnly
                          className="w-full px-4 py-3 bg-slate-100 border border-slate-300 rounded-xl text-base font-semibold text-slate-900"
                          style={{ color: '#000', width: '100%' }}
                        />
                      </div>

                      <div className="space-y-1.5 w-full">
                        <label className="text-xs font-bold text-indigo-900 uppercase">Delivery Address</label>
                        <textarea
                          value={customerForm.deliveryAddress}
                          readOnly
                          rows="4"
                          className="w-full px-4 py-3 bg-amber-50/70 border border-amber-300 rounded-xl text-base font-bold text-slate-900"
                          style={{ color: '#1e293b', width: '100%' }}
                        />
                      </div>
                    </div>

                    <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 space-y-5 shadow-sm w-full flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 border-b pb-3">Receipt & Bill Details</h4>
                        
                        <div className="space-y-2 w-full mt-4">
                          <label className="text-xs font-bold text-slate-700 uppercase">Purchased Items</label>
                          <div className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200 text-base font-semibold text-slate-900">
                            {customerForm.items && customerForm.items.length > 0 ? (
                              customerForm.items.map((item, i) => (
                                <div key={i} className="flex justify-between items-center py-2 border-b last:border-0 border-slate-200">
                                  <span className="font-bold">{item.itemDescription || 'Item'}</span>
                                  <span className="text-slate-700 font-semibold">(Qty {item.quantity || 1}) - ₹{item.unitPrice || 0}</span>
                                </div>
                              ))
                            ) : (
                              <div className="flex justify-between items-center py-2">
                                <span>No items</span>
                                <span className="text-slate-600">₹0</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {customerForm.refundItems && customerForm.refundItems.length > 0 && (
                          <div className="space-y-2 w-full mt-4">
                            <label className="text-xs font-bold text-rose-700 uppercase">Refunded & Deducted Items History</label>
                            <div className="w-full bg-rose-50 p-3 rounded-xl border border-rose-200 text-xs font-semibold text-rose-900">
                              {customerForm.refundItems.map((refItem, rIdx) => (
                                <div key={rIdx} className="flex justify-between items-center py-1 border-b last:border-0 border-rose-200">
                                  <span>{refItem.itemDescription} (Qty: {refItem.refundQuantity})</span>
                                  <span className="font-bold text-rose-700">Refunded: ₹{refItem.finalPayableRefund} (Deducted: ₹{refItem.deductionAmount})</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="space-y-1.5 w-full mt-4">
                          <label className="text-xs font-bold text-indigo-900 uppercase">Current Balance / Amount (₹)</label>
                          <input
                            type="text"
                            value={`₹${customerForm.openingBalance || 0}`}
                            readOnly
                            className="w-full px-4 py-3 bg-indigo-50 border border-indigo-300 rounded-xl text-lg font-extrabold text-indigo-900"
                            style={{ color: '#312e81', width: '100%' }}
                          />
                        </div>

                        <div className="space-y-1.5 w-full mt-4">
                          <label className="text-xs font-bold text-slate-700 uppercase">Account Type / Payment Method</label>
                          <input
                            type="text"
                            value={customerForm.accountType}
                            readOnly
                            className="w-full px-4 py-3 bg-emerald-50 border border-emerald-400 rounded-xl text-base font-bold text-emerald-900"
                            style={{ color: '#065f46', width: '100%' }}
                          />
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t text-xs text-slate-500 text-center font-medium">
                        💡 Note: Item refunds and rollbacks can be initiated by opening the **Details** modal for any customer.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ledger Registry Table with Clean Action Column */}
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <h3 className="text-lg font-bold text-slate-800">Customer Accounts Ledger Registry</h3>
                    <div className="w-full md:w-72">
                      <input
                        type="text"
                        placeholder="Search phone, name, email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-sm">
                    <table className="w-full border-collapse text-left text-sm text-slate-700">
                      <thead className="bg-slate-100 text-slate-800 uppercase text-xs font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3">ID</th>
                          <th className="p-3">Customer Name</th>
                          <th className="p-3">Contact & Address</th>
                          <th className="p-3">Current Balance</th>
                          <th className="p-3">Account Type</th>
                          <th className="p-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {paginatedCustomers.length > 0 ? (
                          paginatedCustomers.map((cust) => {
                            const hasRefunds = cust.refundItems && cust.refundItems.length > 0;
                            return (
                              <tr key={cust.id} className="hover:bg-slate-50">
                                <td className="p-3 font-semibold">#{cust.id}</td>
                                <td className="p-3 font-bold text-slate-900">
                                  {cust.customerName || cust.name}
                                  {hasRefunds && (
                                    <span className="ml-2 px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] rounded-full font-bold">
                                      Refunded
                                    </span>
                                  )}
                                </td>
                                <td className="p-3">
                                  <div>{cust.phone || cust.mobile}</div>
                                  <div className="text-xs text-slate-500 truncate max-w-xs">{cust.deliveryAddress || cust.address}</div>
                                </td>
                                <td className="p-3 font-extrabold text-indigo-700">₹{cust.currentBalance || 0}</td>
                                <td className="p-3 font-semibold text-emerald-700">{cust.accountType || cust.paymentMethod}</td>
                                <td className="p-3 text-center">
                                  <div className="flex justify-center gap-1.5">
                                    <button 
                                      onClick={() => { setSelectedCustomer(cust); setModalMode('editDetails'); }}
                                      className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded text-xs font-bold"
                                      title="Details"
                                    >
                                      👁️ Details
                                    </button>
                                    <button 
                                      onClick={() => { setSelectedCustomer(cust); setModalMode('editDetails'); }}
                                      className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-xs font-bold"
                                      title="Edit"
                                    >
                                      ✏️ Edit
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteCustomer(cust.id)}
                                      className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-bold"
                                      title="Delete"
                                    >
                                      🗑️ Delete
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="6" className="text-center p-6 text-slate-500 font-medium">No records found.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
                    <span className="text-xs text-slate-500 font-medium">
                      Showing page {currentPage} of {totalPages} (Rows per page: {rowsPerPage})
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`px-3 py-1.5 border rounded text-xs font-bold ${currentPage === 1 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
                      >
                        Previous
                      </button>

                      {[1, 2, 3, 4, 5].map((pageNumber) => (
                        <button
                          key={pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                          className={`px-3 py-1.5 border rounded text-xs font-bold ${currentPage === pageNumber ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
                        >
                          {pageNumber}
                        </button>
                      ))}

                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1.5 border rounded text-xs font-bold ${currentPage === totalPages ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {activeTab === 'invoices' && (
              <div className="space-y-8">
                <div className="bg-slate-50 border border-slate-200 p-6 md:p-8 rounded-2xl shadow-sm space-y-6">
                  <h2 className="text-lg font-bold text-slate-900 border-b pb-3">Generate Automatic GST Invoice</h2>
                  <form onSubmit={handleAutomaticInvoiceGeneration} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 uppercase">Invoice Number</label>
                        <input
                          type="text"
                          value={invoiceForm.invoiceNumber}
                          onChange={(e) => setInvoiceForm({ ...invoiceForm, invoiceNumber: e.target.value })}
                          className="w-full px-4 py-2.5 border rounded-xl text-sm font-semibold bg-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 uppercase">GST Rate (%)</label>
                        <input
                          type="number"
                          value={invoiceForm.gstRate}
                          onChange={(e) => setInvoiceForm({ ...invoiceForm, gstRate: Number(e.target.value) })}
                          className="w-full px-4 py-2.5 border rounded-xl text-sm font-semibold bg-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 uppercase">Accountant In Charge</label>
                        <input
                          type="text"
                          value={invoiceForm.accountantName}
                          readOnly
                          className="w-full px-4 py-2.5 border rounded-xl text-sm font-semibold bg-slate-100 text-slate-700"
                        />
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-bold text-slate-800">Invoice Items</h4>
                        <button
                          type="button"
                          onClick={addInvoiceItemRow}
                          className="px-3 py-1 bg-indigo-600 text-white rounded text-xs font-bold"
                        >
                          + Add Item
                        </button>
                      </div>

                      {invoiceForm.items.map((it, idx) => (
                        <div key={idx} className="flex gap-3 items-center">
                          <input
                            type="text"
                            placeholder="Item description"
                            value={it.itemDescription}
                            onChange={(e) => handleItemChange(idx, 'itemDescription', e.target.value)}
                            className="flex-1 px-3 py-2 border rounded-lg text-sm bg-white"
                            required
                          />
                          <input
                            type="number"
                            placeholder="Qty"
                            value={it.quantity}
                            onChange={(e) => handleItemChange(idx, 'quantity', Number(e.target.value))}
                            className="w-20 px-3 py-2 border rounded-lg text-sm bg-white"
                            min="1"
                            required
                          />
                          <input
                            type="number"
                            placeholder="Unit Price (₹)"
                            value={it.unitPrice}
                            onChange={(e) => handleItemChange(idx, 'unitPrice', Number(e.target.value))}
                            className="w-32 px-3 py-2 border rounded-lg text-sm bg-white"
                            min="0"
                            required
                          />
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 flex flex-col md:flex-row justify-between items-center gap-4">
                      <div className="text-sm font-bold text-slate-700">
                        Subtotal: ₹{subTotalAmount} | GST ({invoiceForm.gstRate}%): ₹{gstAmountCalculated} | <span className="text-indigo-700">Grand Total: ₹{finalTotalWithGst}</span>
                      </div>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md"
                      >
                        Generate & Save Invoice
                      </button>
                    </div>
                  </form>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800">Logged GST Invoices</h3>
                  <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-sm">
                    <table className="w-full border-collapse text-left text-sm text-slate-700">
                      <thead className="bg-slate-100 text-slate-800 uppercase text-xs font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3">Invoice #</th>
                          <th className="p-3">Customer Name</th>
                          <th className="p-3">Subtotal</th>
                          <th className="p-3">GST Amount</th>
                          <th className="p-3">Grand Total</th>
                          <th className="p-3 text-center">Action / PDF</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {invoices.length > 0 ? (
                          invoices.map((inv) => (
                            <tr key={inv.id} className="hover:bg-slate-50">
                              <td className="p-3 font-semibold">{inv.invoiceNumber}</td>
                              <td className="p-3 font-bold">{inv.customer?.customerName || inv.customer?.name || 'Customer'}</td>
                              <td className="p-3">₹{inv.subTotal || 0}</td>
                              <td className="p-3">₹{inv.gstAmount || 0}</td>
                              <td className="p-3 font-extrabold text-indigo-700">₹{inv.totalAmount || 0}</td>
                              <td className="p-3 text-center">
                                <button
                                  onClick={() => handleDownloadInvoicePDF(inv)}
                                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold"
                                >
                                  📥 Download PDF / Print
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="text-center p-6 text-slate-500 font-medium">No invoices generated yet.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
      </div>

      {/* Details & Refund Rollback Modal */}
      {modalMode === 'editDetails' && selectedCustomer && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Customer Details & Refund Rollback</h3>
                <p className="text-xs text-slate-500">Account ID: #{selectedCustomer.id} | {selectedCustomer.customerName}</p>
              </div>
              <button 
                onClick={() => { setModalMode(null); setSelectedCustomer(null); }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-xl border">
              <div><strong className="text-slate-500">Phone:</strong> {selectedCustomer.phone || selectedCustomer.mobile}</div>
              <div><strong className="text-slate-500">Email:</strong> {selectedCustomer.email}</div>
              <div className="md:col-span-2"><strong className="text-slate-500">Delivery Address:</strong> {selectedCustomer.deliveryAddress || selectedCustomer.address}</div>
              <div><strong className="text-slate-500">Current Balance:</strong> ₹{selectedCustomer.currentBalance}</div>
              <div><strong className="text-slate-500">Account Type:</strong> {selectedCustomer.accountType || selectedCustomer.paymentMethod}</div>
            </div>

            {selectedCustomer.refundItems && selectedCustomer.refundItems.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-rose-700 uppercase">Processed Refund Items History</h4>
                <div className="bg-rose-50 p-3 rounded-xl border border-rose-200 space-y-2 text-xs">
                  {selectedCustomer.refundItems.map((ref, idx) => (
                    <div key={idx} className="flex justify-between items-center border-b pb-1 border-rose-200 last:border-0">
                      <span>{ref.itemDescription} (Qty: {ref.refundQuantity})</span>
                      <span className="font-bold text-rose-800">Refunded: ₹{ref.finalPayableRefund} (Deduction: ₹{ref.deductionAmount})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleProcessRefundRollback} className="space-y-4 pt-2 border-t">
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Process Item Refund & Rollback</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase">Item Description</label>
                  <input
                    type="text"
                    value={refundRollbackForm.itemDescription}
                    onChange={(e) => setRefundRollbackForm({ ...refundRollbackForm, itemDescription: e.target.value })}
                    placeholder="e.g. Toothbrush"
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase">Refund Quantity</label>
                  <input
                    type="number"
                    value={refundRollbackForm.refundQuantity}
                    onChange={(e) => setRefundRollbackForm({ ...refundRollbackForm, refundQuantity: Number(e.target.value) })}
                    min="1"
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase">Unit Price (₹)</label>
                  <input
                    type="number"
                    value={refundRollbackForm.unitPrice}
                    onChange={(e) => setRefundRollbackForm({ ...refundRollbackForm, unitPrice: Number(e.target.value) })}
                    min="0"
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase">Deduction Amount (₹)</label>
                  <input
                    type="number"
                    value={refundRollbackForm.deductionAmount}
                    onChange={(e) => setRefundRollbackForm({ ...refundRollbackForm, deductionAmount: Number(e.target.value) })}
                    min="0"
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    placeholder="Fee/Shipping cut"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setModalMode(null); setSelectedCustomer(null); }}
                  className="px-4 py-2 border rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow"
                >
                  Confirm & Process Refund Rollback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}