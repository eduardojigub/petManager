import styled from 'styled-components/native';

// Main container for the screen
export const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #f5f5f5;
  align-items: center;
`;

// Style for each item in the list
export const ListItem = styled.View`
  flex-direction: row; /* Align items in a row */
  justify-content: space-between; /* Space between text and icon */
  align-items: center; /* Vertically align the items */
  background-color: #ffffff;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 10px;
  width: 100%;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
`;

// Text inside the list items
export const ListItemText = styled.Text`
  font-size: 16px;
  color: #333;
  flex: 1; /* Take up remaining space */
`;
// Add button for new health records
export const AddButton = styled.TouchableOpacity`
  background-color: #7289DA;
  padding: 15px 20px;
  border-radius: 8px;
  margin-top: 20px;
  align-items: center;
  width: 100%;
`;

// Text inside the button
export const ButtonText = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
`;
