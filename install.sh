#!/bin/bash
set -e

echo "=========================================="
echo "  VPN Landing STEALTHNET — установка"
echo "=========================================="
echo

# Проверка Docker
if ! command -v docker &> /dev/null; then
    echo "Docker не установлен. Установите: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! docker compose version &> /dev/null; then
    echo "Docker Compose не найден. Установите Docker Compose v2."
    exit 1
fi

# Запрос параметров
read -p "Домен (например: vpn.example.com): " DOMAIN
if [ -z "$DOMAIN" ]; then
    echo "Домен обязателен для SSL."
    exit 1
fi

read -p "Пароль админки [/admin] (по умолчанию afina2025): " ADMIN_PASS
ADMIN_PASS=${ADMIN_PASS:-afina2025}

read -p "Email для Let's Encrypt (для уведомлений): " LE_EMAIL
if [ -z "$LE_EMAIL" ]; then
    LE_EMAIL="admin@$DOMAIN"
fi

# Создание папок
mkdir -p data public/uploads

# Инициализация data если пусто
if [ ! -f data/tariffs.json ]; then
    echo '[]' > data/tariffs.json
fi
if [ ! -f data/site-info.json ]; then
    echo '{}' > data/site-info.json
fi

# Caddyfile с доменом и SSL
cat > Caddyfile << CADDY
$DOMAIN {
    reverse_proxy app:3000
}
CADDY

# .env для docker-compose
cat > .env << EOF
ADMIN_PASSWORD=$ADMIN_PASS
DOMAIN=$DOMAIN
EOF

# Запуск
echo
echo "Запуск контейнеров..."
docker compose build --no-cache
docker compose up -d

echo
echo "=========================================="
echo "  Готово!"
echo "=========================================="
echo "Сайт: https://$DOMAIN"
echo "Админка: https://$DOMAIN/admin"
echo "Пароль: $ADMIN_PASS"
echo
echo "SSL получится автоматически в течение 1–2 минут."
echo "Убедитесь, что порты 80 и 443 открыты и DNS указывает на этот сервер."
echo
echo "Команды:"
echo "  docker compose logs -f    — логи"
echo "  docker compose down       — остановить"
echo "  docker compose up -d      — запустить снова"
echo
