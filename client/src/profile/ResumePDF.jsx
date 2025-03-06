// src/profile/ResumePDF.jsx
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts if needed
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/opensans/v17/mem8YaGs126MiZpBA-UFVZ0e.ttf' }, // Regular
    { src: 'https://fonts.gstatic.com/s/opensans/v17/mem5YaGs126MiZpBA-UNirkOUuhs.ttf', fontWeight: 600 } // Bold
  ]
});

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'Helvetica'
  },
  header: {
    marginBottom: 20,
    textAlign: 'center'
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4
  },
  section: {
    marginBottom: 15
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    borderBottom: '1px solid #000',
    paddingBottom: 4
  },
  entry: {
    marginBottom: 10
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  entryTitle: {
    fontSize: 12,
    fontWeight: 'bold'
  },
  entrySubtitle: {
    fontSize: 12,
    color: '#666'
  },
  entryDate: {
    fontSize: 12,
    color: '#666'
  },
  skills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4
  },
  skillTag: {
    backgroundColor: '#f0f0f0',
    padding: '4px 8px',
    borderRadius: 4,
    fontSize: 12,
    margin: 2
  }
});

const ResumePDF = ({ basicInfo, resumeData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.name}>{basicInfo.fullName}</Text>
        <Text style={styles.entrySubtitle}>{basicInfo.email}</Text>
        <Text style={styles.entrySubtitle}>{basicInfo.phoneNumber}</Text>
        <Text style={styles.entrySubtitle}>{basicInfo.location}</Text>
      </View>

      {/* Objective */}
      {resumeData?.objective && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Career Objective</Text>
          <Text style={styles.entrySubtitle}>{resumeData.objective}</Text>
        </View>
      )}

      {/* Education */}
      {resumeData?.education.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {resumeData.education.map((edu, index) => (
            <View key={index} style={styles.entry}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryTitle}>{edu.degree}</Text>
                <Text style={styles.entryDate}>{edu.duration}</Text>
              </View>
              <Text style={styles.entrySubtitle}>{edu.university}</Text>
              {edu.gpa && <Text style={styles.entrySubtitle}>GPA: {edu.gpa}</Text>}
            </View>
          ))}
        </View>
      )}

      {/* Experience */}
      {resumeData?.experience.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Experience</Text>
          {resumeData.experience.map((exp, index) => (
            <View key={index} style={styles.entry}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryTitle}>{exp.position}</Text>
                <Text style={styles.entryDate}>{exp.duration}</Text>
              </View>
              <Text style={styles.entrySubtitle}>{exp.company}</Text>
              <Text style={styles.entrySubtitle}>{exp.description}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Skills */}
      {resumeData?.skills.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skills}>
            {resumeData.skills.map((skill, index) => (
              <Text key={index} style={styles.skillTag}>
                {skill}
              </Text>
            ))}
          </View>
        </View>
      )}

      {/* Projects */}
      {resumeData?.projects.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Projects</Text>
          {resumeData.projects.map((project, index) => (
            <View key={index} style={styles.entry}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryTitle}>{project.title}</Text>
                <Text style={styles.entryDate}>{project.duration}</Text>
              </View>
              <Text style={styles.entrySubtitle}>{project.description}</Text>
              {project.link && (
                <Text style={styles.entrySubtitle}>
                  Link: {project.link}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}
    </Page>
  </Document>
);

export default ResumePDF;