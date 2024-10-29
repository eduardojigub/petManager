import React from 'react';
import { View, Text } from 'react-native';
import { Container, Section, DetailText, IconRow, IconText, DetailImage, StyledButton, ButtonText } from "./styles";
import * as Icon from 'phosphor-react-native';

export default function HealthRecordDetailsScreen({ route, navigation }) {
  const { record } = route.params; // Receive the health record passed via navigation
 


  return (
    <Container>
      <Text style={{ fontSize: 26, fontWeight: 'bold', color: "#41245C", marginBottom: 20 }}>
        {record.type} Details
      </Text>

      <Section>
        <IconRow>
          <Icon.FileText size={24} color="#41245C" />
          <IconText>Description:</IconText>
        </IconRow>
        <DetailText>{record.description}</DetailText>
      </Section>

      <Section>
        <IconRow>
          <Icon.Calendar size={24} color="#41245C" />
          <IconText>Date:</IconText>
        </IconRow>
        <DetailText>{new Date(record.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</DetailText>
      </Section>

      {record.image ? (
        <Section>
          <IconRow>
            <Icon.Image size={24} color="#41245C" />
            <IconText>Image:</IconText>
          </IconRow>
          <DetailImage source={{ uri: record.image }} />
        </Section>
      ) : (
        <Section>
          <DetailText>No image available</DetailText>
        </Section>
      )}
      <StyledButton onPress={() => navigation.navigate('AddHealthRecord',{ isEditMode: true, record })}>
        <ButtonText>Edit Health Record</ButtonText>
      </StyledButton>
      <StyledButton onPress={() => navigation.goBack()}>
        <ButtonText>Go Back</ButtonText>
      </StyledButton>
    </Container>
  );
}
