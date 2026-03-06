import React, { useCallback, useState } from 'react';
import { Linking, Modal, Share, Alert } from 'react-native';
import { getAuth, signOut } from '@react-native-firebase/auth';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import { SettingsStackParamList } from '../../types/navigation';
import Constants from 'expo-constants';
import { CaretRight, User, Bell, Question, SignOut, Star, ShareNetwork, FileText, DownloadSimple } from 'phosphor-react-native';
import { exportUserData } from '../../utils/exportData';
import {
  Container,
  ContentContainer,
  HeaderTitle,
  HeaderSubtitle,
  ProfileCard,
  ProfileAvatar,
  ProfileAvatarText,
  ProfileAvatarImage,
  ProfileInfo,
  ProfileName,
  ProfileEmail,
  MenuCard,
  MenuItem,
  MenuIconContainer,
  MenuTextContainer,
  MenuItemTitle,
  MenuItemSubtitle,
  MenuDivider,
  LogoutTitle,
  LogoutSubtitle,
  FooterText,
  FooterSubtext,
  ModalOverlay,
  ModalContainer,
  ModalTitle,
  ModalText,
  ScrollModalContent,
  SectionTitle,
  CloseButton,
  CloseButtonText,
} from './styles';

const appVersion = Constants.expoConfig?.version || 'Version not available';

export default function SettingsScreen() {
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [, forceUpdate] = useState(0);
  const navigation = useNavigation<NavigationProp<SettingsStackParamList>>();
  const auth = getAuth();
  const user = auth.currentUser;

  useFocusEffect(
    useCallback(() => {
      forceUpdate((n) => n + 1);
    }, [])
  );

  const userEmail = user?.email || '';
  const userName = user?.displayName || userEmail.split('@')[0] || 'User';
  const userPhoto = user?.photoURL || null;
  const userInitial = userName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.warn('Sign out error:', error.message);
    }
  };

  const APP_STORE_URL = 'https://apps.apple.com/app/id6504808468';

  const handleRateApp = () => {
    Linking.openURL(APP_STORE_URL).catch(() =>
      Alert.alert('Error', 'Could not open the App Store')
    );
  };

  const handleShareApp = async () => {
    try {
      await Share.share({
        message: `Check out Pet Life - the best app to manage your pet's health, schedules and expenses! ${APP_STORE_URL}`,
      });
    } catch (error) {
      // user cancelled
    }
  };

  const [exporting, setExporting] = useState(false);

  const handleExportData = async () => {
    setExporting(true);
    try {
      await exportUserData();
    } catch (error) {
      Alert.alert('Error', 'Failed to export data. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const menuItems = [
    {
      icon: <User size={20} color="#41245c" weight="bold" />,
      bgColor: '#ede8f5',
      title: 'Account',
      subtitle: 'Profile and security',
      onPress: () => navigation.navigate('Account'),
    },
    {
      icon: <Bell size={20} color="#e67e22" weight="bold" />,
      bgColor: '#fdf0e0',
      title: 'Notifications',
      subtitle: 'Alerts and reminders',
      onPress: () => navigation.navigate('ManageNotifications'),
    },
    {
      icon: <DownloadSimple size={20} color="#2ecc71" weight="bold" />,
      bgColor: '#e0f5e9',
      title: exporting ? 'Exporting...' : 'Export Data',
      subtitle: 'Download your data as PDF',
      onPress: handleExportData,
    },
    {
      icon: <Question size={20} color="#3498db" weight="bold" />,
      bgColor: '#e0eef9',
      title: 'Help & FAQ',
      subtitle: 'Frequently asked questions',
      onPress: () => navigation.navigate('Help'),
    },
    {
      icon: <Star size={20} color="#f1c40f" weight="bold" />,
      bgColor: '#fdf8e0',
      title: 'Rate the App',
      subtitle: 'Leave a review on the App Store',
      onPress: handleRateApp,
    },
    {
      icon: <ShareNetwork size={20} color="#9b59b6" weight="bold" />,
      bgColor: '#f0e6f6',
      title: 'Share the App',
      subtitle: 'Tell your friends about Pet Life',
      onPress: handleShareApp,
    },
    {
      icon: <FileText size={20} color="#7289da" weight="bold" />,
      bgColor: '#e8ecf7',
      title: 'Terms & Privacy',
      subtitle: 'Terms of use and policy',
      onPress: () => setShowTermsModal(true),
    },
  ];

  return (
    <Container>
      <ContentContainer>
        <HeaderTitle>Settings</HeaderTitle>
        <HeaderSubtitle>Manage your preferences</HeaderSubtitle>

        <ProfileCard>
          {userPhoto ? (
            <ProfileAvatarImage source={{ uri: userPhoto }} />
          ) : (
            <ProfileAvatar>
              <ProfileAvatarText>{userInitial}</ProfileAvatarText>
            </ProfileAvatar>
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
                <MenuIconContainer bgColor={item.bgColor}>
                  {item.icon}
                </MenuIconContainer>
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
              <LogoutTitle>Log Out</LogoutTitle>
              <LogoutSubtitle>Sign out of your account</LogoutSubtitle>
            </MenuTextContainer>
            <CaretRight size={18} color="#e74c3c" weight="bold" />
          </MenuItem>
        </MenuCard>

        <FooterText>Pet Life v{appVersion}</FooterText>
        <FooterSubtext>Made with love for pet lovers</FooterSubtext>
      </ContentContainer>

      <Modal
        visible={showTermsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTermsModal(false)}
      >
        <ModalOverlay>
          <ModalContainer>
            <ModalTitle>Terms of Use & Privacy Policy</ModalTitle>
            <ScrollModalContent>
              <ModalText>
                Welcome to our application. By using this app, you agree to the
                following terms and conditions. We reserve the right to update
                these terms at any time.
              </ModalText>

              <SectionTitle>1. Data Collection</SectionTitle>
              <ModalText>
                We collect data to improve user experience. We respect your
                privacy and ensure your data is secure.
              </ModalText>

              <SectionTitle>2. Usage</SectionTitle>
              <ModalText>
                You agree not to misuse our services, including unlawful or
                unauthorized activities.
              </ModalText>

              <SectionTitle>3. Disclaimer</SectionTitle>
              <ModalText>
                We are not liable for any losses or damages arising from your
                use of this app.
              </ModalText>

              <ModalText>
                For more details, please contact support@catapp.com. Thank you
                for choosing us.
              </ModalText>
            </ScrollModalContent>
            <CloseButton onPress={() => setShowTermsModal(false)}>
              <CloseButtonText>Close</CloseButtonText>
            </CloseButton>
          </ModalContainer>
        </ModalOverlay>
      </Modal>
    </Container>
  );
}
