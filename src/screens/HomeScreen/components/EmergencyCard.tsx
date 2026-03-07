import React, { useState, useContext, useEffect } from 'react';
import { Modal, Share, Alert } from 'react-native';
import styled from 'styled-components/native';
import { X, ShareNetwork, Syringe, Stethoscope, IdentificationBadge } from 'phosphor-react-native';
import { collection, query, where, getDocs } from '@react-native-firebase/firestore';
import { db } from '../../../firebase/Firestore';
import { DogProfileContext } from '../../../context/DogProfileContext';
import { LanguageContext } from '../../../context/LanguageContext';
import { DogProfile } from '../../../types/dogProfile';

interface EmergencyCardProps {
  visible: boolean;
  onClose: () => void;
}

export default function EmergencyCard({ visible, onClose }: EmergencyCardProps) {
  const { selectedDog } = useContext(DogProfileContext);
  const { t } = useContext(LanguageContext);
  const [vaccines, setVaccines] = useState<any[]>([]);
  const [vetName, setVetName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && selectedDog) {
      loadEmergencyData();
    }
  }, [visible, selectedDog]);

  const loadEmergencyData = async () => {
    if (!selectedDog) return;
    setLoading(true);
    try {
      const snapshot = await getDocs(
        query(collection(db, 'healthRecords'), where('dogId', '==', selectedDog.id))
      );
      const records = snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() }));

      // Get active vaccines (not expired)
      const now = new Date();
      const activeVaccines = records
        .filter((r: any) => r.type === 'Vaccine' && r.status !== 'scheduled')
        .filter((r: any) => !r.dueDate || new Date(r.dueDate) > now)
        .map((r: any) => r.extraInfo || 'Vaccine');

      // Get latest vet name
      const vetRecords = records
        .filter((r: any) => r.type === 'Vet Appointment' && r.vetName)
        .sort((a: any, b: any) => (b.date || '').localeCompare(a.date || ''));
      const latestVet = vetRecords.length > 0 ? vetRecords[0].vetName : null;

      setVaccines(activeVaccines);
      setVetName(latestVet);
    } catch (error) {
      console.error('Error loading emergency data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!selectedDog) return;
    const dog = selectedDog as DogProfile;

    let text = `🐾 ${t('home.emergencyCardTitle')} — ${dog.name}\n\n`;
    text += `${t('editPet.breed')}: ${dog.breed || '-'}\n`;
    text += `${t('editPet.weight')}: ${dog.weight ? `${dog.weight} kg` : '-'}\n`;
    if (dog.microchip) text += `${t('editPet.microchip')}: ${dog.microchip}\n`;
    text += `\n💉 ${t('home.vaccinesUpToDate')}:\n`;
    if (vaccines.length > 0) {
      vaccines.forEach((v) => { text += `  • ${v}\n`; });
    } else {
      text += `  ${t('home.noVaccinesRecorded')}\n`;
    }
    if (vetName) {
      text += `\n🩺 ${t('home.contactVet')}: ${vetName}\n`;
    }

    try {
      await Share.share({ message: text });
    } catch {
      Alert.alert(t('common.error'));
    }
  };

  if (!selectedDog) return null;
  const dog = selectedDog as DogProfile;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <Overlay>
        <CardContainer>
          <CardHeader>
            <CardHeaderTitle>{t('home.emergencyCardTitle')}</CardHeaderTitle>
            <CloseButton onPress={onClose}>
              <X size={22} color="#666" />
            </CloseButton>
          </CardHeader>

          <PetNameRow>
            <PetName>{dog.name}</PetName>
            <PetBreed>{dog.breed}{dog.gender ? ` · ${dog.gender}` : ''}</PetBreed>
          </PetNameRow>

          <InfoSection>
            <InfoRow>
              <InfoIconBox bgColor="#f0eff4">
                <IdentificationBadge size={18} color="#41245c" weight="bold" />
              </InfoIconBox>
              <InfoContent>
                <InfoLabel>{t('editPet.weight')}</InfoLabel>
                <InfoValue>{dog.weight ? `${dog.weight} kg` : '-'}</InfoValue>
              </InfoContent>
            </InfoRow>

            {dog.microchip && (
              <InfoRow>
                <InfoIconBox bgColor="#e0eef9">
                  <IdentificationBadge size={18} color="#3498db" weight="bold" />
                </InfoIconBox>
                <InfoContent>
                  <InfoLabel>{t('editPet.microchip')}</InfoLabel>
                  <InfoValue>{dog.microchip}</InfoValue>
                </InfoContent>
              </InfoRow>
            )}

            <InfoRow>
              <InfoIconBox bgColor="#e8f5e9">
                <Syringe size={18} color="#27ae60" weight="bold" />
              </InfoIconBox>
              <InfoContent>
                <InfoLabel>{t('home.vaccinesUpToDate')}</InfoLabel>
                {loading ? (
                  <InfoValue>...</InfoValue>
                ) : vaccines.length > 0 ? (
                  <InfoValue>{vaccines.join(', ')}</InfoValue>
                ) : (
                  <InfoValue style={{ color: '#999' }}>{t('home.noVaccinesRecorded')}</InfoValue>
                )}
              </InfoContent>
            </InfoRow>

            {vetName && (
              <InfoRow>
                <InfoIconBox bgColor="#e3f2fd">
                  <Stethoscope size={18} color="#3498db" weight="bold" />
                </InfoIconBox>
                <InfoContent>
                  <InfoLabel>{t('home.contactVet')}</InfoLabel>
                  <InfoValue>{vetName}</InfoValue>
                </InfoContent>
              </InfoRow>
            )}
          </InfoSection>

          <ShareButton onPress={handleShare}>
            <ShareNetwork size={20} color="#fff" weight="bold" />
            <ShareButtonText>{t('home.shareCard')}</ShareButtonText>
          </ShareButton>
        </CardContainer>
      </Overlay>
    </Modal>
  );
}

const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  padding: 24px;
`;

const CardContainer = styled.View`
  background-color: #fff;
  border-radius: 24px;
  padding: 24px;
`;

const CardHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const CardHeaderTitle = styled.Text`
  font-size: 18px;
  color: #41245c;
  font-family: 'Poppins_700Bold';
`;

const CloseButton = styled.TouchableOpacity`
  padding: 4px;
`;

const PetNameRow = styled.View`
  margin-bottom: 20px;
`;

const PetName = styled.Text`
  font-size: 22px;
  color: #333;
  font-family: 'Poppins_700Bold';
`;

const PetBreed = styled.Text`
  font-size: 14px;
  color: #666;
  font-family: 'Poppins_400Regular';
`;

const InfoSection = styled.View`
  margin-bottom: 20px;
`;

const InfoRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 14px;
`;

const InfoIconBox = styled.View<{ bgColor: string }>`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background-color: ${({ bgColor }) => bgColor};
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const InfoContent = styled.View`
  flex: 1;
`;

const InfoLabel = styled.Text`
  font-size: 12px;
  color: #999;
  font-family: 'Poppins_500Medium';
`;

const InfoValue = styled.Text`
  font-size: 14px;
  color: #333;
  font-family: 'Poppins_600SemiBold';
`;

const ShareButton = styled.TouchableOpacity`
  background-color: #41245c;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 14px;
  border-radius: 14px;
`;

const ShareButtonText = styled.Text`
  color: #fff;
  font-size: 15px;
  font-family: 'Poppins_600SemiBold';
  margin-left: 8px;
`;
