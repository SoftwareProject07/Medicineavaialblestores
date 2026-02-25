import React, { useState } from 'react';

export default function PRINTER_VOUCHER() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    date: new Date().toISOString().split('T')[0],
    voucherNo: ''
  });

  const [items, setItems] = useState([{ id: 1, desc: '', qty: 0, price: 0 }]);
  const [advance, setAdvance] = useState(0);

  // --- Logic Section (BLL) ---
  const subtotal = items.reduce((acc, item) => acc + (item.qty * item.price), 0);
  const balance = subtotal - advance;

  // --- API Section ---
  const handleSaveAndPrint = async () => {
    const apiUrl = "https://your-api-endpoint.com/vouchers"; // Yahan apni API ka URL lagayein

    const payload = {
      customer: formData,
      items: items,
      financials: {
        total: subtotal,
        advance: advance,
        balance: balance
      }
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert("Data Saved Successfully!");
        window.print(); // Save hone ke baad print dialogue open hoga
      } else {
        alert("API Error: Data save nahi ho paya.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Network Error: API connect nahi ho rahi.");
    }
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  return (
    <div className="voucher-container">
      <style>{`
        .voucher-container { width: 800px; margin: 20px auto; padding: 40px; border: 1px solid #eee; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; background: #fff; }
        .header { text-align: center; margin-bottom: 30px; }
        .biz-name { color: #2c7bb6; font-size: 28px; font-weight: bold; margin-bottom: 2px; }
        .voucher-title { color: #5dade2; font-size: 38px; font-weight: 300; letter-spacing: 6px; float: right; margin-top: -50px; }
        
        .info-section { display: flex; justify-content: space-between; margin-top: 40px; }
        .input-line { border: none; border-bottom: 1px solid #ccc; outline: none; padding: 2px; width: 200px; }

        table { width: 100%; border-collapse: collapse; margin-top: 20px; border: 1px solid #aed6f1; }
        th { background-color: #d6eaf8; border: 1px solid #aed6f1; padding: 12px; text-align: left; color: #2c7bb6; }
        td { border: 1px solid #aed6f1; padding: 8px; }
        tr:nth-child(even) { background-color: #f9fcfd; }

        .footer { display: grid; grid-template-columns: 1.5fr 1fr; gap: 40px; margin-top: 30px; }
        .notes-area { border: 1px dotted #999; height: 100px; padding: 10px; width: 100%; margin-top: 5px; }
        
        .totals-box { border: 1px solid #aed6f1; }
        .row-item { display: flex; justify-content: space-between; padding: 8px 15px; border-bottom: 1px solid #eee; }
        .bg-gray { background: #f2f2f2; font-weight: bold; }
        .btn-panel { margin-top: 20px; display: flex; gap: 10px; }
        
        @media print { .no-print { display: none; } .voucher-container { border: none; margin: 0; } }
      `}</style>

      {/* Top Header */}
      <div className="header">
        <div className="biz-name">Your Business Name</div>
        <div style={{fontSize: '14px', color: '#666'}}>
          Company address, city, state ZIP<br/>
          Contact, telephone, fax<br/>
          <span style={{color: '#3498db', textDecoration: 'underline'}}>Slogan, Web site, email</span>
        </div>
      </div>

      <h1 className="voucher-title">VOUCHER</h1>

      {/* Customer Info */}
      <div className="info-section">
        <div>
          <p><strong>Name :</strong> <input className="input-line" onChange={e => setFormData({...formData, name: e.target.value})} /></p>
          <p><strong>Address :</strong> <input className="input-line" onChange={e => setFormData({...formData, address: e.target.value})} /></p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p><strong>Date :</strong> <input type="date" className="input-line" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} /></p>
          <p><strong>Voucher No :</strong> <input className="input-line" onChange={e => setFormData({...formData, voucherNo: e.target.value})} /></p>
        </div>
      </div>

      {/* Item Table */}
      <table>
        <thead>
          <tr>
            <th style={{width: '10%'}}>Item #</th>
            <th style={{width: '50%'}}>Description</th>
            <th style={{width: '10%'}}>Qty</th>
            <th style={{width: '15%'}}>Unit Price</th>
            <th style={{width: '15%'}}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td><input style={{width: '100%', border: 'none', background: 'transparent'}} onChange={e => updateItem(index, 'desc', e.target.value)} /></td>
              <td><input type="number" style={{width: '100%', border: 'none', background: 'transparent'}} onChange={e => updateItem(index, 'qty', e.target.value)} /></td>
              <td><input type="number" style={{width: '100%', border: 'none', background: 'transparent'}} onChange={e => updateItem(index, 'price', e.target.value)} /></td>
              <td style={{textAlign: 'right'}}>{(item.qty * item.price).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="no-print" onClick={() => setItems([...items, { id: Date.now(), desc: '', qty: 0, price: 0 }])} style={{marginTop: '10px'}}>+ Add Row</button>

      {/* Bottom Section */}
      <div className="footer">
        <div>
          <strong>NOTES:</strong>
          <textarea className="notes-area" placeholder="Enter notes here..."></textarea>
        </div>
        <div className="totals-box">
          <div className="row-item"><span>DISCOUNT</span><span>-</span></div>
          <div className="row-item" style={{fontWeight: 'bold'}}><span>TOTAL</span><span>{subtotal.toFixed(2)}</span></div>
          <div className="row-item" style={{fontStyle: 'italic'}}><span>ADVANCE</span>
            <input type="number" style={{width: '60px', textAlign: 'right'}} onChange={e => setAdvance(parseFloat(e.target.value) || 0)} />
          </div>
          <div className="row-item bg-gray"><span>BALANCE</span><span>{balance.toFixed(2)}</span></div>
        </div>
      </div>

      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <p style={{ marginLeft: '60%' }}><strong>Cashier</strong> ______________________</p>
        <div style={{ background: '#eee', padding: '10px', marginTop: '20px', fontWeight: 'bold', fontStyle: 'italic' }}>
          THANK YOU FOR YOUR BUSINESS!
        </div>
      </div>

      <div className="btn-panel no-print">
        <button onClick={handleSaveAndPrint} style={{ padding: '10px 20px', background: '#2c7bb6', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Save to Database & Print
        </button>
      </div>
    </div>
  );
}