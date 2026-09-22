# Tiny LMS - Frontend Next.js 16 (App Router)

Plataforma moderna de cursos online construída com **Next.js 16**, **React 19**, **TypeScript** e **Design System em CSS Puro (Vanilla CSS)** com estética escura de alto padrão (*sleek dark luxury*).

---

## 🚀 Funcionalidades

- **Autenticação e Permissões:**
  - Perfis dinâmicos: **Público**, **Aluno (User)** e **Administrador/Editor**.
  - Login rápido de demonstração (1-clique) e alternador de perfil (*Role Switcher*) em tempo real.
  - Registro de usuários, recuperação e redefinição de senha.

- **Área do Aluno:**
  - Catálogo completo de cursos com filtros de busca em tempo real.
  - Grade curricular com status individual por aula (Concluída / Pendente).
  - Player de vídeo responsivo com navegação fluida (Anterior / Próxima) e botão de conclusão.
  - Barra de progresso interativa com cálculo de porcentagem.
  - Emissão e visualização de certificados oficiais com código de validação e layout para impressão/PDF (`window.print`).
  - Reinicialização de progresso do curso.

- **Painel Administrativo:**
  - Gerenciamento de Cursos (criação e edição com slug automático).
  - Gerenciamento de Aulas (ordenação, duração, links e upload de arquivos).
  - Gestão de Usuários com busca por nome/email e paginação.

- **Persistência e Conectividade Híbrida:**
  - **Modo Estático / Local (Padrão):** Opera com persistência reativa em `localStorage`, pré-populado com os cursos, aulas, usuários e certificados do seed oficial.
  - **Conexão com Backend NestJS:** Basta definir a variável `BACKEND_API_URL` no `.env.local`.

---

## 🛠️ Tecnologias

- **Framework:** Next.js 16 (App Router)
- **UI & Biblioteca:** React 19, Lucide React
- **Linguagem:** TypeScript
- **Estilização:** Vanilla CSS (Tokens de Design, Glassmorphism, Micro-animações)

---

## 📦 Como Rodar Localmente

1. **Instalar dependências:**
   ```bash
   yarn install
   ```

2. **Iniciar o servidor de desenvolvimento:**
   ```bash
   yarn dev
   ```

3. **Acessar a aplicação:**
   Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 🌐 Configuração do Backend

1. Configure as variáveis em `.env.local`:
   ```env
   BACKEND_API_URL=https://localhost/api
   ```
2. Inicie o servidor de desenvolvimento (`yarn dev`).
