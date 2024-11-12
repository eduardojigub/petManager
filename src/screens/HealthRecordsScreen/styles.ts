import { Platform } from 'react-native';
import styled from 'styled-components/native';
import FastImage from 'react-native-fast-image';


export const Container = styled.View`
  flex: 1;
  padding: 10px;
  background-color: ${Platform.OS === 'ios' ? '#ffffff' : '#ededed '};
  align-items: center;
`;

export const ListItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: #ffffff;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 10px;
  width: 100%;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
`;

export const ListItemContent = styled.View`
  flex: 1;
  margin-left: 10px;
`;

export const ListItemText = styled.Text`
  font-size: 16px;
  color: #333;
`;

export const TypeIcon = styled.View`
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
`;

export const ListItemDetailHint = styled.Text`
  color: #7289DA;
  font-size: 12px;
  margin-top: 4px;
`;

export const AddButton = styled.TouchableOpacity`
  background-color: #41245C;
  padding: 15px 20px;
  border-radius: 8px;
  margin-top: 20px;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
`;

export const ButtonText = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
`;

export const TrashIconContainer = styled.TouchableOpacity`
  padding: 10px;
  margin-left: auto;
`;

export const ModalContainer = styled.View`
  background-color: #FFFFFF;
  width: 90%; /* Increased width for a larger modal */
  padding: 30px; /* Increased padding for more spacious content */
  border-radius: 15px;
  align-items: center;
  justify-content: center;
  ${Platform.select({
    ios: `
      shadow-color: #000;
      shadow-offset: {width: 0, height: 2};
      shadow-opacity: 0.25;
      shadow-radius: 3.84px;
    `,
    android: `
      elevation: 5;
    `
  })}
`;


export const FilterButton = styled.TouchableOpacity`
  background-color: #41245C;
  padding: 10px 20px;
  border-radius: 8px;
  margin-bottom: 15px;
  align-items: center;
  width: 100%;
`;

export const DetailDateText = styled.Text`
  color: #A9A9A9;
  font-size: 12px;
`;

export const EmptyListContainer = styled.View`
  align-items: center;
  margin-top: 80px;
`;

export const EmptyListImage = styled(FastImage)`
  width: 300px;
  height: 300px;
  margin-bottom: 20px;
`;

export const EmptyListText = styled.Text`
  font-size: 16px;
  color: #000;
  text-align: center;
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 30px;
  font-family: 'Poppins_400Regular';
`;

export const DisabledAddButton = styled.TouchableOpacity`
  background-color: #41245C;
  padding: 15px 20px;
  border-radius: 8px;
  margin-top: 20px;
  align-items: center;
  width: 100%;
  opacity: 0.5; // Reduced opacity for disabled effect
`;

export const FilterButtonText = styled.Text`
  color: #FFF;
  font-size: 16px;
  font-weight: bold;
`;

export const ModalHeader = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center; /* Centers the title */
  margin-bottom: 15px;
  position: relative;
`;
export const ModalTitle = styled.Text`
  flex: 1; /* Allows the title to take up available space */
  font-size: 20px;
  font-weight: bold;
  color: #41245C;
  text-align: center; /* Centers the title text */
`;

export const CloseButton = styled.TouchableOpacity`
  padding: 5px;
  justify-content: center;
  align-items: center;
`;

export const CloseButtonText = styled.Text`
  font-size: 18px; /* Larger font size for visibility */
  font-weight: bold; /* Make it bold for emphasis */
`;

export const DropdownContainer = styled.View`
  width: 100%; /* Full width for more space */
  margin-top: 15px; /* Increased margin for more spacing */
  margin-bottom: 15px;
`;

export const FloatingFilterButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 90px;
  right: 25px;
  background-color: #41245C;
  padding: 15px;
  border-radius: 50px;
  align-items: center;
  justify-content: center;
`;

export const FloatingButtonText = styled.Text`
  color: #FFF;
  font-size: 14px;
  font-weight: bold;
`;

// Add this styled component for the dropdown labels
export const DropdownLabel = styled.Text`
  font-size: 14px; /* Increased font size for better readability */
  color: #A9A9A9;
  margin-bottom: 8px; /* Slightly increased margin for spacing */
`;

// Add this styled component for dropdown styling
export const DropdownStyle = styled.View`
  border-width: 1px;
  border-color: #ccc;
  border-radius: 8px;
  padding: 12px; /* Increased padding for a larger dropdown area */
  width: 100%; /* Full width for better alignment */
`;

export const FloatingClearFilterButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 150px; /* Adjust to place above the FloatingFilterButton */
  right: 25px;
  background-color: #E07A73;
  padding: 15px;
  border-radius: 50px;
  align-items: center;
  justify-content: center;
  z-index: 10; /* Ensure it appears above other elements */
`;