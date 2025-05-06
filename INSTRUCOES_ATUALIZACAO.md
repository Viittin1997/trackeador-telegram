# Instruções para Atualização do App.js

Como o arquivo App.js é muito grande, siga estas instruções para atualizá-lo manualmente:

## 1. Adicione as importações dos novos componentes

No início do arquivo, após as importações existentes, adicione:

```javascript
import Dashboard from './components/Dashboard';
import EstatisticasGerais from './components/EstatisticasGerais';
import RelatoriosDiarios from './components/RelatoriosDiarios';
```

## 2. Remova a inicialização do cliente Supabase

Localize e remova estas linhas:

```javascript
// Inicialização do cliente Supabase (ainda usado para operações no banco de dados)
const supabase = createClient(
  'https://apidb.meumenu2023.uk',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogImFub24iLAogICJpc3MiOiAic3VwYWJhc2UiLAogICJpYXQiOiAxNzAzMzg2ODAwLAogICJleHAiOiAxODYxMjM5NjAwCn0.kU_d1xlxfuEgkYMC0mYoiZHQpUvRE2EnilTZ7S0bfIM'
);
```

Também remova a importação:

```javascript
import { createClient } from '@supabase/supabase-js';
```

## 3. Remova os componentes embutidos

Localize e remova os seguintes componentes embutidos (podem ser centenas de linhas cada):

- `const Dashboard = ({ setCurrentTab, currentTab }) => { ... }`
- `const EstatisticasGerais = () => { ... }`
- `const RelatoriosDiarios = () => { ... }`

## 4. Atualize as referências no componente App

No componente App, localize onde os componentes são renderizados e certifique-se de que estão assim:

```javascript
{currentTab === 'dashboard' && <Dashboard setCurrentTab={setCurrentTab} currentTab={currentTab} />}
{currentTab === 'estatisticas' && <EstatisticasGerais />}
{currentTab === 'relatorios' && <RelatoriosDiarios />}
```

## 5. Atualize o componente CadastroForm

No componente CadastroForm, localize a função handleSubmit e atualize-a para usar o LinksService:

```javascript
const handleSubmit = async (formData) => {
  try {
    setLoading(true);
    setError('');
    
    // Adicionar o user_id selecionado se for admin
    if (isAdmin && selectedUserId) {
      formData.user_id = selectedUserId;
    }
    
    // Usar o serviço de links para criar um novo link
    await LinksService.createLink(formData);
    
    alert('Link cadastrado com sucesso!');
    onCadastroSuccess();
  } catch (error) {
    setError('Erro ao cadastrar link: ' + error.message);
  } finally {
    setLoading(false);
  }
};
```

Não se esqueça de adicionar a importação no início do arquivo:

```javascript
import LinksService from './services/links.service';
```

## 6. Atualize o componente GerenciamentoUsuarios

No componente GerenciamentoUsuarios, atualize as funções para usar o serviço de usuários (que você precisará criar).

## Observações

- Mantenha o restante do código inalterado
- Teste cada componente após as alterações
- Verifique se não há mais referências diretas ao Supabase no código
