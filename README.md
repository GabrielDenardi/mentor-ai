# Mentor AI 📚🤖

Seu estudo com IA, do seu jeito.

O **Mentor AI** não é apenas mais um chatbot educacional — é um verdadeiro mentor digital. Desenvolvido para alunos que se sentem perdidos diante de tantos conteúdos ou simplesmente querem estudar com foco, clareza e organização, o Mentor AI entende **o que você precisa aprender** e **como você prefere aprender**.

A partir de um bate-papo com a IA, você recebe um **plano de estudos personalizado**, com tarefas organizadas em uma checklist interativa que você pode acompanhar, exportar em PDF, integrar ao Google Agenda e ainda receber **resumos, exemplos cotidianos, quizzes e simulados** sobre os assuntos que mais importam pra você.

🎉 Concluiu uma tarefa? Vai chover confetes.  
❓ Teve uma dúvida? A IA pode explicar de outra forma, exemplificar e ainda te testar.  
Tudo isso em uma interface fluida, simples e pensada para deixar o aluno **no controle do próprio aprendizado**.

> Chega de promessas genéricas. Aqui, você estuda com propósito, foco e uma pitada de diversão.

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
  - Receba pontuação e feedback imediato para identificar pontos fortes e fracos.

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
