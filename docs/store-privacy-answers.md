# Respostas para a ficha de privacidade das lojas

**Modelo para revisão do Bruno. Não é aconselhamento jurídico.**

Este arquivo traduz o que o código do Pet's Life faz, nesta branch, para os formulários da App Store Connect e do Play Console. Não publique a ficha com “Data Not Collected”. Conferir o texto da política em `docs/privacy/` antes de ativar o GitHub Pages e antes de colar o URL nas lojas.

URL da política (depois que o Pages estiver no ar, branch `main`, pasta `/docs`):

- Português: `https://eduardojigub.github.io/petManager/privacy/`
- Inglês: `https://eduardojigub.github.io/petManager/privacy/en.html`
- Seção de exclusão, para o campo de URL de exclusão: `https://eduardojigub.github.io/petManager/privacy/#exclusao`

Colar o URL em português nas duas lojas. A página em inglês está ligada no topo.

O Pages publica a pasta `/docs` inteira. Este arquivo também fica acessível em `https://eduardojigub.github.io/petManager/store-privacy-answers.md`. Não há segredo aqui. Se não quiser esse checklist público, tire o arquivo de `/docs` antes do merge em `main`.

## Como o inventário foi feito

Lido no código, sem assumir SDK que o app não liga:

- Conta: `SignUp`, `SignIn`, `ForgotPassword`, `EditUserProfileScreen`, `ManageAccountScreen`. E-mail e senha via Firebase Authentication. Nome e foto de perfil só se o usuário salvar. Sem login social na interface.
- Dados do pet: `dogProfiles` (nome, raça, aniversário, idade calculada, peso, sexo do pet, cor, microchip, foto).
- Saúde do pet: `healthRecords` (tipo, descrição, data, observações, foto, retorno, lembrete, veterinário, clínica, peso da visita, lote, dosagem, frequência, serviços, id do lembrete local).
- Agenda: `schedules` (tipo, descrição, data, hora, lembrete local). O campo `emailReminder` é gravado sempre `false`. Não há envio de e-mail de lembrete.
- Despesas: `expenses` (título, valor, tipo, data, recorrência). Não há pagamento, cartão nem compra in-app.
- Documento técnico `userMigrations/{uid}`.
- Fotos novas: Firebase Storage em `users/{uid}/...`, pelo `useImageUpload` (só galeria, só imagem).
- No aparelho: AsyncStorage (`selectedDogId`, `notificationsEnabled`, `@petlife_language`, marca do backfill). Notificações locais com `expo-notifications`. O código não pede token de push.
- Exportação: PDF local com `expo-print` e folha de compartilhamento com `expo-sharing`. Não inclui e-mail nem arquivos de foto.
- Exclusão: Ajustes → Conta → Excluir minha conta. Pede a senha, apaga documentos encontrados da conta, fotos ainda ligadas a esses documentos ou à foto do perfil, lembretes locais e preferências locais (o idioma fica), e por último o usuário do Auth.
- `package.json` não depende de analytics, Crashlytics, anúncios nem `expo-web-browser`. `GoogleService-Info.plist` tem `IS_ANALYTICS_ENABLED` e `IS_ADS_ENABLED` em falso. Os módulos Firebase instalados são só `app`, `auth`, `firestore` e `storage`, sem Analytics nem Crashlytics. O app não usa `expo-updates` (sem atualização remota de código). As pastas `ios/` e `android/` não ficam no repositório: a EAS gera as duas a partir do `app.json`, onde também está o privacy manifest do iOS (`ios.privacyManifests`).

Não marcar na ficha o que esta lista não mostra: localização, contatos, calendário, SMS, áudio, vídeo, identificador de publicidade, histórico de navegação, saúde do usuário (HealthKit), pagamento, crash, analytics, anúncios, rastreamento.

O projeto iOS tem textos de permissão de câmera e microfone, e `app.json` declara `RECORD_AUDIO` no Android. O código não abre a câmera, não grava áudio e não pede essas permissões em execução. Não declarar câmera, microfone ou áudio como dados coletados. Vale remover essas permissões numa mudança separada, para a ficha do binário não sugerir o contrário.

Registros de saúde são do pet. Não marcar a categoria Health / Health info da loja. O conteúdo entra em Other User Content / Other user-generated content. Sexo do pet não é dado sensível do usuário.

## App Store Connect

### Privacy Policy URL

Em App Information (informações do app), campo **Privacy Policy URL**:

`https://eduardojigub.github.io/petManager/privacy/`

Só funciona depois do Pages na `main`.

### App Privacy (Nutrition Label)

Pergunta inicial: **Do you or your third-party partners collect data from this app?**

**Yes.** A resposta atual “Data Not Collected” está errada.

Para cada tipo abaixo: **Collected: Yes**. **Used for Tracking: No**. **Linked to the user's identity: Yes**. Purpose: só **App Functionality**. Não marcar Third-Party Advertising, Developer's Advertising or Marketing, Analytics, Product Personalization nem Other Purposes.

| Data type (rótulo da Apple) | Marcar | O que é, no app |
| --- | --- | --- |
| Contact Info → **Name** | Sim | Nome de exibição opcional no Firebase Auth. |
| Contact Info → **Email Address** | Sim | E-mail da conta. O Firebase também envia o e-mail de redefinição de senha quando o usuário pede. |
| Contact Info → Phone Number, Physical Address, Other User Contact Info | Não | Não há esses campos. |
| Health & Fitness → Health, Fitness | Não | Não há HealthKit. As anotações são do pet e entram em Other User Content. |
| Financial Info → **Other Financial Info** | Sim | Valor, título, tipo e recorrência das despesas que o usuário digita. Não é cartão nem histórico de compra da loja. |
| Financial Info → Payment Info, Credit Info | Não | Não há pagamento. |
| Location → Precise, Coarse | Não | Sem geolocalização. |
| Sensitive Info | Não | Sem dado sensível do usuário. Sexo, cor e microchip são do pet. |
| Contacts | Não | |
| User Content → **Photos or Videos** | Sim | Só fotos (perfil, pet, registro de saúde). Sem vídeo. |
| User Content → **Other User Content** | Sim | Perfil do pet, anotações de saúde, agenda e o texto das despesas que não é o valor. |
| User Content → Emails or Text Messages, Audio Data, Gameplay Content, Customer Support | Não | E-mail de suporte vai para a caixa `eduardobrunoit@gmail.com`, fora de um SDK de suporte do app. |
| Browsing History, Search History | Não | |
| Identifiers → **User ID** | Sim | uid do Firebase Authentication. |
| Identifiers → Device ID | Não | O app não lê IDFA, Android ID nem identificador de publicidade. Sem prompt de rastreamento (ATT). |
| Purchases | Não | Sem compra in-app. |
| Usage Data → Product Interaction, Advertising Data, Other Usage Data | Não | Sem analytics. |
| Diagnostics → Crash Data, Performance Data, Other Diagnostic Data | Não | Sem Crashlytics nem SDK de diagnóstico. `console` fica no aparelho. |
| Surroundings, Body, Other Data | Não | |

“Data Used to Track You”: nenhum tipo.

“Data Linked to You”: Name, Email Address, Other Financial Info, Photos or Videos, Other User Content, User ID.

“Data Not Linked to You”: nenhum.

A senha não tem tipo próprio. Ela vai para o Firebase Authentication e não é um campo do Firestore.

Se o privacy report do binário enviado listar um tipo a mais por causa do SDK do Firebase, reconciliar com esse relatório antes de enviar. Por este repositório, os tipos da tabela são os que o app coleta.

## Play Console — Segurança dos dados (Data safety)

Caminho: Política do app → Segurança dos dados (`Policy` → `App content` → `Data safety`).

### Perguntas gerais

| Pergunta | Resposta |
| --- | --- |
| O app coleta ou compartilha algum dos tipos de dados obrigatórios? (`Does your app collect or share any of the required user data types?`) | **Sim** |
| Todos os dados coletados são criptografados em trânsito? (`Is all of the user data collected by your app encrypted in transit?`) | **Sim.** O que sai do aparelho vai para o Firebase por HTTPS. Não há outro endpoint no código. |
| Vocês oferecem um meio de pedir exclusão dos dados? (`Do you provide a way for users to request that their data is deleted?`) | **Sim.** No app: Ajustes → Conta → Excluir minha conta, com a senha. Por e-mail: `eduardobrunoit@gmail.com`. URL: `https://eduardojigub.github.io/petManager/privacy/#exclusao` |

Método de conta, se o formulário perguntar: nome de usuário e senha (e-mail e senha). Sem Google Sign-In, Facebook ou login anônimo na interface.

Não marcar “os dados são só processados de forma efêmera”. Os dados são armazenados.

**Compartilhamento (`Shared`): Não**, em todos os tipos. O Firebase é o provedor que hospeda conta, banco e arquivos em nome do app. O app não vende dados e não os manda para publicidade, corretoras ou outros apps. A folha de compartilhamento do PDF é ação do usuário. No formulário, isso não é “shared”.

### Tipos para marcar como coletados

Para cada um: Collected **Yes**, Shared **No**, processado de forma efêmera **No**.

| Tipo no Play Console | Obrigatório ou o usuário escolhe | Finalidades |
| --- | --- | --- |
| Informações pessoais → **Nome** (`Name`) | O usuário escolhe. Dá para usar a conta sem salvar um nome. | Funcionalidade do app; gerenciamento da conta |
| Informações pessoais → **Endereço de e-mail** (`Email address`) | Obrigatório. Sem conta o app não abre a área dos pets. | Funcionalidade do app; gerenciamento da conta |
| Informações pessoais → **IDs de usuário** (`User IDs`) | Obrigatório. O uid é criado com a conta. | Funcionalidade do app; gerenciamento da conta |
| Informações financeiras → **Outras informações financeiras** (`Other financial info`) | O usuário escolhe. Dá para não lançar despesas. | Funcionalidade do app |
| Fotos e vídeos → **Fotos** (`Photos`) | O usuário escolhe. | Funcionalidade do app |
| Atividade no app → **Outro conteúdo gerado pelo usuário** (`Other user-generated content`) | O usuário escolhe. A conta existe sem pets; as funções de pet guardam o que ele digitar. | Funcionalidade do app |

Não marcar estas finalidades: Analytics, Developer communications, Advertising or marketing, Fraud prevention, security, and compliance, Personalization. O app não implementa isso. O e-mail de redefinição de senha é o Firebase Authentication, coberto por gerenciamento da conta.

### Tipos para deixar desmarcados

Localização (aproximada e precisa). Endereço, telefone, raça e etnia, crenças, orientação sexual, outras informações pessoais além do nome, e-mail e uid. Informações de pagamento, histórico de compras, score de crédito. Informações de saúde e de condicionamento físico. E-mails, SMS e outras mensagens no app. Vídeos. Gravações de voz ou som, arquivos de música, outros áudios. Arquivos e documentos (o PDF é gerado no aparelho e o usuário escolhe o destino; o desenvolvedor não o recebe). Calendário. Contatos. Interações no app, histórico de pesquisa no app, apps instalados, outras ações. Navegação na web. Registros de falhas, diagnósticos, outros dados de desempenho. IDs do dispositivo ou outros IDs.

## Exclusão de conta no Play (além do Data safety)

Se o formulário de exclusão de conta pedir um URL na web, usar `https://eduardojigub.github.io/petManager/privacy/#exclusao`. O caminho no app continua obrigatório: Ajustes → Conta → Excluir minha conta.

## Limites reais da exclusão (não exagerar na ficha)

- Apagar um item remove aquele documento. Apagar um pet não apaga sozinho saúde, agenda, despesas nem o arquivo da foto.
- A exclusão da conta remove fotos cujo endereço ainda está num documento da conta ou na foto do perfil. Uma foto cujo registro já foi apagado pode ficar no Storage.
- Documentos antigos sem `userId`, se o backfill não os marcou e a regra já bloqueia a busca só por `dogId`, ficam de fora da exclusão feita pelo app. O usuário pode pedir pelo e-mail.
- Se a exclusão falha no meio, a conta permanece ativa de propósito, para tentar de novo.
- O idioma (`@petlife_language`) fica no aparelho.
- Não há prazo automático de retenção no código. Os dados ficam enquanto a conta existir.

Esses limites estão escritos na política, em linguagem direta, na seção de exclusão.

## Passos manuais depois do merge

1. Este PR entra em `staging`. A política só fica no URL público quando `staging` for para `main` e o GitHub Pages for ligado: Settings → Pages → Deploy from a branch → Branch **main** → Folder **/docs** → Save. O arquivo `docs/.nojekyll` faz o Pages servir o HTML como está.
2. Abrir `https://eduardojigub.github.io/petManager/privacy/` e `en.html`. Confirmar a data 14 de novembro de 2026, o e-mail e o caminho de exclusão.
3. App Store Connect: Privacy Policy URL e App Privacy com a tabela desta página. Tirar “Data Not Collected”.
4. Play Console: URL da política, Segurança dos dados e o URL de exclusão, com a tabela desta página.
