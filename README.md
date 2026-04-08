# Clone TabNews - Developer Community Platform

**Like abNews** - A mix of blog, social media, and developer forum built with **Next.js**, **TypeScript**, and **PostgreSQL**.

## ✨ Features

✅ **User Management** - Create users with API keys
✅ **Posts/Articles** - Create, read, update, delete articles  
✅ **Comments** - Comment on posts with nested replies
✅ **Upvotes** - Upvote posts and comments
✅ **Bookmarks** - Save favorite posts
✅ **Search** - Full-text search across posts, users, comments
✅ **Categories & Tags** - Organize content by topic
✅ **Views Tracking** - Monitor post popularity
✅ **Free Backend** - No paid services, PostgreSQL based

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
```bash
# Create database
psql -U postgres -c "CREATE DATABASE tabnews;"

# Run schema
psql -U tabnews_user -d tabnews < schema.sql
```

### 3. Configure Environment
Update `.env.local`:
```env
DATABASE_URL=postgresql://tabnews_user:password@localhost:5432/tabnews
```

### 4. Start Development Server
```bash
npm run dev
```

Open **http://localhost:3000** (or available port)

---

## 📡 API Endpoints

### 👤 Users
- `POST /api/users` - Create user (get API key)
- `GET /api/users` - List all users
- `GET /api/users?id=1` - Get user profile

### 📰 Posts
- `GET /api/feed` - Get all posts
- `GET /api/feed?category=web-development&sort=trending` - Filter posts
- `POST /api/feed` - Create post
- `PUT /api/feed?id=1` - Update post
- `DELETE /api/feed?id=1` - Delete post

### 💬 Comments
- `GET /api/comments?post_id=1` - Get comments
- `POST /api/comments?post_id=1` - Add comment
- `DELETE /api/comments?post_id=1` - Delete comment

### 👍 Upvotes
- `POST /api/upvote` - Upvote post/comment
- `DELETE /api/upvote` - Remove upvote

### 🔖 Bookmarks
- `GET /api/bookmarks?user_id=1` - Get bookmarks
- `POST /api/bookmarks?user_id=1&post_id=5` - Bookmark post

### 🔍 Search
- `GET /api/search?q=react` - Search everything
- `GET /api/search?q=typescript&type=posts` - Search by type

**Full API docs:** See [API.md](API.md)

---

## 💻 Example Usage

### Create User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_dev",
    "email": "john@example.com",
    "full_name": "John Developer"
  }'
```

### Create Post
```bash
curl -X POST http://localhost:3000/api/feed \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Article",
    "content": "Full article content here...",
    "author_id": 1,
    "category": "web-development",
    "tags": "javascript, react"
  }'
```

### Get Posts
```bash
curl http://localhost:3000/api/feed
```

---

## 📁 Project Structure

```
clone-tabnews/
├── pages/api/
│   ├── users.ts          # User management
│   ├── feed.ts           # Posts/Articles
│   ├── comments.ts       # Comments
│   ├── upvote.ts         # Upvoting
│   ├── bookmarks.ts      # Bookmarks
│   ├── search.ts         # Search
│   └── health.ts         # Health check
├── lib/db.ts             # Database connection
├── schema.sql            # Database schema
├── API.md                # API documentation
└── package.json
```

---

## 🗄️ Database

**Tables:**
- `users` - User accounts with API keys
- `posts` - Articles and blog posts
- `comments` - Post comments (nested replies)
- `post_upvotes` - Post votes
- `comment_upvotes` - Comment votes
- `bookmarks` - Saved posts

---

## 🛠️ Tech Stack

- **Frontend:** React 18.2 + TypeScript
- **Backend:** Next.js 16.2 API Routes
- **Database:** PostgreSQL
- **Runtime:** Node.js v16+

---

## 📚 Resources

- [Full API Documentation](API.md)
- [Database Schema](schema.sql)
- [Troubleshooting Guide](TROUBLESHOOTING.md)
- [Quick Start](QUICKSTART.md)

---

## 🚀 Deployment
- PostgreSQL (v12 ou superior)
- npm ou yarn

### Passo 1: Clonar o repositório

```bash
git clone https://github.com/uemuradevexe/clone-tabnews.git
cd clone-tabnews
```

### Passo 2: Instalar dependências

```bash
npm install
```

### Passo 3: Configurar banco de dados

1. Certifique-se de que o PostgreSQL está rodando
2. Crie um novo banco de dados:

```sql
CREATE DATABASE tabnews;
```

3. Crie um usuário (ou use um existente):

```sql
CREATE USER user WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE tabnews TO user;
```

### Passo 4: Configurar variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/tabnews
```

### Passo 5: Executar o projeto

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

**Para acesso direto ao guia de início rápido**: → [QUICKSTART.md](QUICKSTART.md)

## 🚨 Problemas Comuns?

Consulte o guia de solução de problemas: → [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

## 📁 Estrutura do Projeto

```
clone-tabnews/
├── pages/
│   ├── index.js              # Homepage (lista de posts)
│   ├── api/
│   │   ├── posts.js          # API para posts
│
├── components/
│   ├── PostCard.js           # Componente de card de post
│
├── lib/
│   ├── db.js                 # Conexão com banco de dados
│
├── styles/
│   └── (estilos CSS)
│
├── package.json
├── .env.local
└── README.md
```

## 🔌 API Endpoints

### GET /api/posts
Retorna uma lista de todos os posts.

**Response:**
```json
{
  "posts": [
    {
      "id": 1,
      "title": "Título do Post",
      "excerpt": "Resumo do post",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### POST /api/posts
Cria um novo post.

**Request:**
```json
{
  "title": "Novo Post",
  "excerpt": "Descrição curta",
  "content": "Conteúdo completo"
}
```

## 🛠️ Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Compila o projeto para produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint:check` - Verifica formatação do código
- `npm run lint:fix` - Corrige formatação do código

## 👨‍💻 Autor

Ricardo Uemura

## 🧪 Testando a API

### Com cURL

**Criar um novo post:**
```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Meu Primeiro Post",
    "content": "Este é um post de teste!"
  }'
```

**Listar todos os posts:**
```bash
curl http://localhost:3000/api/posts
```

### No Navegador

- Abra: `http://localhost:3000/api/posts`
- Você verá um JSON com todos os posts

## 📚 Documentação

- [QUICKSTART.md](QUICKSTART.md) - Guia rápido de início
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Solução de problemas comuns
- [init.sql](init.sql) - Script de criação do banco de dados

## 📊 Estrutura do Banco de Dados

```sql
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title TEXT,
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Para criar a tabela:
```bash
psql -U user -d tabnews < init.sql
```

## 📄 Licença

Este projeto está sob a licença MIT. Ver arquivo [LICENSE](LICENSE) para mais detalhes.

## 🔗 Links

- [TabNews Original](https://www.tabnews.com.br)
- [Curso.dev](https://curso.dev)
- [GitHub Repository](https://github.com/uemuradevexe/clone-tabnews)
