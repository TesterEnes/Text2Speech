# Text2Speech (Sesli Metin Dönüştürücü)

Bu proje, tarayıcının dahili Web Speech API'sini kullanarak sesi metne ve metni sese dönüştüren basit bir web uygulamasıdır.

## Özellikler

- **Sesten Metne:** Mikrofonunuzu kullanarak konuştuğunuz kelimeleri anlık olarak metne çevirir.
- **Metinden Sese:** Yazı alanındaki metni, tarayıcınızda mevcut olan seslerden birini kullanarak seslendirir.
- **Ses Seçimi:** Tarayıcınızda yüklü olan tüm sesler arasından istediğinizi seçerek metni okutabilirsiniz.

## Kurulum ve Çalıştırma

Bu projenin bir `frontend` (React) ve bir `backend` (Node.js/Express) bölümü bulunmaktadır.

### Gereksinimler

- [Node.js](https://nodejs.org/)

### Adımlar

1.  **Projeyi klonlayın:**
    ```bash
    git clone https://github.com/TesterEnes/Text2Speech.git
    cd Text2Speech
    ```

2.  **Backend bağımlılıklarını kurun:**
    ```bash
    cd backend
    npm install
    cd ..
    ```

3.  **Frontend bağımlılıklarını kurun:**
    ```bash
    cd frontend
    npm install
    ```

4.  **Uygulamayı Çalıştırın:**
    *   **Backend'i başlatmak için** (projenin ana dizinindeyken):
        ```bash
        node backend/src/server.js
        ```
    *   **Frontend'i başlatmak için** (yeni bir terminalde, `frontend` klasörünün içindeyken):
        ```bash
        npm start
        ```

Frontend genellikle `http://localhost:3000` adresinde, backend ise `http://localhost:3001` adresinde çalışacaktır.
