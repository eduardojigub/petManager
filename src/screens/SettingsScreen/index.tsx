import React from 'react';
import ClearCacheButton from '../../components/ClearCacheButton/ClearCacheButton';
import { Container, Title, Button, ButtonText } from './styles'; // Importando os componentes estilizados

export default function SettingsScreen() {
  return (
    <Container>
      <Title>Configurações</Title>

      {/* Botão para editar o perfil */}
      <Button onPress={() => alert('Navegar para edição de perfil')}>
        <ButtonText>Editar Perfil</ButtonText>
      </Button>

      {/* Gerenciamento de notificações */}
      <Button onPress={() => alert('Navegar para configurações de notificações')}>
        <ButtonText>Gerenciar Notificações</ButtonText>
      </Button>

      {/* Botão para escolher idioma */}
      <Button onPress={() => alert('Escolher idioma')}>
        <ButtonText>Escolher Idioma</ButtonText>
      </Button>

      {/* Botão de limpar cache */}
      <ClearCacheButton />

      {/* Termos de uso e política de privacidade */}
      <Button onPress={() => alert('Exibir termos de uso')}>
        <ButtonText>Termos de Uso e Privacidade</ButtonText>
      </Button>

      {/* Sobre o aplicativo */}
      <Button onPress={() => alert('Exibir informações do app')}>
        <ButtonText>Sobre o Aplicativo</ButtonText>
      </Button>

      {/* Logout (se aplicável) */}
      <Button onPress={() => alert('Sair da conta')}>
        <ButtonText>Sair da Conta</ButtonText>
      </Button>
    </Container>
  );
}
