import React from 'react';
import {
  Container,
  Section,
  DetailText,
  IconRow,
  IconText,
  DetailImage,
  StyledButton,
  ButtonText,
  RecordTitle,
} from './styles';
import * as Icon from 'phosphor-react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { HealthStackParamList } from '../../types/navigation';
import { formatLongDate } from '../../utils/dateFormarter';

type Props = StackScreenProps<HealthStackParamList, 'HealthRecordDetails'>;

export default function HealthRecordDetailsScreen({ route, navigation }: Props) {
  const { record, setIsFilterApplied } = route.params; // Receive the health record passed via navigation


  return (
    <Container>
      <RecordTitle numberOfLines={1} ellipsizeMode="tail">
        {record?.extraInfo || record?.type}
      </RecordTitle>

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
        <DetailText>{formatLongDate(record.date)}</DetailText>
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
      <StyledButton
        onPress={() =>
          navigation.navigate('AddHealthRecord', {
            isEditMode: true,
            record,
            onGoBack: () => setIsFilterApplied(false), // Reset filter state on return
          })
        }
      >
        <ButtonText>Edit Health Record</ButtonText>
      </StyledButton>
      <StyledButton onPress={() => navigation.goBack()}>
        <ButtonText>Go Back</ButtonText>
      </StyledButton>
    </Container>
  );
}
