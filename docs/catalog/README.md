# میدسک — کاتالوگ فرایندها و قابلیت‌ها

> نسخه ۱.۰ · مناسب برای تیم داخلی و ارائه به مشتری

## مشاهده کاتالوگ

کاتالوگ تعاملی HTML (با نمودار فلو، تصاویر داشبورد و طراحی بازاریابی):

```
midesk-site/docs/catalog/index.html
```

در مرورگر باز کنید:

```bash
open midesk-site/docs/catalog/index.html
```

یا اگر سرور dev در حال اجراست:

```
http://localhost:3000/docs/catalog/index.html
```

## به‌روزرسانی تصاویر داشبورد

پیش‌نیاز: سرور فرانت روی `localhost:3000` و دیتابیس seed شده.

```bash
cd midesk-site/docs/catalog
npm init -y   # فقط بار اول
npm install playwright
npx playwright install chromium
node capture-screenshots.mjs
```

تصاویر در `screenshots/` ذخیره می‌شوند.

## ساختار سند

| بخش | محتوا |
|-----|--------|
| نقش‌ها | OWNER, ADMIN, MANAGER, HR_MANAGER, FINANCE, MEMBER |
| فاز ۰ | ورود، داشبورد، پروژه، کانبان |
| فاز ۱ | اسپرینت، Worklog، تقویم، مرخصی |
| فاز ۲ | HR کامل |
| فاز ۳ | مالی + عملکرد |
| فاز ۴ | چت، جلسه، AI، یادداشت |
| فاز ۵ | CRM، مکاتبات، نظرسنجی، گزارش‌ساز |
| فلوهای نقش | نمودار روز کاری هر نقش |

## کاربران دمو

| ایمیل | نقش | رمز |
|-------|-----|-----|
| owner@midesk.test | مالک | password |
| member@midesk.test | عضو | password |
| finance@midesk.test | مالی | password |

## منابع فنی

- مجوزها: `midesk-backend/app/Support/SitePermissions.php`
- مسیرهای فرانت: `midesk-site/app/pages/`
- API: `midesk-backend/docs/SITE_API_REFERENCE.md`
