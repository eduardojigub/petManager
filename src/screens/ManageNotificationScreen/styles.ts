// src/screens/styles.js

import styled from 'styled-components/native';

// Main container for the screen
export const Container = styled.View`
  flex: 1;
  background-color: #f5f5f5;
  padding: 20px;
  align-items: flex-start;
  justify-content: flex-start;
`;

// A row for each option with spacing
export const OptionRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;
  padding: 15px 20px;
  margin-vertical: 10px;
  border-radius: 10px;
  width: 100%;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

// Text for each option label
export const OptionText = styled.Text`
  font-size: 18px;
  color: #41245C;
  font-weight: 500;
`;

// Option description for additional information, if needed
export const OptionDescription = styled.Text`
  font-size: 14px;
  color: #888;
  margin-top: 5px;
`;
