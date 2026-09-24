# 🎓 Veltro LMS - Frontend Next.js 16 (App Router)

Plataforma moderna de cursos online construída com **Next.js 16**, **React 19**, **TypeScript**, **SCSS Modules** e arquitetura **BFF (Backend For Frontend)** com estética escura de alto padrão (*sleek dark luxury*) e foco em experiência do usuário (UX).

> 🔗 **Backend Oficial:** Este frontend funciona em conjunto com a API REST desenvolvida em **NestJS**, **Prisma** e **PostgreSQL**: [lms-nest-postgres](https://github.com/Cr1stofe/lms-nest-postgres).

---

## 🚀 Principais Recursos

### 🔐 Autenticação & Controle de Acesso (RBAC)
- **Perfis de Usuário:**
  - **Administrador (`admin`):** Acesso total à plataforma, incluindo gestão de cursos, aulas e listagem/gestão de usuários.
  - **Editor (`editor`):** Acesso restrito à gestão de cursos e aulas (sem acesso à listagem de usuários).
  - **Aluno (`user`):** Acesso ao catálogo de cursos, aulas liberadas/matriculadas e emissão de certificados.
  - **Público (`public`):** Visualização de cursos abertos e aulas com marcação gratuita (*free*).
- **Proteção no Proxy (`proxy.ts`):** Redirecionamento instantâneo no servidor (Edge/Node.js) com **Zero Flicker**.
- **Sessão Segura:** Autenticação baseada em cookies `httpOnly` (`__Secure-sid` e `lms_role`).
- **Modal de Confirmação:** Confirmação explícita antes de encerrar a sessão do usuário.

### 📚 Área do Aluno & Player de Vídeo
- **Catálogo de Cursos:** Listagem dinâmica com cálculo de carga horária e total de aulas.
- **Barreira de Acesso (*Lock Barrier*):** Bloqueio visual para aulas restritas a usuários deslogados.
- **Player de Vídeo com Streaming:** Suporte a HTTP Range Requests (`206 Partial Content`) para reprodução fluida de arquivos de vídeo públicos e privados.
- **Navegação & Conclusão:** Navegação entre aulas (Anterior / Próxima) e registro de progresso em tempo real.
- **Certificados Oficiais:** Emissão automática de certificados ao concluir 100% do curso, com layout otimizado para impressão/PDF.

### ⚙️ Painel Administrativo
- **Formulários Validados:** Integração completa entre **React Hook Form** e **Zod** (`@hookform/resolvers/zod`) com mensagens de erro inline e tipagem estrita.
- **Gerenciamento de Cursos:** Criação e edição com geração automática de slug e atualização reativa.
- **Gerenciamento de Aulas:** Upload de arquivos de vídeo com indicação de visibilidade (*public* / *private*).
- **Gestão de Usuários:** Busca em tempo real por nome/e-mail e paginação integrada.
- **Notificações Toasts (Sonner):** Feedback flutuante em tempo real para ações de criação, edição e uploads.

---

## 🛡️ Matriz de Permissões de Rotas

| Rota | Público | Aluno (`user`) | Editor (`editor`) | Administrador (`admin`) |
| :--- | :---: | :---: | :---: | :---: |
| `/` (Home) | 🟢 Aberto | 🟢 Personalizado | 🟢 Painel Admin | 🟢 Painel Admin |
| `/cursos` | 🟢 Aberto | 🟢 Aberto | 🟢 Aberto | 🟢 Aberto |
| `/cursos/[slug]` | 🟢 Aberto | 🟢 Aberto | 🟢 Aberto | 🟢 Aberto |
| `/aula/[courseSlug]/[lessonSlug]` | 🟡 Apenas Aulas Free | 🟢 Acesso Total | 🟢 Acesso Total | 🟢 Acesso Total |
| `/certificados` | 🔴 Login | 🟢 Permitido | 🟢 Permitido | 🟢 Permitido |
| `/admin/cursos` | 🔴 Login | 🔴 Redireciona `/cursos` | 🟢 Permitido | 🟢 Permitido |
| `/admin/aulas` | 🔴 Login | 🔴 Redireciona `/cursos` | 🟢 Permitido | 🟢 Permitido |
| `/admin/usuarios` | 🔴 Login | 🔴 Redireciona `/cursos` | 🔴 Redireciona `/admin/cursos` | 🟢 Permitido |

---

## 🛠️ Tecnologias Utilizadas

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
- **Biblioteca Base:** [React 19](https://react.dev/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** SCSS Modules (`.module.scss`), CSS Variables e Mixins responsivos
- **Gerenciamento de Estado:** [Zustand](https://github.com/pmndrs/zustand)
- **Formulários & Validação:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) via `@hookform/resolvers`
- **Notificações:** [Sonner](https://sonner.emilkowal.ski/)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Bundler & Build:** Turbopack

---

## 📂 Estrutura do Projeto

```text
src/
├── app/                              # Rotas e páginas (App Router)
│   ├── admin/                        # Painel Administrativo (Cursos, Aulas, Usuários)
│   ├── api/                          # Route Handlers do BFF (Auth, LMS, Files)
│   ├── aula/[courseSlug]/[lessonSlug]# Player de aula e navegação
│   ├── certificados/                 # Visualização de certificados emitidos
│   ├── cursos/                       # Catálogo e detalhes do curso
│   ├── (auth)/                       # Login, Criar Conta, Recuperação de Senha
│   ├── layout.tsx                    # Layout raiz com Toaster e fontes
│   └── page.tsx                      # Home dinâmica SSR (Aluno vs Admin)
├── components/                       # Componentes reutilizáveis
│   ├── CourseCard/                   # Card de curso interativo
│   ├── Footer/                       # Rodapé global
│   ├── Navbar/                       # Header responsivo com perfil de usuário
│   ├── ProgressBar/                  # Barra de progresso de conclusão
│   ├── SessionInitializer/           # Sincronização inicial de sessão
│   └── VideoPlayer/                  # Player de vídeo HTML5 com fallback
├── lib/                              # Configurações, Schemas Zod e utilitários
│   ├── config.ts                     # Centralização de variáveis de ambiente
│   ├── api-client.ts                 # Cliente HTTP centralizado
│   ├── types.ts                      # Tipagens globais do domínio
│   └── schemas/                      # Schemas de validação Zod (Auth e LMS)
├── services/                         # Camada de serviços e comunicação com API
│   ├── authService.ts                # Operações de autenticação e sessão
│   └── lmsService.ts                 # Operações de cursos, aulas e arquivos
├── stores/                           # Stores globais Zustand
│   ├── useAuthStore.ts               # Estado de autenticação e sessão
│   └── useLMSStore.ts                # Estado de cursos e aulas
├── styles/                           # Design System em SCSS
│   ├── _variables.scss               # Cores, tipografia, espaçamentos e raios
│   ├── _mixins.scss                  # Glassmorphism, cards, botões e responsividade
│   ├── globals.scss                  # Estilos globais e resets
│   └── admin.module.scss             # Estilização do painel administrativo
└── proxy.ts                          # Proxy de roteamento e RBAC (Next.js 16)
```

---

## 📦 Como Rodar o Projeto Localmente

### 1. Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18.17 ou superior)
- [Yarn](https://yarnpkg.com/)

### 2. Instalação das dependências
```bash
yarn install
```

### 3. Configuração de Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto com o endereço da API do Backend:

```env
BACKEND_API_URL=https://localhost/api
```

### 4. Executando em Modo de Desenvolvimento
```bash
yarn dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

### 5. Scripts Disponíveis

- `yarn dev`: Inicia o servidor de desenvolvimento com Turbopack.
- `yarn build`: Executa a verificação de tipos e compila a aplicação para produção.
- `yarn start`: Executa o build de produção localmente.
- `yarn lint`: Executa a verificação de regras de código com ESLint.
- `yarn lint:fix`: Corrige automaticamente problemas identificados pelo linter.
