# Pet's Life 🐾

Aplicativo mobile para gerenciamento completo da vida do seu pet — perfis, saúde, compromissos e despesas, tudo em um só lugar.

Desenvolvido em **React Native + Expo** com backend em **Firebase**, o Pet's Life ajuda tutores a manter o histórico e a rotina dos seus cães sempre organizados.

---

## 📱 Sobre o projeto

Pet's Life (pacote `com.petmanager.cat`) é um app publicado nas lojas iOS e Android que centraliza todas as informações importantes sobre seus pets. Cada usuário pode cadastrar múltiplos perfis de cachorros e acompanhar vacinas, consultas, agendamentos, gastos e muito mais.

**Versão atual:** 2.0.2

---

## ✨ Funcionalidades

### 🔐 Autenticação
- Cadastro e login com e-mail e senha (Firebase Auth)
- Recuperação de senha via e-mail
- Gerenciamento de conta (edição de perfil, troca de senha, exclusão de conta)

### 🐕 Perfis de Pets
- Cadastro de múltiplos pets por usuário
- Foto, nome, raça, data de nascimento, peso e informações gerais
- Seletor global de pet ativo — a experiência do app todo se adapta ao pet selecionado
- Edição e exclusão de perfis

### 💉 Registros de Saúde
- Histórico de vacinas, consultas, medicamentos e tratamentos
- Anexo de imagens (receitas, exames) via câmera ou galeria
- Visualização detalhada de cada registro
- Exportação do histórico em PDF para levar ao veterinário

### 📅 Agenda e Compromissos
- Cadastro de compromissos (consultas, banho, vacinas, passeios)
- Notificações push locais com lembretes
- Visualização por data e por pet

### 💰 Controle de Despesas
- Registro de gastos por categoria (ração, veterinário, petshop, acessórios etc.)
- Gráficos de despesas por período
- Acompanhamento de quanto você investe em cada pet

### ⚙️ Configurações e Suporte
- Gerenciamento de notificações
- Tela de ajuda e suporte
- Gestão completa da conta do usuário

---

## 🛠️ Stack Técnica

| Camada | Tecnologia |
|--------|-----------|
| Framework | React Native 0.79 (New Architecture) + Expo 53 |
| Linguagem | TypeScript (strict) |
| UI | styled-components/native |
| Navegação | React Navigation v6 (Bottom Tabs + Stack) |
| Ícones | Phosphor React Native + Vector Icons |
| Fontes | Poppins (Google Fonts) |
| Autenticação | Firebase Auth (`@react-native-firebase/auth`) |
| Banco de dados | Cloud Firestore |
| Armazenamento | Firebase Storage (imagens) |
| Notificações | expo-notifications |
| Gráficos | react-native-chart-kit |
| Persistência local | AsyncStorage |
| Build/Deploy | EAS Build + EAS Update |

---

## 🏗️ Arquitetura

### Navegação
```
AuthStack
  ├── InitialScreen
  ├── SignIn
  ├── SignUp
  └── ForgotPassword

Main (Bottom Tabs)
  ├── Profile    → Cadastro/edição de pets
  ├── Health     → Registros de saúde + detalhes
  ├── Schedule   → Agenda/compromissos
  ├── Expenses   → Despesas e gráficos
  └── Settings   → Conta, notificações, ajuda
```

### Estado global
- `DogProfileContext` (React Context) mantém o pet selecionado globalmente
- `AsyncStorage` persiste o pet selecionado entre sessões

### Camada de dados
- `src/firebase/FirestoreService.tsx` — utilitários centralizados de CRUD (`addDocument`, `updateDocument`, `getUserDocuments`, `deleteUserDocument`)
- Todas as queries são escopadas por `userId` e/ou `dogId`
- Coleções: `dogProfiles`, `schedules`, `healthRecords`, `expenses`

### Estrutura de pastas
```
src/
├── assets/       # Imagens estáticas
├── components/   # Componentes compartilhados (GlobalAlert, etc.)
├── context/      # DogProfileContext
├── firebase/     # Configuração e serviços Firebase
├── hooks/        # Hooks customizados
├── screens/      # Telas organizadas por feature, cada uma com styles.ts
├── types/        # Definições TypeScript
└── utils/        # Utilitários (dateFormatter, etc.)
```

---

## 🚀 Como rodar localmente

### Pré-requisitos
- Node.js 18+
- npm
- Expo CLI
- Conta Firebase com projeto configurado (Auth + Firestore + Storage)
- Arquivos `GoogleService-Info.plist` (iOS) e `google-services.json` (Android) na raiz do projeto

### Instalação

```bash
# Clone o repositório
git clone https://github.com/eduardojigub/petManager.git
cd petManager

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run start
```

### Comandos disponíveis

```bash
npm run start      # Expo dev server
npm run android    # Rodar no Android
npm run ios        # Rodar no iOS
npm run web        # Rodar no web (experimental)
```

### Build de produção

Builds são gerenciadas via **EAS Build**. Veja `eas.json` para os perfis configurados.

```bash
eas build --platform ios
eas build --platform android
```

---

## 🎨 Design System

- **Cores primárias:** Roxo `#41245C` • Azul `#7289DA` • Branco `#fff`
- **Tipografia:** Poppins
- **Padrão de telas:** cada tela possui pasta própria com o componente principal + `styles.ts` colocalizado

---

## 🌿 Git Workflow

- Todas as branches de feature/fix são criadas a partir de `staging`
- PRs sempre vão primeiro para `staging`
- Releases são feitas com merge `staging → main`
- Commits diretos em `main` não são permitidos

---

## 📄 Licença

Projeto privado. Todos os direitos reservados.

---

## 👨‍💻 Autor

Desenvolvido por **Eduardo Bruno**
[GitHub](https://github.com/eduardojigub)
