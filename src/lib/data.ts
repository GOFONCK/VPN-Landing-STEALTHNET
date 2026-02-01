import { promises as fs } from 'fs';
import path from 'path';

export interface Tariff {
  id: string;
  name: string;
  price: number;
  currency: string; // RUB, USD, EUR, UAH, KZT, BYN и т.д.
  period: string;
  features: string[];
  popular?: boolean;
  sortOrder: number;
  buttonUrl?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface TrustFact {
  title: string;
  value: string;
}

export interface FeatureItem {
  title: string;
  description: string;
}

export interface SiteInfo {
  contacts: { email: string; telegram: string };
  authUrl: string;
  registerUrl: string;
  connectUrl: string;
  siteUrl: string;
  offerta: string;
  agreement: string;
  faq: FaqItem[];
  instructions: string;
  trustFacts: TrustFact[];
  // Логотип и бренд
  logoUrl: string;
  brand: { name: string; tagline: string };
  // SEO
  seo: { title: string; description: string; keywords: string; ogImage: string };
  // Оформление
  theme: {
    primaryColor: string;
    accentColor: string;
    bgColor: string;
    textColor?: string;
    cardBg?: string;
    headingColor?: string;
    headerBg?: string;
  };
  header: {
    showLogo: boolean;
    showBrand: boolean;
    elementOrder: string[];
    navItems: { label: string; href: string }[];
  };
  // Детали дизайна
  design: {
    heroTitleSize: string;      // text-5xl, text-6xl...
    heroSubtitleSize: string;
    sectionPadding: string;     // py-16, py-20...
    cardRadius: string;         // rounded-xl, rounded-2xl...
    buttonRadius: string;
    heroElementOrder: string[]; // logo, title, subtitle, button
  };
  // Hero-блок
  hero: { title: string; subtitle: string; buttonText: string };
  // Блоки (показать/скрыть) и порядок
  blocks: { hero: boolean; trustFacts: boolean; features: boolean; tariffs: boolean; faq: boolean };
  blockOrder: string[]; // порядок: hero, trustFacts, features, tariffs, faq
  // Блок преимуществ (редактируемый)
  featuresBlock: { title: string; items: FeatureItem[] };
  // Блок тарифов
  tariffsBlock: { title: string; subtitle: string };
  // Footer
  footer: { copyright: string };
}

const DATA_DIR = path.join(process.cwd(), 'data');
const TARIFFS_FILE = path.join(DATA_DIR, 'tariffs.json');
const SITE_INFO_FILE = path.join(DATA_DIR, 'site-info.json');

const DEFAULT_TARIFFS: Tariff[] = [
  { id: '1', name: 'Базовый', price: 299, currency: 'RUB', period: '1 месяц', features: ['VLESS протокол', 'Неограниченный трафик', 'Поддержка 24/7'], sortOrder: 1 },
  { id: '2', name: 'Стандарт', price: 749, currency: 'RUB', period: '3 месяца', features: ['VLESS протокол', 'Неограниченный трафик', 'Приоритетная поддержка', 'Резервные серверы'], popular: true, sortOrder: 2 },
  { id: '3', name: 'Премиум', price: 1299, currency: 'RUB', period: '12 месяцев', features: ['VLESS протокол', 'Неограниченный трафик', 'Приоритетная поддержка', 'Резервные серверы', 'Максимальная скорость'], sortOrder: 3 },
];

const DEFAULT_SITE_INFO: SiteInfo = {
  contacts: { email: 'support@afina.vip', telegram: '@afinavpn' },
  authUrl: '',
  registerUrl: '',
  connectUrl: '#tariffs',
  siteUrl: 'https://afina.vip',
  logoUrl: '/logo.png',
  brand: { name: 'AFINA', tagline: 'VPN' },
  seo: {
    title: 'AFINA VPN — Защищённое подключение | afina.vip',
    description: 'VPN-сервис на протоколе VLESS. Стабильность, конфиденциальность, надёжность.',
    keywords: 'VPN, VLESS, защита, конфиденциальность',
    ogImage: '/logo.png',
  },
  theme: {
    primaryColor: '#14b8a6',
    accentColor: '#f59e0b',
    bgColor: '#0f172a',
    textColor: '#e2e8f0',
    cardBg: '#1e293b',
    headingColor: '#fbbf24',
    headerBg: 'rgba(2,6,23,0.98)',
  },
  header: {
    showLogo: true,
    showBrand: true,
    elementOrder: ['logo', 'brand', 'nav', 'auth'],
    navItems: [
      { label: 'Тарифы', href: '/#tariffs' },
      { label: 'Инструкции', href: '/instructions' },
      { label: 'Оферта', href: '/offerta' },
      { label: 'Соглашение', href: '/agreement' },
      { label: 'Контакты', href: '/contacts' },
    ],
  },
  design: {
    heroTitleSize: 'text-5xl md:text-6xl lg:text-7xl',
    heroSubtitleSize: 'text-lg md:text-xl',
    sectionPadding: 'py-16 md:py-20',
    cardRadius: 'rounded-xl',
    buttonRadius: 'rounded-full',
    heroElementOrder: ['logo', 'title', 'subtitle', 'button'],
  },
  hero: {
    title: 'AFINA',
    subtitle: 'Защищённое подключение на протоколе VLESS. Стабильность, конфиденциальность и надёжность для требовательных пользователей.',
    buttonText: 'Подключиться',
  },
  blocks: { hero: true, trustFacts: true, features: true, tariffs: true, faq: true },
  blockOrder: ['hero', 'trustFacts', 'features', 'tariffs', 'faq'],
  featuresBlock: {
    title: 'Почему AFINA VPN',
    items: [
      { title: 'Протокол VLESS', description: 'Современный протокол для стабильного и быстрого подключения с повышенным уровнем шифрования.' },
      { title: 'Скорость и стабильность', description: 'Оптимизированная инфраструктура обеспечивает высокую скорость и бесперебойную работу.' },
      { title: 'Конфиденциальность', description: 'Строгая политика в отношении данных. Ваше подключение — ваше дело.' },
    ],
  },
  tariffsBlock: {
    title: 'Тарифные планы',
    subtitle: 'Выберите подходящий план. Все тарифы включают неограниченный трафик и поддержку.',
  },
  footer: { copyright: 'AFINA VPN. Протокол VLESS. Защищённое подключение.' },
  faq: [
    { question: 'Какой протокол используется?', answer: 'AFINA VPN работает на протоколе VLESS — современном решении с высокой скоростью и стабильностью.' },
    { question: 'Сохраняются ли логи активности?', answer: 'Нет. Мы не ведём логи активности пользователей. Ваше подключение остаётся конфиденциальным.' },
    { question: 'Как получить доступ после оплаты?', answer: 'Детали подключения отправляются на указанные контактные данные в течение суток после подтверждения оплаты.' },
  ],
  trustFacts: [
    { title: 'Протокол', value: 'VLESS' },
    { title: 'Логи', value: 'Не ведутся' },
    { title: 'Трафик', value: 'Безлимит' },
    { title: 'Поддержка', value: '24/7' },
  ],
  instructions: `# Как подключиться

## 1. Выберите тариф
Перейдите в раздел «Тарифы» и выберите подходящий план.

## 2. Оплатите подписку
Оплатите выбранный тариф удобным способом.

## 3. Получите данные
После подтверждения оплаты на вашу почту или в Telegram будут отправлены данные для подключения.

## 4. Настройте клиент
Установите поддерживаемый клиент (например, v2rayN, Nekoray) и добавьте конфигурацию согласно инструкции.

## 5. Подключитесь
Запустите VPN и пользуйтесь защищённым подключением.`,
  offerta: `ПУБЛИЧНАЯ ОФЕРТА

1. ОБЩИЕ ПОЛОЖЕНИЯ
Настоящий документ является официальным предложением (публичной офертой) AFINA VPN (далее — Исполнитель) заключить договор оказания услуг на условиях, изложенных ниже.

2. ПРЕДМЕТ ДОГОВОРА
Исполнитель обязуется оказать Заказчику услуги по предоставлению доступа к виртуальной частной сети (VPN) на базе протокола VLESS, а Заказчик обязуется оплатить указанные услуги.

3. ПОРЯДОК ОКАЗАНИЯ УСЛУГ
Услуги предоставляются дистанционно. Доступ к сервису обеспечивается после подтверждения оплаты. Детали подключения направляются на контактные данные Заказчика.

4. СТОИМОСТЬ И ПОРЯДОК ОПЛАТЫ
Стоимость услуг указана на сайте. Оплата производится в соответствии с выбранным тарифным планом. Датой оказания услуг считается дата активации доступа.

5. СРОК ДЕЙСТВИЯ
Договор вступает в силу с момента оплаты и действует в течение срока выбранного тарифного плана.

6. КОНФИДЕНЦИАЛЬНОСТЬ
Исполнитель обеспечивает защиту персональных данных Заказчика в соответствии с действующим законодательством.`,
  agreement: `СОГЛАШЕНИЕ О КОНФИДЕНЦИАЛЬНОСТИ И ИСПОЛЬЗОВАНИИ СЕРВИСА

1. ПРИНИМАНИЕ УСЛОВИЙ
Используя сервис AFINA VPN, вы подтверждаете согласие с настоящим Соглашением.

2. УСЛУГИ
AFINA VPN предоставляет услуги виртуальной частной сети (VPN) с использованием протокола VLESS. Сервис предназначен для обеспечения защищённого и стабильного подключения к сети.

3. ПРАВИЛЬНОЕ ИСПОЛЬЗОВАНИЕ
Заказчик обязуется использовать сервис исключительно в законных целях. Запрещается использование сервиса для деятельности, нарушающей законодательство.

4. ЗАЩИТА ДАННЫХ
Мы применяем современные методы шифрования и не храним логи активности пользователей. Ваши данные защищены.

5. КОНТАКТЫ
По всем вопросам: support@afina.vip`,
};

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // Directory exists
  }
}

export async function getTariffs(): Promise<Tariff[]> {
  try {
    const data = await fs.readFile(TARIFFS_FILE, 'utf-8');
    const tariffs = (JSON.parse(data) as Tariff[]).map((t) => ({
      ...t,
      currency: t.currency ?? 'RUB',
    }));
    return tariffs.sort((a, b) => a.sortOrder - b.sortOrder);
  } catch {
    return DEFAULT_TARIFFS;
  }
}

export async function saveTariffs(tariffs: Tariff[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(TARIFFS_FILE, JSON.stringify(tariffs, null, 2));
}

function deepMerge<T extends object>(defaults: T, parsed: Partial<T>): T {
  const result = { ...defaults, ...parsed };
  for (const key of Object.keys(defaults) as (keyof T)[]) {
    const def = defaults[key];
    const par = parsed[key];
    if (def && typeof def === 'object' && !Array.isArray(def) && par && typeof par === 'object') {
      (result as Record<string, unknown>)[key as string] = { ...def, ...par };
    }
  }
  return result;
}

export async function getSiteInfo(): Promise<SiteInfo> {
  try {
    const data = await fs.readFile(SITE_INFO_FILE, 'utf-8');
    const parsed = JSON.parse(data) as Partial<SiteInfo>;
    return deepMerge(DEFAULT_SITE_INFO, {
      ...parsed,
      contacts: { ...DEFAULT_SITE_INFO.contacts, ...parsed.contacts },
      brand: { ...DEFAULT_SITE_INFO.brand, ...parsed.brand },
      seo: { ...DEFAULT_SITE_INFO.seo, ...parsed.seo },
      theme: { ...DEFAULT_SITE_INFO.theme, ...parsed.theme },
      header: parsed.header && typeof parsed.header === 'object'
        ? { ...DEFAULT_SITE_INFO.header, ...parsed.header, navItems: Array.isArray(parsed.header.navItems) && parsed.header.navItems.length > 0 ? parsed.header.navItems : DEFAULT_SITE_INFO.header.navItems }
        : DEFAULT_SITE_INFO.header,
      design: parsed.design && typeof parsed.design === 'object' ? { ...DEFAULT_SITE_INFO.design, ...parsed.design } : DEFAULT_SITE_INFO.design,
      hero: { ...DEFAULT_SITE_INFO.hero, ...parsed.hero },
      blocks: { ...DEFAULT_SITE_INFO.blocks, ...parsed.blocks },
      blockOrder: Array.isArray(parsed.blockOrder) && parsed.blockOrder.length > 0 ? parsed.blockOrder : DEFAULT_SITE_INFO.blockOrder,
      featuresBlock: parsed.featuresBlock && Array.isArray(parsed.featuresBlock.items) && parsed.featuresBlock.items.length > 0
        ? parsed.featuresBlock
        : DEFAULT_SITE_INFO.featuresBlock,
      tariffsBlock: { ...DEFAULT_SITE_INFO.tariffsBlock, ...parsed.tariffsBlock },
      footer: { ...DEFAULT_SITE_INFO.footer, ...parsed.footer },
      faq: Array.isArray(parsed.faq) && parsed.faq.length > 0 ? parsed.faq : DEFAULT_SITE_INFO.faq,
      trustFacts: Array.isArray(parsed.trustFacts) && parsed.trustFacts.length > 0 ? parsed.trustFacts : DEFAULT_SITE_INFO.trustFacts,
    });
  } catch {
    return DEFAULT_SITE_INFO;
  }
}

export async function saveSiteInfo(info: SiteInfo): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(SITE_INFO_FILE, JSON.stringify(info, null, 2));
}
