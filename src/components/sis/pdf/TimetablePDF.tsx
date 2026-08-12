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
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 10,
    color: '#666666',
    textAlign: 'right',
  },
  table: {
    display: 'flex',
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold',
    fontSize: 9,
    textTransform: 'uppercase',
    color: '#666666',
  },
  tableCell: {
    padding: 6,
    fontSize: 9,
    color: '#1a1a1a',
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

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const COLUMNS = ['Day', 'Time', 'Module', 'Section', 'Room', 'Building', 'Instructor', 'Campus'];

interface TimetablePDFProps {
  version: any;
  semester: any;
  assignments: any[];
  exportType: string;
}

const TimetablePDF: React.FC<TimetablePDFProps> = ({ version, semester, assignments, exportType }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Cannoga College - Timetable</Text>
          <Text style={styles.subtitle}>
            {semester?.name || 'N/A'} | Version {version?.version_number || 'N/A'} | {exportType.toUpperCase()}
          </Text>
        </View>

        <View style={styles.table}>
          <View style={{ ...styles.tableRow, ...styles.tableHeader }}>
            {COLUMNS.map((col) => (
              <Text key={col} style={{ flex: 1, padding: 6, fontSize: 9, fontWeight: 'bold', color: '#666666', textTransform: 'uppercase' }}>
                {col}
              </Text>
            ))}
          </View>
          {assignments.map((a, idx) => {
            const section = a.section || {};
            const module = Array.isArray(section.module) ? section.module[0] : section.module;
            const instructor = Array.isArray(section.instructor) ? section.instructor[0] : section.instructor;
            const room = a.room || {};
            return (
              <View key={idx} style={{ ...styles.tableRow, backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                <Text style={{ flex: 1, padding: 6, fontSize: 9, color: '#1a1a1a' }}>
                  {DAYS[a.day_of_week] || String(a.day_of_week)}
                </Text>
                <Text style={{ flex: 1, padding: 6, fontSize: 9, color: '#1a1a1a' }}>
                  {a.start_time} - {a.end_time}
                </Text>
                <Text style={{ flex: 1, padding: 6, fontSize: 9, color: '#1a1a1a' }}>
                  {module?.title || module?.code || '—'}
                </Text>
                <Text style={{ flex: 1, padding: 6, fontSize: 9, color: '#1a1a1a' }}>
                  {section.code || '—'}
                </Text>
                <Text style={{ flex: 1, padding: 6, fontSize: 9, color: '#1a1a1a' }}>
                  {room.name || '—'}
                </Text>
                <Text style={{ flex: 1, padding: 6, fontSize: 9, color: '#1a1a1a' }}>
                  {room.building || '—'}
                </Text>
                <Text style={{ flex: 1, padding: 6, fontSize: 9, color: '#1a1a1a' }}>
                  {instructor ? `${instructor.first_name} ${instructor.last_name}` : 'TBD'}
                </Text>
                <Text style={{ flex: 1, padding: 6, fontSize: 9, color: '#1a1a1a' }}>
                  {room.campus || '—'}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.footer}>
          <Text>Generated on {new Date().toLocaleDateString('en-CA')}</Text>
          <Text>Cannoga College Timetable Export | {exportType.toUpperCase()}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default TimetablePDF;
