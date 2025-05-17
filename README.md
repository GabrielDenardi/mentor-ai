# Mentor AI 📚🤖  
**Seu estudo com IA, do seu jeito — mas como nunca foi antes.**

O **Mentor AI** não é apenas mais um chatbot educacional.  
É um **mentor digital de verdade**, feito para quem se sente perdido em meio a tanto conteúdo ou frustrado com métodos que não funcionam.

A partir de um bate-papo com a IA, você recebe **um plano de estudos realmente personalizado**, feito para o seu jeito de aprender. Com tarefas organizadas em um **checklist interativo**, integração com o **Google Agenda**, exportação para **PDF**, além de **resumos, exemplos do cotidiano, quizzes e simulados**, o Mentor AI coloca você no controle do próprio aprendizado.

> 🎯 Quer foco? Ele entrega.  
> 💬 Teve dúvida? A IA explica, reexplica, exemplifica e ainda gera quiz.  
> 🎉 Concluiu uma tarefa? Vai chover confetes. Porque cada passo importa.  
> ⏳ Cansado de promessas genéricas? Aqui, você estuda com propósito, clareza e uma pitada de diversão.

### ✨ O diferencial

O Mentor AI une **tecnologia de ponta** com **pedagogia aplicada**. Não estamos falando de um assistente genérico:  
- Ele **entende o que você precisa aprender**,  
- **como você prefere aprender**,  
- e **ajusta o caminho com base nas suas interações**.

Tudo isso em uma interface fluida, bonita e intuitiva — pensada para que você aprenda mais e se preocupe menos.

> **Estudar nunca foi tão humano.**

---

## 🔍 Demonstração

> _Insira aqui uma captura de tela da aplicação ou um link para uma demo online._

---

## 🎯 Principais Funcionalidades

- **Chat com IA para Plano de Estudos**  
  Converse com a IA informando suas dificuldades e matérias que deseja reforçar. A IA gera um **plano de estudos personalizado** com tópicos, atividades e metas de aprendizado.

- **Tela de Planejamento**  
  - Visualize seu cronograma de estudos.  
  - Exporte o plano para **PDF**.  
  - Marque tarefas como concluídas em um **checklist interativo** (🎉 confetes ao concluir!).  
  - **Reinicie** o progresso ou **inicie** uma nova matéria quando quiser.  
  - Integre com o **Google Agenda** para receber lembretes automáticos.

- **Tirar Dúvidas com IA**  
  - Faça perguntas sobre qualquer ponto do seu estudo.  
  - Botões de ação para:  
    - **Reescrever** a explicação em termos mais simples.  
    - **Exemplificar** com situações do cotidiano.  
    - **Gerar Quiz** automático para praticar.

- **Resumo de Conteúdos**  
  - Veja um resumo conciso dos tópicos recomendados.  
  - Clique em **Exemplificar no Cotidiano** para analogias práticas.

- **Simulados**  
  - Realize quizzes e simulados (múltipla escolha ou discursivas).  
  - Feedback imediato para identificar pontos fortes e fracos.

---

## 🛠 Tecnologias Utilizadas

- **Next.js**  
- **TypeScript**  
- **Node.js**  
- **Tailwind CSS**  
- Integrações com APIs de IA (OpenAI / Gemini)  
- Integração com Google Agenda via OAuth

---

## 🚀 Como Rodar Localmente

### 1. Clonar o repositório
```bash
git clone https://github.com/GabrielDenardi/mentor-ai.git
cd mentor-ai
```

### 2. Instalar dependências
```bash
pnpm install
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto e adicione:

```env
GEMINI_API_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
```

### 4. Executar em modo de desenvolvimento
```bash
pnpm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)
