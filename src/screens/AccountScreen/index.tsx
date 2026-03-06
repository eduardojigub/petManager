import React from 'react';
import { Alert, Linking } from 'react-native';
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

  const handleDeleteAccount = () => {
    const url = 'https://jp7dc7wdnld.typeform.com/to/UukaGjeR';
    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'Failed to open the link')
    );
  };

  const menuItems = [
    {
      icon: <PencilSimple size={20} color="#41245c" weight="bold" />,
      bgColor: '#ede8f5',
      title: 'Edit Profile',
      subtitle: 'Update your name and photo',
      onPress: () => navigation.navigate('EditUserProfile'),
    },
    {
      icon: <ShieldCheck size={20} color="#27ae60" weight="bold" />,
      bgColor: '#e0f5e9',
      title: 'Update Password',
      subtitle: 'Change your password',
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
            <DeleteTitle>Delete my account</DeleteTitle>
            <DeleteSubtitle>Permanently remove your data</DeleteSubtitle>
          </MenuTextContainer>
          <CaretRight size={18} color="#e74c3c" weight="bold" />
        </MenuItem>
      </MenuCard>
    </Container>
  );
}
