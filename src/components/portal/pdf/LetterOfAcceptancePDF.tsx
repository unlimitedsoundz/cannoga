import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { getProgramYears } from '@/utils/tuition';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.6,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  documentType: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'right',
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 4,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: 140,
    fontSize: 10,
    color: '#666666',
    fontWeight: 'bold',
  },
  value: {
    flex: 1,
    fontSize: 10,
    color: '#1a1a1a',
  },
  twoColumn: {
    flexDirection: 'row',
    gap: 20,
  },
  column: {
    flex: 1,
  },
  programBox: {
    borderWidth: 1,
    borderColor: '#1a1a1a',
    padding: 10,
    marginBottom: 10,
  },
  programTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
    fontSize: 10,
  },
  feeTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: '#1a1a1a',
    fontWeight: 'bold',
    fontSize: 11,
  },
  condition: {
    fontSize: 9,
    color: '#666666',
    marginBottom: 3,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 9,
    color: '#999999',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 5,
  },
  signature: {
    marginTop: 30,
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: '#1a1a1a',
    width: 200,
    marginTop: 40,
    paddingTop: 4,
    fontSize: 9,
  },
});

interface LetterOfAcceptancePDFProps {
  application: any;
  admissionDetails?: any;
}

const LetterOfAcceptancePDF: React.FC<LetterOfAcceptancePDFProps> = ({ application, admissionDetails }) => {
  const course = application.course || {};
  const school = course.school || {};
  const user = application.user || {};
  const offer = application.offer || {};
  const personalInfo = application.personal_info || {};

  const tuitionFee = offer.tuition_fee || 0;
  const ancillaryFee = offer.ancillary_charged || 0;
  const totalFee = tuitionFee + ancillaryFee;

  const programLength = getProgramYears(course.duration || '', course.degreeLevel);
  const startDate = admissionDetails?.start_date ? new Date(admissionDetails.start_date) : new Date();
  const completionDate = new Date(startDate);
  completionDate.setFullYear(completionDate.getFullYear() + programLength);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.logo}>Cannoga College</Text>
          <Text style={styles.documentType}>Letter of Acceptance</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date</Text>
          <Text>{new Date().toLocaleDateString('en-CA')}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>To</Text>
          <Text style={{ fontWeight: 'bold', fontSize: 12 }}>
            {personalInfo.firstName || user.first_name} {personalInfo.lastName || user.last_name}
          </Text>
          <Text>{user.email || ''}</Text>
          {personalInfo.streetAddress && <Text>{personalInfo.streetAddress}</Text>}
          {personalInfo.city && <Text>{personalInfo.city}</Text>}
          {personalInfo.country && <Text>{personalInfo.country}</Text>}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Re: Admission Offer — {course.title}</Text>
          <Text>Dear {personalInfo.firstName || user.first_name},</Text>
          <Text style={{ marginTop: 8 }}>
            We are pleased to inform you that your application for the {course.title} program at Cannoga College has been accepted.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Program Details</Text>
          <View style={styles.programBox}>
            <View style={styles.row}>
              <Text style={styles.label}>Program:</Text>
              <Text style={styles.value}>{course.title}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>School:</Text>
              <Text style={styles.value}>{school.name || '—'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Duration:</Text>
              <Text style={styles.value}>{course.duration || '—'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Program Length:</Text>
              <Text style={styles.value}>{programLength} {programLength === 1 ? 'Year' : 'Years'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Credential:</Text>
              <Text style={styles.value}>{course.degreeLevel || '—'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Approx. Completion Date:</Text>
              <Text style={styles.value}>{completionDate.toLocaleDateString('en-CA')}</Text>
            </View>
            {admissionDetails?.intake && (
              <View style={styles.row}>
                <Text style={styles.label}>Intake:</Text>
                <Text style={styles.value}>{admissionDetails.intake}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fee Structure</Text>
          <View style={styles.feeRow}>
            <Text>Tuition Fee</Text>
            <Text>${tuitionFee.toLocaleString()}</Text>
          </View>
          {ancillaryFee > 0 && (
            <View style={styles.feeRow}>
              <Text>Ancillary Fees</Text>
              <Text>${ancillaryFee.toLocaleString()}</Text>
            </View>
          )}
          <View style={styles.feeTotal}>
            <Text>Total</Text>
            <Text>${totalFee.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conditions of Admission</Text>
          <Text style={styles.condition}>1. Payment of tuition fees must be made within 14 days of acceptance.</Text>
          <Text style={styles.condition}>2. A valid study permit is required for international students.</Text>
          <Text style={styles.condition}>3. Proof of English proficiency must be provided if not already on file.</Text>
          <Text style={styles.condition}>4. Health insurance is mandatory for all international students.</Text>
          <Text style={styles.condition}>5. This letter of acceptance is valid for the stated intake period only.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Next Steps</Text>
          <Text>1. Review and accept this offer by the deadline stated above.</Text>
          <Text>2. Complete the online enrollment form.</Text>
          <Text>3. Submit required documents (passport, transcripts, English proficiency).</Text>
          <Text>4. Make tuition payment within 14 days.</Text>
        </View>

        <View style={styles.signature}>
          <Text>For Cannoga College</Text>
          <View style={styles.signatureLine}>
            <Text>Registrar</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>Cannoga College | 81 Montreal Rd, Ottawa, Ontario, K1L 6E8</Text>
          <Text>Page 1 of 1</Text>
        </View>
      </Page>
    </Document>
  );
};

export default LetterOfAcceptancePDF;