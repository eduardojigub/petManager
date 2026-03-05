import styled from 'styled-components/native';

export const SafeArea = styled.SafeAreaView`
  flex: 1;
`;

export const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const headerStyle = {
  backgroundColor: '#fff',
  elevation: 0,
  shadowOpacity: 0,
  borderBottomWidth: 0,
};

export const headerTitleStyle = {
  fontFamily: 'Poppins_400Regular',
  fontWeight: 'normal' as const,
};
