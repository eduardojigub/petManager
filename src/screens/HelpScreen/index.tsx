import React, { useState } from 'react';
import { Linking, Alert } from 'react-native';
import { CaretDown, CaretUp, EnvelopeSimple } from 'phosphor-react-native';
import {
  Container,
  ContentContainer,
  FAQCard,
  QuestionRow,
  QuestionText,
  AnswerContainer,
  AnswerText,
  ContactCard,
  ContactTitle,
  ContactText,
  ContactButton,
  ContactButtonText,
} from './styles';

const faqData = [
  {
    question: 'How do I add a new pet?',
    answer:
      'Go to the Profile tab and tap the "+" button. Fill in your pet\'s details like name, breed, birthday, and photo.',
  },
  {
    question: 'How do I set up reminders?',
    answer:
      'Navigate to the Schedule tab and tap "Add Schedule". You can set reminders for vet appointments, grooming, medication, and more. Enable push notifications to receive alerts.',
  },
  {
    question: 'How do I track expenses?',
    answer:
      'Go to the Expenses tab and tap "Add Expense". You can categorize expenses by type (food, vet, grooming, etc.) and track spending over time.',
  },
  {
    question: 'How do I add health records?',
    answer:
      'In the Health tab, tap "Add Record" to log vaccinations, medications, vet visits, and other health-related information. You can also attach photos of documents.',
  },
  {
    question: 'Can I manage multiple pets?',
    answer:
      'Yes! You can add multiple pet profiles and switch between them. Each pet has its own health records, schedules, and expenses.',
  },
  {
    question: 'How do I delete my account?',
    answer:
      'Go to Settings > Account > Delete my account. You\'ll be redirected to a form to request account deletion. Your data will be permanently removed.',
  },
];

export default function HelpScreen() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleContact = () => {
    Linking.openURL('mailto:support@catapp.com').catch(() =>
      Alert.alert('Error', 'Could not open email client')
    );
  };

  return (
    <Container>
      <ContentContainer>
        {faqData.map((item, index) => (
          <FAQCard key={index}>
            <QuestionRow onPress={() => toggleExpand(index)}>
              <QuestionText>{item.question}</QuestionText>
              {expandedIndex === index ? (
                <CaretUp size={18} color="#41245c" weight="bold" />
              ) : (
                <CaretDown size={18} color="#ccc" weight="bold" />
              )}
            </QuestionRow>
            {expandedIndex === index && (
              <AnswerContainer>
                <AnswerText>{item.answer}</AnswerText>
              </AnswerContainer>
            )}
          </FAQCard>
        ))}

        <ContactCard>
          <EnvelopeSimple size={32} color="#7289da" weight="duotone" />
          <ContactTitle>Still need help?</ContactTitle>
          <ContactText>
            Contact our support team and we'll get back to you as soon as possible.
          </ContactText>
          <ContactButton onPress={handleContact}>
            <ContactButtonText>Contact Support</ContactButtonText>
          </ContactButton>
        </ContactCard>
      </ContentContainer>
    </Container>
  );
}
