import styled from 'styled-components/native';

// Main container for the screen
export const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #f5f5f5;
  align-items: center;
`;

// Add Schedule button style
export const AddButton = styled.TouchableOpacity`
  background-color: #7289da;
  padding: 15px 20px;
  border-radius: 8px;
  margin-top: 20px;
  align-items: center;
  width: 100%;
`;

// Text for the buttons
export const ButtonText = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
`;

// Style for each item in the list
export const ListItem = styled.View`
  background-color: #ffffff;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 10px;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
`;

// Text inside each list item
export const ListItemText = styled.Text`
  font-size: 16px;
  color: #333;
`;

// Input for schedule description
export const Input = styled.TextInput`
  width: 100%;
  padding: 15px;
  border-radius: 8px;
  border-width: 1px;
  border-color: #ccc;
  margin-bottom: 20px;
  font-size: 16px;
  color: #333;
`;