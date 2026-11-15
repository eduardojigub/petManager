import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import FormScreen from '../../components/FormScreen';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Eye, EyeSlash, WarningCircle } from 'phosphor-react-native';
import { LanguageContext } from '../../context/LanguageContext';
import { DogProfileContext } from '../../context/DogProfileContext';
import { SettingsStackParamList } from '../../types/navigation';
import {
  DeleteAccountError,
  DeleteAccountFailure,
  deleteCurrentAccount,
} from '../../utils/deleteAccount';
import {
  Container,
  Content,
  WarningCard,
  WarningIcon,
  WarningTitle,
  WarningBody,
  Card,
  ListTitle,
  BulletRow,
  Bullet,
  BulletText,
  AfterText,
  Label,
  InputWrap,
  Input,
  TogglePasswordIcon,
  Hint,
  ErrorText,
  DeleteButton,
  ButtonRow,
  DeleteButtonText,
  LoadingText,
  CancelButton,
  CancelButtonText,
} from './styles';

const DELETED_ITEMS = [
  'deleteAccount.bulletPets',
  'deleteAccount.bulletHealth',
  'deleteAccount.bulletSchedules',
  'deleteAccount.bulletExpenses',
  'deleteAccount.bulletPhotos',
  'deleteAccount.bulletAuth',
] as const;

function deletionMessage(
  failure: DeleteAccountFailure,
  t: (key: string) => string,
): string {
  switch (failure) {
    case 'wrong-password':
      return t('deleteAccount.wrongPassword');
    case 'requires-recent-login':
      return t('deleteAccount.requiresRecentLogin');
    case 'network':
      return t('deleteAccount.networkError');
    case 'too-many-requests':
      return t('deleteAccount.tooManyRequests');
    case 'no-password':
      return t('deleteAccount.noPassword');
    case 'partial':
      return t('deleteAccount.partialError');
    case 'local':
      return t('deleteAccount.localError');
    case 'auth-delete':
      return t('deleteAccount.authDeleteError');
    default:
      return t('deleteAccount.genericError');
  }
}

export default function DeleteAccountScreen() {
  const navigation = useNavigation<NavigationProp<SettingsStackParamList>>();
  const { t } = useContext(LanguageContext);
  const { setSelectedDog } = useContext(DogProfileContext);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!deleting) return;
    const unsubscribe = navigation.addListener('beforeRemove', (event) => {
      event.preventDefault();
    });
    return unsubscribe;
  }, [deleting, navigation]);

  const runDeletion = async () => {
    setError('');
    setDeleting(true);
    try {
      await deleteCurrentAccount(password, {
        onRemoteDataDeleted: () => setSelectedDog(null),
      });
    } catch (err) {
      const failure = err instanceof DeleteAccountError ? err.failure : 'unknown';
      setDeleting(false);
      setError(deletionMessage(failure, t));
    }
  };

  const handleDeletePress = () => {
    if (deleting) return;
    if (!password) {
      setError(t('deleteAccount.passwordRequired'));
      return;
    }

    Alert.alert(t('deleteAccount.confirmTitle'), t('deleteAccount.confirmMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('deleteAccount.confirmButton'),
        style: 'destructive',
        onPress: () => {
          void runDeletion();
        },
      },
    ]);
  };

  return (
    <FormScreen backgroundColor="#f8f8f8">
      <Container>
        <Content>
          <WarningCard>
            <WarningIcon>
              <WarningCircle size={28} color="#e74c3c" weight="fill" />
            </WarningIcon>
            <WarningTitle>{t('deleteAccount.warningTitle')}</WarningTitle>
            <WarningBody>{t('deleteAccount.warning')}</WarningBody>
          </WarningCard>

          <Card>
            <ListTitle>{t('deleteAccount.listIntro')}</ListTitle>
            {DELETED_ITEMS.map((key) => (
              <BulletRow key={key}>
                <Bullet />
                <BulletText>{t(key)}</BulletText>
              </BulletRow>
            ))}
          </Card>

          <AfterText>{t('deleteAccount.after')}</AfterText>

          <Label>{t('deleteAccount.passwordLabel')}</Label>
          <InputWrap>
            <Input
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                if (error) setError('');
              }}
              placeholder={t('deleteAccount.passwordPlaceholder')}
              placeholderTextColor="#ccc"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="password"
              textContentType="password"
              editable={!deleting}
            />
            <TogglePasswordIcon
              onPress={() => setShowPassword((current) => !current)}
              disabled={deleting}
            >
              {showPassword ? (
                <Eye size={22} color="#7C7C7C" />
              ) : (
                <EyeSlash size={22} color="#7C7C7C" />
              )}
            </TogglePasswordIcon>
          </InputWrap>
          <Hint>{t('deleteAccount.passwordHint')}</Hint>

          {error ? <ErrorText>{error}</ErrorText> : null}

          <DeleteButton onPress={handleDeletePress} disabled={deleting}>
            {deleting ? (
              <ButtonRow>
                <ActivityIndicator color="#fff" />
                <LoadingText>{t('deleteAccount.deleting')}</LoadingText>
              </ButtonRow>
            ) : (
              <DeleteButtonText>{t('deleteAccount.deleteButton')}</DeleteButtonText>
            )}
          </DeleteButton>

          <CancelButton onPress={() => navigation.goBack()} disabled={deleting}>
            <CancelButtonText>{t('common.cancel')}</CancelButtonText>
          </CancelButton>
        </Content>
      </Container>
    </FormScreen>
  );
}
