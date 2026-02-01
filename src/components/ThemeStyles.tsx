interface ThemeStylesProps {
  primaryColor: string;
  accentColor: string;
  bgColor: string;
  textColor?: string;
  cardBg?: string;
  headingColor?: string;
}

export function ThemeStyles({ primaryColor, accentColor, bgColor, textColor, cardBg, headingColor }: ThemeStylesProps) {
  const t = textColor ?? '#e2e8f0';
  const c = cardBg ?? '#1e293b';
  const h = headingColor ?? '#fbbf24';
  const css = `
:root {
  --theme-primary: ${primaryColor};
  --theme-accent: ${accentColor};
  --theme-bg: ${bgColor};
  --theme-text: ${t};
  --theme-card: ${c};
  --theme-heading: ${h};
}
body { background: linear-gradient(180deg, ${bgColor} 0%, #0c1222 50%, #0a0f1a 100%) !important; color: ${t}; }
  `.trim();
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
