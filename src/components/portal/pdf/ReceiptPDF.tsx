'use client';

import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#1a1a1a',
    paddingBottom: 10,
  },
  logo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  documentType: {
    fontSize: 10,
    color: '#666666',
    textAlign: 'right',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 4,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  label: {
    width: 140,
    fontSize: 9,
    color: '#666666',
    fontWeight: 'bold',
  },
  value: {
    flex: 1,
    fontSize: 9,
    color: '#1a1a1a',
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
    fontSize: 9,
  },
  feeTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: '#1a1a1a',
    fontWeight: 'bold',
    fontSize: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: '#999999',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 5,
  },
});

interface ReceiptPDFProps {
  application: any;
  payment: any;
}

const ReceiptPDF: React.FC<ReceiptPDFProps> = ({ application, payment }) => {
  const course = application.course || {};
  const user = application.user || {};
  const personalInfo = application.personal_info || {};

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.logo}>Cannoga College</Text>
          <Text style={styles.documentType}>Tuition Receipt</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Receipt Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Receipt Ref:</Text>
            <Text style={styles.value}>{payment?.transaction_reference || '—'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>{payment?.paid_at ? new Date(payment.paid_at).toLocaleDateString('en-CA') : '—'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Payment Type:</Text>
            <Text style={styles.value}>{payment?.payment_method || '—'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <Text style={styles.value}>{payment?.status || '—'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Student</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{personalInfo.firstName || user.first_name} {personalInfo.lastName || user.last_name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user.email || ''}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Student ID:</Text>
            <Text style={styles.value}>{(user.student_id || '—').replace(/^(SYK|KC|KU|HU)/, 'CC')}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Program</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Program:</Text>
            <Text style={styles.value}>{course.title || '—'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>School:</Text>
            <Text style={styles.value}>{course.school?.name || '—'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Breakdown</Text>
          <View style={styles.feeRow}>
            <Text>Tuition Fee</Text>
            <Text>${(payment?.amount || 0).toLocaleString()}</Text>
          </View>
          <View style={styles.feeRow}>
            <Text>Ancillary Fees</Text>
            <Text>$0</Text>
          </View>
          <View style={styles.feeTotal}>
            <Text>Total Paid</Text>
            <Text>${(payment?.amount || 0).toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>Cannoga College | 81 Montreal Rd, Ottawa, Ontario, K1L 6E8</Text>
          <Text>Official Receipt</Text>
        </View>
      </Page>
    </Document>
  );
};

export default ReceiptPDF;