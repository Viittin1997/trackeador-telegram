# Trackeador Telegram - BravoBet

Aplicação para rastreamento de links do Telegram com autenticação, controle de acesso baseado em perfis de usuário e dashboard.

## Funcionalidades

- Sistema de autenticação com Supabase Auth
- Controle de acesso baseado em perfis (admin/user)
- Dashboard para visualização de links com filtros por usuário
- Cadastro de novos links com atribuição a usuários específicos
- Edição de links existentes
- Exclusão de links com confirmação
- Estatísticas gerais com métricas de desempenho
- Relatórios diários detalhados por campanha, anúncio, plataforma e URL

## Tecnologias Utilizadas

- React (Hooks, Context API)
- Supabase para autenticação e banco de dados
- CSS puro para estilização
- Gráficos interativos para visualização de dados

## Estrutura do Banco de Dados

- `bravobet_users`: Armazena informações dos usuários (email, tipo: admin/user)
- `bravobet_links_personalizados`: Links rastreados com associação a usuários específicos
- `bravobet_leads_telegram`: Registro de leads capturados através dos links
- `bravobet_registro_de_entrada`: Dados detalhados sobre entradas de usuários

## Como Executar Localmente

No diretório do projeto, você pode executar:

### `npm start`

Executa o aplicativo no modo de desenvolvimento.\
Abra [http://localhost:3000](http://localhost:3000) para visualizá-lo no navegador.

A página será recarregada quando você fizer alterações.\
Você também pode ver erros de lint no console.

### `npm run build`

Compila o aplicativo para produção na pasta `build`.\
Ele agrupa corretamente o React no modo de produção e otimiza a compilação para obter o melhor desempenho.

## Implantação

Este projeto está implantado no Netlify.

## Controle de Acesso

- **Administradores**: Podem ver e gerenciar todos os links do sistema
- **Usuários**: Podem ver e gerenciar apenas os links atribuídos a eles
