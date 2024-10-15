import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #f5f5f5; /* Soft background color for consistency */
  padding: 30px 20px; /* Add some extra padding on top for spacing */
  align-items: center;
`;

export const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: #41245C; /* Match the primary color theme */
  margin-bottom: 30px; /* Additional spacing for separation */
  text-align: center;
  font-family: 'Poppins_700Bold'; /* Use custom font if available */
`;

export const Button = styled.TouchableOpacity`
  background-color: #41245C;
  padding: 15px 20px;
  border-radius: 12px;
  margin-vertical: 12px; /* Slightly increased margin for breathing room */
  width: 100%;
  max-width: 350px; /* Optional max-width for larger screens */
  align-items: center;
`;

export const ButtonText = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  font-family: 'Poppins_600SemiBold'; /* Use custom font if available */
`;
