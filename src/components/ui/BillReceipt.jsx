import React from 'react';
import { forwardRef } from 'react';
import { QrCode, Receipt, Asterisk, Server } from 'lucide-react';

const BillReceipt = forwardRef(({ order }, ref) => {
    if (!order) return null;

    return (
        <div 
            ref={ref} 
            style={{ 
                width: '380px', 
                backgroundColor: '#ffffff', 
                color: '#0f172a', 
                fontFamily: 'monospace',
                padding: '40px 20px',
                margin: '0 auto',
                boxSizing: 'border-box',
                position: 'relative' // Ensure clean capture
            }}
        >
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <Server size={32} style={{ margin: '0 auto 8px', color: '#1e293b' }} />
                <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px' }}>TECH CHAAT WALA</h1>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b', letterSpacing: '1px' }}>KORAMANGALA HUB • NODE 01</p>
                <div style={{ borderTop: '2px dashed #cbd5e1', margin: '16px 0' }} />
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, letterSpacing: '2px' }}>TAX INVOICE</h2>
                <div style={{ borderTop: '2px dashed #cbd5e1', margin: '16px 0' }} />
            </div>

            <div style={{ fontSize: '12px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>ORDER ID:</span>
                    <span style={{ fontWeight: 700 }}>#{order.id.slice(0, 8).toUpperCase()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>DATE & TIME:</span>
                    <span>{new Date(order.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>CLIENT ID:</span>
                    <span>{order.customerName || 'GUEST-USER'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>PAY METHOD:</span>
                    <span>{order.paymentMethod.toUpperCase()}</span>
                </div>
            </div>

            <div style={{ borderTop: '2px dashed #cbd5e1', margin: '16px 0' }} />

            <div style={{ marginBottom: '24px' }}>
                {/* Headers */}
                <div style={{ display: 'flex', fontSize: '10px', fontWeight: 700, borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', marginBottom: '8px' }}>
                    <span style={{ width: '40px' }}>QTY</span>
                    <span style={{ flex: 1 }}>MODULE ITEM</span>
                </div>

                {/* Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {order.items.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', fontSize: '12px', alignItems: 'flex-start' }}>
                            <span style={{ width: '40px', fontWeight: 700 }}>{item.qty}x</span>
                            <span style={{ flex: 1 }}>{item.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ borderTop: '2px dashed #cbd5e1', margin: '16px 0' }} />

            <div style={{ fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>SYS_FEE (15):</span>
                    <span>included</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>TAX (5%):</span>
                    <span>included</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', fontSize: '18px', fontWeight: 900 }}>
                    <span>TOTAL PAYLOAD:</span>
                    <span>INR {order.total}</span>
                </div>
            </div>

            <div style={{ borderTop: '2px dashed #cbd5e1', margin: '24px 0 16px' }} />

            <div style={{ textAlign: 'center' }}>
                <p style={{ margin: '0 0 16px', fontSize: '12px', fontWeight: 700 }}>VERIFIED BY BLOCKCHAIN PROTOCOL 42</p>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                     <QrCode size={48} style={{ color: '#0f172a' }} />
                </div>
                <p style={{ margin: '16px 0 0', fontSize: '10px', color: '#64748b' }}>STORE IN COOL, DRY STORAGE ARRAY.</p>
                <p style={{ margin: '4px 0 0', fontSize: '10px', color: '#64748b' }}>THANK YOU FOR BUILDING WITH US.</p>
            </div>
            
            {/* Absolute Watermark */}
            <div style={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%) rotate(-30deg)', 
                fontSize: '80px', 
                fontWeight: 900, 
                color: 'rgba(0,0,0,0.03)',
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
                zIndex: 0
            }}>
                PAID
            </div>
        </div>
    );
});

export default BillReceipt;
