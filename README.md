# Docker Port - Portfoy AI Studio

Portföy yönetim uygulaması - Docker destekli.

## Gereksinimler

- Docker
- Docker Compose

## Hızlı Başlangıç

### 1. Docker Kurulumu

#### macOS
```bash
# Homebrew ile kurulum
brew install --cask docker

# veya Docker Desktop'ı indirin:
# https://www.docker.com/products/docker-desktop/
```

#### Windows
```bash
# Docker Desktop for Windows indirin:
# https://www.docker.com/products/docker-desktop/
```

#### Linux (Ubuntu/Debian)
```bash
# Docker kurulumu
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Kullanıcıyı docker grubuna ekle
sudo usermod -aG docker $USER

# Docker Servisini başlat
sudo systemctl start docker
sudo systemctl enable docker
```

### 2. Projeyi Klonla

```bash
git clone https://github.com/sohayli/dockerport.git
cd dockerport/portfoy-ai-studio
```

### 3. Docker Compose ile Başlat

```bash
docker-compose up -d --build
```

### 4. Servisleri Kontrol Et

```bash
docker-compose ps
```

## Servisler

| Servis | Port | Açıklama |
|--------|------|----------|
| App | 3000 | Node.js backend + React frontend |
| PostgreSQL | 5432 | Veritabanı |

## Erişim

- **Uygulama:** http://localhost:3000
- **Veritabanı:** localhost:5432
  - Database: `portfoy_ai`
  - Kullanıcı: `postgres`
  - Şifre: `postgres`

## Komutlar

### Uygulamayı Durdur
```bash
docker-compose down
```

### Logları Görüntüle
```bash
docker-compose logs -f app
docker-compose logs -f db
```

### Veritabanını Sıfırla
```bash
docker-compose down -v
docker-compose up -d --build
```

### TEFAS Verilerini Çek
```bash
docker exec portfoy_ai_studio-app-1 python3 scripts/scrape_tefas_historical.py
```

## Özellikler

- 📊 Portföy takibi
- 💰 TEFAS fon fiyatları (TRY + USD)
- 🤖 Otomatik günlük veri çekme
- 📈 Pasif gelir projeksiyonları
- 🇹🇷 BES (Bireysel Emeklilik) hesaplamaları

## Sorun Giderme

### Port 3000 Zaten Kullanımda
```bash
# Kullanan işlemi bul
lsof -i :3000

# Durdur
kill -9 <PID>
```

### Container Başlamıyor
```bash
# Logları kontrol et
docker-compose logs app

# Yeniden başlat
docker-compose restart app
```

### Veritabanı Bağlantı Hatası
```bash
# Veritabanı container'ını kontrol et
docker-compose ps db

# Sağlıklı olduğundan emin ol
docker-compose up -d db
```

## Ortam Değişkenleri

`.env` dosyası oluşturarak isteğe bağlı ayarları yapabilirsiniz:

```bash
# Google OAuth için (opsiyonel)
GOOGLE_CLIENT_ID=your-client-id

# JWT Secret
JWT_SECRET=your-secret-key
```

## Lisans

MIT
