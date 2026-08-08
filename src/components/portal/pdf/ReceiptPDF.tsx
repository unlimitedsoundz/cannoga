import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.3,
    color: '#333333',
  },
  container: {
    width: '100%',
    maxWidth: 800,
    margin: '0 auto',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  collegeBranding: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  collegeLogo: {
    width: 45,
    height: 45,
    objectFit: 'contain',
    marginRight: 10,
  },
  collegeName: {
    fontSize: 27,
    fontWeight: '500',
    color: '#3a4252',
    lineHeight: 1.15,
  },
  stamp: {
    width: 60,
    height: 60,
    objectFit: 'contain',
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    marginVertical: 12,
  },
  subtitle: {
    fontSize: 27,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: '#4a5568',
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  metaTable: {
    width: '100%',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  metaLabel: {
    width: 160,
    fontSize: 9,
    fontWeight: '700',
    color: '#4a5568',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metaValue: {
    flex: 1,
    fontSize: 9,
    color: '#2d3748',
    fontWeight: '500',
  },
  detailsTable: {
    width: '100%',
    marginTop: 10,
  },
  detailsHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 8,
    marginBottom: 2,
  },
  detailsRow: {
    flexDirection: 'row',
    paddingTop: 3,
  },
  colDesc: { width: '40%' },
  colDate: { width: '20%' },
  colOrig: { width: '22%' },
  colRecv: { width: '18%' },
  th: {
    fontSize: 9,
    fontWeight: '700',
    color: '#4a5568',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  td: {
    fontSize: 10,
    color: '#2d3748',
  },
  thankYou: {
    textAlign: 'center',
    color: '#718096',
    fontSize: 10,
    marginTop: 30,
    marginBottom: 10,
  },
  supportBox: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 6,
    padding: 14,
    backgroundColor: '#ffffff',
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  supportIcon: {
    width: 26,
    height: 26,
    borderWidth: 1.5,
    borderColor: '#3182ce',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    color: '#3182ce',
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: 10,
  },
  supportTitle: {
    fontWeight: '700',
    fontSize: 11,
    color: '#2d3748',
  },
  supportSubtext: {
    fontSize: 10,
    color: '#718096',
    marginTop: 2,
  },
  supportLink: {
    color: '#0072ce',
    fontSize: 10,
    fontWeight: '700',
    textDecoration: 'none',
    marginLeft: 'auto',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  poweredBy: {
    fontSize: 8,
    fontWeight: '700',
    color: '#718096',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  flywireLogo: {
    width: 80,
    height: 22,
    objectFit: 'contain',
    marginBottom: 6,
  },
  footerAddress: {
    fontSize: 9,
    color: '#718096',
  },
});

interface ReceiptPDFProps {
  payment: any;
  application: any;
}

const ReceiptPDF: React.FC<ReceiptPDFProps> = ({ payment, application }) => {
  const course = application?.course || {};
  const user = application?.user || {};
  const personalInfo = application?.personal_info || {};

  const fullName = `${personalInfo.firstName || user.first_name || ''} ${personalInfo.lastName || user.last_name || ''}`.trim() || '—';
  const studentId = (user.student_id || application.id || '—').toString().replace(/^(SYK|KC|KU|HU)/, 'CC');

  const paymentId = payment?.id || '—';
  const transactionRef = payment?.transaction_reference || '—';
  const paidAt = payment?.paid_at || payment?.created_at || new Date().toISOString();
  const amount = Number(payment?.amount || 0);
  const currency = payment?.currency || 'CAD';
  const method = payment?.payment_method || '—';
  const status = payment?.status || '—';

  const description = payment?.invoice_type?.replace(/_/g, ' ') || 'Tuition Payment';
  const deliveryDate = new Date(paidAt).toLocaleDateString('en-CA');
  const originatingAmount = `${currency} ${amount.toLocaleString()}`;
  const receivedAmount = `${currency} ${amount.toLocaleString()}`;

  const logoUrl = 'https://lbkrzyqpdqgtqbodkcyi.supabase.co/storage/v1/object/public/application-documents/logo-cannoga.png';
  const stampUrl = 'https://lbkrzyqpdqgtqbodkcyi.supabase.co/storage/v1/object/public/application-documents/Paid%20stamp.png';
  const flywireUrl = 'https://www.designyourway.net/blog/wp-content/uploads/2025/09/logo-5.jpg';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.collegeBranding}>
              <Image style={styles.collegeLogo} src={logoUrl} />
              <View>
                <Text style={styles.collegeName}>Cannoga College</Text>
              </View>
            </View>
            <Image style={styles.stamp} src={stampUrl} />
          </View>

          <View style={styles.divider} />

          {/* Subtitle */}
          <Text style={styles.subtitle}>Flywire Payment Confirmation</Text>

          {/* Meta Table */}
          <View style={styles.metaTable}>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>PAYMENT ID</Text>
              <Text style={styles.metaValue}>{paymentId}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>STUDENT ID</Text>
              <Text style={styles.metaValue}>{studentId}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>FULL NAME</Text>
              <Text style={styles.metaValue}>{fullName}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Details Table */}
          <View style={styles.detailsTable}>
            <View style={styles.detailsHeader}>
              <Text style={[styles.th, styles.colDesc]}>DESCRIPTION</Text>
              <Text style={[styles.th, styles.colDate]}>DELIVERY DATE</Text>
              <Text style={[styles.th, styles.colOrig]}>ORIGINATING AMOUNT</Text>
              <Text style={[styles.th, styles.colRecv]}>RECEIVED AMOUNT</Text>
            </View>
            <View style={styles.detailsRow}>
              <Text style={[styles.td, styles.colDesc]}>{description}</Text>
              <Text style={[styles.td, styles.colDate]}>{deliveryDate}</Text>
              <Text style={[styles.td, styles.colOrig]}>{originatingAmount}</Text>
              <Text style={[styles.td, styles.colRecv]}>{receivedAmount}</Text>
            </View>
          </View>

          {/* Thank You */}
          <Text style={styles.thankYou}>Thank you for completing your payment with us.</Text>

          <View style={styles.divider} />

          {/* Support Box */}
          <View style={styles.supportBox}>
            <View style={styles.supportIcon}>
              <Text>?</Text>
            </View>
            <View>
              <Text style={styles.supportTitle}>Flywire support</Text>
              <Text style={styles.supportSubtext}>Do you need help with your payment?</Text>
            </View>
            <Text style={styles.supportLink}>https://help@flywire.com</Text>
          </View>

          <View style={styles.divider} />

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.poweredBy}>PAYMENT POWERED BY</Text>
            <Image style={styles.flywireLogo} src={flywireUrl} />
            <Text style={styles.footerAddress}>41 Tremont Street - Boston, MA 02111</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ReceiptPDF;
