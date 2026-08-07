import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';

// Define Styles matching Cannoga College specs
const styles = StyleSheet.create({
  page: {
    padding: 35,
    fontSize: 9.5,
    fontFamily: 'Helvetica',
    color: '#000000',
    lineHeight: 1.35,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 9.5,
  },
  logo: {
    width: 130,
    height: 50,
    objectFit: 'contain',
  },
  congrats: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 10,
  },
  sectionHeader: {
    backgroundColor: '#F2F2F2',
    padding: 3,
    paddingLeft: 5,
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#000000',
    textTransform: 'uppercase',
  },
  table: {
    borderWidth: 1,
    borderColor: '#000000',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#000000',
  },
  rowLast: {
    flexDirection: 'row',
  },
  col2: {
    width: '50%',
    padding: 4,
    borderRightWidth: 1,
    borderColor: '#000000',
  },
  col2Last: {
    width: '50%',
    padding: 4,
  },
  bold: {
    fontFamily: 'Helvetica-Bold',
  },
  footerNote: {
    fontSize: 7.5,
    color: '#333333',
    marginBottom: 15,
    lineHeight: 1.2,
  },
  signatureBlock: {
    marginTop: 25,
  },
  signatureImg: {
    width: 100,
    height: 30,
    marginBottom: 3,
  },
  
  /* Page 2 Specific Styles */
  h3: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10.5,
    marginTop: 12,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  paragraph: {
    marginBottom: 8,
  },
  bulletList: {
    marginLeft: 15,
    marginBottom: 8,
  },
  bulletItem: {
    marginBottom: 3,
  },
  closingText: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    marginTop: 20,
    marginBottom: 20,
  }
});

interface LetterOfAcceptancePDFProps {
  data: {
    issueDate: string;
    college: {
      name: string;
      logoUrl?: string;
      campus: string;
      address: string;
      phone: string;
      email: string;
      type: string;
      website: string;
      dliNumber: string;
    };
    student: {
      id: string;
      familyName: string;
      givenName: string;
      dob: string;
      caq: string;
      address: string;
      agent: string;
    };
    program: {
      name: string;
      status: string;
      campus: string;
      length: string;
      startDate: string;
      completionDate: string;
      credential: string;
      level: string;
      hoursPerWeek: string;
      exchangeProgram: string;
      internship: string;
      financialAid: string;
      conditions: string;
      expiryDate: string;
    };
    fees: {
      payments: Array<{ amount: string; dueDate: string }>;
      tuition: string;
      ancillary: string;
      totalAnnual: string;
    };
    registrar: {
      name: string;
      title: string;
      signatureUrl?: string;
    };
    visaDeadlines?: {
      fall: string;
      winter: string;
      summer: string;
    };
  };
}

const LetterOfAcceptancePDF: React.FC<LetterOfAcceptancePDFProps> = ({ data }) => {
  const { issueDate, college, student, program, fees, registrar } = data;

  return (
    <Document>
      {/* ================= PAGE 1 ================= */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>LETTER OF ACCEPTANCE</Text>
            <Text style={styles.subtitle}>Date of Issue: {issueDate}</Text>
          </View>
          {college.logoUrl ? <Image style={styles.logo} src={college.logoUrl} /> : null}
        </View>

        <Text style={styles.congrats}>
          Congratulations! You have been accepted to {college.name}!
        </Text>

        {/* PERSONAL INFORMATION */}
        <Text style={styles.sectionHeader}>Personal Information</Text>
        <View style={styles.table}>
          <View style={styles.row}>
            <View style={styles.col2}>
              <Text><Text style={styles.bold}>Family Name:</Text>{"\n"}{student.familyName}</Text>
            </View>
            <View style={styles.col2Last}>
              <Text><Text style={styles.bold}>CAQ:</Text> {student.caq}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col2}>
              <Text><Text style={styles.bold}>Given Name:</Text>{"\n"}{student.givenName}</Text>
            </View>
            <View style={styles.col2Last}>
              <Text><Text style={styles.bold}>Student's Full Mailing Address:</Text>{"\n"}{student.address}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col2}>
              <Text><Text style={styles.bold}>Date of Birth:</Text> {student.dob}</Text>
            </View>
            <View style={styles.col2Last}>
              <Text style={{ opacity: 0 }}>-</Text>
            </View>
          </View>
          <View style={styles.rowLast}>
            <View style={styles.col2}>
              <Text><Text style={styles.bold}>Student ID #:</Text> {student.id}</Text>
            </View>
            <View style={styles.col2Last}>
              <Text><Text style={styles.bold}>Referring Agent:</Text> {student.agent}</Text>
            </View>
          </View>
        </View>

        {/* INSTITUTIONAL INFORMATION */}
        <Text style={styles.sectionHeader}>Institutional Information</Text>
        <View style={styles.table}>
          <View style={styles.row}>
            <View style={styles.col2}>
              <Text style={styles.bold}>Name of Contact: International Admissions</Text>
              <Text>Phone: {college.phone}</Text>
              <Text>Email: {college.email}</Text>
            </View>
            <View style={styles.col2Last}>
              <Text style={styles.bold}>Full Name and Address of Institution:</Text>
              <Text>{college.name} - {college.campus}</Text>
              <Text>{college.address}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col2}>
              <Text><Text style={styles.bold}>Type of School/Institution:</Text> {college.type}</Text>
            </View>
            <View style={styles.col2Last}>
              <Text><Text style={styles.bold}>Designated Learning Institution #:</Text> {college.dliNumber}</Text>
            </View>
          </View>
          <View style={styles.rowLast}>
            <View style={styles.col2}>
              <Text><Text style={styles.bold}>Website:</Text> {college.website}</Text>
            </View>
            <View style={styles.col2Last}>
              <Text style={{ opacity: 0 }}>-</Text>
            </View>
          </View>
        </View>

        {/* PROGRAM INFORMATION */}
        <Text style={styles.sectionHeader}>Program Information</Text>
        <View style={styles.table}>
          <View style={styles.row}>
            <View style={styles.col2}>
              <Text><Text style={styles.bold}>Academic Status:</Text> {program.status}</Text>
              <Text><Text style={styles.bold}>Program of Study:</Text>{"\n"}{program.name}</Text>
              <Text><Text style={styles.bold}>Campus:</Text> {program.campus}</Text>
              <Text><Text style={styles.bold}>Program Length:</Text> {program.length}</Text>
              <Text><Text style={styles.bold}>Start Date:</Text> {program.startDate}</Text>
              <Text><Text style={styles.bold}>Approx. Completion Date:</Text> {program.completionDate}</Text>
              <Text><Text style={styles.bold}>Credential:</Text> {program.credential}</Text>
              <Text><Text style={styles.bold}>Level of Study:</Text> {program.level}</Text>
              <Text><Text style={styles.bold}>Hours of Instruction:</Text> {program.hoursPerWeek}</Text>
              <Text><Text style={styles.bold}>Exchange Program:</Text> {program.exchangeProgram}</Text>
            </View>
            <View style={styles.col2Last}>
              <Text style={styles.bold}>Fee Structure:</Text>
              <Text style={[styles.bold, { textDecoration: 'underline', marginTop: 2 }]}>TOTAL DUE:</Text>
              {fees.payments.map((p, index) => (
                <Text key={index}>{p.amount} by {p.dueDate}</Text>
              ))}
              <Text style={{ marginTop: 6 }}>Tuition Fees: {fees.tuition}</Text>
              <Text>Mandatory Ancillary Fees: {fees.ancillary}</Text>
              <Text style={[styles.bold, { marginTop: 4 }]}>Total Annual Fees: {fees.totalAnnual}*</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col2}>
              <Text><Text style={styles.bold}>Internship/Work practicum:</Text> {program.internship}</Text>
            </View>
            <View style={styles.col2Last}>
              <Text><Text style={styles.bold}>Scholarship/Financial Aid:</Text> {program.financialAid}</Text>
            </View>
          </View>
          <View style={styles.rowLast}>
            <View style={styles.col2}>
              <Text><Text style={styles.bold}>Conditions of Acceptance:</Text>{"\n"}• {program.conditions}</Text>
            </View>
            <View style={styles.col2Last}>
              <Text><Text style={styles.bold}>Expiry of Letter of Acceptance:</Text>{"\n"}{program.expiryDate}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.footerNote}>
          *Note: Tuition and fees quoted are for two semesters of the program and are subject to change. Tuition deposit of $2,000 CAD is non-refundable.{"\n"}
          {college.name} reserves the right to revoke an offer of admission should a student fail to meet the payment deadline.
        </Text>

        <View style={styles.signatureBlock}>
          {registrar.signatureUrl ? <Image style={styles.signatureImg} src={registrar.signatureUrl} /> : null}
          <Text style={styles.bold}>{registrar.name}, {registrar.title}</Text>
          <Text>{college.name}</Text>
        </View>
      </Page>

      {/* ================= NEW PAGE 2 ================= */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>LETTER OF ACCEPTANCE</Text>
            <Text style={styles.subtitle}>Date of Issue: {issueDate}</Text>
          </View>
          {college.logoUrl ? <Image style={styles.logo} src={college.logoUrl} /> : null}
        </View>

        <Text style={styles.h3}>TO ACCEPT THIS LETTER OF ACCEPTANCE:</Text>

        <Text style={styles.paragraph}>
          1. Your offer will be accepted upon receipt of payment. Your fees are due by the payment dates specified on your Letter of Acceptance (LOA). If a minimum of $2,000 is not received by the College by the specified due date, your offer will be withdrawn.
        </Text>

        <Text style={styles.paragraph}>
          2. You must confirm receipt of your Student Visa by uploading a copy of it to your application portal no later than the date indicated below:
        </Text>

        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>2026-08-15 (September/Fall programs)</Text>
          <Text style={styles.bulletItem}>2026-12-22 (January/Winter programs)</Text>
          <Text style={styles.bulletItem}>April 15, 2026 (May/Summer programs)</Text>
        </View>

        <Text style={styles.paragraph}>
          3. Students are required to arrive on campus before the International Student Orientation. Contact {college.email || "admissions@cannogacollege.ca"} to confirm details.
        </Text>

        <Text style={styles.h3}>IMPORTANT INFORMATION</Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Canadian Study Permit: </Text>
          You should apply for a Canadian Study Permit as soon as possible. For guidance, visit www.cic.gc.ca/english/study.
        </Text>

        <Text style={styles.closingText}>
          We look forward to having you study at {college.name || "Cannoga College"}!
        </Text>

        <View style={styles.signatureBlock}>
          {registrar.signatureUrl ? <Image style={styles.signatureImg} src={registrar.signatureUrl} /> : null}
          <Text style={styles.bold}>{registrar.name}, {registrar.title}</Text>
          <Text>{college.name}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default LetterOfAcceptancePDF;
