# 🚀 دليل أوامر محرك الـ AI Importer (الإصدار الخامس)

يوضح هذا الدليل كيفية استخدام محرك الـ AI من خلال نافذة الأوامر (Terminal) لإضافة أدوات جديدة أو تحديث أسعار الأدوات الموجودة بالفعل.

## 1. رفع أداة جديدة (Full Import)
استخدم هذا الخيار عندما تريد إضافة أداة "غير موجودة" في قاعدة البيانات.

```powershell
# الطريقة الأفضل: رابط الأداة الرئيسي | رابط صفحة الأسعار
node scripts/ai-importer/index.js "https://uizard.io | https://uizard.io/pricing"

# الطريقة البسيطة: رابط الأداة الرئيسي فقط
node scripts/ai-importer/index.js "https://claude.com/"
```

## 2. تحديث الأسعار فقط (تحديث جراحي - Surgical Update)
استخدم هذا الخيار لتحديث "نوع التسعير" و "تفاصيل الأسعار" فقط لأداة موجودة بالفعل. لن يتم تغيير الوصف أو المميزات.

```powershell
# الطريقة الأفضل: PRICING_ONLY: الرابط الرئيسي | رابط صفحة الأسعار
node scripts/ai-importer/index.js "PRICING_ONLY: https://uizard.io | https://uizard.io/pricing"

# الطريقة البسيطة: PRICING_ONLY: الرابط الرئيسي فقط
node scripts/ai-importer/index.js "PRICING_ONLY: https://chatgpt.com/pricing/"

## 3. المعالجة الجماعية (Bulk Processing)
يمكنك معالجة عدة أدوات في وقت واحد عن طريق الفصل بينها بفاصلة (`,`).

```powershell
node scripts/ai-importer/index.js "https://tool1.com | https://tool1.com/pricing, PRICING_ONLY: https://tool2.com | https://tool2.com/pricing"
```

---

## 📝 قواعد هامة عند استخدام الـ Terminal:
1. **استخدم علامات التنصيص دائماً**: ضع كل ما تريد تنفيذه بين علامتي تنصيص مزدوجة `" "`.
2. **علامة الـ Pipe (|)**: تستخدم للفصل بين الرابط الرئيسي ورابط صفحة الأسعار.
3. **البادئة (PRICING_ONLY:)**: يجب أن تكون في بداية الرابط الخاص بالأداة المراد تحديث أسعارها فقط.
4. **مطابقة الروابط**: يبحث المحرك عن الأداة الموجودة في قاعدة بياناتك من خلال مطابقة "الرابط الرئيسي".

---
*تم إعداده بواسطة مساعد الذكاء الاصطناعي Antigravity - مايو 2026*
