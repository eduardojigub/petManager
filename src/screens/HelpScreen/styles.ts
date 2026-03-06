import styled from 'styled-components/native';

export const Container = styled.ScrollView`
  flex: 1;
  background-color: #f8f8f8;
`;

export const ContentContainer = styled.View`
  padding: 20px;
`;

export const FAQCard = styled.View`
  background-color: #fff;
  border-radius: 16px;
  margin-bottom: 12px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.06;
  shadow-radius: 8px;
  elevation: 2;
`;

export const QuestionRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 16px 20px;
`;

export const QuestionText = styled.Text`
  flex: 1;
  font-size: 15px;
  color: #333;
  font-family: 'Poppins_600SemiBold';
`;

export const AnswerContainer = styled.View`
  padding: 0 20px 16px 20px;
`;

export const AnswerText = styled.Text`
  font-size: 14px;
  color: #666;
  line-height: 22px;
  font-family: 'Poppins_400Regular';
`;

export const ContactCard = styled.View`
  background-color: #fff;
  border-radius: 16px;
  padding: 20px;
  margin-top: 12px;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.06;
  shadow-radius: 8px;
  elevation: 2;
`;

export const ContactTitle = styled.Text`
  font-size: 16px;
  color: #333;
  font-family: 'Poppins_600SemiBold';
  margin-bottom: 6px;
`;

export const ContactText = styled.Text`
  font-size: 13px;
  color: #999;
  font-family: 'Poppins_400Regular';
  text-align: center;
  margin-bottom: 14px;
`;

export const ContactButton = styled.TouchableOpacity`
  background-color: #7289da;
  padding: 12px 32px;
  border-radius: 12px;
`;

export const ContactButtonText = styled.Text`
  color: #fff;
  font-size: 14px;
  font-family: 'Poppins_600SemiBold';
`;
