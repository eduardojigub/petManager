import React from 'react';
import { Modal } from 'react-native';
import { Star } from 'phosphor-react-native';
import { Locale } from '../../../i18n/translations';
import {
  ModalOverlay, ModalContainer, ModalTitle, ModalText, ScrollModalContent,
  SectionTitle, CloseButton, CloseButtonText,
  ModalOptionButton, ModalOptionText, ModalOptionCheck,
} from '../styles';

interface SettingsModalsProps {
  showTermsModal: boolean;
  setShowTermsModal: (v: boolean) => void;
  showRateShareModal: boolean;
  setShowRateShareModal: (v: boolean) => void;
  showLanguageModal: boolean;
  setShowLanguageModal: (v: boolean) => void;
  locale: Locale;
  onSelectLanguage: (lang: Locale) => void;
  onRateApp: () => void;
  onShareApp: () => void;
  t: (key: string) => string;
}

export default function SettingsModals({
  showTermsModal, setShowTermsModal,
  showRateShareModal, setShowRateShareModal,
  showLanguageModal, setShowLanguageModal,
  locale, onSelectLanguage, onRateApp, onShareApp, t,
}: SettingsModalsProps) {
  return (
    <>
      <Modal visible={showTermsModal} transparent animationType="slide"
        onRequestClose={() => setShowTermsModal(false)}>
        <ModalOverlay>
          <ModalContainer>
            <ModalTitle>{t('terms.title')}</ModalTitle>
            <ScrollModalContent>
              <ModalText>{t('terms.intro')}</ModalText>
              <SectionTitle>{t('terms.section1Title')}</SectionTitle>
              <ModalText>{t('terms.section1')}</ModalText>
              <SectionTitle>{t('terms.section2Title')}</SectionTitle>
              <ModalText>{t('terms.section2')}</ModalText>
              <SectionTitle>{t('terms.section3Title')}</SectionTitle>
              <ModalText>{t('terms.section3')}</ModalText>
              <ModalText>{t('terms.contact')}</ModalText>
            </ScrollModalContent>
            <CloseButton onPress={() => setShowTermsModal(false)}>
              <CloseButtonText>{t('common.close')}</CloseButtonText>
            </CloseButton>
          </ModalContainer>
        </ModalOverlay>
      </Modal>

      <Modal visible={showRateShareModal} transparent animationType="fade"
        onRequestClose={() => setShowRateShareModal(false)}>
        <ModalOverlay>
          <ModalContainer>
            <ModalTitle>{t('rateShare.title')}</ModalTitle>
            <ModalOptionButton onPress={onRateApp}>
              <Star size={20} color="#f1c40f" weight="fill" />
              <ModalOptionText>{t('rateShare.rate')}</ModalOptionText>
            </ModalOptionButton>
            <ModalOptionButton onPress={onShareApp}>
              <Star size={20} color="#9b59b6" weight="bold" />
              <ModalOptionText>{t('rateShare.share')}</ModalOptionText>
            </ModalOptionButton>
            <CloseButton onPress={() => setShowRateShareModal(false)}>
              <CloseButtonText>{t('rateShare.cancel')}</CloseButtonText>
            </CloseButton>
          </ModalContainer>
        </ModalOverlay>
      </Modal>

      <Modal visible={showLanguageModal} transparent animationType="fade"
        onRequestClose={() => setShowLanguageModal(false)}>
        <ModalOverlay>
          <ModalContainer>
            <ModalTitle>{t('language.title')}</ModalTitle>
            <ModalOptionButton onPress={() => onSelectLanguage('en')}>
              <ModalOptionText>{t('language.english')}</ModalOptionText>
              {locale === 'en' && <ModalOptionCheck>✓</ModalOptionCheck>}
            </ModalOptionButton>
            <ModalOptionButton onPress={() => onSelectLanguage('pt')}>
              <ModalOptionText>{t('language.portuguese')}</ModalOptionText>
              {locale === 'pt' && <ModalOptionCheck>✓</ModalOptionCheck>}
            </ModalOptionButton>
            <CloseButton onPress={() => setShowLanguageModal(false)}>
              <CloseButtonText>{t('common.close')}</CloseButtonText>
            </CloseButton>
          </ModalContainer>
        </ModalOverlay>
      </Modal>
    </>
  );
}
