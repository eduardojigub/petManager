import styled from 'styled-components/native';
import { Image } from 'expo-image';

export const DogDetailCard = styled.View`
  background-color: #fff;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 20px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.06;
  shadow-radius: 8px;
  elevation: 2;
`;

export const DogDetailHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
`;

export const DogDetailImage = styled(Image)`
  width: 72px;
  height: 72px;
  border-radius: 36px;
  border-width: 2px;
  border-color: #41245c;
`;

export const DogDetailPlaceholder = styled.View`
  width: 72px;
  height: 72px;
  border-radius: 36px;
  background-color: #f0eff4;
  align-items: center;
  justify-content: center;
  border-width: 2px;
  border-color: #e0dce6;
`;

export const DogDetailInfo = styled.View`
  flex: 1;
  margin-left: 16px;
`;

export const DogDetailName = styled.Text`
  font-size: 20px;
  color: #333;
  font-family: 'Poppins_700Bold';
`;

export const DogDetailBreed = styled.Text`
  font-size: 13px;
  color: #666;
  font-family: 'Poppins_400Regular';
`;

export const DogDetailMeta = styled.Text`
  font-size: 13px;
  color: #888;
  font-family: 'Poppins_400Regular';
`;

export const EditDogButton = styled.TouchableOpacity`
  padding: 4px;
`;

export const StatsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const StatCard = styled.TouchableOpacity<{ bgColor?: string }>`
  flex: 1;
  background-color: ${({ bgColor }) => bgColor || '#f0eff4'};
  border-radius: 14px;
  padding: 12px;
  margin-horizontal: 4px;
  align-items: center;
`;

export const StatValue = styled.Text<{ color?: string }>`
  font-size: 20px;
  color: ${({ color }) => color || '#333'};
  font-family: 'Poppins_700Bold';
`;

export const StatLabel = styled.Text`
  font-size: 11px;
  color: #666;
  font-family: 'Poppins_400Regular';
  text-align: center;
`;
