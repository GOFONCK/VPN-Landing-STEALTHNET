# VPN LANDING STEALTHNET
<img width="2046" height="1033" alt="image" src="https://github.com/user-attachments/assets/8158c2b6-348d-4492-9389-1807e9614054" />

Сайт для VPN-сервиса AFINA VPN на протоколе VLESS.


## Установка на сервер (VPN Landing STEALTHNET)
Скачать проект себе на сервер 
```bash
git clone https://github.com/GOFONCK/VPN-Landing-STEALTHNET.git
```
Перейти в папку проекта
```bash
cd /opt/VPN-Landing-STEALTHNET/
```
Скрипт `install.sh` — развёртывание с одной команды и автоматическим SSL:

```bash
chmod +x install.sh
./install.sh
```

Скрипт спросит домен, пароль админки и email для Let's Encrypt. Caddy сам получит SSL-сертификат.

**Требования:** Docker и Docker Compose. Порты 80 и 443 должны быть открыты, DNS должен указывать на сервер.

### Установка на Nginx (без Docker)

Если на сервере уже есть Nginx или нужна установка без Docker — см. **[docs/INSTALL-NGINX.md](docs/INSTALL-NGINX.md)**. Инструкция для:
- чистого сервера (установка Nginx, Node.js, PM2, Certbot);
- сервера с уже установленным Nginx.

## Панель управления

Адрес: `/admin`

По умолчанию пароль: `afina2025`

Для смены пароля создайте файл `.env` и добавьте:
```
ADMIN_PASSWORD=ваш_пароль
```

В панели можно:
- Добавлять, редактировать и удалять тарифы
- Редактировать контакты (email, Telegram)
- Редактировать текст оферты и соглашения

## Структура

- `/` — главная страница
- `/offerta` — публичная оферта
- `/agreement` — соглашение о конфиденциальности
- `/contacts` — контакты
- `/admin` — панель управления (требует пароль)
