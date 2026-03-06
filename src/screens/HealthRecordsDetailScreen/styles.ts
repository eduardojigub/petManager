import styled from 'styled-components/native';
import { Image } from 'expo-image';

export const Container = styled.ScrollView`
  flex: 1;
  background-color: #f8f8f8;
`;

export const ContentContainer = styled.View`
  padding: 20px;
`;

// Header with icon + title
export const HeaderCard = styled.View`
  background-color: #fff;
  border-radius: 20px;
  padding: 24px 20px;
  align-items: center;
  margin-bottom: 16px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.06;
  shadow-radius: 8px;
  elevation: 2;
`;

export const HeaderIconContainer = styled.View<{ bgColor?: string }>`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background-color: ${({ bgColor }) => bgColor || '#f0eff4'};
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
`;

export const RecordTitle = styled.Text`
  font-size: 22px;
  color: #333;
  font-family: 'Poppins_700Bold';
  text-align: center;
`;

export const RecordType = styled.Text`
  font-size: 13px;
  color: #888;
  font-family: 'Poppins_400Regular';
  margin-top: 2px;
`;

export const StatusBadge = styled.View<{ bgColor?: string }>`
  padding: 4px 14px;
  border-radius: 12px;
  background-color: ${({ bgColor }) => bgColor || '#e0f5e9'};
  margin-top: 10px;
`;

export const StatusBadgeText = styled.Text<{ color?: string }>`
  font-size: 12px;
  color: ${({ color }) => color || '#27ae60'};
  font-family: 'Poppins_600SemiBold';
`;

// Detail card
export const DetailCard = styled.View`
  background-color: #fff;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 16px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.06;
  shadow-radius: 8px;
  elevation: 2;
`;

export const DetailRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 16px;
`;

export const DetailIconContainer = styled.View`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background-color: #f0eff4;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

export const DetailInfo = styled.View`
  flex: 1;
`;

export const DetailLabel = styled.Text`
  font-size: 11px;
  color: #888;
  font-family: 'Poppins_500Medium';
  margin-bottom: 2px;
`;

export const DetailValue = styled.Text`
  font-size: 15px;
  color: #333;
  font-family: 'Poppins_400Regular';
`;

export const DetailImage = styled(Image)`
  width: 100%;
  height: 220px;
  border-radius: 14px;
  margin-top: 4px;
`;

// Buttons
export const EditButton = styled.TouchableOpacity`
  background-color: #41245c;
  padding: 16px;
  border-radius: 14px;
  align-items: center;
  margin-bottom: 12px;
`;

export const BackButton = styled.TouchableOpacity`
  background-color: #fff;
  padding: 16px;
  border-radius: 14px;
  align-items: center;
  margin-bottom: 20px;
  border-width: 1px;
  border-color: #e0dce6;
`;

export const EditButtonText = styled.Text`
  color: #fff;
  font-size: 15px;
  font-family: 'Poppins_600SemiBold';
`;

export const BackButtonText = styled.Text`
  color: #41245c;
  font-size: 15px;
  font-family: 'Poppins_600SemiBold';
`;
