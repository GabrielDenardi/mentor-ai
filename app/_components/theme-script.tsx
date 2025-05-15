// Este componente adiciona um script inline para evitar o flash de tema incorreto
export function ThemeScript() {
  const themeScript = `
    (function() {
      try {
        // Obtém o tema salvo ou usa a preferência do sistema
        const savedTheme = localStorage.getItem('mentoria-theme');
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const theme = savedTheme || systemTheme;
        
        // Aplica o tema ao elemento html
        document.documentElement.classList.toggle('dark', theme === 'dark');
        
        // Define a cor do tema para o meta tag
        document.documentElement.style.colorScheme = theme;
      } catch (e) {
        console.error('Erro ao aplicar tema:', e);
      }
    })();
  `

  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />
}
