import React, { useCallback, useContext, useState } from 'react';
import { Linking, Share, Alert } from 'react-native';
import { getAuth, signOut } from '@react-native-firebase/auth';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import { SettingsStackParamList } from '../../types/navigation';
import Constants from 'expo-constants';
import {
  CaretRight, User, Bell, Question, SignOut, Star, FileText, DownloadSimple, GlobeSimple,
} from 'phosphor-react-native';
import { exportUserData } from '../../utils/exportData';
import { LanguageContext } from '../../context/LanguageContext';
import { Locale } from '../../i18n/translations';
import SettingsModals from './components/SettingsModals';
import {
  Container, ContentContainer, HeaderTitle, HeaderSubtitle,
  ProfileCard, ProfileAvatar, ProfileAvatarText, ProfileAvatarImage,
  ProfileInfo, ProfileName, ProfileEmail,
  MenuCard, MenuItem, MenuIconContainer, MenuTextContainer,
  MenuItemTitle, MenuItemSubtitle, MenuDivider, LogoutTitle, LogoutSubtitle,
  FooterText, FooterSubtext,
} from './styles';

const appVersion = Constants.expoConfig?.version || 'Version not available';
const APP_STORE_URL = 'https://apps.apple.com/app/id6504808468';

export default function SettingsScreen() {
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showRateShareModal, setShowRateShareModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [, forceUpdate] = useState(0);
  const navigation = useNavigation<NavigationProp<SettingsStackParamList>>();
  const auth = getAuth();
  const user = auth.currentUser;
  const { locale, setLocale, t } = useContext(LanguageContext);

  useFocusEffect(useCallback(() => { forceUpdate((n) => n + 1); }, []));

  const userEmail = user?.email || '';
  const userName = user?.displayName || userEmail.split('@')[0] || 'User';
  const userPhoto = user?.photoURL || null;
  const userInitial = userName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    try { await signOut(auth); } catch (error: any) { console.warn('Sign out error:', error.message); }
  };

  const handleRateApp = () => {
    Linking.openURL(APP_STORE_URL).catch(() => Alert.alert(t('common.error'), t('settings.couldNotOpenStore')));
    setShowRateShareModal(false);
  };

  const handleShareApp = async () => {
    setShowRateShareModal(false);
    try { await Share.share({ message: `${t('rateShare.shareMessage')} ${APP_STORE_URL}` }); } catch {}
  };

  const handleExportData = async () => {
    setExporting(true);
    try { await exportUserData(); } catch { Alert.alert(t('common.error'), t('settings.exportFailed')); }
    finally { setExporting(false); }
  };

  const handleSelectLanguage = (lang: Locale) => { setLocale(lang); setShowLanguageModal(false); };

  const menuItems = [
    { icon: <User size={20} color="#41245c" weight="bold" />, bgColor: '#ede8f5', title: t('settings.account'), subtitle: t('settings.accountSub'), onPress: () => navigation.navigate('Account') },
    { icon: <Bell size={20} color="#e67e22" weight="bold" />, bgColor: '#fdf0e0', title: t('settings.notifications'), subtitle: t('settings.notificationsSub'), onPress: () => navigation.navigate('ManageNotifications') },
    { icon: <DownloadSimple size={20} color="#2ecc71" weight="bold" />, bgColor: '#e0f5e9', title: exporting ? t('settings.exporting') : t('settings.exportData'), subtitle: t('settings.exportDataSub'), onPress: handleExportData },
    { icon: <GlobeSimple size={20} color="#3498db" weight="bold" />, bgColor: '#e0eef9', title: t('settings.language'), subtitle: locale === 'pt' ? t('language.portuguese') : t('language.english'), onPress: () => setShowLanguageModal(true) },
    { icon: <Question size={20} color="#9b59b6" weight="bold" />, bgColor: '#f0e6f6', title: t('settings.help'), subtitle: t('settings.helpSub'), onPress: () => navigation.navigate('Help') },
    { icon: <Star size={20} color="#f1c40f" weight="bold" />, bgColor: '#fdf8e0', title: t('settings.rateShare'), subtitle: t('settings.rateShareSub'), onPress: () => setShowRateShareModal(true) },
    { icon: <FileText size={20} color="#7289da" weight="bold" />, bgColor: '#e8ecf7', title: t('settings.terms'), subtitle: t('settings.termsSub'), onPress: () => setShowTermsModal(true) },
  ];

  return (
    <Container>
      <ContentContainer>
        <HeaderTitle>{t('settings.title')}</HeaderTitle>
        <HeaderSubtitle>{t('settings.subtitle')}</HeaderSubtitle>

        <ProfileCard>
          {userPhoto ? <ProfileAvatarImage source={{ uri: userPhoto }} /> : (
            <ProfileAvatar><ProfileAvatarText>{userInitial}</ProfileAvatarText></ProfileAvatar>
          )}
          <ProfileInfo>
            <ProfileName>{userName}</ProfileName>
            <ProfileEmail>{userEmail}</ProfileEmail>
          </ProfileInfo>
        </ProfileCard>

        <MenuCard>
          {menuItems.map((item, index) => (
            <React.Fragment key={item.title}>
              {index > 0 && <MenuDivider />}
              <MenuItem onPress={item.onPress}>
                <MenuIconContainer bgColor={item.bgColor}>{item.icon}</MenuIconContainer>
                <MenuTextContainer>
                  <MenuItemTitle>{item.title}</MenuItemTitle>
                  <MenuItemSubtitle>{item.subtitle}</MenuItemSubtitle>
                </MenuTextContainer>
                <CaretRight size={18} color="#ccc" weight="bold" />
              </MenuItem>
            </React.Fragment>
          ))}
        </MenuCard>

        <MenuCard>
          <MenuItem onPress={handleLogout}>
            <MenuIconContainer bgColor="#fde8e8">
              <SignOut size={20} color="#e74c3c" weight="bold" />
            </MenuIconContainer>
            <MenuTextContainer>
              <LogoutTitle>{t('settings.logout')}</LogoutTitle>
              <LogoutSubtitle>{t('settings.logoutSub')}</LogoutSubtitle>
            </MenuTextContainer>
            <CaretRight size={18} color="#e74c3c" weight="bold" />
          </MenuItem>
        </MenuCard>

        <FooterText>Pet Life v{appVersion}</FooterText>
        <FooterSubtext>{t('settings.footer')}</FooterSubtext>
      </ContentContainer>

      <SettingsModals
        showTermsModal={showTermsModal} setShowTermsModal={setShowTermsModal}
        showRateShareModal={showRateShareModal} setShowRateShareModal={setShowRateShareModal}
        showLanguageModal={showLanguageModal} setShowLanguageModal={setShowLanguageModal}
        locale={locale} onSelectLanguage={handleSelectLanguage}
        onRateApp={handleRateApp} onShareApp={handleShareApp} t={t}
      />
    </Container>
  );
}
