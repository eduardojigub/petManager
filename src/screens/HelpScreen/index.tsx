import React, { useState, useContext } from 'react';
import { Linking, Alert } from 'react-native';
import { LanguageContext } from '../../context/LanguageContext';
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

export default function HelpScreen() {
  const { t } = useContext(LanguageContext);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const faqData = [
    { question: t('help.faq1q'), answer: t('help.faq1a') },
    { question: t('help.faq2q'), answer: t('help.faq2a') },
    { question: t('help.faq3q'), answer: t('help.faq3a') },
    { question: t('help.faq4q'), answer: t('help.faq4a') },
    { question: t('help.faq5q'), answer: t('help.faq5a') },
    { question: t('help.faq6q'), answer: t('help.faq6a') },
  ];

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleContact = () => {
    Linking.openURL('mailto:support@catapp.com').catch(() =>
      Alert.alert(t('common.error'), t('help.emailError'))
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
          <ContactTitle>{t('help.stillNeedHelp')}</ContactTitle>
          <ContactText>
            {t('help.contactText')}
          </ContactText>
          <ContactButton onPress={handleContact}>
            <ContactButtonText>{t('help.contactButton')}</ContactButtonText>
          </ContactButton>
        </ContactCard>
      </ContentContainer>
    </Container>
  );
}
