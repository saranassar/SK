import { useState, useEffect } from "react";
import { supabase } from "./supabase";

/* ══════════════════════════════════════════
   CSS
══════════════════════════════════════════ */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  .admin { min-height:100vh; background:#080808; color:#f5f0eb; font-family:'DM Sans',sans-serif; }

  .admin-nav { display:flex; align-items:center; justify-content:space-between; padding:16px 32px; background:#0d0d0d; border-bottom:1px solid rgba(201,169,110,0.15); position:sticky; top:0; z-index:100; }
  .admin-logo { font-family:'Playfair Display',serif; font-size:18px; color:#c9a96e; }
  .admin-logo span { color:#f5f0eb; }
  .admin-badge { padding:4px 12px; background:rgba(201,169,110,0.1); border:1px solid rgba(201,169,110,0.3); border-radius:20px; font-size:11px; color:#c9a96e; letter-spacing:1px; }
  .back-home { padding:8px 16px; background:transparent; border:1px solid rgba(255,255,255,0.1); border-radius:4px; color:#6a5a4a; cursor:pointer; font-size:13px; font-family:'DM Sans',sans-serif; transition:all 0.2s; }
  .back-home:hover { border-color:#c9a96e; color:#c9a96e; }

  .admin-body { display:grid; grid-template-columns:220px 1fr; min-height:calc(100vh - 57px); }

  .sidebar { background:#0a0a0a; border-right:1px solid rgba(255,255,255,0.05); padding:24px 0; }
  .sidebar-item { display:flex; align-items:center; gap:12px; padding:12px 24px; cursor:pointer; font-size:14px; color:#5a4a3a; transition:all 0.2s; border-right:2px solid transparent; }
  .sidebar-item:hover { color:#c9a96e; background:rgba(201,169,110,0.04); }
  .sidebar-item.active { color:#c9a96e; background:rgba(201,169,110,0.07); border-right-color:#c9a96e; }
  .sidebar-icon { font-size:18px; }
  .sidebar-divider { height:1px; background:rgba(255,255,255,0.04); margin:12px 24px; }
  .sidebar-badge { margin-right:auto; background:rgba(201,169,110,0.15); color:#c9a96e; border-radius:10px; padding:1px 7px; font-size:10px; }

  .admin-main { padding:32px; overflow-y:auto; }
  .page-title { font-family:'Playfair Display',serif; font-size:26px; margin-bottom:6px; }
  .page-sub { font-size:13px; color:#5a4a3a; margin-bottom:32px; }

  .stats-row { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:32px; }
  .stat-card { padding:20px; background:#0d0d0d; border:1px solid rgba(255,255,255,0.05); border-radius:8px; position:relative; overflow:hidden; }
  .stat-card::after { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,#c9a96e,transparent); }
  .stat-card-num { font-family:'Playfair Display',serif; font-size:30px; color:#c9a96e; }
  .stat-card-lbl { font-size:11px; color:#3a3030; text-transform:uppercase; letter-spacing:1px; margin-top:4px; }
  .stat-card-trend { font-size:11px; color:#2ecc71; margin-top:6px; }

  .btn-gold { padding:10px 22px; background:#c9a96e; color:#0a0a0a; border:none; border-radius:4px; font-size:13px; font-weight:600; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.2s; }
  .btn-gold:hover { background:#ddb97e; }
  .btn-gold:disabled { opacity:0.4; cursor:not-allowed; }
  .btn-outline { padding:10px 22px; background:transparent; color:#c9a96e; border:1px solid rgba(201,169,110,0.4); border-radius:4px; font-size:13px; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.2s; }
  .btn-outline:hover { background:rgba(201,169,110,0.08); }
  .btn-danger { padding:8px 16px; background:transparent; color:#c05050; border:1px solid rgba(200,80,80,0.3); border-radius:4px; font-size:12px; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.2s; }
  .btn-danger:hover { background:rgba(200,80,80,0.1); }
  .btn-edit { padding:8px 16px; background:transparent; color:#c9a96e; border:1px solid rgba(201,169,110,0.3); border-radius:4px; font-size:12px; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.2s; }
  .btn-edit:hover { background:rgba(201,169,110,0.1); }
  .btn-approve { padding:6px 14px; background:rgba(46,204,113,0.1); color:#2ecc71; border:1px solid rgba(46,204,113,0.3); border-radius:4px; font-size:12px; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.2s; }
  .btn-approve:hover { background:rgba(46,204,113,0.2); }
  .btn-sm { padding:6px 12px; font-size:11px; }

  .table-wrap { background:#0d0d0d; border:1px solid rgba(255,255,255,0.05); border-radius:8px; overflow:hidden; margin-bottom:24px; }
  .table-header { display:flex; align-items:center; justify-content:space-between; padding:20px 24px; border-bottom:1px solid rgba(255,255,255,0.05); flex-wrap:wrap; gap:12px; }
  .table-title { font-size:15px; font-weight:500; }
  .search-input { padding:8px 14px; background:#111; border:1px solid rgba(255,255,255,0.08); border-radius:4px; color:#f5f0eb; font-size:13px; font-family:'DM Sans',sans-serif; outline:none; width:220px; }
  .search-input:focus { border-color:rgba(201,169,110,0.4); }
  table { width:100%; border-collapse:collapse; font-size:13px; }
  th { padding:10px 16px; text-align:right; font-size:10px; color:#3a3030; text-transform:uppercase; letter-spacing:1px; border-bottom:1px solid rgba(255,255,255,0.04); font-weight:500; }
  td { padding:13px 16px; border-bottom:1px solid rgba(255,255,255,0.03); color:#9a8a7a; vertical-align:middle; }
  tr:hover td { background:rgba(255,255,255,0.01); }
  tr:last-child td { border-bottom:none; }
  .td-name { color:#f5f0eb; font-weight:500; }
  .td-brand { color:#c9a96e; font-size:12px; }
  .td-price { font-family:'Playfair Display',serif; color:#c9a96e; }
  .td-actions { display:flex; gap:8px; flex-wrap:wrap; }

  .badge { padding:3px 10px; border-radius:20px; font-size:10px; font-weight:500; }
  .badge-cleanser { background:rgba(46,204,113,0.1); color:#2ecc71; }
  .badge-serum { background:rgba(52,152,219,0.1); color:#3498db; }
  .badge-moisturizer { background:rgba(155,89,182,0.1); color:#9b59b6; }
  .badge-sunscreen { background:rgba(241,196,15,0.1); color:#f1c40f; }
  .badge-toner { background:rgba(230,126,34,0.1); color:#e67e22; }
  .badge-pending { background:rgba(241,196,15,0.1); color:#f1c40f; }
  .badge-approved { background:rgba(46,204,113,0.1); color:#2ecc71; }
  .badge-superadmin { background:rgba(201,169,110,0.15); color:#c9a96e; }
  .badge-admin { background:rgba(52,152,219,0.1); color:#3498db; }

  .form-wrap { background:#0d0d0d; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:28px; margin-bottom:24px; }
  .form-title { font-size:15px; font-weight:500; margin-bottom:20px; color:#c9a96e; }
  .form-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
  .form-grid-2 { display:grid; grid-template-columns:repeat(2,1fr); gap:16px; }
  .field { display:flex; flex-direction:column; gap:6px; }
  .field label { font-size:11px; color:#5a4a3a; text-transform:uppercase; letter-spacing:1px; }
  .field input, .field select, .field textarea { padding:10px 14px; background:#111; border:1px solid rgba(255,255,255,0.07); border-radius:4px; color:#f5f0eb; font-size:13px; font-family:'DM Sans',sans-serif; outline:none; transition:border-color 0.2s; }
  .field input:focus, .field select:focus, .field textarea:focus { border-color:rgba(201,169,110,0.4); }
  .field select option { background:#111; }
  .field textarea { resize:vertical; min-height:80px; }
  .form-full { grid-column:1/-1; }
  .form-actions { display:flex; gap:12px; margin-top:20px; flex-wrap:wrap; }
  .err-msg { font-size:12px; color:#c05050; padding:10px 14px; background:rgba(200,80,80,0.08); border-radius:4px; margin-bottom:16px; }
  .ok-msg { font-size:12px; color:#2ecc71; padding:10px 14px; background:rgba(46,204,113,0.08); border-radius:4px; margin-bottom:16px; }

  .colors-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; margin-bottom:24px; }
  .color-card { padding:20px; background:#0d0d0d; border:1px solid rgba(255,255,255,0.05); border-radius:8px; }
  .color-card-label { font-size:12px; color:#5a4a3a; text-transform:uppercase; letter-spacing:1px; margin-bottom:12px; }
  .color-preview { width:100%; height:48px; border-radius:4px; margin-bottom:12px; border:1px solid rgba(255,255,255,0.08); }
  .color-input-row { display:flex; gap:8px; align-items:center; }
  .color-input-row input[type=color] { width:40px; height:36px; border:none; background:none; cursor:pointer; border-radius:4px; }
  .color-input-row input[type=text] { flex:1; padding:8px 12px; background:#111; border:1px solid rgba(255,255,255,0.07); border-radius:4px; color:#f5f0eb; font-size:13px; font-family:'DM Sans',sans-serif; outline:none; }

  /* ANALYTICS */
  .chart-bar-wrap { margin-bottom:8px; }
  .chart-bar-label { display:flex; justify-content:space-between; font-size:12px; color:#7a6a5a; margin-bottom:4px; }
  .chart-bar-bg { height:8px; background:#1a1a1a; border-radius:4px; overflow:hidden; }
  .chart-bar-fill { height:100%; background:linear-gradient(90deg,#c9a96e,#e0c080); border-radius:4px; transition:width 0.8s ease; }

  /* REVIEW CARD */
  .review-card { padding:20px; background:#0d0d0d; border:1px solid rgba(255,255,255,0.05); border-radius:8px; margin-bottom:12px; }
  .review-card-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
  .review-card-user { font-size:13px; font-weight:500; color:#f5f0eb; }
  .review-card-date { font-size:11px; color:#3a3030; }
  .review-card-product { font-size:12px; color:#c9a96e; margin-bottom:8px; }
  .review-card-text { font-size:13px; color:#9a8a7a; line-height:1.6; margin-bottom:12px; }
  .review-stars { color:#c9a96e; font-size:14px; margin-bottom:8px; }
  .review-actions { display:flex; gap:8px; }

  /* ADMIN MANAGEMENT */
  .admin-card { padding:20px; background:#0d0d0d; border:1px solid rgba(255,255,255,0.05); border-radius:8px; margin-bottom:12px; display:flex; align-items:center; justify-content:space-between; gap:16px; flex-wrap:wrap; }
  .admin-card-info { flex:1; }
  .admin-card-email { font-size:14px; color:#f5f0eb; font-weight:500; margin-bottom:4px; }
  .admin-card-limits { font-size:12px; color:#5a4a3a; }
  .permissions-grid { display:flex; gap:8px; flex-wrap:wrap; margin-top:8px; }
  .perm-tag { padding:4px 10px; border-radius:4px; font-size:11px; border:1px solid rgba(255,255,255,0.08); color:#7a6a5a; }
  .perm-tag.on { border-color:rgba(201,169,110,0.4); color:#c9a96e; background:rgba(201,169,110,0.06); }

  .user-row-email { font-size:12px; color:#5a4a3a; }
  .toast { position:fixed; bottom:24px; left:50%; transform:translateX(-50%); padding:12px 24px; background:#1a1a1a; border:1px solid rgba(201,169,110,0.3); border-radius:6px; font-size:13px; color:#c9a96e; z-index:999; }
  .admin-login { display:flex; align-items:center; justify-content:center; min-height:100vh; background:#080808; }
  .login-box { background:#0d0d0d; border:1px solid rgba(201,169,110,0.15); border-radius:12px; padding:40px; width:100%; max-width:380px; text-align:center; }
  .login-title { font-family:'Playfair Display',serif; font-size:24px; margin-bottom:6px; }
  .login-sub { font-size:13px; color:#3a3030; margin-bottom:28px; }
  .empty { text-align:center; padding:48px; color:#3a3030; }
  .empty-icon { font-size:40px; margin-bottom:12px; }
  .divider { height:1px; background:rgba(255,255,255,0.05); margin:24px 0; }
  .info-box { padding:14px; background:rgba(201,169,110,0.05); border:1px solid rgba(201,169,110,0.1); border-radius:6px; font-size:12px; color:#5a4a3a; margin-top:16px; line-height:1.6; }

  /* ROUTINES */
  .routine-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-bottom:28px; }
  .routine-tab { padding:14px 10px; background:#0d0d0d; border:1px solid rgba(255,255,255,0.05); border-radius:6px; cursor:pointer; text-align:center; transition:all 0.2s; }
  .routine-tab:hover { border-color:rgba(201,169,110,0.25); }
  .routine-tab.active { border-color:#c9a96e; background:rgba(201,169,110,0.06); }
  .routine-tab-label { font-size:13px; color:#f5f0eb; margin-bottom:4px; }
  .routine-tab-budget { font-size:11px; color:#5a4a3a; }
  .routine-editor { background:#0d0d0d; border:1px solid rgba(201,169,110,0.2); border-radius:8px; padding:24px; }
  .routine-editor-title { font-family:'Playfair Display',serif; font-size:18px; color:#c9a96e; margin-bottom:20px; }
  .step-row { display:grid; grid-template-columns:150px 1fr 36px; gap:10px; align-items:center; margin-bottom:10px; padding:10px 14px; background:#111; border-radius:6px; border:1px solid rgba(255,255,255,0.04); }
  .step-row-label { font-size:12px; color:#7a6a5a; }
  .step-row select { padding:8px 12px; background:#0d0d0d; border:1px solid rgba(255,255,255,0.08); border-radius:4px; color:#f5f0eb; font-size:13px; font-family:'DM Sans',sans-serif; outline:none; width:100%; }
  .step-row select:focus { border-color:rgba(201,169,110,0.4); }
  .step-remove { background:none; border:none; color:#c05050; cursor:pointer; font-size:18px; padding:4px; }
  .step-remove:hover { opacity:0.7; }
  .add-step-row { display:flex; gap:10px; margin-top:14px; align-items:center; flex-wrap:wrap; }
  .add-step-row select { padding:8px 12px; background:#111; border:1px solid rgba(255,255,255,0.07); border-radius:4px; color:#f5f0eb; font-size:13px; font-family:'DM Sans',sans-serif; outline:none; flex:1; min-width:120px; }
  .total-edit { display:flex; align-items:center; gap:10px; margin-top:16px; padding-top:16px; border-top:1px solid rgba(255,255,255,0.05); }
  .total-edit label { font-size:12px; color:#5a4a3a; text-transform:uppercase; letter-spacing:1px; white-space:nowrap; }
  .total-edit input { padding:8px 12px; background:#111; border:1px solid rgba(255,255,255,0.07); border-radius:4px; color:#c9a96e; font-size:16px; font-family:'Playfair Display',serif; outline:none; width:140px; }
  .mode-tabs { display:flex; gap:8px; margin-bottom:20px; }
  .mode-tab { padding:8px 20px; border-radius:20px; border:1px solid rgba(255,255,255,0.08); background:transparent; color:#5a4a3a; cursor:pointer; font-size:13px; font-family:'DM Sans',sans-serif; transition:all 0.2s; }
  .mode-tab.active { background:#c9a96e; color:#0a0a0a; border-color:#c9a96e; font-weight:600; }

  @media(max-width:768px) {
    .admin-body { grid-template-columns:1fr; }
    .sidebar { display:flex; overflow-x:auto; padding:8px 0; border-right:none; border-bottom:1px solid rgba(255,255,255,0.05); }
    .stats-row { grid-template-columns:repeat(2,1fr); }
    .form-grid { grid-template-columns:1fr; }
    .routine-grid { grid-template-columns:1fr; }
    .step-row { grid-template-columns:120px 1fr 36px; }
    .colors-grid { grid-template-columns:repeat(2,1fr); }
  }
`;

/* ══════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════ */
const SUPER_ADMIN_EMAIL = "sara.amin.nassar@gmail.com";

const TYPE_BADGES = { cleanser:"badge-cleanser", serum:"badge-serum", moisturizer:"badge-moisturizer", sunscreen:"badge-sunscreen", toner:"badge-toner", mask:"badge-toner", makeup_remover:"badge-cleanser", body_moisturizer:"badge-moisturizer", eye_cream:"badge-serum", exfoliator:"badge-cleanser", spot_treatment:"badge-serum", oil:"badge-moisturizer" };
const TYPE_LABELS = { cleanser:"غسول", serum:"سيروم", moisturizer:"مرطب", sunscreen:"واقي شمس", toner:"تونر", mask:"ماسك", makeup_remover:"مزيل مكياج", body_moisturizer:"مرطب جسم", eye_cream:"كريم عيون", exfoliator:"مقشر", spot_treatment:"علاج موضعي", oil:"زيت" };
const DEFAULT_PRODUCT = { id:"", name:"", brand:"", type:"cleanser", skin:"", concerns:"", price:"", original_price:"", where_to_buy:"", link:"", image_url:"", ingredients:"", note:"", doctor_note:"", on_sale:false, sale_label:"" };

const PERMISSIONS = [
  { key:"products_add",  label:"إضافة منتجات" },
  { key:"products_edit", label:"تعديل منتجات" },
  { key:"users_view",    label:"مشاهدة اليوزرز" },
  { key:"reviews",       label:"الريفيوز" },
  { key:"routines",      label:"تعديل الروتينات" },
];

const SKIN_CATEGORIES  = ["dry","oily","combo","sensitive","normal"];
const CONCERN_CATEGORIES = ["brightening","acne","aging","hydration","sensitivity","pores","darkcircles","darkspots"];
const BUDGET_LABELS = { budget:"💸 Budget", mid:"💛 Mid", premium:"💜 Premium" };
const CATEGORY_LABELS = {
  dry:"جافة", oily:"دهنية", combo:"مختلطة", sensitive:"حساسة", normal:"عادية",
  brightening:"تفتيح", acne:"حب الشباب", aging:"شيخوخة", hydration:"ترطيب",
  sensitivity:"حساسية", pores:"مسامات", darkcircles:"هالات", darkspots:"آثار حب الشباب",
};
const STEP_LABELS = ["🧼 غسول","💧 تونر","🧪 سيروم","🧪 سيروم مكمل","🌿 مرطب","☀️ واقي شمس"];

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function AdminPanel({ onBack, lang = "ar" }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage]       = useState("dashboard");

  // ── ADMIN TRANSLATIONS ──
  const A = {
    ar: {
      dashboard: "الرئيسية", analytics: "الإحصائيات", products: "المنتجات",
      reviews: "الريفيوز", consultations: "الاستشارات", routines: "الروتينات",
      abTest: "A/B Testing", brands: "البراندات", colors: "الألوان",
      admins: "الأدمنز", users: "اليوزرز",
      totalUsers: "إجمالي اليوزرز", thisMonth: "تسجيلات الشهر",
      totalRoutines: "إجمالي الروتينات", totalReviews: "إجمالي الريفيوز",
      pendingReviews: "ينتظر Approve", approvedReviews: "معتمدة",
      engagement: "تفاعل اليوزرز", savedRoutine: "حفظوا روتين",
      wroteReview: "كتبوا ريفيو", noAction: "مش عملوا حاجة",
      ageGroups: "الفئات العمرية", under18: "أقل من 18",
      notSpecified: "مش محدد",
      addProduct: "إضافة منتج جديد", editProduct: "تعديل المنتج",
      productName: "اسم المنتج", brandLabel: "البراند", typeLabel: "النوع",
      priceLabel: "السعر (ج)", skinLabel: "أنواع البشرة", concernsLabel: "الكونسيرن",
      whereLabel: "أين تشتري", linkLabel: "Affiliate Link", imageLabel: "رابط صورة المنتج",
      ingredientsLabel: "المكونات", noteLabel: "ملاحظة عامة", doctorNoteLabel: "ملاحظات الطبيبة",
      saleCheck: "عرض حالي؟", saleLabelField: "نص العرض",
      saveEdit: "حفظ التعديل", addBtn: "إضافة", cancelBtn: "إلغاء",
      deleteBtn: "حذف", editBtn: "تعديل", approveBtn: "موافقة", rejectBtn: "رفض",
      allProducts: "كل المنتجات", searchPlaceholder: "ابحثي...",
      sendReply: "إرسال الرد", replyPlaceholder: "اكتبي ردك هنا...",
      pending: "في الانتظار", answered: "تم الرد", total: "إجمالي",
      userQuestion: "سؤال اليوزر", doctorReply: "ردك",
      noConsultations: "مفيش استشارات لحد دلوقتي",
      backHome: "رجوع للتوول", adminPanel: "Admin Panel",
      currency: "ج",
    },
    en: {
      dashboard: "Dashboard", analytics: "Analytics", products: "Products",
      reviews: "Reviews", consultations: "Consultations", routines: "Routines",
      abTest: "A/B Testing", brands: "Brands", colors: "Colors",
      admins: "Admins", users: "Users",
      totalUsers: "Total Users", thisMonth: "This Month Signups",
      totalRoutines: "Total Routines", totalReviews: "Total Reviews",
      pendingReviews: "Pending Approval", approvedReviews: "Approved",
      engagement: "User Engagement", savedRoutine: "Saved a Routine",
      wroteReview: "Wrote a Review", noAction: "No Action",
      ageGroups: "Age Groups", under18: "Under 18",
      notSpecified: "Not Specified",
      addProduct: "Add New Product", editProduct: "Edit Product",
      productName: "Product Name", brandLabel: "Brand", typeLabel: "Type",
      priceLabel: "Price (EGP)", skinLabel: "Skin Types", concernsLabel: "Concerns",
      whereLabel: "Where to Buy", linkLabel: "Affiliate Link", imageLabel: "Product Image URL",
      ingredientsLabel: "Ingredients", noteLabel: "General Note", doctorNoteLabel: "Doctor's Notes",
      saleCheck: "On Sale?", saleLabelField: "Sale Label",
      saveEdit: "Save Changes", addBtn: "Add", cancelBtn: "Cancel",
      deleteBtn: "Delete", editBtn: "Edit", approveBtn: "Approve", rejectBtn: "Reject",
      allProducts: "All Products", searchPlaceholder: "Search...",
      sendReply: "Send Reply", replyPlaceholder: "Write your reply here...",
      pending: "Pending", answered: "Answered", total: "Total",
      userQuestion: "User's Question", doctorReply: "Your Reply",
      noConsultations: "No consultations yet",
      backHome: "Back to Tool", adminPanel: "Admin Panel",
      currency: "EGP",
    }
  };
  const a = A[lang];
  const [products, setProducts] = useState([]);
  const [users, setUsers]     = useState([]);
  const [admins, setAdmins]   = useState([]);
  const [reviews, setReviews] = useState([]);
  const [curatedRoutines, setCuratedRoutines] = useState([]);
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [routineMode, setRoutineMode] = useState("skin");
  const [editingSteps, setEditingSteps] = useState([]);
  const [editingTotal, setEditingTotal] = useState(0);
  const [editingNotes, setEditingNotes] = useState("");
  const [newStepLabel, setNewStepLabel] = useState("🧼 غسول");
  const [newStepProduct, setNewStepProduct] = useState("");
  const [selectedBrandPage, setSelectedBrandPage] = useState("");
  const [abTests, setAbTests]   = useState([]);
  const [abForm, setAbForm]     = useState({ routine_id:"", step_index:0, product_a:"", product_b:"", start_date:"", end_date:"", name:"" });
  const [abMsg, setAbMsg]       = useState({ type:"", text:"" });
  const [analytics, setAnalytics] = useState({ totalRoutines:0, topProducts:{}, recentSignups:0 });
  const [consultations, setConsultations] = useState([]);
  const [consultReply, setConsultReply] = useState({});
  const [search, setSearch]   = useState("");
  const [form, setForm]       = useState(DEFAULT_PRODUCT);
  const [editing, setEditing] = useState(false);
  const [msg, setMsg]         = useState({ type:"", text:"" });
  const [toast, setToast]     = useState("");
  const [loginForm, setLoginForm] = useState({ email:"", password:"" });
  const [loginErr, setLoginErr]   = useState("");
  const [colors, setColors]   = useState({ primary:"#c9a96e", background:"#0a0a0a", text:"#f5f0eb", accent:"#1a1a2e" });

  // Admin form
  const [adminForm, setAdminForm] = useState({ email:"", permissions:{ products_add:false, products_edit:false, users_view:false, reviews:false } });
  const [adminMsg, setAdminMsg]   = useState({ type:"", text:"" });

  // Current admin permissions
  const [myPerms, setMyPerms] = useState(null); // null = superadmin

  const showToast = (t) => { setToast(t); setTimeout(()=>setToast(""), 3000); };

  // ── SESSION ──
  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      setUser(session?.user ?? null);
      setLoading(false);
    });
  },[]);

  useEffect(()=>{
    if(!user) return;
    if(user.email === SUPER_ADMIN_EMAIL){
      setMyPerms(null); // superadmin — كل الصلاحيات
      loadAll();
    } else {
      // check if sub-admin
      checkSubAdmin(user.email);
    }
  },[user]);

  const checkSubAdmin = async(email)=>{
    const {data} = await supabase.from("admins").select("*").eq("email", email).single();
    if(data){ setMyPerms(data.permissions || {}); loadAll(); }
    else { setUser(null); } // مش أدمن
  };

  const loadAll = ()=>{ loadProducts(); loadUsers(); loadColors(); loadAdmins(); loadReviews(); loadAnalytics(); loadCuratedRoutines(); loadAbTests(); loadConsultations(); };

  const loadConsultations = async()=>{
    const {data} = await supabase.from("consultations").select("*").order("created_at",{ascending:false});
    if(data) setConsultations(data);
  };

  const handleReplyConsult = async(id)=>{
    const reply = consultReply[id];
    if(!reply?.trim()) return;
    const {error} = await supabase.from("consultations").update({ doctor_reply:reply, status:"answered", replied_at: new Date().toISOString() }).eq("id",id);
    if(error){ showToast(lang==="ar"?"في مشكلة في الإرسال":"Error sending reply"); return; }
    showToast("✅ تم إرسال الرد!");
    setConsultReply(r=>({...r,[id]:""}));
    loadConsultations();
  };

  const loadProducts = async()=>{
    const {data} = await supabase.from("products").select("*").order("created_at",{ascending:false});
    if(data) setProducts(data);
  };
  const loadUsers = async()=>{
    const {data} = await supabase.from("profiles").select("*").order("created_at",{ascending:false});
    if(data) setUsers(data);
  };
  const loadColors = async()=>{
    const {data} = await supabase.from("settings").select("*");
    if(data && data.length > 0){ const c={}; data.forEach(s=>c[s.key]=s.value); setColors(prev=>({...prev,...c})); }
  };
  const loadAdmins = async()=>{
    const {data} = await supabase.from("admins").select("*").order("created_at",{ascending:false});
    if(data) setAdmins(data);
  };
  const loadCuratedRoutines = async()=>{
    const {data} = await supabase.from("curated_routines").select("*");
    if(data) setCuratedRoutines(data);
  };

  const loadAbTests = async()=>{
    const {data} = await supabase.from("ab_tests").select("*, product_a_info:products!ab_tests_product_a_fkey(name,brand), product_b_info:products!ab_tests_product_b_fkey(name,brand)").order("created_at",{ascending:false});
    if(data) setAbTests(data);
  };

  // ── DELETE USER ──
  const handleDeleteUser = async(userId, userEmail)=>{
    const confirm1 = window.confirm(
      lang==="ar"
        ? `هتمسحي اليوزر ده؟\n${userEmail}\n\nده هيشيله من الداتابيز نهائياً.`
        : `Delete this user?\n${userEmail}\n\nThis will permanently remove them from the database.`
    );
    if(!confirm1) return;
    // امسحي روتيناته واستشاراته وريفيوهاته أولاً (CASCADE safety)
    await supabase.from("routines").delete().eq("user_id", userId);
    await supabase.from("consultations").delete().eq("user_id", userId);
    await supabase.from("reviews").delete().eq("user_id", userId);
    // امسحي من profiles
    const {error: profileError} = await supabase.from("profiles").delete().eq("id", userId);
    if(profileError){
      alert(lang==="ar" ? `في مشكلة: ${profileError.message}` : `Error: ${profileError.message}`);
      return;
    }
    // ملاحظة: لمسح اليوزر من auth.users بالكامل — لازم Supabase service role key
    // من Dashboard: Authentication → Users → Delete manually
    setUsers(prev => prev.filter(u => u.id !== userId));
    showToast(lang==="ar" ? "🗑️ تم مسح اليوزر من الداتابيز — امسحيه من Supabase Auth يدوياً" : "🗑️ User deleted from DB — remove from Supabase Auth manually");
  };

  // ── EXPORT EXCEL (CSV) ──
  const exportUsersCSV = ()=>{
    const headers = ["الاسم","الإيميل","الموبايل","السن","تاريخ التسجيل"];
    const rows = users.map(u=>[
      u.name||"",
      u.email||"",
      u.phone||"",
      u.age||"",
      new Date(u.created_at).toLocaleDateString("ar-EG")
    ]);
    const csv = [headers, ...rows].map(r=>r.map(v=>`"${v}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF"+csv], {type:"text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href=url; a.download=`skinmatch_users_${new Date().toISOString().slice(0,10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
    showToast("✅ تم التحميل!");
  };

  // ── AB TESTS ──
  const handleSaveAbTest = async()=>{
    setAbMsg({type:"",text:""});
    if(!abForm.name||!abForm.product_a||!abForm.product_b||!abForm.start_date||!abForm.end_date){
      setAbMsg({type:"err",text:"كملي كل الحقول"}); return;
    }
    if(!abForm.routine_id){ setAbMsg({type:"err",text:"اختاري الروتين"}); return; }
    const {error} = await supabase.from("ab_tests").insert({
      name: abForm.name,
      routine_id: abForm.routine_id,
      step_index: parseInt(abForm.step_index),
      product_a: abForm.product_a,
      product_b: abForm.product_b,
      start_date: abForm.start_date,
      end_date: abForm.end_date,
      status: "active",
      saves_a: 0,
      saves_b: 0,
    });
    if(error){ setAbMsg({type:"err",text:"في مشكلة"}); return; }
    setAbMsg({type:"ok",text:"✅ تم إنشاء الـ Test!"});
    setAbForm({routine_id:"",step_index:0,product_a:"",product_b:"",start_date:"",end_date:"",name:""});
    loadAbTests();
  };

  const handleDeleteAbTest = async(id)=>{ if(!window.confirm("متأكدة؟")) return; await supabase.from("ab_tests").delete().eq("id",id); loadAbTests(); showToast("🗑️ تم الحذف"); };
  const loadReviews = async()=>{
    const {data} = await supabase.from("reviews").select("*").order("created_at",{ascending:false});
    if(data) setReviews(data);
  };
  const loadAnalytics = async()=>{
    const {data:routines} = await supabase.from("routines").select("steps_json, created_at, user_id");
    const {data:allReviews} = await supabase.from("reviews").select("user_id, status, created_at");
    // جيب الـ users مباشرة من الـ DB مش من الـ state عشان تضمن إن البيانات موجودة
    const {data:freshUsers} = await supabase.from("profiles").select("id, age, created_at");
    const usersData = freshUsers || [];
    if(routines){
      const productCount = {};
      routines.forEach(r=>{
        try { const ids = JSON.parse(r.steps_json||"[]"); ids.forEach(id=>{ productCount[id]=(productCount[id]||0)+1; }); } catch{}
      });
      const now = new Date();
      const recentSignups = usersData.filter(u=>{ const d=new Date(u.created_at); return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear(); }).length;

      // السن
      const ageGroups = {"أقل من 18":0,"18-24":0,"25-30":0,"31-40":0,"40+":0,"مش محدد":0};
      usersData.forEach(u=>{
        const age = parseInt(u.age);
        if(!u.age || isNaN(age)) ageGroups["مش محدد"]++;
        else if(age < 18) ageGroups["أقل من 18"]++;
        else if(age <= 24) ageGroups["18-24"]++;
        else if(age <= 30) ageGroups["25-30"]++;
        else if(age <= 40) ageGroups["31-40"]++;
        else ageGroups["40+"]++;
      });

      // Engagement
      const usersWithRoutines = new Set(routines.map(r=>r.user_id)).size;
      const usersWithReviews = new Set((allReviews||[]).map(r=>r.user_id)).size;
      const totalReviews = (allReviews||[]).length;
      const pendingReviewsCount = (allReviews||[]).filter(r=>r.status==="pending").length;

      // روتينات هذا الشهر
      const routinesThisMonth = routines.filter(r=>{ const d=new Date(r.created_at); return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear(); }).length;

      setAnalytics({ totalRoutines:routines.length, topProducts:productCount, recentSignups, ageGroups, usersWithRoutines, usersWithReviews, totalReviews, pendingReviewsCount, routinesThisMonth });
    }
  };

  // ── LOGIN ──
  const handleLogin = async()=>{
    setLoginErr("");
    const {error} = await supabase.auth.signInWithPassword({email:loginForm.email, password:loginForm.password});
    if(error){ setLoginErr("إيميل أو باسورد غلط"); return; }
    const {data:{session}} = await supabase.auth.getSession();
    setUser(session?.user ?? null);
  };

  // ── PRODUCT CRUD ──
  const handleSaveProduct = async()=>{
    setMsg({type:"",text:""});
    if(!form.id||!form.name||!form.brand||!form.price){ setMsg({type:"err",text: lang==="ar"?"كملي الحقول: ID، الاسم، البراند، السعر":"Fill in required fields: ID, Name, Brand, Price"}); return; }
    // افصلي الـ id و doctor_note من الـ payload
    const {id, doctor_note, ...rest} = form;
    const isSale = !!form.on_sale;
    const payload = {
      ...rest,
      price: parseInt(form.price)||0,
      // لو العرض اتشال — امسح السعر الأصلي والـ label تلقائياً
      original_price: isSale && form.original_price ? parseInt(form.original_price) : null,
      on_sale: isSale,
      sale_label: isSale ? (form.sale_label||"") : "",
      image_url: form.image_url||null,
      skin: form.skin ? form.skin.split(",").map(s=>s.trim()).filter(Boolean) : [],
      concerns: form.concerns ? form.concerns.split(",").map(s=>s.trim()).filter(Boolean) : [],
    };
    // doctor_note مش في جدول products — بتتحفظ في product_notes
    delete payload.doctor_note;
    let error;
    if(editing){
      // update: استخدمي .eq("id", id) بدون الـ id في الـ payload
      ({error} = await supabase.from("products").update(payload).eq("id", id));
    } else {
      // insert: ضيفي الـ id
      ({error} = await supabase.from("products").insert({id, ...payload}));
    }
    if(error){
      console.error("Save error:", error);
      setMsg({type:"err", text: editing
        ? (lang==="ar" ? `في مشكلة في التعديل: ${error.message}` : `Update error: ${error.message}`)
        : (lang==="ar" ? "في مشكلة — تأكدي إن الـ ID مش موجود قبل كده" : "Error — make sure this ID doesn't exist already")
      });
      return;
    }
    // حفظ ملاحظات الطبيبة في product_notes
    if(doctor_note !== undefined){
      await supabase.from("product_notes").upsert({product_id: id, notes: doctor_note||""},{onConflict:"product_id"});
    }
    setMsg({type:"ok", text: editing ? (lang==="ar"?"✅ تم التعديل!":"✅ Updated!") : (lang==="ar"?"✅ تم الإضافة!":"✅ Added!")});
    setForm(DEFAULT_PRODUCT); setEditing(false); loadProducts();
    showToast(editing ? (lang==="ar"?"✅ تم التعديل":"✅ Updated") : (lang==="ar"?"✅ تم الإضافة":"✅ Added"));
  };
  const handleEdit = (p)=>{ setForm({...DEFAULT_PRODUCT, ...p, skin:Array.isArray(p.skin)?p.skin.join(", "):p.skin||"", concerns:Array.isArray(p.concerns)?p.concerns.join(", "):p.concerns||"", image_url:p.image_url||"", original_price:p.original_price||"", doctor_note:p.doctor_note||""}); setEditing(true); setMsg({type:"",text:""}); window.scrollTo({top:0,behavior:"smooth"}); };
  const handleDelete = async(id)=>{ if(!window.confirm("متأكدة؟")) return; await supabase.from("products").delete().eq("id",id); loadProducts(); showToast("🗑️ تم الحذف"); };
  const handleCancelEdit = ()=>{ setForm(DEFAULT_PRODUCT); setEditing(false); setMsg({type:"",text:""}); };

  // ── COLORS ──
  const handleSaveColors = async()=>{
    for(const [key,value] of Object.entries(colors)){ await supabase.from("settings").upsert({key,value}); }
    showToast("✅ تم حفظ الألوان!");
  };

  // ── ADMINS ──
  const handleAddAdmin = async()=>{
    setAdminMsg({type:"",text:""});
    if(!adminForm.email){ setAdminMsg({type:"err",text:"اكتبي الإيميل"}); return; }
    if(adminForm.email === SUPER_ADMIN_EMAIL){ setAdminMsg({type:"err",text:"ده الإيميل بتاعك!"}); return; }
    const {error} = await supabase.from("admins").insert({ email:adminForm.email, permissions:adminForm.permissions });
    if(error){ setAdminMsg({type:"err",text:"في مشكلة — ممكن الإيميل موجود قبل كده"}); return; }
    setAdminMsg({type:"ok",text:"✅ تم إضافة الأدمن!"});
    setAdminForm({email:"",permissions:{products_add:false,products_edit:false,users_view:false,reviews:false}});
    loadAdmins();
  };
  const handleDeleteAdmin = async(id)=>{ if(!window.confirm("متأكدة؟")) return; await supabase.from("admins").delete().eq("id",id); loadAdmins(); showToast("🗑️ تم الحذف"); };

  // ── REVIEWS ──
  const handleApproveReview = async(id)=>{
    await supabase.from("reviews").update({status:"approved"}).eq("id",id);
    loadReviews(); showToast("✅ تم الموافقة على الريفيو!");
  };
  const handleDeleteReview = async(id)=>{ if(!window.confirm("متأكدة؟")) return; await supabase.from("reviews").delete().eq("id",id); loadReviews(); showToast("🗑️ تم الحذف"); };

  // ── ROUTINES ──
  const openRoutineEditor = (mode, category, budget)=>{
    const found = curatedRoutines.find(r=>r.mode===mode && r.category===category && r.budget===budget);
    setSelectedRoutine({mode,category,budget});
    setEditingSteps(found ? (typeof found.steps==="string" ? JSON.parse(found.steps) : found.steps) : []);
    setEditingTotal(found?.total_price || 0);
    setEditingNotes(found?.usage_notes || "");
  };
  const saveRoutineEdit = async()=>{
    if(!selectedRoutine) return;
    const {mode,category,budget} = selectedRoutine;
    const existing = curatedRoutines.find(r=>r.mode===mode && r.category===category && r.budget===budget);
    const payload = { mode, category, budget, steps:editingSteps, total_price:parseInt(editingTotal)||0, usage_notes:editingNotes, updated_by:user.email, updated_at:new Date().toISOString() };
    let error;
    if(existing){
      ({error} = await supabase.from("curated_routines").update(payload).eq("id",existing.id));
    } else {
      ({error} = await supabase.from("curated_routines").insert(payload));
    }
    if(error){ showToast(lang==="ar"?"في مشكلة في الحفظ":"Error saving routine"); return; }
    loadCuratedRoutines();
    showToast("✅ تم حفظ الروتين!");
  };
  const addStep = ()=>{
    if(!newStepProduct) return;
    setEditingSteps(s=>[...s, {product_id:newStepProduct, label:newStepLabel}]);
    setNewStepProduct("");
  };
  const removeStep = (i)=>setEditingSteps(s=>s.filter((_,idx)=>idx!==i));
  const moveStep = (i, dir)=>{
    const arr = [...editingSteps];
    const j = i+dir;
    if(j<0||j>=arr.length) return;
    [arr[i],arr[j]]=[arr[j],arr[i]];
    setEditingSteps(arr);
  };

  const isSuperAdmin = user?.email === SUPER_ADMIN_EMAIL;
  const canDo = (perm) => isSuperAdmin || myPerms?.[perm];

  const pendingReviews = reviews.filter(r=>r.status==="pending");
  const approvedReviews = reviews.filter(r=>r.status==="approved");

  // Top products
  const topProductsList = Object.entries(analytics.topProducts)
    .sort((a,b)=>b[1]-a[1])
    .slice(0,5)
    .map(([id,count])=>({ id, count, name:products.find(p=>p.id===id)?.name||id }));
  const maxCount = topProductsList[0]?.count || 1;

  const filtered = products.filter(p=>p.name?.toLowerCase().includes(search.toLowerCase())||p.brand?.toLowerCase().includes(search.toLowerCase()));

  // ── SIDEBAR ITEMS ──
  const sidebarItems = [
    {key:"dashboard", icon:"📊", label:a.dashboard, show:true},
    {key:"analytics", icon:"📈", label:a.analytics, show:true},
    {key:"products",  icon:"🧴", label:a.products, show:canDo("products_add")||canDo("products_edit")},
    {key:"reviews",   icon:"⭐", label:a.reviews, show:canDo("reviews"), badge:pendingReviews.length},
    {key:"consultations", icon:"👩‍⚕️", label:a.consultations, show:isSuperAdmin||canDo("reviews"), badge:consultations.filter(c=>c.status==="pending").length},
    {key:"routines",  icon:"📋", label:a.routines, show:canDo("routines")||isSuperAdmin},
    {key:"ab",        icon:"🧪", label:a.abTest, show:isSuperAdmin},
    {key:"brands",    icon:"🏷️", label:a.brands, show:isSuperAdmin},
    {key:"colors",    icon:"🎨", label:a.colors, show:isSuperAdmin},
    {key:"admins",    icon:"👑", label:a.admins, show:isSuperAdmin},
    {key:"users",     icon:"👥", label:a.users, show:isSuperAdmin||canDo("users_view")},
  ];

  if(loading) return <div style={{background:"#080808",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",color:"#c9a96e",fontFamily:"DM Sans,sans-serif"}}>{lang==="ar"?"جاري التحميل...":"Loading..."}</div>;

  if(!user || (!isSuperAdmin && !myPerms)) return (
    <>
      <style>{css}</style>
      <div className="admin-login">
        <div className="login-box">
          <div className="login-title">🔐 Admin Panel</div>
          <div className="login-sub">SkinMatch Egypt — لوحة التحكم</div>
          {loginErr && <div className="err-msg">{loginErr}</div>}
          <div className="field" style={{marginBottom:14,textAlign:"right"}}>
            <label>الإيميل</label>
            <input type="email" placeholder="admin@skinmatch.eg" value={loginForm.email} onChange={e=>setLoginForm(f=>({...f,email:e.target.value}))}/>
          </div>
          <div className="field" style={{marginBottom:20,textAlign:"right"}}>
            <label>الباسورد</label>
            <input type="password" placeholder="••••••••" value={loginForm.password} onChange={e=>setLoginForm(f=>({...f,password:e.target.value}))}/>
          </div>
          <button className="btn-gold" style={{width:"100%"}} onClick={handleLogin}>دخول 🌿</button>
          <button className="back-home" style={{width:"100%",marginTop:12}} onClick={onBack}>← {a.backHome}</button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{css}</style>
      <div className="admin" dir={lang==="ar"?"rtl":"ltr"}>

        {/* NAV */}
        <nav className="admin-nav">
          <div className="admin-logo">Skin<span>Match</span> <span style={{fontSize:12,color:"#5a4a3a"}}>Admin</span></div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <span className={`badge ${isSuperAdmin?"badge-superadmin":"badge-admin"}`}>{isSuperAdmin?"👑 Super Admin":"⚡ Admin"}</span>
            <span style={{fontSize:12,color:"#3a3030"}}>{user.email}</span>
            <button className="back-home" onClick={onBack}>← {a.backHome}</button>
          </div>
        </nav>

        <div className="admin-body">

          {/* SIDEBAR */}
          <aside className="sidebar">
            {sidebarItems.filter(i=>i.show).map(item=>(
              <div key={item.key} className={`sidebar-item ${page===item.key?"active":""}`} onClick={()=>setPage(item.key)}>
                <span className="sidebar-icon">{item.icon}</span>
                {item.label}
                {item.badge > 0 && <span className="sidebar-badge">{item.badge}</span>}
              </div>
            ))}
            <div className="sidebar-divider"/>
            <div className="sidebar-item" onClick={()=>supabase.auth.signOut().then(()=>setUser(null))} style={{color:"#c05050"}}>
              <span className="sidebar-icon">🚪</span>{lang==="ar"?"خروج":"Logout"}
            </div>
          </aside>

          {/* MAIN */}
          <main className="admin-main">

            {/* ══ DASHBOARD ══ */}
            {page==="dashboard" && <>
              <div className="page-title">{lang==="ar"?"أهلاً 👋":"Welcome 👋"}</div>
              <div className="page-sub">{lang==="ar"?"لوحة تحكم SkinMatch Egypt":"SkinMatch Egypt Control Panel"}</div>
              <div className="stats-row">
                <div className="stat-card">
                  <div className="stat-card-num">{products.length}</div>
                  <div className="stat-card-lbl">{lang==="ar"?"منتج في القاعدة":"Products in DB"}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-num">{users.length}</div>
                  <div className="stat-card-lbl">{lang==="ar"?"مستخدم مسجل":"Registered Users"}</div>
                  <div className="stat-card-trend">+{analytics.recentSignups} الشهر ده</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-num">{analytics.totalRoutines}</div>
                  <div className="stat-card-lbl">{lang==="ar"?"روتين اتحفظ":"Saved Routines"}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-num">{pendingReviews.length}</div>
                  <div className="stat-card-lbl">{lang==="ar"?"ريفيو ينتظر Approve":"Reviews Pending"}</div>
                </div>
              </div>

              <div className="form-wrap">
                <div className="form-title">⚡ {lang==="ar"?"وصول سريع":"Quick Access"}</div>
                <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                  {canDo("products_add") && <button className="btn-gold" onClick={()=>setPage("products")}>{lang==="ar"?"➕ أضيفي منتج":"➕ Add Product"}</button>}
                  {canDo("reviews") && pendingReviews.length > 0 && <button className="btn-outline" onClick={()=>setPage("reviews")}>⭐ {pendingReviews.length} {lang==="ar"?"ريفيو ينتظرك":"reviews pending"}</button>}
                  {isSuperAdmin && <button className="btn-outline" onClick={()=>setPage("colors")}>🎨 {lang==="ar"?"غيري الألوان":"Change Colors"}</button>}
                  <button className="btn-outline" onClick={()=>setPage("analytics")}>📈 {a.analytics}</button>
                </div>
              </div>

              <div className="table-wrap">
                <div className="table-header"><div className="table-title">👥 {lang==="ar"?"آخر المستخدمين":"Recent Users"}</div></div>
                <table>
                  <thead><tr><th>{lang==="ar"?"الاسم":"Name"}</th><th>{lang==="ar"?"الإيميل":"Email"}</th><th>{lang==="ar"?"السن":"Age"}</th><th>{lang==="ar"?"تاريخ التسجيل":"Sign Up Date"}</th></tr></thead>
                  <tbody>
                    {users.slice(0,5).map(u=>(<tr key={u.id}><td className="td-name">{u.name||"—"}</td><td className="user-row-email">{u.email}</td><td>{u.age||"—"}</td><td>{new Date(u.created_at).toLocaleDateString(lang==="ar"?"ar-EG":"en-GB")}</td></tr>))}
                    {users.length===0 && <tr><td colSpan={4}><div className="empty"><div className="empty-icon">👥</div>{lang==="ar"?"لسه مفيش مستخدمين":"No users yet"}</div></td></tr>}
                  </tbody>
                </table>
              </div>
            </>}

            {/* ══ ANALYTICS ══ */}
            {page==="analytics" && <>
              <div className="page-title">📈 {a.analytics}</div>
              <div className="page-sub">{lang==="ar"?"أرقام الموقع وأداء المنتجات":"Site stats and product performance"}</div>

              {/* KPIs */}
              <div className="stats-row" style={{gridTemplateColumns:"repeat(4,1fr)",marginBottom:24}}>
                <div className="stat-card"><div className="stat-card-num">{users.length}</div><div className="stat-card-lbl">{a.totalUsers}</div><div className="stat-card-trend">+{analytics.recentSignups} {lang==="ar"?"الشهر ده":"this month"}</div></div>
                <div className="stat-card"><div className="stat-card-num">{analytics.totalRoutines}</div><div className="stat-card-lbl">{lang==="ar"?"روتين اتحفظ":"Saved Routines"}</div><div className="stat-card-trend">+{analytics.routinesThisMonth||0} {lang==="ar"?"الشهر ده":"this month"}</div></div>
                <div className="stat-card"><div className="stat-card-num">{analytics.totalReviews||0}</div><div className="stat-card-lbl">{a.totalReviews}</div><div className="stat-card-trend">{analytics.pendingReviewsCount||0} {lang==="ar"?"ينتظر Approve":"pending"}</div></div>
                <div className="stat-card"><div className="stat-card-num">{users.length>0?Math.round((analytics.usersWithRoutines||0)/users.length*100):0}%</div><div className="stat-card-lbl">{a.savedRoutine}</div><div className="stat-card-trend">{analytics.usersWithRoutines||0} {lang==="ar"?"من":"of"} {users.length}</div></div>
              </div>

              {/* Engagement */}
              <div className="form-wrap" style={{marginBottom:16}}>
                <div className="form-title">💡 {a.engagement}</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
                  {[
                    {label:a.savedRoutine,  val:analytics.usersWithRoutines||0,  icon:"💾", color:"#c9a96e"},
                    {label:a.wroteReview,   val:analytics.usersWithReviews||0,   icon:"⭐", color:"#f1c40f"},
                    {label:a.noAction,      val:users.length-(analytics.usersWithRoutines||0), icon:"😴", color:"#3a3030"},
                  ].map((s,i)=>(
                    <div key={i} style={{padding:"16px",background:"#111",borderRadius:8,textAlign:"center"}}>
                      <div style={{fontSize:28,marginBottom:6}}>{s.icon}</div>
                      <div style={{fontFamily:"Playfair Display,serif",fontSize:26,color:s.color}}>{s.val}</div>
                      <div style={{fontSize:11,color:"#3a3030",marginTop:4}}>{s.label}</div>
                      {users.length>0 && <div style={{fontSize:11,color:"#5a4a3a",marginTop:2}}>{Math.round(s.val/users.length*100)}%</div>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Age groups */}
              <div className="form-wrap" style={{marginBottom:16}}>
                <div className="form-title">🎂 {a.ageGroups}</div>
                {!analytics.ageGroups
                  ? <div style={{color:"#3a3030",fontSize:13}}>{lang==="ar"?"لسه مفيش بيانات كافية":"Not enough data yet"}</div>
                  : Object.entries(analytics.ageGroups).map(([label, count])=>{
                    const maxAge = Math.max(...Object.values(analytics.ageGroups));
                    // استخدم مجموع الـ ageGroups مش users.length عشان يكون دقيق
                    const totalInGroups = Object.values(analytics.ageGroups).reduce((s,v)=>s+v,0);
                    const pct = totalInGroups > 0 ? Math.round((count/totalInGroups)*100) : 0;
                    return (
                      <div key={label} className="chart-bar-wrap">
                        <div className="chart-bar-label">
                          <span>{label}</span>
                          <span>{count} ({pct}%)</span>
                        </div>
                        <div className="chart-bar-bg">
                          <div className="chart-bar-fill" style={{width:maxAge>0?`${(count/maxAge)*100}%`:"0%"}}/>
                        </div>
                      </div>
                    );
                  })
                }
              </div>

              {/* Top Products */}
              <div className="form-wrap" style={{marginBottom:16}}>
                <div className="form-title">🏆 {lang==="ar"?"أكتر المنتجات ظهوراً في الروتينات":"Top Products in Routines"}</div>
                {topProductsList.length === 0
                  ? <div style={{color:"#3a3030",fontSize:13}}>{lang==="ar"?"لسه مفيش بيانات — لما البنات يحفظوا روتينات هتظهر هنا":"No data yet — will show once users save routines"}</div>
                  : topProductsList.map((p,i)=>(
                    <div key={p.id} className="chart-bar-wrap">
                      <div className="chart-bar-label">
                        <span>{i+1}. {p.name}</span>
                        <span>{p.count} {lang==="ar"?"مرة":"times"}</span>
                      </div>
                      <div className="chart-bar-bg">
                        <div className="chart-bar-fill" style={{width:`${(p.count/maxCount)*100}%`}}/>
                      </div>
                    </div>
                  ))
                }
              </div>

              {/* Reviews breakdown */}
              <div className="form-wrap">
                <div className="form-title">⭐ {a.reviews}</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
                  {[
                    {label:a.totalReviews,    val:analytics.totalReviews||0,       color:"#c9a96e"},
                    {label:a.approvedReviews, val:approvedReviews.length,           color:"#2ecc71"},
                    {label:a.pendingReviews,  val:analytics.pendingReviewsCount||0, color:"#f1c40f"},
                  ].map((s,i)=>(
                    <div key={i} style={{padding:"16px",background:"#111",borderRadius:8,textAlign:"center"}}>
                      <div style={{fontFamily:"Playfair Display,serif",fontSize:26,color:s.color}}>{s.val}</div>
                      <div style={{fontSize:11,color:"#3a3030",marginTop:4}}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>}

            {/* ══ PRODUCTS ══ */}
            {page==="products" && <>
              <div className="page-title">🧴 {a.products}</div>
              <div className="page-sub">{lang==="ar"?"إضافة وتعديل المنتجات":"Add and edit products"}</div>

              {canDo("products_add") && <div className="form-wrap">
                <div className="form-title">{editing?`✏️ ${a.editProduct}`:`➕ ${a.addProduct}`}</div>
                {msg.text && <div className={msg.type==="err"?"err-msg":"ok-msg"}>{msg.text}</div>}
                <div className="form-grid">
                  <div className="field"><label>ID *</label><input placeholder="e.g. c15" value={form.id} onChange={e=>setForm(f=>({...f,id:e.target.value}))} disabled={editing}/></div>
                  <div className="field"><label>{a.productName} *</label><input placeholder={lang==="ar"?"اسم المنتج كامل":"Full product name"} value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></div>
                  <div className="field"><label>{a.brandLabel} *</label><input placeholder="SESH" value={form.brand} onChange={e=>setForm(f=>({...f,brand:e.target.value}))}/></div>
                  <div className="field"><label>{a.typeLabel}</label><select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}><option value="cleanser">{lang==="ar"?"غسول":"Cleanser"}</option><option value="toner">{lang==="ar"?"تونر":"Toner"}</option><option value="serum">{lang==="ar"?"سيروم":"Serum"}</option><option value="moisturizer">{lang==="ar"?"مرطب":"Moisturizer"}</option><option value="sunscreen">{lang==="ar"?"واقي شمس":"Sunscreen"}</option><option value="mask">{lang==="ar"?"ماسك":"Mask"}</option><option value="makeup_remover">{lang==="ar"?"مزيل مكياج":"Makeup Remover"}</option><option value="body_moisturizer">{lang==="ar"?"مرطب جسم":"Body Moisturizer"}</option><option value="eye_cream">{lang==="ar"?"كريم عيون":"Eye Cream"}</option><option value="exfoliator">{lang==="ar"?"مقشر":"Exfoliator"}</option><option value="spot_treatment">{lang==="ar"?"علاج موضعي":"Spot Treatment"}</option><option value="oil">{lang==="ar"?"زيت":"Oil"}</option></select></div>
                  <div className="field"><label>{a.priceLabel} *</label><input type="number" placeholder="350" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))}/></div>
                  <div className="field"><label>{lang==="ar"?"السعر الأصلي (قبل الخصم)":"Original Price (before discount)"}</label><input type="number" placeholder={lang==="ar"?"مثال: 450":"e.g. 450"} value={form.original_price||""} onChange={e=>setForm(f=>({...f,original_price:e.target.value}))}/></div>
                  <div className="field"><label>{a.skinLabel}</label><input placeholder="oily, dry, sensitive" value={form.skin} onChange={e=>setForm(f=>({...f,skin:e.target.value}))}/></div>
                  <div className="field"><label>{a.concernsLabel}</label><input placeholder="acne, brightening" value={form.concerns} onChange={e=>setForm(f=>({...f,concerns:e.target.value}))}/></div>
                  <div className="field"><label>{a.whereLabel}</label><input placeholder={lang==="ar"?"نون، أمازون":"Noon, Amazon"} value={form.where_to_buy} onChange={e=>setForm(f=>({...f,where_to_buy:e.target.value}))}/></div>
                  <div className="field"><label>🔗 {a.linkLabel}</label><input placeholder="https://noon.com/..." value={form.link} onChange={e=>setForm(f=>({...f,link:e.target.value}))}/></div>
                  <div className="field form-full"><label>🖼️ {a.imageLabel}</label><input placeholder="https://example.com/product.jpg" value={form.image_url||""} onChange={e=>setForm(f=>({...f,image_url:e.target.value}))}/>{form.image_url && <img src={form.image_url} alt="" style={{width:80,height:80,objectFit:"contain",marginTop:8,borderRadius:6,border:"1px solid rgba(255,255,255,0.08)",background:"#111"}} onError={e=>e.target.style.display="none"}/>}</div>
                  <div className="field form-full"><label>{a.ingredientsLabel}</label><input placeholder="Niacinamide, HA, Vitamin C" value={form.ingredients} onChange={e=>setForm(f=>({...f,ingredients:e.target.value}))}/></div>
                  <div className="field form-full"><label>{a.noteLabel}</label><textarea placeholder={lang==="ar"?"ملاحظة عن المنتج":"Note about the product"} value={form.note} onChange={e=>setForm(f=>({...f,note:e.target.value}))}/></div>
                  <div className="field form-full"><label>📋 {a.doctorNoteLabel}</label><textarea placeholder={lang==="ar"?"مثال: مناسب للبشرة الحساسة...":"e.g. Suitable for sensitive skin..."} value={form.doctor_note||""} onChange={e=>setForm(f=>({...f,doctor_note:e.target.value}))} style={{minHeight:70}}/></div>
                  <div className="field" style={{display:"flex",alignItems:"center",gap:12}}>
                    <label style={{margin:0}}>🏷️ {a.saleCheck}</label>
                    <input type="checkbox" checked={!!form.on_sale} onChange={e=>setForm(f=>({...f,on_sale:e.target.checked}))} style={{width:18,height:18,accentColor:"#c9a96e",cursor:"pointer"}}/>
                  </div>
                  {form.on_sale && <>
                    <div className="field">
                      <label>{a.saleLabelField} {lang==="ar"?"(اختياري — هنحسبه تلقائي لو حطيتي السعر الأصلي)":"(optional — auto-calculated if original price set)"}</label>
                      <input
                        placeholder={lang==="ar"?"خصم 20%":"20% Off"}
                        value={form.sale_label||(()=>{
                          const orig=parseInt(form.original_price);
                          const curr=parseInt(form.price);
                          if(orig>0&&curr>0&&orig>curr){
                            const pct=Math.round((orig-curr)/orig*100);
                            return lang==="ar"?`خصم ${pct}%`:`${pct}% Off`;
                          }
                          return "";
                        })()}
                        onChange={e=>setForm(f=>({...f,sale_label:e.target.value}))}
                      />
                      {/* Auto-discount preview */}
                      {(()=>{
                        const orig=parseInt(form.original_price);
                        const curr=parseInt(form.price);
                        if(orig>0&&curr>0&&orig>curr){
                          const pct=Math.round((orig-curr)/orig*100);
                          const saved=orig-curr;
                          return (
                            <div style={{marginTop:8,padding:"8px 12px",background:"rgba(46,204,113,0.08)",border:"1px solid rgba(46,204,113,0.2)",borderRadius:6,fontSize:12,color:"#2ecc71",display:"flex",gap:16}}>
                              <span>💰 {lang==="ar"?"نسبة الخصم":"Discount"}: <strong>{pct}%</strong></span>
                              <span>{lang==="ar"?"توفير":"Saving"}: <strong>{saved.toLocaleString()} {a.currency}</strong></span>
                              <button
                                type="button"
                                style={{background:"rgba(46,204,113,0.15)",border:"1px solid rgba(46,204,113,0.3)",color:"#2ecc71",borderRadius:4,padding:"2px 10px",cursor:"pointer",fontSize:11}}
                                onClick={()=>setForm(f=>({...f,sale_label:lang==="ar"?`خصم ${pct}%`:`${pct}% Off`}))}
                              >{lang==="ar"?"اكتبي أوتوماتيك":"Auto-fill"}</button>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  </>}
                </div>
                <div className="form-actions">
                  <button className="btn-gold" onClick={handleSaveProduct}>{editing?`💾 ${a.saveEdit}`:`➕ ${a.addBtn}`}</button>
                  {editing && <button className="btn-outline" onClick={handleCancelEdit}>{a.cancelBtn}</button>}
                </div>
              </div>}

              <div className="table-wrap">
                <div className="table-header">
                  <div className="table-title">{a.allProducts} ({products.length})</div>
                  <input className="search-input" placeholder={`🔍 ${a.searchPlaceholder}`} value={search} onChange={e=>setSearch(e.target.value)}/>
                </div>
                <table>
                  <thead><tr><th>{lang==="ar"?"المنتج":"Product"}</th><th>{a.brandLabel}</th><th>{a.typeLabel}</th><th>{lang==="ar"?"السعر":"Price"}</th><th>Affiliate</th><th>{lang==="ar"?"إجراءات":"Actions"}</th></tr></thead>
                  <tbody>
                    {filtered.map(p=>(
                      <tr key={p.id}>
                        <td className="td-name" style={{maxWidth:180}}>{p.name}</td>
                        <td className="td-brand">{p.brand}</td>
                        <td><span className={`badge ${TYPE_BADGES[p.type]||""}`}>{TYPE_LABELS[p.type]||p.type}</span></td>
                        <td className="td-price">{p.price?.toLocaleString()} {a.currency}</td>
                        <td><a href={p.link} target="_blank" rel="noreferrer" style={{color:"#c9a96e",fontSize:11,textDecoration:"underline"}}>{p.link?"🔗 Link":"—"}</a></td>
                        <td><div className="td-actions">
                          {canDo("products_edit") && <button className="btn-edit" onClick={()=>handleEdit(p)}>✏️</button>}
                          {isSuperAdmin && <button className="btn-danger" onClick={()=>handleDelete(p.id)}>🗑️</button>}
                        </div></td>
                      </tr>
                    ))}
                    {filtered.length===0 && <tr><td colSpan={6}><div className="empty"><div className="empty-icon">🧴</div>{search?lang==="ar"?"مفيش نتايج":"No results":lang==="ar"?"مفيش منتجات!":"No products!"}</div></td></tr>}
                  </tbody>
                </table>
              </div>
            </>}

            {/* ══ REVIEWS ══ */}
            {page==="reviews" && <>
              <div className="page-title">⭐ {a.reviews}</div>
              <div className="page-sub">{lang==="ar"?"موافقة أو رفض الريفيوز":"Approve or reject reviews"}</div>

              {pendingReviews.length > 0 && <>
                <div style={{fontSize:15,fontWeight:500,marginBottom:16,color:"#f1c40f"}}>⏳ {a.pendingReviews} ({pendingReviews.length})</div>
                {pendingReviews.map(r=>(
                  <div key={r.id} className="review-card">
                    <div className="review-card-header">
                      <div>
                        <div className="review-card-user">👤 {r.user_name || lang==="ar"?"مجهول":"Anonymous"}</div>
                        <div className="review-card-product">🧴 {products.find(p=>p.id===r.product_id)?.name || r.product_id}</div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div className="review-card-date">{new Date(r.created_at).toLocaleDateString(lang==="ar"?"ar-EG":"en-GB")}</div>
                        <span className="badge badge-pending">{a.pending}</span>
                      </div>
                    </div>
                    <div className="review-stars">{"⭐".repeat(r.rating||5)}</div>
                    <div className="review-card-text">{r.text}</div>
                    <div className="review-actions">
                      <button className="btn-approve" onClick={()=>handleApproveReview(r.id)}>✅ {a.approveBtn}</button>
                      <button className="btn-danger" onClick={()=>handleDeleteReview(r.id)}>🗑️ {a.deleteBtn}</button>
                    </div>
                  </div>
                ))}
                <div className="divider"/>
              </>}

              <div style={{fontSize:15,fontWeight:500,marginBottom:16,color:"#2ecc71"}}>✅ {a.approvedReviews} ({approvedReviews.length})</div>
              {approvedReviews.length === 0
                ? <div className="empty"><div className="empty-icon">⭐</div>{lang==="ar"?"لسه مفيش ريفيوز معتمدة":"No approved reviews yet"}</div>
                : approvedReviews.map(r=>(
                  <div key={r.id} className="review-card">
                    <div className="review-card-header">
                      <div>
                        <div className="review-card-user">👤 {r.user_name || lang==="ar"?"مجهول":"Anonymous"}</div>
                        <div className="review-card-product">🧴 {products.find(p=>p.id===r.product_id)?.name || r.product_id}</div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div className="review-card-date">{new Date(r.created_at).toLocaleDateString(lang==="ar"?"ar-EG":"en-GB")}</div>
                        <span className="badge badge-approved">✅ {a.approvedReviews}</span>
                      </div>
                    </div>
                    <div className="review-stars">{"⭐".repeat(r.rating||5)}</div>
                    <div className="review-card-text">{r.text}</div>
                    <div className="review-actions">
                      <button className="btn-danger" onClick={()=>handleDeleteReview(r.id)}>🗑️ {a.deleteBtn}</button>
                    </div>
                  </div>
                ))
              }
            </>}

            {/* ══ ROUTINES ══ */}
            {page==="routines" && <>
              <div className="page-title">📋 {a.routines}</div>
              <div className="page-sub">{lang==="ar"?"عدلي الروتينات الجاهزة — أضيفي أو شيلي منتجات":"Edit ready-made routines — add or remove products"}</div>

              <div className="mode-tabs">
                <button className={`mode-tab ${routineMode==="skin"?"active":""}`} onClick={()=>{setRoutineMode("skin");setSelectedRoutine(null);}}>💧 {lang==="ar"?"نوع البشرة":"Skin Type"}</button>
                <button className={`mode-tab ${routineMode==="concern"?"active":""}`} onClick={()=>{setRoutineMode("concern");setSelectedRoutine(null);}}>🎯 {lang==="ar"?"الكونسيرن":"Concern"}</button>
              </div>

              <div className="routine-grid">
                {(routineMode==="skin"?SKIN_CATEGORIES:CONCERN_CATEGORIES).map(cat=>(
                  ["budget","mid","premium"].map(bud=>{
                    const found = curatedRoutines.find(r=>r.mode===routineMode&&r.category===cat&&r.budget===bud);
                    const isSelected = selectedRoutine?.category===cat && selectedRoutine?.budget===bud && selectedRoutine?.mode===routineMode;
                    return (
                      <div key={`${cat}-${bud}`} className={`routine-tab ${isSelected?"active":""}`} onClick={()=>openRoutineEditor(routineMode,cat,bud)}>
                        <div className="routine-tab-label">{CATEGORY_LABELS[cat]}</div>
                        <div className="routine-tab-budget">{BUDGET_LABELS[bud]}</div>
                        <div style={{fontSize:11,color:found?"#2ecc71":"#c05050",marginTop:4}}>{found?`${found.steps?.length||0} ${lang==="ar"?"خطوات":"steps"}`:lang==="ar"?"فارغ":"empty"}</div>
                      </div>
                    );
                  })
                ))}
              </div>

              {selectedRoutine && <div className="routine-editor">
                <div className="routine-editor-title">
                  ✏️ {CATEGORY_LABELS[selectedRoutine.category]} — {BUDGET_LABELS[selectedRoutine.budget]}
                </div>

                {editingSteps.length === 0
                  ? <div style={{color:"#3a3030",fontSize:13,marginBottom:16}}>{lang==="ar"?"مفيش خطوات — أضيفي من تحت":"No steps yet — add below"}</div>
                  : editingSteps.map((step,i)=>(
                    <div key={i} className="step-row">
                      <div>
                        <select value={step.label} onChange={e=>{ const arr=[...editingSteps]; arr[i]={...arr[i],label:e.target.value}; setEditingSteps(arr); }}>
                          {STEP_LABELS.map(l=><option key={l} value={l}>{l}</option>)}
                        </select>
                      </div>
                      <select value={step.product_id} onChange={e=>{ const arr=[...editingSteps]; arr[i]={...arr[i],product_id:e.target.value}; setEditingSteps(arr); }}>
                        {products.map(p=><option key={p.id} value={p.id}>{p.name} — {p.price} {a.currency}</option>)}
                      </select>
                      <div style={{display:"flex",flexDirection:"column",gap:2}}>
                        <button style={{background:"none",border:"none",color:"#5a4a3a",cursor:"pointer",fontSize:12,padding:"2px"}} onClick={()=>moveStep(i,-1)}>▲</button>
                        <button className="step-remove" onClick={()=>removeStep(i)}>×</button>
                        <button style={{background:"none",border:"none",color:"#5a4a3a",cursor:"pointer",fontSize:12,padding:"2px"}} onClick={()=>moveStep(i,1)}>▼</button>
                      </div>
                    </div>
                  ))
                }

                <div className="add-step-row">
                  <select value={newStepLabel} onChange={e=>setNewStepLabel(e.target.value)}>
                    {STEP_LABELS.map(l=><option key={l} value={l}>{l}</option>)}
                  </select>
                  <select value={newStepProduct} onChange={e=>setNewStepProduct(e.target.value)} style={{flex:2}}>
                    <option value="">{lang==="ar"?"— اختاري منتج —":"— Select a product —"}</option>
                    {products.map(p=><option key={p.id} value={p.id}>{p.name} ({p.brand}) — {p.price} {a.currency}</option>)}
                  </select>
                  <button className="btn-outline" onClick={addStep}>➕ {lang==="ar"?"أضيفي":"Add"}</button>
                </div>

                <div className="total-edit">
                  <label>{lang==="ar"?"الإجمالي (ج)":"Total (EGP)"}</label>
                  <input type="number" value={editingTotal} onChange={e=>setEditingTotal(e.target.value)} placeholder="0"/>
                  <button className="btn-outline btn-sm" onClick={()=>{ const sum = editingSteps.reduce((acc,s)=>{ const p=products.find(x=>x.id===s.product_id); return acc+(p?.price||0); },0); setEditingTotal(sum); }}>
                    {lang==="ar"?"احسبي أوتوماتيك":"Auto-calculate"}
                  </button>
                </div>

                <div style={{marginTop:20}}>
                  <div style={{fontSize:11,color:"#5a4a3a",textTransform:"uppercase",letterSpacing:"1px",marginBottom:8}}>{lang==="ar"?"📋 ملاحظات الاستخدام (من الطبيبة)":"📋 Usage Notes (Doctor)"}</div>
                  <textarea
                    value={editingNotes}
                    onChange={e=>setEditingNotes(e.target.value)}
                    placeholder={lang==="ar"?"مثال: استخدمي الـ Retinol مرة في الأسبوع في البداية...":"e.g. Start using Retinol once a week..."}
                    style={{width:"100%",minHeight:90,padding:"12px 14px",background:"#111",border:"1px solid rgba(255,255,255,0.07)",borderRadius:4,color:"#f5f0eb",fontSize:13,fontFamily:"DM Sans,sans-serif",outline:"none",resize:"vertical",boxSizing:"border-box"}}
                  />
                  <div style={{fontSize:11,color:"#3a3030",marginTop:6}}>{lang==="ar"?"💡 هتظهر للبنت في صفحة الروتين المحفوظ":"💡 Will appear in user's saved routine page"}</div>
                </div>

                <div style={{marginTop:20,display:"flex",gap:10}}>
                  <button className="btn-gold" onClick={saveRoutineEdit}>💾 {lang==="ar"?"حفظ الروتين":"Save Routine"}</button>
                  <button className="btn-outline" onClick={()=>setSelectedRoutine(null)}>{a.cancelBtn}</button>
                </div>
              </div>}
            </>}

            {/* ══ BRANDS ══ */}
            {page==="brands" && isSuperAdmin && <>
              <div className="page-title">🏷️ {a.brands} — Promote</div>
              <div className="page-sub">{lang==="ar"?"اختاري براند وعدلي الـ Boost Score على مستوى البراند أو كل منتج":"Choose a brand and edit the Boost Score at brand or product level"}</div>

              <div className="info-box" style={{marginBottom:24}}>
                💡 <strong>{lang==="ar"?"إزاي بيشتغل:":"How it works:"}</strong> {lang==="ar"?"Score من 0 لـ 10 — المنتج الأعلى score بيتفضل في الروتين أوتوماتيك.":"Score from 0 to 10 — highest score product is preferred in the routine automatically."}
              </div>

              <div className="form-wrap" style={{marginBottom:24}}>
                <div className="field">
                  <label>{lang==="ar"?"اختاري البراند":"Select Brand"}</label>
                  <select
                    value={selectedBrandPage||""}
                    onChange={e=>setSelectedBrandPage(e.target.value)}
                    style={{maxWidth:320}}
                  >
                    <option value="">{lang==="ar"?"— اختاري براند —":"— Select a brand —"}</option>
                    {[...new Set(products.map(p=>p.brand))].sort().map(b=>{
                      const bp = products.filter(p=>p.brand===b);
                      const maxB = Math.max(...bp.map(p=>p.boost_score||0));
                      return <option key={b} value={b}>{b} ({bp.length} {lang==="ar"?"منتج":"products"}){maxB>0?" 🔥":""}</option>;
                    })}
                  </select>
                </div>
              </div>

              {selectedBrandPage && (()=>{
                const bp = products.filter(p=>p.brand===selectedBrandPage);
                const brandMaxBoost = bp.length > 0 ? Math.max(...bp.map(p=>p.boost_score||0)) : 0;
                return <>
                  <div className="form-wrap" style={{marginBottom:20,border:"1px solid rgba(201,169,110,0.2)"}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:10}}>
                      <div>
                        <div style={{fontFamily:"Playfair Display,serif",fontSize:20,color:"#f5f0eb",marginBottom:4}}>{selectedBrandPage}</div>
                        <div style={{fontSize:12,color:"#5a4a3a"}}>{bp.length} {lang==="ar"?"منتج":"products"}</div>
                      </div>
                      {brandMaxBoost > 0 && <span style={{padding:"6px 16px",background:"rgba(201,169,110,0.1)",border:"1px solid rgba(201,169,110,0.3)",borderRadius:20,fontSize:13,color:"#c9a96e"}}>🔥 Promoted — Score {brandMaxBoost}</span>}
                    </div>
                    <div style={{fontSize:12,color:"#5a4a3a",marginBottom:10,textTransform:"uppercase",letterSpacing:"1px"}}>Boost Score {lang==="ar"?"للبراند كله":"for all brand"}</div>
                    <div style={{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
                      <input type="range" min="0" max="10" step="1"
                        value={brandMaxBoost}
                        style={{flex:1,maxWidth:300,accentColor:"#c9a96e"}}
                        onChange={async(e)=>{
                          const val = parseInt(e.target.value);
                          for(const p of bp){ await supabase.from("products").update({boost_score:val}).eq("id",p.id); }
                          loadProducts();
                        }}
                      />
                      <span style={{fontFamily:"Playfair Display,serif",fontSize:22,color:brandMaxBoost>0?"#c9a96e":"#3a3030",minWidth:28}}>{brandMaxBoost}</span>
                      <div style={{display:"flex",gap:8}}>
                        {[0,3,5,8,10].map(v=>(
                          <button key={v} className={`btn-outline btn-sm`}
                            style={{padding:"5px 12px",fontSize:12,background:brandMaxBoost===v?"rgba(201,169,110,0.15)":"transparent"}}
                            onClick={async()=>{
                              for(const p of bp){ await supabase.from("products").update({boost_score:v}).eq("id",p.id); }
                              loadProducts();
                            }}>{v}</button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="table-wrap">
                    <div className="table-header"><div className="table-title">{lang==="ar"?"منتجات":"Products"} {selectedBrandPage}</div></div>
                    <table>
                      <thead><tr>
                        <th>المنتج</th>
                        <th>النوع</th>
                        <th>السعر</th>
                        <th style={{textAlign:"center",width:220}}>Boost Score</th>
                      </tr></thead>
                      <tbody>
                        {bp.map(p=>(
                          <tr key={p.id}>
                            <td className="td-name">{p.name}</td>
                            <td><span className={`badge ${TYPE_BADGES[p.type]||""}`}>{TYPE_LABELS[p.type]||p.type}</span></td>
                            <td className="td-price">{p.price?.toLocaleString()} ج</td>
                            <td style={{padding:"10px 16px"}}>
                              <div style={{display:"flex",alignItems:"center",gap:10,justifyContent:"center"}}>
                                <input type="range" min="0" max="10" step="1"
                                  value={p.boost_score||0}
                                  style={{flex:1,accentColor:"#c9a96e"}}
                                  onChange={async(e)=>{
                                    await supabase.from("products").update({boost_score:parseInt(e.target.value)}).eq("id",p.id);
                                    loadProducts();
                                  }}
                                />
                                <span style={{minWidth:24,textAlign:"center",fontFamily:"Playfair Display,serif",fontSize:16,color:(p.boost_score||0)>0?"#c9a96e":"#3a3030"}}>{p.boost_score||0}</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>;
              })()}
            </>}

            {/* ══ COLORS ══ */}
            {page==="colors" && isSuperAdmin && <>
              <div className="page-title">🎨 ألوان الموقع</div>
              <div className="page-sub">غيري ألوان الموقع — التغيير فوري</div>
              <div className="colors-grid">
                {[{key:"primary",label:"الذهبي الأساسي"},{key:"background",label:"الخلفية"},{key:"text",label:"النص"},{key:"accent",label:"المكمل"}].map(({key,label})=>(
                  <div key={key} className="color-card">
                    <div className="color-card-label">{label}</div>
                    <div className="color-preview" style={{background:colors[key]}}/>
                    <div className="color-input-row">
                      <input type="color" value={colors[key]} onChange={e=>setColors(c=>({...c,[key]:e.target.value}))}/>
                      <input type="text" value={colors[key]} onChange={e=>setColors(c=>({...c,[key]:e.target.value}))}/>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn-gold" onClick={handleSaveColors}>💾 حفظ الألوان</button>
            </>}

            {/* ══ ADMINS ══ */}
            {page==="admins" && isSuperAdmin && <>
              <div className="page-title">👑 إدارة الأدمنز</div>
              <div className="page-sub">أضيفي أدمنز وتحكمي في صلاحياتهم</div>

              <div className="form-wrap">
                <div className="form-title">➕ إضافة أدمن جديد</div>
                {adminMsg.text && <div className={adminMsg.type==="err"?"err-msg":"ok-msg"}>{adminMsg.text}</div>}
                <div className="form-grid-2" style={{marginBottom:16}}>
                  <div className="field"><label>إيميل الأدمن *</label><input type="email" placeholder="admin@example.com" value={adminForm.email} onChange={e=>setAdminForm(f=>({...f,email:e.target.value}))}/></div>
                </div>
                <div style={{fontSize:12,color:"#5a4a3a",textTransform:"uppercase",letterSpacing:"1px",marginBottom:10}}>الصلاحيات</div>
                <div className="permissions-grid">
                  {PERMISSIONS.map(p=>(
                    <div key={p.key} className={`perm-tag ${adminForm.permissions[p.key]?"on":""}`} style={{cursor:"pointer"}} onClick={()=>setAdminForm(f=>({...f,permissions:{...f.permissions,[p.key]:!f.permissions[p.key]}}))}>
                      {adminForm.permissions[p.key]?"✅":"○"} {p.label}
                    </div>
                  ))}
                </div>
                <div className="form-actions">
                  <button className="btn-gold" onClick={handleAddAdmin}>➕ إضافة أدمن</button>
                </div>
                <div className="info-box">💡 الأدمن محتاج يكون عنده حساب على الموقع الأول — بعدين هيقدر يدخل Admin Panel بإيميله وباسورده</div>
              </div>

              <div style={{fontSize:15,fontWeight:500,marginBottom:16}}>الأدمنز الحاليين ({admins.length})</div>
              {admins.length === 0
                ? <div className="empty"><div className="empty-icon">👑</div>لسه مفيش أدمنز مضافين</div>
                : admins.map(a=>(
                  <div key={a.id} className="admin-card">
                    <div className="admin-card-info">
                      <div className="admin-card-email">{a.email}</div>
                      <div className="admin-card-limits">تاريخ الإضافة: {new Date(a.created_at).toLocaleDateString("ar-EG")}</div>
                      <div className="permissions-grid">
                        {PERMISSIONS.map(p=>(
                          <div key={p.key} className={`perm-tag ${a.permissions?.[p.key]?"on":""}`}>{a.permissions?.[p.key]?"✅":"○"} {p.label}</div>
                        ))}
                      </div>
                    </div>
                    <button className="btn-danger" onClick={()=>handleDeleteAdmin(a.id)}>🗑️ حذف</button>
                  </div>
                ))
              }
            </>}

            {/* ══ USERS ══ */}
            {page==="users" && <>
              <div className="page-title">👥 المستخدمين</div>
              <div className="page-sub">كل البنات المسجلين</div>
              <div className="stats-row" style={{gridTemplateColumns:"repeat(3,1fr)"}}>
                <div className="stat-card"><div className="stat-card-num">{users.length}</div><div className="stat-card-lbl">إجمالي</div></div>
                <div className="stat-card"><div className="stat-card-num">{users.filter(u=>u.age).length}</div><div className="stat-card-lbl">حددوا سنهم</div></div>
                <div className="stat-card"><div className="stat-card-num">{analytics.recentSignups}</div><div className="stat-card-lbl">الشهر الحالي</div></div>
              </div>
              <div className="table-wrap">
                <div className="table-header">
                  <div className="table-title">قائمة المستخدمين</div>
                  <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
                    <input className="search-input" placeholder="🔍 ابحثي..." value={search} onChange={e=>setSearch(e.target.value)}/>
                    <button className="btn-gold" style={{padding:"8px 18px",fontSize:12,whiteSpace:"nowrap"}} onClick={exportUsersCSV}>📥 Export Excel</button>
                  </div>
                </div>
                <table>
                  <thead><tr><th>الاسم</th><th>الإيميل</th><th>الموبايل</th><th>السن</th><th>تاريخ التسجيل</th><th></th></tr></thead>
                  <tbody>
                    {users.filter(u=>u.name?.includes(search)||u.email?.includes(search)).map(u=>(
                      <tr key={u.id}>
                        <td className="td-name">{u.name||"—"}</td>
                        <td className="user-row-email">{u.email}</td>
                        <td style={{fontSize:12,color:"#7a6a5a"}}>{u.phone||"—"}</td>
                        <td>{u.age||"—"}</td>
                        <td>{new Date(u.created_at).toLocaleDateString("ar-EG")}</td>
                        <td>
                          <button
                            onClick={()=>handleDeleteUser(u.id, u.email)}
                            style={{background:"rgba(192,57,43,0.12)",color:"#e74c3c",border:"1px solid rgba(192,57,43,0.3)",borderRadius:6,padding:"4px 10px",fontSize:12,cursor:"pointer"}}
                            title={lang==="ar"?"مسح اليوزر":"Delete user"}
                          >🗑️</button>
                        </td>
                      </tr>
                    ))}
                    {users.length===0 && <tr><td colSpan={6}><div className="empty"><div className="empty-icon">👥</div>لسه مفيش مستخدمين</div></td></tr>}
                  </tbody>
                </table>
              </div>
            </>}

            {/* ══ A/B TESTING ══ */}
            {page==="ab" && isSuperAdmin && <>
              <div className="page-title">🧪 A/B Testing</div>
              <div className="page-sub">اختبري منتجين في نفس الخطوة وشوفي أيهم أحسن</div>

              <div className="info-box" style={{marginBottom:24}}>
                💡 نص البنات يشوفوا منتج A ونص يشوفوا منتج B — بعد الـ Date Range تشوفي أيهم اتحفظ أكتر في الروتينات
              </div>

              {/* New Test Form */}
              <div className="form-wrap">
                <div className="form-title">➕ Test جديد</div>
                {abMsg.text && <div className={abMsg.type==="err"?"err-msg":"ok-msg"}>{abMsg.text}</div>}
                <div className="form-grid">
                  <div className="field form-full"><label>اسم الـ Test</label><input placeholder='مثال: "SESH vs COSRX Serum — مارس"' value={abForm.name} onChange={e=>setAbForm(f=>({...f,name:e.target.value}))}/></div>
                  <div className="field">
                    <label>الروتين</label>
                    <select value={abForm.routine_id} onChange={e=>setAbForm(f=>({...f,routine_id:e.target.value}))}>
                      <option value="">— اختاري —</option>
                      {curatedRoutines.map(r=><option key={r.id} value={r.id}>{CATEGORY_LABELS[r.category]||r.category} — {r.budget} ({r.mode})</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label>رقم الخطوة (من 0)</label>
                    <input type="number" min="0" max="10" value={abForm.step_index} onChange={e=>setAbForm(f=>({...f,step_index:e.target.value}))} placeholder="0"/>
                  </div>
                  <div className="field">
                    <label>منتج A</label>
                    <select value={abForm.product_a} onChange={e=>setAbForm(f=>({...f,product_a:e.target.value}))}>
                      <option value="">— اختاري —</option>
                      {products.map(p=><option key={p.id} value={p.id}>{p.name} ({p.brand})</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label>منتج B</label>
                    <select value={abForm.product_b} onChange={e=>setAbForm(f=>({...f,product_b:e.target.value}))}>
                      <option value="">— اختاري —</option>
                      {products.map(p=><option key={p.id} value={p.id}>{p.name} ({p.brand})</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label>تاريخ البداية</label>
                    <input type="date" value={abForm.start_date} onChange={e=>setAbForm(f=>({...f,start_date:e.target.value}))}/>
                  </div>
                  <div className="field">
                    <label>تاريخ النهاية</label>
                    <input type="date" value={abForm.end_date} onChange={e=>setAbForm(f=>({...f,end_date:e.target.value}))}/>
                  </div>
                </div>
                <div className="form-actions">
                  <button className="btn-gold" onClick={handleSaveAbTest}>🧪 ابدأي الـ Test</button>
                </div>
              </div>

              {/* Active Tests */}
              <div style={{fontSize:15,fontWeight:500,marginBottom:16}}>الـ Tests الحالية ({abTests.length})</div>
              {abTests.length===0
                ? <div className="empty"><div className="empty-icon">🧪</div>لسه مفيش Tests</div>
                : abTests.map(t=>{
                  const pA = products.find(p=>p.id===t.product_a);
                  const pB = products.find(p=>p.id===t.product_b);
                  const totalSaves = (t.saves_a||0)+(t.saves_b||0);
                  const pctA = totalSaves > 0 ? Math.round(((t.saves_a||0)/totalSaves)*100) : 50;
                  const pctB = 100-pctA;
                  const now = new Date();
                  const end = new Date(t.end_date);
                  const isActive = now <= end;
                  const daysLeft = Math.ceil((end-now)/(1000*60*60*24));
                  return (
                    <div key={t.id} className="form-wrap" style={{marginBottom:16,borderColor:isActive?"rgba(46,204,113,0.2)":"rgba(255,255,255,0.05)"}}>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:10}}>
                        <div>
                          <div style={{fontFamily:"Playfair Display,serif",fontSize:17,color:"#f5f0eb",marginBottom:4}}>{t.name}</div>
                          <div style={{fontSize:12,color:"#5a4a3a"}}>{t.start_date} ← {t.end_date}</div>
                        </div>
                        <div style={{display:"flex",gap:8,alignItems:"center"}}>
                          <span style={{padding:"4px 12px",borderRadius:20,fontSize:11,background:isActive?"rgba(46,204,113,0.1)":"rgba(255,255,255,0.04)",color:isActive?"#2ecc71":"#5a4a3a",border:`1px solid ${isActive?"rgba(46,204,113,0.3)":"rgba(255,255,255,0.06)"}`}}>{isActive?`🟢 نشط — ${daysLeft} يوم`:"⚫ انتهى"}</span>
                          <button className="btn-danger" onClick={()=>handleDeleteAbTest(t.id)}>🗑️</button>
                        </div>
                      </div>

                      {/* Results */}
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
                        <div style={{padding:"14px",background:"#111",borderRadius:6,border:`2px solid ${pctA>pctB?"rgba(201,169,110,0.4)":"rgba(255,255,255,0.05)"}`}}>
                          <div style={{fontSize:10,color:"#5a4a3a",textTransform:"uppercase",letterSpacing:"1px",marginBottom:6}}>A {pctA>pctB?"🏆":""}</div>
                          <div style={{fontSize:14,color:"#f5f0eb",fontWeight:500,marginBottom:4}}>{pA?.name||t.product_a}</div>
                          <div style={{fontSize:12,color:"#c9a96e"}}>{pA?.brand||""}</div>
                          <div style={{fontSize:22,fontFamily:"Playfair Display,serif",color:"#c9a96e",marginTop:8}}>{t.saves_a||0} <span style={{fontSize:12,color:"#5a4a3a"}}>حفظ</span></div>
                          <div style={{marginTop:8,height:6,background:"#1a1a1a",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",background:"#c9a96e",borderRadius:3,width:`${pctA}%`,transition:"width 0.8s"}}/></div>
                          <div style={{fontSize:11,color:"#5a4a3a",marginTop:4}}>{pctA}%</div>
                        </div>
                        <div style={{padding:"14px",background:"#111",borderRadius:6,border:`2px solid ${pctB>pctA?"rgba(201,169,110,0.4)":"rgba(255,255,255,0.05)"}`}}>
                          <div style={{fontSize:10,color:"#5a4a3a",textTransform:"uppercase",letterSpacing:"1px",marginBottom:6}}>B {pctB>pctA?"🏆":""}</div>
                          <div style={{fontSize:14,color:"#f5f0eb",fontWeight:500,marginBottom:4}}>{pB?.name||t.product_b}</div>
                          <div style={{fontSize:12,color:"#c9a96e"}}>{pB?.brand||""}</div>
                          <div style={{fontSize:22,fontFamily:"Playfair Display,serif",color:"#c9a96e",marginTop:8}}>{t.saves_b||0} <span style={{fontSize:12,color:"#5a4a3a"}}>حفظ</span></div>
                          <div style={{marginTop:8,height:6,background:"#1a1a1a",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",background:"#c9a96e",borderRadius:3,width:`${pctB}%`,transition:"width 0.8s"}}/></div>
                          <div style={{fontSize:11,color:"#5a4a3a",marginTop:4}}>{pctB}%</div>
                        </div>
                      </div>
                      {totalSaves===0 && <div style={{fontSize:12,color:"#3a3030",textAlign:"center"}}>لسه مفيش بيانات — البنات محتاجين يحفظوا روتينات عشان تظهر النتايج</div>}
                    </div>
                  );
                })
              }
            </>}

            {/* ══ CONSULTATIONS ══ */}
            {page==="consultations" && <>
              <div className="page-title">👩‍⚕️ {a.consultations}</div>
              <div className="page-sub">{lang==="ar"?"ردي على استشارات اليوزرز — كل استشارة private":"Reply to user consultations — all consultations are private"}</div>

              <div style={{display:"flex",gap:16,marginBottom:24}}>
                {[
                  {label:a.total, val:consultations.length, color:"#c9a96e"},
                  {label:a.pending, val:consultations.filter(c=>c.status==="pending").length, color:"#f1c40f"},
                  {label:a.answered, val:consultations.filter(c=>c.status==="answered").length, color:"#2ecc71"},
                ].map((s,i)=>(
                  <div key={i} style={{flex:1,padding:"16px",background:"#0d0d0d",border:"1px solid rgba(255,255,255,0.05)",borderRadius:8,textAlign:"center"}}>
                    <div style={{fontFamily:"Playfair Display,serif",fontSize:26,color:s.color}}>{s.val}</div>
                    <div style={{fontSize:11,color:"#3a3030",marginTop:4}}>{s.label}</div>
                  </div>
                ))}
              </div>

              {consultations.length === 0
                ? <div style={{textAlign:"center",padding:"40px",color:"#3a3030"}}>{a.noConsultations}</div>
                : consultations.map(c=>(
                  <div key={c.id} style={{padding:"22px",background:"#0d0d0d",border:`1px solid ${c.status==="answered"?"rgba(46,204,113,0.15)":"rgba(241,196,15,0.2)"}`,borderRadius:10,marginBottom:14}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12,flexWrap:"wrap",gap:8}}>
                      <div style={{display:"flex",alignItems:"center",gap:12}}>
                        <span style={{fontSize:22}}>👩</span>
                        <div>
                          <div style={{fontSize:14,fontWeight:600,color:"#f5f0eb"}}>{c.user_name}</div>
                          <div style={{fontSize:11,color:"#5a4a3a"}}>{c.user_email}</div>
                        </div>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        {c.skin_type && <span style={{padding:"3px 10px",background:"rgba(201,169,110,0.1)",border:"1px solid rgba(201,169,110,0.2)",borderRadius:12,fontSize:11,color:"#c9a96e"}}>{c.skin_type}</span>}
                        <span style={{padding:"3px 10px",background:c.status==="answered"?"rgba(46,204,113,0.1)":"rgba(241,196,15,0.1)",border:`1px solid ${c.status==="answered"?"rgba(46,204,113,0.3)":"rgba(241,196,15,0.3)"}`,borderRadius:12,fontSize:11,color:c.status==="answered"?"#2ecc71":"#f1c40f"}}>
                          {c.status==="answered"?`✅ ${a.answered}`:`⏳ ${a.pending}`}
                        </span>
                        <span style={{fontSize:11,color:"#3a3030"}}>{new Date(c.created_at).toLocaleDateString(lang==="ar"?"ar-EG":"en-GB")}</span>
                      </div>
                    </div>

                    {c.concerns && <div style={{fontSize:12,color:"#5a4a3a",marginBottom:10}}>{lang==="ar"?"المشاكل:":"Concerns:"} {c.concerns}</div>}

                    <div style={{padding:"14px",background:"#111",borderRadius:8,marginBottom:14}}>
                      <div style={{fontSize:11,color:"#5a4a3a",textTransform:"uppercase",letterSpacing:"1px",marginBottom:8}}>{a.userQuestion}</div>
                      <div style={{fontSize:14,color:"#c9c0b0",lineHeight:1.7}}>{c.question}</div>
                    </div>

                    {c.doctor_reply && <div style={{padding:"14px",background:"rgba(201,169,110,0.05)",border:"1px solid rgba(201,169,110,0.15)",borderRadius:8,marginBottom:14}}>
                      <div style={{fontSize:11,color:"#c9a96e",textTransform:"uppercase",letterSpacing:"1px",marginBottom:8}}>{a.doctorReply}</div>
                      <div style={{fontSize:13,color:"#c9a96e",lineHeight:1.7}}>{c.doctor_reply}</div>
                      <div style={{fontSize:10,color:"#3a3030",marginTop:6}}>{c.replied_at && new Date(c.replied_at).toLocaleString(lang==="ar"?"ar-EG":"en-GB")}</div>
                    </div>}

                    {c.status === "pending" && <div>
                      <textarea
                        placeholder={a.replyPlaceholder}
                        value={consultReply[c.id]||""}
                        onChange={e=>setConsultReply(r=>({...r,[c.id]:e.target.value}))}
                        style={{width:"100%",padding:"12px 16px",background:"#111",border:"1px solid rgba(255,255,255,0.08)",borderRadius:6,color:"#f5f0eb",fontSize:13,fontFamily:"DM Sans,sans-serif",outline:"none",resize:"vertical",minHeight:100,boxSizing:"border-box",marginBottom:10}}
                      />
                      <button className="btn-gold" onClick={()=>handleReplyConsult(c.id)} disabled={!consultReply[c.id]?.trim()}>
                        {a.sendReply} 📩
                      </button>
                    </div>}
                  </div>
                ))
              }
            </>}

          </main>
        </div>

        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
}
