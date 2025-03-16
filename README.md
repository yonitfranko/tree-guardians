# Tree Guardians (שומרי העצים)

פרויקט לניהול פעילויות חינוכיות סביב עצים בבית הספר.

## תכונות עיקריות

- ניהול פעילויות לימודיות סביב עצים שונים
- תיעוד ביצוע פעילויות בכיתות
- מעקב אחר התקדמות במיומנויות לפי כיתות
- העלאת תמונות ומשאבים נוספים

## בעיות ידועות

1. לא ניתן לשמור קישורים בדף הפעילות
2. תיעודים עם תמונות לא תמיד נשמרים כראוי
3. בעיות בכיווץ תמונות גדולות

## התקנה

1. התקן את הדרישות:
```bash
npm install
```

2. צור קובץ `.env.local` עם הגדרות Firebase:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

3. הרץ את הפרויקט:
```bash
npm run dev
```

## טכנולוגיות

- Next.js 13 (App Router)
- Firebase (Firestore)
- Tailwind CSS
- TypeScript

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
