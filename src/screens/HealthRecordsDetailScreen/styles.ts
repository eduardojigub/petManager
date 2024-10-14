import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #f5f5f5;
  align-items: center;
`;

export const Section = styled.View`
  background-color: #ffffff;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
  width: 100%;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow for elevation */
  elevation: 3;
`;

export const DetailText = styled.Text`
  font-size: 16px;
  color: #333;
  margin-top: 5px;
  text-align: center;
`;

export const IconRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 5px;
`;

export const IconText = styled.Text`
  font-size: 18px;
  color: #41245C;
  font-weight: bold;
  margin-left: 10px;
`;

export const DetailImage = styled.Image`
  width: 100%;
  height: 200px;
  border-radius: 10px;
  margin-top: 10px;
  border-width: 1px;
  border-color: #ddd;
`;

export const StyledButton = styled.TouchableOpacity`
  background-color: #41245C;
  padding: 15px 30px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  width: 60%;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2); /* Subtle shadow */
  elevation: 3;
`;

export const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;
