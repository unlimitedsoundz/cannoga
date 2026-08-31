import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    paddingTop: 40,
    paddingBottom: 40,
    paddingLeft: 50,
    paddingRight: 50,
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.5,
    color: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  titleGroup: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.15,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 11,
    color: '#000000',
  },
  logo: {
    width: 120,
    height: 33,
    objectFit: 'contain',
  },
  intro: {
    marginBottom: 16,
  },
  introText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.1,
    marginBottom: 6,
    color: '#000000',
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#000000',
    borderCollapse: 'collapse',
    marginBottom: 16,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  tableCell: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#000000',
    padding: 4,
    justifyContent: 'flex-start',
  },
  tableCellLast: {
    flex: 1,
    padding: 4,
    justifyContent: 'flex-start',
  },
  tableCellHalf: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#000000',
    padding: 4,
    justifyContent: 'flex-start',
  },
  tableCellThird: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#000000',
    padding: 4,
    justifyContent: 'flex-start',
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: 11,
    color: '#000000',
  },
  noteBox: {
    borderWidth: 1,
    borderColor: '#000000',
    padding: 8,
    marginBottom: 16,
  },
  noteTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.1,
    marginBottom: 4,
    color: '#000000',
  },
  noteText: {
    fontSize: 10,
    color: '#000000',
    lineHeight: 1.5,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.1,
    marginBottom: 6,
    color: '#000000',
  },
  bodyText: {
    fontSize: 12,
    color: '#000000',
    lineHeight: 1.6,
    marginBottom: 8,
  },
  listItem: {
    fontSize: 12,
    color: '#000000',
    lineHeight: 1.6,
    marginBottom: 4,
    paddingLeft: 16,
  },
  signatureSection: {
    marginTop: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  signatureText: {
    fontSize: 12,
    color: '#000000',
    lineHeight: 1.6,
  },
  signatureImage: {
    width: 120,
    height: 50,
    objectFit: 'contain',
  },
  footer: {
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#cccccc',
    paddingTop: 8,
    textAlign: 'center',
    fontSize: 9,
    color: '#000000',
  },
  grid2Col: {
    flexDirection: 'row',
    gap: 8,
  },
  gridItem: {
    flex: 1,
    minWidth: 0,
  },
  gridItemLast: {
    flex: 2,
    minWidth: 0,
  },
  grayText: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 2,
  },
});

interface ConditionalOfferPDFProps {
  application: any;
  offer: any;
  logoUrl?: string;
  signatureUrl?: string;
}

const ConditionalOfferPDF: React.FC<ConditionalOfferPDFProps> = ({ application, offer, logoUrl, signatureUrl }) => {
  const course = application.course || {};
  const school = course.school || {};
  const user = application.user || {};
  const personalInfo = application.personal_info || {};
  const offerData = offer || {};

  const tuitionFee = offerData.tuition_fee || 0;
  const mandatoryFees = 700;
  const totalAnnualFees = tuitionFee + mandatoryFees;
  const totalDue1 = totalAnnualFees;
  const totalDue2 = 2000;
  const totalDue3 = totalDue1 - totalDue2;

  const today = new Date();
  const admissionTimestamp = offerData.accepted_at || offerData.created_at || application.updated_at || application.submitted_at || application.created_at || today.toISOString();
  const dateOfIssue = new Date(admissionTimestamp).toLocaleDateString('en-CA');
  const expiryDate = new Date(admissionTimestamp);
  expiryDate.setMonth(expiryDate.getMonth() + 3);
  const expiryDateLabel = new Date(expiryDate).toLocaleDateString('en-CA');
  const paymentDeadline = offerData.payment_deadline
    ? new Date(offerData.payment_deadline)
    : new Date(admissionTimestamp);
  paymentDeadline.setDate(paymentDeadline.getDate() + 30);
  const paymentDeadlineLabel = new Date(paymentDeadline).toLocaleDateString('en-CA');

  const degreeLevelRaw = (course.degreeLevel || '').toUpperCase();
  const degreeLevelLabel =
    (degreeLevelRaw === 'MASTER' || degreeLevelRaw === 'ADVANCED_DIPLOMA') ? "Ontario College Advanced Diploma"
      : degreeLevelRaw === 'BACHELOR' ? "Bachelor's Degree"
        : degreeLevelRaw === 'DIPLOMA' ? 'Ontario College Diploma'
          : degreeLevelRaw === 'CERTIFICATE' ? 'Ontario College Certificate'
            : "Bachelor's Degree";

  const years = (degreeLevelRaw === 'MASTER' || degreeLevelRaw === 'ADVANCED_DIPLOMA') ? 3 : degreeLevelRaw === 'BACHELOR' ? 4 : degreeLevelRaw === 'DIPLOMA' ? 2 : 1;
  const programLength = `${years} Year${years > 1 ? 's' : ''}`;
  const levelOfStudy = (degreeLevelRaw === 'MASTER' || degreeLevelRaw === 'ADVANCED_DIPLOMA') ? 'Level 6' : degreeLevelRaw === 'BACHELOR' ? 'Level 6' : 'Level 5';
  const hoursOfInstruction = (degreeLevelRaw === 'MASTER' || degreeLevelRaw === 'ADVANCED_DIPLOMA') ? '2,400' : degreeLevelRaw === 'BACHELOR' ? '2,400' : '1,200';

  const applicantFirstName = personalInfo.firstName || user.first_name || '';
  const applicantLastName = personalInfo.lastName || user.last_name || '';
  const applicantAddress = [
    personalInfo.streetAddress || user.address || '',
    [personalInfo.city || user.city, user.state_province, user.zipcode].filter(Boolean).join(', '),
    personalInfo.country || user.country_of_residence
  ].filter(Boolean).join(', ') || 'Address Pending';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleGroup}>
            <Text style={styles.title}>Letter of Offer</Text>
            <Text style={styles.dateText}>Date of Issue: {dateOfIssue}</Text>
          </View>
          <Image src={logoUrl || 'https://lbkrzyqpdqgtqbodkcyi.supabase.co/storage/v1/object/public/application-documents/logo-cannoga.png'} style={styles.logo} />
        </View>

        {/* Intro */}
        <View style={styles.intro}>
          <Text style={styles.introText}>Congratulations! You have been offered admission to Cannoga College.</Text>
        </View>

        {/* Applicant & Programme Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Applicant & Programme Details</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={[styles.tableCellHalf, { flex: 2 }]}>
                <Text style={styles.fieldLabel}>Full Name (Passport Match)</Text>
                <Text style={styles.fieldValue}>{`${applicantFirstName} ${applicantLastName}`.trim() || '-'}</Text>
              </View>
              <View style={styles.tableCellLast}>
                <Text style={styles.fieldLabel}>Application ID</Text>
                <Text style={styles.fieldValue}>{application.id.slice(0, 8).toUpperCase()}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCellHalf}>
                <Text style={styles.fieldLabel}>Intended Programme</Text>
                <Text style={styles.fieldValue}>{course.title || '-'}</Text>
              </View>
              <View style={styles.tableCellLast}>
                <Text style={styles.fieldLabel}>Intake & Year</Text>
                <Text style={styles.fieldValue}>{application.intake || '-'}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCellHalf}>
                <Text style={styles.fieldLabel}>Degree Level</Text>
                <Text style={styles.fieldValue}>{degreeLevelLabel}</Text>
              </View>
              <View style={styles.tableCellLast}>
                <Text style={styles.fieldLabel}>Programme Length</Text>
                <Text style={styles.fieldValue}>{programLength}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCellHalf}>
                <Text style={styles.fieldLabel}>Student ID #</Text>
                <Text style={styles.fieldValue}>{(user.student_id || application.id.slice(0, 8).toUpperCase()).replace(/^(SYK|KC|KU|HU)/, 'CC')}</Text>
              </View>
              <View style={styles.tableCellLast}>
                <Text style={styles.fieldLabel}>Date of Birth</Text>
                <Text style={styles.fieldValue}>{user.date_of_birth || personalInfo.dateOfBirth || '-'}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={{ ...styles.tableCell, flex: 2 }}>
                <Text style={styles.fieldLabel}>Mailing Address</Text>
                <Text style={styles.fieldValue}>{applicantAddress}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Offer Statement */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Offer Statement</Text>
          <Text style={styles.bodyText}>Dear {applicantFirstName || 'Applicant'},</Text>
          <Text style={styles.bodyText}>
            We are pleased to inform you that, following a thorough review of your application, the Admissions Committee of Cannoga College has decided to offer you a place in the {course.title || '-'} ({degreeLevelLabel}) programme for the {application.intake || '-'} intake.
          </Text>
          <Text style={styles.bodyText}>
            This offer is subject to the conditions outlined below, including acceptance of the offer via the student portal and confirmation of tuition payment by the specified deadline. Upon fulfillment of these conditions, an official Letter of Admission will be issued confirming your enrollment.
          </Text>
        </View>

        {/* Conditions of Offer */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conditions of Offer</Text>
          <Text style={styles.bodyText}>This offer is conditional upon acceptance and fulfillment of all stated requirements:</Text>
          <Text style={styles.listItem}>• Formal acceptance of this offer via the student portal.</Text>
          <Text style={styles.listItem}>• Payment of required tuition deposit by the specified deadline.</Text>
          <Text style={styles.listItem}>• Submission of any outstanding original documents (if applicable).</Text>
        </View>

        {/* Tuition & Financial Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tuition & Financial Information</Text>
          <Text style={styles.bodyText}>The following tuition information is provided for your reference based on the programme and degree level.</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={{ ...styles.tableCell, flex: 2 }}>
                <Text style={styles.fieldLabel}>Tuition Fee (Annual)</Text>
                <Text style={styles.fieldValue}>${tuitionFee.toLocaleString()} CAD</Text>
              </View>
              <View style={styles.tableCellLast}>
                <Text style={styles.fieldLabel}>Mandatory Fees</Text>
                <Text style={styles.fieldValue}>${mandatoryFees.toLocaleString()} CAD</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={{ ...styles.tableCell, flex: 2 }}>
                <Text style={styles.fieldLabel}>Total Annual Fees</Text>
                <Text style={styles.fieldValue}>${totalAnnualFees.toLocaleString()} CAD</Text>
              </View>
              <View style={styles.tableCellLast}>
                <Text style={styles.fieldLabel}>Tuition Deposit</Text>
                <Text style={styles.fieldValue}>${totalDue2.toLocaleString()} CAD</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={{ ...styles.tableCell, flex: 2 }}>
                <Text style={styles.fieldLabel}>Total Due</Text>
                <Text style={styles.fieldValue}>${totalDue1.toLocaleString()} CAD</Text>
              </View>
              <View style={styles.tableCellLast}>
                <Text style={styles.fieldLabel}>Remaining Balance</Text>
                <Text style={styles.fieldValue}>${totalDue3.toLocaleString()} CAD</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Next Steps & Validity */}
        <View style={styles.grid2Col}>
          <View style={styles.gridItem}>
            <Text style={styles.grayText}>NEXT STEPS</Text>
            <Text style={styles.fieldValue}>1. Accept offer via the student portal.</Text>
            <Text style={styles.fieldValue}>2. Proceed to tuition payment.</Text>
            <Text style={styles.fieldValue}>3. Admission letter issued after payment.</Text>
          </View>
          <View style={styles.gridItemLast}>
            <Text style={styles.grayText}>OFFER VALIDITY</Text>
            <Text style={[styles.fieldValue, { fontWeight: 'bold' }]}>{paymentDeadlineLabel}</Text>
            <Text style={styles.grayText}>This offer will lapse automatically if not accepted by the specified date.</Text>
          </View>
        </View>

        {/* Important Note */}
        <View style={styles.noteBox}>
          <Text style={styles.noteTitle}>Important Note</Text>
          <Text style={styles.noteText}>
            Tuition and fees are subject to the institution's official fee schedule. Payment deadlines are listed in the applicant's official offer. Applicable deposits and fees are subject to the college's refund policy. Scholarships, bursaries, and financial awards are subject to their applicable terms and conditions.
          </Text>
        </View>

        {/* Program of Study Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Program Information</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCellHalf}>
                <Text style={styles.fieldLabel}>Academic Status</Text>
                <Text style={styles.fieldValue}>Full-Time</Text>
              </View>
              <View style={styles.tableCellLast}>
                <Text style={styles.fieldLabel}>Program of Study</Text>
                <Text style={styles.fieldValue}>{course.title || '-'}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCellHalf}>
                <Text style={styles.fieldLabel}>Program Code</Text>
                <Text style={styles.fieldValue}>{course.slug || '-'}</Text>
              </View>
              <View style={styles.tableCellLast}>
                <Text style={styles.fieldLabel}>Campus</Text>
                <Text style={styles.fieldValue}>Ottawa</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCellHalf}>
                <Text style={styles.fieldLabel}>Credential</Text>
                <Text style={styles.fieldValue}>{degreeLevelLabel}</Text>
              </View>
              <View style={styles.tableCellLast}>
                <Text style={styles.fieldLabel}>Hours of Instruction</Text>
                <Text style={styles.fieldValue}>{hoursOfInstruction}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCellHalf}>
                <Text style={styles.fieldLabel}>Level of Study</Text>
                <Text style={styles.fieldValue}>{levelOfStudy}</Text>
              </View>
              <View style={styles.tableCellLast}>
                <Text style={styles.fieldLabel}>Expiry of Letter of Offer</Text>
                <Text style={styles.fieldValue}>{expiryDateLabel}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Page 2 */}
      </Page>

      <Page size="A4" style={styles.page}>
        {/* To Accept This Letter of Offer */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>To Accept This Letter of Offer</Text>
          <Text style={styles.bodyText}>1. Acceptance is confirmed through the official Cannoga College admissions process. Any required payment must be made through the institution's authorized payment channel. Do not send cash or personal cheques by mail.</Text>
          <Text style={styles.bodyText}>2. Applicants must complete all required documentation through the official applicant portal by the specified deadline. Incomplete submissions may delay processing.</Text>
          <Text style={styles.bodyText}>3. Orientation requirements will be communicated to your student email account prior to the start of the program. Attendance is mandatory for all new students.</Text>
        </View>

        {/* Payment Options for International Students */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Payment Options for International Students</Text>
          <Text style={styles.bodyText}>International students should use only payment methods officially authorized by Cannoga College. The following options are available:</Text>
          <Text style={styles.listItem}>• Online payment: Through the official Cannoga College student portal using a certified payment provider.</Text>
          <Text style={styles.listItem}>• Bank transfer: Contact the Admissions Office for official banking instructions. Do not transfer funds to personal accounts.</Text>
          <Text style={styles.listItem}>• Other authorized method: As specified by the Finance Office in your official invoice.</Text>
        </View>

        {/* Payment Options for Students in Canada */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Payment Options for Students in Canada</Text>
          <Text style={styles.listItem}>• Online payment through the official student portal.</Text>
          <Text style={styles.listItem}>• Authorized bank payment at a recognized financial institution.</Text>
          <Text style={styles.listItem}>• Other methods officially supported by Cannoga College.</Text>
        </View>

        {/* Student Portal */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Cannoga College Student Portal</Text>
          <Text style={styles.bodyText}>Students can use the official portal to:</Text>
          <Text style={styles.listItem}>• Review admission information.</Text>
          <Text style={styles.listItem}>• Submit required documents.</Text>
          <Text style={styles.listItem}>• Monitor application status.</Text>
          <Text style={styles.listItem}>• Review tuition information.</Text>
          <Text style={styles.listItem}>• Access registration information.</Text>
          <Text style={styles.bodyText}>Portal URL: <Text style={{ fontWeight: 'bold' }}>portal.cannogacollege.ca</Text></Text>
        </View>

        {/* Program Requirements */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Program Requirements</Text>
          <Text style={styles.bodyText}>Program-specific requirements must be completed before enrollment where applicable. These may include:</Text>
          <Text style={styles.listItem}>• Academic documentation (transcripts, certificates).</Text>
          <Text style={styles.listItem}>• English-language requirements (IELTS, TOEFL, or equivalent).</Text>
          <Text style={styles.listItem}>• Prerequisite courses or bridging programs.</Text>
          <Text style={styles.listItem}>• Identity documentation (valid passport).</Text>
          <Text style={styles.listItem}>• Other program-specific requirements as specified in your offer.</Text>
        </View>

        {/* Canadian Study Permit */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Canadian Study Permit</Text>
          <Text style={styles.bodyText}>International students who require a Canadian study permit are responsible for applying through the appropriate Government of Canada process. Admission to Cannoga College does not guarantee approval of a study permit.</Text>
          <Text style={styles.bodyText}>Official Government of Canada immigration information: <Text style={{ fontWeight: 'bold' }}>canada.ca/en/immigration-refugees-citizenship/services/study-canada.html</Text></Text>
        </View>

        {/* Closing */}
        <View style={styles.section}>
          <Text style={styles.bodyText}>We look forward to welcoming you to Cannoga College.</Text>
          <View style={styles.signatureSection}>
            <View>
              <Text style={styles.signatureText}>Sincerely,</Text>
              <Text style={[styles.signatureText, { marginTop: 6, fontWeight: 'bold' }]}>Todd Banning</Text>
              <Text style={[styles.signatureText, { fontWeight: 'bold' }]}>Registrar | Cannoga College</Text>
            </View>
            <Image src={signatureUrl || 'https://lbkrzyqpdqgtqbodkcyi.supabase.co/storage/v1/object/public/application-documents/registrar-signature.png'} style={styles.signatureImage} />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Cannoga College | 81 Montreal Rd, Ottawa, Ontario, K1L 6E8 | admissions@cannogacollege.ca</Text>
          <Text>Letter of Offer</Text>
        </View>
      </Page>
    </Document>
  );
};

export default ConditionalOfferPDF;

