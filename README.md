# FocusPulse

Aplicativo mobile offline-first de Pomodoro e gestão de tarefas, construído com React Native, Expo e TypeScript estrito.

## Primeira entrega

- Temporizador com foco, pausa curta, pausa longa, ciclos configuráveis e restauração após segundo plano.
- Tarefas locais em SQLite, com prioridades, estimativas, conclusão e início do timer pelo card.
- Relatórios calculados a partir das sessões concluídas: produtividade, foco vs. pausas, semana, histórico e horários de pico.
- Ajustes persistidos de duração, ciclos, tema e início automático.
- Tema claro/escuro e navegação inferior nas quatro áreas do produto.

## Executar

Requer Node.js 20.19.4 ou superior e o Expo Go compatível com SDK 54.

```bash
npm install
npm start
```

Leia o QR Code com o Expo Go ou use `npm run android` com um emulador disponível.

## Verificar

```bash
npm run typecheck
npx expo export --platform android
```

## Persistência

Tarefas e sessões usam `expo-sqlite`. Preferências e o estado ativo do timer passam pela interface `KeyValueStorage`, hoje implementada com AsyncStorage para funcionar no Expo Go. Essa fronteira permite substituir o adaptador por MMKV em um development build sem alterar controllers ou telas.
