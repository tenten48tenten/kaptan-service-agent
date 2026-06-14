@echo off
echo ================================================
echo   KAPTAN BILISIM - Vercel Deploy Baslatiyor...
echo ================================================
echo.

cd /d "C:\Users\leveno\Desktop\Kaptan_Service_Agent"

echo [1/2] Vercel CLI kontrol ediliyor...
where vercel >nul 2>&1
if %errorlevel% neq 0 (
    echo Vercel CLI bulunamadi, yukleniyor...
    npm install -g vercel
)

echo.
echo [2/2] Production deploy baslatiyor...
echo Lutfen bekleyin...
echo.
vercel --prod --yes

echo.
echo ================================================
echo   DEPLOY TAMAMLANDI!
echo   Site: https://fethiyekaptanbilisimteknolojileri.com.tr
echo ================================================
pause
