import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: 'Helvetica',
        fontSize: 10,
        color: '#333'
    },
    header: {
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    logo: {
        width: 120,
        height: 40,
        marginBottom: 5
    },
    companyInfo: {
        textAlign: 'right'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#2563EB' // Primary blue
    },
    section: {
        marginBottom: 15
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    label: {
        width: 100,
        fontWeight: 'bold',
        color: '#666'
    },
    value: {
        flex: 1
    },
    table: {
        display: 'table',
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        marginTop: 20,
        marginBottom: 20
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        minHeight: 30,
        alignItems: 'center'
    },
    tableHeader: {
        backgroundColor: '#f9fafb',
        fontWeight: 'bold'
    },
    tableCell: {
        padding: 8,
        fontSize: 9
    },
    col1: { width: '50%' }, // Product
    col2: { width: '15%', textAlign: 'center' }, // Qty
    col3: { width: '15%', textAlign: 'right' }, // Price
    col4: { width: '20%', textAlign: 'right' }, // Total
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingTop: 5
    },
    totalLabel: {
        width: 100,
        textAlign: 'right',
        fontWeight: 'bold',
        paddingRight: 10
    },
    totalValue: {
        width: 80,
        textAlign: 'right',
        fontWeight: 'bold'
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        textAlign: 'center',
        color: '#9ca3af',
        fontSize: 8,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        paddingTop: 10
    }
});

const InvoiceDocument = ({ order }) => {
    // Safe check for order data
    if (!order) return null;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return `₹${amount?.toLocaleString()}`;
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>

                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>INVOICE</Text>
                        <Text style={{ fontSize: 12, color: '#666' }}>#{order.orderNumber}</Text>
                    </View>
                    <View style={styles.companyInfo}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 2 }}>S Square Industries</Text>
                        <Text>2/177, Gandhi Street</Text>
                        <Text>Nazarethpet, Chennai – 600 123</Text>
                        <Text>Phone: +91 9841394925</Text>
                        <Text>Email: ssquaretestingmachine@gmail.com</Text>
                    </View>
                </View>

                {/* Info Grid */}
                <View style={{ flexDirection: 'row', gap: 40, marginBottom: 20 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: 'bold', marginBottom: 5, color: '#4b5563' }}>Bill To:</Text>
                        <Text style={{ fontWeight: 'bold' }}>{order.user?.name || 'Customer'}</Text>
                        <Text>{order.shippingAddress?.street}</Text>
                        <Text>{order.shippingAddress?.city}, {order.shippingAddress?.state}</Text>
                        <Text>{order.shippingAddress?.pincode}</Text>
                        <Text>Phone: {order.shippingAddress?.phone || order.user?.phone}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: 'bold', marginBottom: 5, color: '#4b5563' }}>Order Details:</Text>
                        <View style={styles.row}>
                            <Text style={styles.label}>Date:</Text>
                            <Text style={styles.value}>{formatDate(order.createdAt)}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Status:</Text>
                            <Text style={styles.value}>{order.status?.toUpperCase()}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Payment:</Text>
                            <Text style={styles.value}>{order.paymentInfo?.status?.toUpperCase()}</Text>
                        </View>
                    </View>
                </View>

                {/* Items Table */}
                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={[styles.tableCell, styles.col1]}>Item</Text>
                        <Text style={[styles.tableCell, styles.col2]}>Quantity</Text>
                        <Text style={[styles.tableCell, styles.col3]}>Price</Text>
                        <Text style={[styles.tableCell, styles.col4]}>Total</Text>
                    </View>

                    {order.items?.map((item, index) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={[styles.tableCell, styles.col1]}>{item.product?.name}</Text>
                            <Text style={[styles.tableCell, styles.col2]}>{item.quantity}</Text>
                            <Text style={[styles.tableCell, styles.col3]}>{formatCurrency(item.price)}</Text>
                            <Text style={[styles.tableCell, styles.col4]}>{formatCurrency(item.price * item.quantity)}</Text>
                        </View>
                    ))}
                </View>

                {/* Summary */}
                <View style={{ alignItems: 'flex-end', marginTop: 10 }}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Subtotal:</Text>
                        <Text style={styles.totalValue}>{formatCurrency(order.totalAmount)}</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Grand Total:</Text>
                        <Text style={[styles.totalValue, { fontSize: 12, color: '#2563EB' }]}>{formatCurrency(order.totalAmount)}</Text>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text>Thank you for your business!</Text>
                    <Text style={{ marginTop: 2 }}>For support, please contact us at ssquaretestingmachine@gmail.com</Text>
                </View>

            </Page>
        </Document>
    );
};

export default InvoiceDocument;
