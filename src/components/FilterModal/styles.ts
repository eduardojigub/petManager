import styled from 'styled-components/native';

interface ApplyButtonProps {
  hasActiveFilters: boolean;
}

export const Overlay = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const ModalContainer = styled.View`
  background-color: #fff;
  border-radius: 16px;
  padding: 20px;
  width: 90%;
  max-height: 80%;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const Title = styled.Text`
  font-size: 20px;
  font-family: Poppins_600SemiBold;
  color: #41245C;
`;

export const CloseButton = styled.TouchableOpacity`
  padding: 4px;
`;

export const DropdownContainer = styled.View`
  margin-bottom: 16px;
`;

export const DropdownLabel = styled.Text`
  font-size: 14px;
  font-family: Poppins_400Regular;
  color: #666;
  margin-bottom: 6px;
`;

export const DropdownWrapper = styled.View`
  border-width: 1px;
  border-color: #ddd;
  border-radius: 8px;
  padding: 8px;
`;

export const ApplyButton = styled.TouchableOpacity<ApplyButtonProps>`
  background-color: #7289DA;
  border-radius: 10px;
  padding: 14px;
  align-items: center;
  margin-top: 10px;
  opacity: ${({ hasActiveFilters }) => (hasActiveFilters ? 1 : 0.5)};
`;

export const ApplyButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-family: Poppins_600SemiBold;
`;
