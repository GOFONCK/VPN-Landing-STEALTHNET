# Установка на Nginx

Инструкция для развёртывания на сервере с Nginx. Подходит для Ubuntu 22.04 / Debian 12.

---

## Вариант A: Чистый сервер (Nginx нет)

### 1. Обновление системы и установка зависимостей

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git nginx certbot python3-certbot-nginx
```

### 2. Установка Node.js 20

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

Проверка: `node -v` и `npm -v`.

### 3. Установка PM2 (менеджер процессов)

```bash
sudo npm install -g pm2
```

### 4. Загрузка проекта

```bash
cd /var/www
sudo git clone https://github.com/ВАШ_РЕПОЗИТОРИЙ/afinavpn.git
cd afinavpn
```

Либо скопируйте проект через `scp` / SFTP.

### 5. Настройка приложения

```bash
npm install
npm run build
```

Создайте `.env` (или скопируйте из `.env.example`):

```bash
echo "ADMIN_PASSWORD=ваш_надёжный_пароль" > .env
```

### 6. Запуск через PM2

```bash
pm2 start npm --name "afinavpn" -- start
pm2 save
pm2 startup
```

### 7. Конфиг Nginx

Создайте конфиг (подставьте свой домен):

```bash
sudo nano /etc/nginx/sites-available/afinavpn
```

Содержимое (HTTP — для первого запуска, SSL добавим позже). Готовый шаблон: [nginx.conf.example](nginx.conf.example)

```nginx
server {
    listen 80;
    server_name ваш-домен.com www.ваш-домен.com;
    
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Включите сайт:

```bash
sudo ln -s /etc/nginx/sites-available/afinavpn /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 8. SSL (Let's Encrypt)

Убедитесь, что DNS указывает на сервер и порт 80 открыт, затем:

```bash
sudo certbot --nginx -d ваш-домен.com -d www.ваш-домен.com
```

Certbot обновит конфиг Nginx, добавив HTTPS. Автообновление сертификатов:

```bash
sudo certbot renew --dry-run
```

---

## Вариант B: Nginx уже установлен

### 1. Установка Node.js (если нет)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### 2. Установка PM2

```bash
sudo npm install -g pm2
```

### 3. Проект и сборка

```bash
cd /var/www  # или ваша папка
git clone https://github.com/ВАШ_РЕПОЗИТОРИЙ/afinavpn.git
cd afinavpn

npm install
npm run build
echo "ADMIN_PASSWORD=ваш_пароль" > .env
```

### 4. Запуск приложения

```bash
pm2 start npm --name "afinavpn" -- start
pm2 save
```

### 5. Добавление конфига в Nginx

```bash
sudo nano /etc/nginx/sites-available/afinavpn
```

Вставьте блок `server` из Варианта A (шаг 7), заменив `ваш-домен.com` на свой домен.

```bash
sudo ln -s /etc/nginx/sites-available/afinavpn /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6. SSL

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d ваш-домен.com
```

---

## Управление

| Действие              | Команда                          |
|-----------------------|----------------------------------|
| Логи приложения       | `pm2 logs afinavpn`              |
| Перезапуск            | `pm2 restart afinavpn`           |
| Остановка             | `pm2 stop afinavpn`              |
| Статус                | `pm2 status`                     |
| Обновление после git  | `git pull && npm install && npm run build && pm2 restart afinavpn` |

---

## Обновление конфигурации Nginx (после Certbot)

После `certbot --nginx` файл будет примерно таким:

```nginx
server {
    server_name ваш-домен.com www.ваш-домен.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/ваш-домен.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ваш-домен.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    if ($host = www.ваш-домен.com) {
        return 301 https://$host$request_uri;
    }

    if ($host = ваш-домен.com) {
        return 301 https://$host$request_uri;
    }

    listen 80;
    server_name ваш-домен.com www.ваш-домен.com;
    return 404;
}
```

---

## Требования

- **Домен** — A‑запись должна указывать на IP сервера.
- **Порты** — 80 и 443 открыты (фаервол).
- **Права** — папка проекта должна быть доступна для чтения пользователю, от которого запущен PM2.

---

## Быстрый чеклист

- [ ] Домен указывает на сервер
- [ ] Установлены: Nginx, Node.js, PM2, certbot
- [ ] Проект склонирован в `/var/www/afinavpn` (или другую папку)
- [ ] Выполнены: `npm install`, `npm run build`
- [ ] Создан `.env` с `ADMIN_PASSWORD`
- [ ] PM2 запущен: `pm2 start npm --name "afinavpn" -- start`
- [ ] Добавлен конфиг Nginx и выполнена перезагрузка
- [ ] Выпущен SSL: `certbot --nginx -d домен`
