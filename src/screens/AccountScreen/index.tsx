import React, { useContext } from 'react';
import { Alert, Linking } from 'react-native';
import { LanguageContext } from '../../context/LanguageContext';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { SettingsStackParamList } from '../../types/navigation';
import { CaretRight, ShieldCheck, Trash, UserCircle, PencilSimple } from 'phosphor-react-native';
import {
  Container,
  MenuCard,
  MenuItem,
  MenuIconContainer,
  MenuTextContainer,
  MenuItemTitle,
  MenuItemSubtitle,
  MenuDivider,
  DeleteTitle,
  DeleteSubtitle,
} from './styles';

export default function AccountScreen() {
  const navigation = useNavigation<NavigationProp<SettingsStackParamList>>();
  const { t } = useContext(LanguageContext);

  const handleDeleteAccount = () => {
    const url = 'https://jp7dc7wdnld.typeform.com/to/UukaGjeR';
    Linking.openURL(url).catch(() =>
      Alert.alert(t('common.error'), t('alert.failedOpenLink'))
    );
  };

  const menuItems = [
    {
      icon: <PencilSimple size={20} color="#41245c" weight="bold" />,
      bgColor: '#ede8f5',
      title: t('account.editProfile'),
      subtitle: t('account.editProfileSub'),
      onPress: () => navigation.navigate('EditUserProfile'),
    },
    {
      icon: <ShieldCheck size={20} color="#27ae60" weight="bold" />,
      bgColor: '#e0f5e9',
      title: t('account.updatePassword'),
      subtitle: t('account.updatePasswordSub'),
      onPress: () => navigation.navigate('AccountSettings'),
    },
  ];

  return (
    <Container>
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
        <MenuItem onPress={handleDeleteAccount}>
          <MenuIconContainer bgColor="#fde8e8">
            <Trash size={20} color="#e74c3c" weight="bold" />
          </MenuIconContainer>
          <MenuTextContainer>
            <DeleteTitle>{t('account.deleteAccount')}</DeleteTitle>
            <DeleteSubtitle>{t('account.deleteAccountSub')}</DeleteSubtitle>
          </MenuTextContainer>
          <CaretRight size={18} color="#e74c3c" weight="bold" />
        </MenuItem>
      </MenuCard>
    </Container>
  );
}
