# Como gerar um teste interno do Pet's Life

O workflow **Teste interno (TestFlight e Play)** (`.github/workflows/internal-testing.yml`) gera os binários de loja na EAS e envia:

- iOS para o TestFlight (App Store Connect, app `6737129802`)
- Android para a faixa **internal testing** do Google Play (`com.petmanager.cat`), como AAB

Ele não promove para produção. Depois que o binário for testado, a promoção é manual no App Store Connect e no Play Console. A seção [Promover para produção à mão](#promover-para-produção-à-mão) descreve esse passo.

Nenhum workflow faz commit nem push, inclusive em `main`. O token do GitHub Actions só tem permissão de leitura.

## Por que o workflow não roda a cada push em `staging`

O `staging` recebe merge de pull request com frequência. Cada execução sobe um build iOS e um Android na EAS (minutos pagos do plano Expo), incrementa o build number e publica um binário novo para os testadores. Disparar isso em todo merge encheria o TestFlight e a faixa internal de builds que ninguém pediu para testar.

O workflow só entra na fila quando alguém dispara **Run workflow** na aba Actions, com a branch `staging` selecionada. Um segundo disparo espera o anterior terminar; ele não cancela um build que já está na EAS.

## Branches

1. Branches de feature saem de `staging`. Pull requests entram em `staging`.
2. `staging` → `main` é o corte de release, feito por um pull request no GitHub. O workflow não faz esse merge.
3. O teste interno deve ser gerado a partir de `staging`, no commit que os testadores vão instalar.
4. Quando o teste for aprovado, faça o merge de `staging` em `main` **antes** de promover nas lojas, para `main` apontar para o código que foi testado. Se entrarem commits novos em `main` (ou em `staging`) depois do build, eles **não** estão no binário. Nesse caso, rode o teste interno de novo e teste o build novo.
5. A promoção nas lojas usa o mesmo binário que está no TestFlight e na faixa internal. Não gere outro build de produção para “republicar” o que já foi testado.

O seletor de branch do Actions precisa estar em `staging`, a menos que você marque `allow_non_staging` de propósito.

## Versões

Há dois números:

| O quê | Onde vive | Quem muda |
| --- | --- | --- |
| Versão de loja (`2.0.6`) | `expo.version` em `app.json` e `CFBundleShortVersionString` em `ios/PetLife/Info.plist` | Você, num pull request, quando a versão atual já está publicada |
| Build number / versionCode | Servidores da EAS (`cli.appVersionSource: "remote"`) | O perfil `production`, com `autoIncrement: true`, a cada build |

`autoIncrement` **não** muda a versão de loja. A produção hoje é `2.0.5` (build `205`) nas duas plataformas. Este branch já sobe a versão de loja para `2.0.6` em `expo.version` e em `CFBundleShortVersionString`. O Android lê `expo.version` no prebuild. O iOS lê o `CFBundleShortVersionString` literal do `Info.plist` (não o `MARKETING_VERSION = 1.0` do projeto Xcode, que o Info.plist não usa).

Com `appVersionSource: "local"`, o `autoIncrement` alteraria `app.json` e o Info.plist no runner e essa alteração nunca seria commitada. O build seguinte repetiria o número e a loja recusaria o upload. Por isso a fonte passou a ser `remote`: o contador fica na EAS e o CI não precisa commitar.

Os números commitados (`ios.buildNumber`, `android.versionCode` e `CFBundleVersion`, hoje `205`) são só um piso: o último build que já está em produção. A EAS ignora esses valores no build de produção depois que o contador remoto existe, e o workflow recusa o build se o contador remoto estiver vazio ou menor que esse piso. Não edite esses três números para “adiantar” o próximo build. Os contadores de iOS e Android são independentes: o resumo de cada job mostra o número daquela plataforma.

O perfil `preview` continua para teste local no aparelho: iOS ad hoc e Android APK. Ele **não** tem `autoIncrement`, então não gasta build number de loja. O binário de preview recebe o build number remoto atual, sem somar 1. Se o aparelho já tiver esse número instalado, desinstale antes de instalar o APK de novo.

`promptToConfigurePushNotifications` está `false` para o `eas build --non-interactive` não parar perguntando sobre push (o app depende de `expo-notifications`). Isso não muda o app.

### Uma vez, antes do primeiro build desta mudança

Na sua máquina, na conta Expo que já é dona do projeto (`projectId` `6b04da84-5e19-4d4d-8d3c-52d8afdcb5d2`), **antes da primeira execução**, grave `205` no contador remoto das duas plataformas, com o perfil `production`. `205` é o build que já está em produção. O comando ainda pergunta o número; responda `205`, não `206`.

```bash
npx eas-cli build:version:set --platform ios --profile production
npx eas-cli build:version:set --platform android --profile production
```

O próximo build do perfil `production` soma 1. O primeiro build de CI fica `2.0.6` (`206`) nas duas lojas.

Confira com:

```bash
npx eas-cli build:version:get --platform all --profile production
```

Os dois contadores precisam aparecer como `205`. Não rode um `eas build --profile production` local “só para ver” antes disso: ele também incrementa o mesmo contador e o primeiro CI deixaria de ser `206`.

O CI usa `--freeze-credentials`. Ele não cria certificado, provisioning profile nem keystore. Confirme que já existem na EAS, porque os builds atuais já saem de lá:

```bash
npx eas-cli credentials
```

Se um perfil expirar, o workflow falha. Corrija na sua máquina com `eas credentials` e dispare de novo. Não há commit de credencial.

## Secrets do repositório

Em GitHub → Settings → Secrets and variables → Actions → Repository secrets. Não use environment secrets: o workflow não aponta para um environment. Não commite nenhum desses valores. `.gitignore` já ignora `*.p8`, `google-play-service-account.json` e `play-service-account.json`.

| Secret | Conteúdo |
| --- | --- |
| `EXPO_TOKEN` | Access token da conta Expo dona do projeto |
| `ASC_API_KEY_ID` | Key ID da API do App Store Connect (cerca de 10 caracteres) |
| `ASC_API_ISSUER_ID` | Issuer ID (UUID no topo da página de chaves) |
| `ASC_API_KEY_P8` | Conteúdo do arquivo `.p8`, com as linhas `BEGIN`/`END`, ou o base64 desse arquivo |
| `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON` | JSON da service account do Play, ou o base64 desse arquivo |

### `EXPO_TOKEN`

1. Entre na conta Expo que já roda `eas build` hoje.
2. Abra [expo.dev/settings/access-tokens](https://expo.dev/settings/access-tokens). Se o projeto estiver numa organização, o token precisa ser dessa conta ou de um membro com permissão de build e submit nesse projeto.
3. Crie um token, por exemplo `github-actions-pets-life`, e cole em `EXPO_TOKEN`.

### Chave do App Store Connect

1. Abra [App Store Connect → Users and Access → Integrations → App Store Connect API](https://appstoreconnect.apple.com/access/integrations/api). O Account Holder precisa ter a API habilitada.
2. Gere uma chave com acesso **App Manager** (consegue enviar build; não precisa ser Admin). Nome sugerido: `Pet's Life CI`.
3. Baixe o `.p8` na hora. A Apple não deixa baixar de novo.
4. `ASC_API_KEY_ID` é o Key ID da linha. `ASC_API_ISSUER_ID` é o Issuer ID no topo da página.
5. `ASC_API_KEY_P8` é o arquivo inteiro, várias linhas, incluindo `-----BEGIN PRIVATE KEY-----`. Se o campo do GitHub achatar as quebras de linha, use a saída de `base64 -i AuthKey_XXXXXXXXXX.p8` (macOS) ou `base64 -w 0 AuthKey_XXXXXXXXXX.p8` (Linux).

O Apple ID `eduardobrunoit@gmail.com`, o Team ID `BV4VDJR9GL` e o app `6737129802` já estão no `eas.json`. Não são secret.

### Service account do Google Play

1. No Google Cloud Console, crie uma service account (por exemplo `pet-life-play-submit`) no projeto que você vai vincular ao Play. Crie uma chave JSON e guarde o arquivo fora do git.
2. No Play Console → **Setup** → **API access**, vincule esse projeto Google Cloud se ainda não estiver vinculado.
3. Em **Users and permissions**, convide o `client_email` do JSON. Não dê admin da conta. No app Pet's Life, marque:
   - ver informações do app
   - lançar nas faixas de teste
   - lançar em produção (incluindo Play App Signing)
4. Cole o JSON inteiro em `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON`, ou o base64 do arquivo se for mais fácil colar uma linha só.

O app já está publicado, então a API deve aceitar AAB novos. Se o submit responder que é preciso enviar um APK/AAB manualmente antes, faça **um** upload pela interface do Play Console (faixa internal) e dispare o workflow de novo. Isso só acontece em app que nunca teve um binário na console.

## Disparar o teste interno

1. Faça o merge deste setup em `staging`. O workflow só aparece para a branch que o contém.
2. Actions → **Teste interno (TestFlight e Play)** → **Run workflow**.
3. Branch: `staging`. `what_to_test` é opcional (texto “What to Test” do TestFlight). Deixe `allow_non_staging` desmarcado.
4. O job de conferência roda antes de gastar build. Ele instala as dependências com `npm ci` (cache do npm no `setup-node`) e só então consulta a EAS: o CLI avalia os plugins do `app.json` e precisa do `node_modules`. O job também exige versão igual em `app.json` e no Info.plist, secrets válidos e contador remoto no piso ou acima.
5. iOS e Android sobem em paralelo, cada um com o perfil `production` (binário de loja: IPA para a App Store e AAB, não o APK do `preview`). Cada job instala as mesmas dependências antes de `eas build` e `eas submit`. Em seguida o perfil de submit `internal` envia o iOS ao TestFlight e o Android à faixa internal.
6. No resumo de cada job ficam a versão, o build number ou versionCode e o id da EAS. iOS e Android podem ter números diferentes. Anote os dois.

O build iOS costuma levar mais de meia hora. O job espera até 180 minutos.

### Confirmar que chegou

- **TestFlight:** [App Store Connect → Pet's Life → TestFlight](https://appstoreconnect.apple.com/apps/6737129802/testflight/ios). O build number do resumo aparece depois que a Apple processa (em geral 10–15 minutos depois do submit). Instale com um testador interno.
- **Play:** Play Console → Pet's Life → Test and release → Internal testing. O release deve mostrar o versionCode do resumo. Abra o link de opt-in da faixa e instale com uma conta da lista de testadores.

O perfil `submit.internal` **não** manda o app para revisão da App Store nem para a faixa production do Play.

## Promover para produção à mão

Promova só o binário que os testadores aprovaram. Não rode outro `eas build` para essa promoção: um build novo seria outro binário e gastaria outro build number.

Faça antes o merge de `staging` em `main` se esse commit testado ainda não estiver em `main`.

### Android (internal → production)

1. Play Console → Pet's Life → **Test and release** → **Internal testing**.
2. Abra o release cujo versionCode é o do resumo do job Android.
3. **Promote release** → **Production**.
4. Confira as notas da versão e o percentual do rollout (100% ou um percentual menor, se quiser liberar aos poucos).
5. Revise e inicie o rollout.

Para confirmar: em **Production**, o mesmo versionCode aparece como em revisão ou disponível, conforme o modo de publicação da conta (publicação normal ou gerenciada). O AAB não é enviado de novo.

### iOS (TestFlight → revisão da App Store)

1. App Store Connect → Pet's Life → **TestFlight**. Espere o build number do resumo ficar processado, sem pendência de conformidade de exportação.
2. Aba **App Store**. Se a versão de loja (por exemplo `2.0.6`) ainda não existir, crie a versão pelo botão **+**. A interface copia textos e capturas da versão publicada. Criar a versão pela API não copia isso, por isso a promoção ficou manual.
3. Na versão, em **Build**, escolha o build do TestFlight que foi testado (o mesmo build number). Não faça upload de outro IPA.
4. Preencha “Novidades” e envie para revisão (**Add for Review** / **Submit for Review**).

Para confirmar: o status da versão passa a **Waiting for Review** (ou o equivalente em português) com esse build number anexado. Aprovação não significa que o app já está na loja se a liberação estiver manual: depois da aprovação, use **Release this version** se a versão não estiver marcada para sair sozinha.

## Se um passo falhar

| O que aconteceu | O que fazer |
| --- | --- |
| O job de conferência pede `eas build:version:set` | Rode os dois comandos da seção de versões e responda `205` no perfil `production`. Não dispare de novo antes de `eas build:version:get --platform all --profile production` mostrar `205` no iOS e no Android. |
| `Failed to resolve plugin` ou “Do you have node modules installed?” | A EAS rodou sem as dependências do projeto. Os dois jobs fazem `npm ci` a partir do `package-lock.json` antes de qualquer comando `eas`. |
| `app.json` e Info.plist divergem | Iguale `expo.version` e `CFBundleShortVersionString` no mesmo pull request. Os pisos `205` também precisam continuar iguais entre `ios.buildNumber` e `CFBundleVersion`. |
| Secret ausente ou “não parece uma chave .p8” / JSON inválido | Recrie o secret com o arquivo inteiro ou o base64. O log não imprime a chave. |
| `App Store Connect API Keys cannot be set up in non-interactive mode` | Faltam `ASC_API_KEY_ID`, `ASC_API_ISSUER_ID` ou `ASC_API_KEY_P8`, ou o caminho não chegou no runner. Confira os três secrets e rode de novo. O build, se já tiver terminado, pode ser reenviado sem rebuild: `npx eas-cli submit --platform ios --id BUILD_ID --profile internal --non-interactive`. |
| Credencial iOS ou keystore Android ausente / expirada | `npx eas-cli credentials` na sua máquina. O CI não cria credencial (`--freeze-credentials`). |
| Android: permissão 403 ou “the app has not been uploaded” | Confira o convite da service account e as permissões de release. Se o Play exigir o primeiro upload manual, envie um AAB uma vez pela console e repita só o submit. |
| Um plataforma falha e a outra passa | `fail-fast` está desligado. Use o resumo da que passou e, para a que falhou, leia o log. Se o build EAS terminou e só o submit falhou, reenvie com `eas submit --platform ios|android --id BUILD_ID --profile internal --non-interactive`. Não gere outro build se o binário já está pronto. |
| TestFlight não lista o build | Espere o processamento. O status na EAS pode estar “finished” e “submitted” antes da Apple terminar. Confira também e-mail de compliance de exportação; o app usa HTTPS e Firebase, sem criptografia própria. |
| Play internal não lista o versionCode | Abra o submit na EAS e a faixa internal. Um versionCode repetido é recusado: o contador remoto não foi semeado acima do que já está na loja. |
| Quer cancelar | Cancele o workflow no GitHub. Isso não cancela um build que a EAS já aceitou; cancele também na página do build em [expo.dev](https://expo.dev). |

Submit local, se precisar repetir fora do Actions:

```bash
export EXPO_ASC_API_KEY_PATH="$HOME/AuthKey.p8"
export EXPO_ASC_KEY_ID="XXXXXXXXXX"
export EXPO_ASC_ISSUER_ID="00000000-0000-0000-0000-000000000000"
export GOOGLE_PLAY_SERVICE_ACCOUNT_JSON_PATH="$HOME/play-service-account.json"
npx eas-cli submit --platform all --profile internal --id BUILD_ID --non-interactive
```

Não existe perfil de submit `production` de propósito. `eas submit` sem `--profile internal` não deve ser usado para mandar este app à faixa production.
