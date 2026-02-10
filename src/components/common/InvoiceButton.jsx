import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { FiDownload } from 'react-icons/fi';
import InvoiceDocument from '../documents/InvoiceDocument';

const InvoiceButton = ({ order, className = '', buttonStyle = {}, children }) => {
    // Only show invoice if order is paid or in a final state
    const isPaid = order.paymentInfo?.status === 'paid' || order.payment?.status === 'completed';
    const isFinalState = ['delivered', 'completed'].includes(order.status);

    if (!order || (!isPaid && !isFinalState)) return null;

    return (
        <PDFDownloadLink
            document={<InvoiceDocument order={order} />}
            fileName={`Invoice_${order.orderNumber}.pdf`}
            style={{ textDecoration: 'none' }}
        >
            {({ blob, url, loading, error }) => (
                <button
                    className={`btn ${className || 'btn-outline'}`}
                    style={buttonStyle}
                    disabled={loading}
                >
                    {loading ? (children ? '...' : 'Preparing Invoice...') : (
                        children || (
                            <>
                                <FiDownload style={{ marginRight: 8 }} />
                                Download Invoice
                            </>
                        )
                    )}
                </button>
            )}
        </PDFDownloadLink>
    );
};

export default InvoiceButton;
