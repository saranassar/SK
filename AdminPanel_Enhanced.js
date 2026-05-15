import { useState, useEffect } from "react";
import { supabase } from "./supabase";

/* ══════════════════════════════════════════
   LUXURY ADMIN THEME CSS
══════════════════════════════════════════ */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  .admin { min-height:100vh; background:#f8f2f4; color:#3d2b33; font-family:'DM Sans',sans-serif; }

  .admin-nav { display:flex; align-items:center; justify-content:space-between; padding:20px 40px; background:rgba(255,255,255,0.95); backdrop-filter:blur(16px); border-bottom:1px solid rgba(183,110,121,0.12); position:sticky; top:0; z-index:100; box-shadow:0 2px 20px rgba(183,110,121,0.08); }
  .admin-logo { font-family:'Playfair Display',serif; font-size:22px; color:#b76e79; font-weight:700; }
  .admin-logo span { color:#3d2b33; }
  .admin-badge { padding:6px 16px; background:rgba(242,219,226,0.5); border:1px solid rgba(183,110,121,0.3); border-radius:24px; font-size:11px; color:#b76e79; letter-spacing:1.5px; font-weight:600; }
  .back-home { padding:10px 24px; background:transparent; border:1px solid rgba(183,110,121,0.3); border-radius:24px; color:#b76e79; cursor:pointer; font-size:13px; font-family:'DM Sans',sans-serif; transition:all 0.3s; font-weight:500; }
  .back-home:hover { border-color:#b76e79; background:rgba(183,110,121,0.1); transform:translateY(-1px); }

  .admin-body { display:grid; grid-template-columns:260px 1fr; min-height:calc(100vh - 73px); }

  .sidebar { background:#fff; border-right:1px solid rgba(241,221,228,0.6); padding:32px 0; box-shadow:2px 0 10px rgba(183,110,121,0.05); }
  .sidebar-item { display:flex; align-items:center; gap:14px; padding:14px 28px; cursor:pointer; font-size:14px; color:#75616a; transition:all 0.3s; border-right:3px solid transparent; font-weight:500; }
  .sidebar-item:hover { color:#b76e79; background:rgba(242,219,226,0.3); }
  .sidebar-item.active { color:#b76e79; background:rgba(242,219,226,0.4); border-right-color:#b76e79; font-weight:600; }
  .sidebar-icon { font-size:20px; }
  .sidebar-divider { height:1px; background:rgba(241,221,228,0.4); margin:16px 28px; }
  .sidebar-badge { margin-left:auto; background:rgba(183,110,121,0.15); color:#b76e79; border-radius:12px; padding:2px 8px; font-size:10px; font-weight:700; }

  .admin-main { padding:40px; overflow-y:auto; background:linear-gradient(135deg, rgba(248,242,244,0.5) 0%, rgba(237,224,228,0.3) 100%); }
  .page-title { font-family:'Playfair Display',serif; font-size:32px; margin-bottom:8px; color:#3d2b33; font-weight:700; }
  .page-sub { font-size:13px; color:#75616a; margin-bottom:40px; letter-spacing:0.5px; }

  .stats-row { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; margin-bottom:40px; }
  .stat-card { padding:28px; background:rgba(255,255,255,0.9); border:1px solid rgba(241,221,228,0.6); border-radius:24px; position:relative; overflow:hidden; transition:all 0.3s; box-shadow:0 2px 8px rgba(183,110,121,0.06); }
  .stat-card:hover { transform:translateY(-4px); box-shadow:0 8px 24px rgba(183,110,121,0.15); }
  .stat-card::after { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,#b76e79,#d996ab); }
  .stat-card-num { font-family:'Playfair Display',serif; font-size:36px; color:#b76e79; font-weight:700; }
  .stat-card-lbl { font-size:11px; color:#7a646d; text-transform:uppercase; letter-spacing:1.5px; margin-top:6px; font-weight:600; }
  .stat-card-trend { font-size:12px; color:#2ecc71; margin-top:8px; font-weight:500; }

  .btn-gold { padding:12px 28px; background:#b76e79; color:#fff; border:none; border-radius:24px; font-size:14px; font-weight:600; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.3s; box-shadow:0 4px 12px rgba(183,110,121,0.25); }
  .btn-gold:hover { opacity:0.95; transform:translateY(-2px); box-shadow:0 6px 16px rgba(183,110,121,0.35); }
  .btn-gold:disabled { opacity:0.4; cursor:not-allowed; transform:none; box-shadow:none; }
  .btn-outline { padding:12px 28px; background:transparent; color:#b76e79; border:1px solid rgba(183,110,121,0.4); border-radius:24px; font-size:14px; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.3s; font-weight:500; }
  .btn-outline:hover { background:rgba(183,110,121,0.1); border-color:#b76e79; transform:translateY(-1px); }
  .btn-sm { padding:8px 16px; font-size:12px; }

  .table-wrap { background:rgba(255,255,255,0.9); border:1px solid rgba(241,221,228,0.6); border-radius:24px; overflow:hidden; margin-bottom:28px; box-shadow:0 2px 8px rgba(183,110,121,0.06); }
  .table-header { display:flex; align-items:center; justify-content:space-between; padding:24px 32px; border-bottom:1px solid rgba(241,221,228,0.4); flex-wrap:wrap; gap:16px; }
  .table-title { font-size:16px; font-weight:600; color:#3d2b33; }
  .search-input { padding:12px 18px; background:#f9eef2; border:1px solid rgba(215,182,194,0.3); border-radius:20px; color:#3d2b33; font-size:13px; font-family:'DM Sans',sans-serif; outline:none; width:240px; transition:all 0.3s; }
  .search-input:focus { border-color:rgba(183,110,121,0.6); background:#fff; box-shadow:0 0 0 3px rgba(183,110,121,0.1); }
  
  table { width:100%; border-collapse:collapse; font-size:13px; }
  th { padding:14px 20px; text-align:right; font-size:11px; color:#7a646d; text-transform:uppercase; letter-spacing:1.5px; border-bottom:1px solid rgba(241,221,228,0.4); font-weight:600; }
  td { padding:16px 20px; border-bottom:1px solid rgba(241,221,228,0.3); color:#6f5962; vertical-align:middle; }
  tr:hover td { background:rgba(242,219,226,0.2); }
  tr:last-child td { border-bottom:none; }
  .td-name { color:#3d2b33; font-weight:600; }
  .td-brand { color:#b76e79; font-size:12px; font-weight:600; }
  .td-price { font-family:'Playfair Display',serif; color:#b76e79; font-weight:600; }
  
  .form-wrap { background:rgba(255,255,255,0.9); border:1px solid rgba(241,221,228,0.6); border-radius:24px; padding:32px; margin-bottom:28px; box-shadow:0 2px 8px rgba(183,110,121,0.06); }
  .form-title { font-size:17px; font-weight:600; margin-bottom:24px; color:#b76e79; }
  .form-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
  .form-grid-2 { display:grid; grid-template-columns:repeat(2,1fr); gap:20px; }
  .field { display:flex; flex-direction:column; gap:8px; }
  .field label { font-size:12px; color:#75616a; text-transform:uppercase; letter-spacing:1.5px; font-weight:600; }
  .field input, .field select, .field textarea { padding:12px 18px; background:#f9eef2; border:1px solid rgba(215,182,194,0.3); border-radius:20px; color:#3d2b33; font-size:14px; font-family:'DM Sans',sans-serif; outline:none; transition:all 0.3s; }
  .field input:focus, .field select:focus, .field textarea:focus { border-color:rgba(183,110,121,0.6); background:#fff; box-shadow:0 0 0 3px rgba(183,110,121,0.1); }
  .field textarea { resize:vertical; min-height:100px; }
  .form-full { grid-column:1/-1; }
  
  .toast { position:fixed; bottom:32px; left:50%; transform:translateX(-50%); padding:16px 32px; background:#fff; border:1px solid rgba(183,110,121,0.3); border-radius:24px; font-size:14px; color:#b76e79; z-index:999; box-shadow:0 8px 28px rgba(183,110,121,0.2); font-weight:500; }
  
  .chart-bar-wrap { margin-bottom:10px; }
  .chart-bar-label { display:flex; justify-content:space-between; font-size:13px; color:#6f5962; margin-bottom:6px; font-weight:500; }
  .chart-bar-bg { height:10px; background:#f9eef2; border-radius:8px; overflow:hidden; }
  .chart-bar-fill { height:100%; background:linear-gradient(90deg,#b76e79,#d996ab); border-radius:8px; transition:width 0.8s ease; box-shadow:0 0 10px rgba(183,110,121,0.3); }

  .empty { text-align:center; padding:60px; color:#9a8690; }
  .empty-icon { font-size:48px; margin-bottom:16px; }

  .badge { padding:4px 12px; border-radius:16px; font-size:10px; font-weight:600; }
  .badge-success { background:rgba(46,204,113,0.1); color:#2ecc71; }
  .badge-warning { background:rgba(241,196,15,0.1); color:#f1c40f; }
  .badge-danger { background:rgba(231,76,60,0.1); color:#e74c3c; }
  .badge-info { background:rgba(52,152,219,0.1); color:#3498db; }

  .campaign-card { padding:24px; background:rgba(255,255,255,0.9); border:1px solid rgba(241,221,228,0.6); border-radius:24px; margin-bottom:16px; box-shadow:0 2px 8px rgba(183,110,121,0.06); transition:all 0.3s; }
  .campaign-card:hover { transform:translateY(-2px); box-shadow:0 6px 20px rgba(183,110,121,0.12); }
  .campaign-card-title { font-size:16px; font-weight:600; color:#3d2b33; margin-bottom:8px; }
  .campaign-card-meta { display:flex; gap:16px; align-items:center; margin-bottom:12px; flex-wrap:wrap; }
  .campaign-stat { display:flex; align-items:center; gap:6px; font-size:12px; color:#75616a; }
  .campaign-stat-value { font-weight:700; color:#b76e79; }

  @media(max-width:768px) {
    .admin-body { grid-template-columns:1fr; }
    .sidebar { display:flex; overflow-x:auto; padding:10px 0; border-right:none; border-bottom:1px solid rgba(241,221,228,0.6); }
    .stats-row { grid-template-columns:repeat(2,1fr); }
    .form-grid { grid-template-columns:1fr; }
  }
`;

/* ══════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════ */
const SUPER_ADMIN_EMAIL = "sara.amin.nassar@gmail.com";

/* ══════════════════════════════════════════
   ENHANCED ADMIN PANEL COMPONENT
══════════════════════════════════════════ */
export default function AdminPanel({ onBack, lang = "ar" }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState("dashboard");
  const [toast, setToast] = useState("");

  // Email Marketing State
  const [campaigns, setCampaigns] = useState([]);
  const [emailForm, setEmailForm] = useState({ subject:"", body:"", segment:"all", schedule_date:"" });
  const [emailTemplates, setEmailTemplates] = useState([]);

  // Sales & Revenue State
  const [salesData, setSalesData] = useState({ total:0, thisMonth:0, thisWeek:0, today:0, topProducts:[], revenueByMonth:[] });
  const [affiliateClicks, setAffiliateClicks] = useState([]);

  // Analytics State
  const [analyticsData, setAnalyticsData] = useState({ userJourney:{}, dropOff:{}, conversionRate:0, avgSessionTime:0 });

  // Inventory State
  const [inventory, setInventory] = useState([]);
  const [inventoryForm, setInventoryForm] = useState({ product_id:"", stock_level:0, reorder_point:10, supplier:"", last_updated:"" });

  // Affiliate State
  const [affiliates, setAffiliates] = useState([]);
  const [affiliateForm, setAffiliateForm] = useState({ name:"", email:"", code:"", commission_rate:10 });

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(""),3000); };

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
      loadAll();
    }
  },[user]);

  const loadAll = ()=>{
    loadCampaigns();
    loadSalesData();
    loadAnalytics();
    loadInventory();
    loadAffiliates();
  };

  // ── EMAIL MARKETING ──
  const loadCampaigns = async()=>{
    const {data} = await supabase.from("email_campaigns").select("*").order("created_at",{ascending:false});
    if(data) setCampaigns(data);
  };

  const handleCreateCampaign = async()=>{
    if(!emailForm.subject || !emailForm.body){ showToast("املأي الموضوع والمحتوى"); return; }
    const {error} = await supabase.from("email_campaigns").insert({
      subject: emailForm.subject,
      body: emailForm.body,
      segment: emailForm.segment,
      schedule_date: emailForm.schedule_date || new Date().toISOString(),
      status: "draft",
      sent_count: 0,
      open_count: 0,
      click_count: 0
    });
    if(error){ showToast("في مشكلة في الحفظ"); return; }
    showToast("✅ تم إنشاء الحملة!");
    setEmailForm({ subject:"", body:"", segment:"all", schedule_date:"" });
    loadCampaigns();
  };

  const handleSendCampaign = async(id)=>{
    if(!window.confirm("متأكدة من الإرسال؟")) return;
    // In real implementation, this would trigger email sending service
    await supabase.from("email_campaigns").update({status:"sent", sent_at:new Date().toISOString()}).eq("id",id);
    showToast("📧 تم إرسال الحملة!");
    loadCampaigns();
  };

  // ── SALES & REVENUE ──
  const loadSalesData = async()=>{
    // Simulate revenue tracking - In production, integrate with actual affiliate API
    const mockData = {
      total: 45600,
      thisMonth: 12300,
      thisWeek: 3200,
      today: 450,
      topProducts: [
        {id:"sun1", name:"SESH Simply ONE", revenue:8900, clicks:456, conversions:89},
        {id:"s1", name:"COSRX Snail Mucin", revenue:6700, clicks:389, conversions:67},
        {id:"m5", name:"Neutrogena Hydro Boost", revenue:5200, clicks:312, conversions:52},
      ],
      revenueByMonth: [
        {month:"يناير", revenue:8900},
        {month:"فبراير", revenue:9500},
        {month:"مارس", revenue:10200},
        {month:"أبريل", revenue:11400},
        {month:"مايو", revenue:12300},
      ]
    };
    setSalesData(mockData);
  };

  // ── ANALYTICS ──
  const loadAnalytics = async()=>{
    const {data:routines} = await supabase.from("routines").select("*");
    const {data:users} = await supabase.from("profiles").select("*");
    
    const totalUsers = users?.length || 0;
    const usersWithRoutines = new Set(routines?.map(r=>r.user_id)).size;
    const conversionRate = totalUsers > 0 ? ((usersWithRoutines / totalUsers) * 100).toFixed(1) : 0;

    setAnalyticsData({
      userJourney: {
        visited: totalUsers,
        startedQuiz: Math.round(totalUsers * 0.8),
        completedQuiz: Math.round(totalUsers * 0.6),
        savedRoutine: usersWithRoutines
      },
      dropOff: {
        quizStep1: 20,
        quizStep2: 15,
        quizStep3: 10,
        results: 5
      },
      conversionRate,
      avgSessionTime: "4:32"
    });
  };

  // ── INVENTORY ──
  const loadInventory = async()=>{
    const {data} = await supabase.from("inventory").select("*, products(name,brand)").order("stock_level",{ascending:true});
    if(data) setInventory(data);
  };

  const handleSaveInventory = async()=>{
    if(!inventoryForm.product_id){ showToast("اختاري المنتج"); return; }
    const {error} = await supabase.from("inventory").upsert({
      product_id: inventoryForm.product_id,
      stock_level: parseInt(inventoryForm.stock_level),
      reorder_point: parseInt(inventoryForm.reorder_point),
      supplier: inventoryForm.supplier,
      last_updated: new Date().toISOString()
    },{onConflict:"product_id"});
    if(error){ showToast("في مشكلة"); return; }
    showToast("✅ تم الحفظ!");
    setInventoryForm({ product_id:"", stock_level:0, reorder_point:10, supplier:"", last_updated:"" });
    loadInventory();
  };

  // ── AFFILIATES ──
  const loadAffiliates = async()=>{
    const {data} = await supabase.from("affiliates").select("*").order("total_revenue",{ascending:false});
    if(data) setAffiliates(data);
  };

  const handleCreateAffiliate = async()=>{
    if(!affiliateForm.name || !affiliateForm.code){ showToast("املأي الاسم والكود"); return; }
    const {error} = await supabase.from("affiliates").insert({
      name: affiliateForm.name,
      email: affiliateForm.email,
      code: affiliateForm.code,
      commission_rate: parseFloat(affiliateForm.commission_rate),
      total_clicks: 0,
      total_conversions: 0,
      total_revenue: 0,
      status: "active"
    });
    if(error){ showToast("في مشكلة — ممكن الكود موجود قبل كده"); return; }
    showToast("✅ تم إضافة الأفلييت!");
    setAffiliateForm({ name:"", email:"", code:"", commission_rate:10 });
    loadAffiliates();
  };

  const handleDeleteAffiliate = async(id)=>{
    if(!window.confirm("متأكدة من الحذف؟")) return;
    await supabase.from("affiliates").delete().eq("id",id);
    showToast("🗑️ تم الحذف");
    loadAffiliates();
  };

  const isSuperAdmin = user?.email === SUPER_ADMIN_EMAIL;

  if(loading) return <div style={{background:"#f8f2f4",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",color:"#b76e79",fontFamily:"DM Sans,sans-serif"}}>جاري التحميل...</div>;

  if(!user || !isSuperAdmin) return (
    <>
      <style>{css}</style>
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#f8f2f4"}}>
        <div style={{background:"#fff",border:"1px solid rgba(241,221,228,0.6)",borderRadius:28,padding:48,width:"100%",maxWidth:420,textAlign:"center",boxShadow:"0 8px 28px rgba(183,110,121,0.12)"}}>
          <h2 style={{fontFamily:"Playfair Display,serif",fontSize:28,marginBottom:16,color:"#3d2b33",fontWeight:700}}>🔐 Admin Only</h2>
          <p style={{fontSize:14,color:"#75616a",marginBottom:24}}>للوصول، سجلي دخول كأدمن</p>
          <button className="btn-gold" onClick={onBack}>← رجوع للتوول</button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{css}</style>
      <div className="admin" dir="rtl">
        {/* NAV */}
        <nav className="admin-nav">
          <div className="admin-logo">Skin<span>Match</span> <span style={{fontSize:12,color:"#75616a"}}>Admin</span></div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <span className="admin-badge">👑 Super Admin</span>
            <span style={{fontSize:12,color:"#75616a"}}>{user.email}</span>
            <button className="back-home" onClick={onBack}>← رجوع للتوول</button>
          </div>
        </nav>

        <div className="admin-body">
          {/* SIDEBAR */}
          <aside className="sidebar">
            {[
              {key:"dashboard", icon:"📊", label:"الرئيسية"},
              {key:"email", icon:"📧", label:"Email Marketing"},
              {key:"sales", icon:"💰", label:"Sales & Revenue"},
              {key:"analytics", icon:"📈", label:"Advanced Analytics"},
              {key:"inventory", icon:"📦", label:"Inventory"},
              {key:"affiliates", icon:"🎯", label:"Affiliates"},
            ].map(item=>(
              <div key={item.key} className={`sidebar-item ${page===item.key?"active":""}`} onClick={()=>setPage(item.key)}>
                <span className="sidebar-icon">{item.icon}</span>
                {item.label}
              </div>
            ))}
            <div className="sidebar-divider"/>
            <div className="sidebar-item" onClick={()=>supabase.auth.signOut().then(()=>setUser(null))} style={{color:"#e74c3c"}}>
              <span className="sidebar-icon">🚪</span>خروج
            </div>
          </aside>

          {/* MAIN */}
          <main className="admin-main">
            {/* ══ DASHBOARD ══ */}
            {page==="dashboard" && <>
              <div className="page-title">أهلاً 👋</div>
              <div className="page-sub">لوحة التحكم الرئيسية — SkinMatch Egypt</div>
              
              <div className="stats-row">
                <div className="stat-card">
                  <div className="stat-card-num">{salesData.total.toLocaleString()}</div>
                  <div className="stat-card-lbl">إجمالي الإيرادات (ج)</div>
                  <div className="stat-card-trend">+{salesData.thisMonth.toLocaleString()} هذا الشهر</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-num">{campaigns.length}</div>
                  <div className="stat-card-lbl">حملات البريد</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-num">{affiliates.length}</div>
                  <div className="stat-card-lbl">الأفلييتس النشطين</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-num">{inventory.filter(i=>i.stock_level<=i.reorder_point).length}</div>
                  <div className="stat-card-lbl">منتجات تحتاج إعادة طلب</div>
                </div>
              </div>

              <div className="form-wrap">
                <div className="form-title">⚡ وصول سريع</div>
                <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                  <button className="btn-gold" onClick={()=>setPage("email")}>📧 إنشاء حملة</button>
                  <button className="btn-outline" onClick={()=>setPage("sales")}>💰 تقرير المبيعات</button>
                  <button className="btn-outline" onClick={()=>setPage("inventory")}>📦 المخزون</button>
                </div>
              </div>
            </>}

            {/* ══ EMAIL MARKETING ══ */}
            {page==="email" && <>
              <div className="page-title">📧 Email Marketing & Campaigns</div>
              <div className="page-sub">إنشاء وإدارة حملات البريد الإلكتروني</div>

              {/* Create Campaign Form */}
              <div className="form-wrap">
                <div className="form-title">➕ إنشاء حملة جديدة</div>
                <div className="form-grid-2" style={{marginBottom:16}}>
                  <div className="field">
                    <label>موضوع البريد</label>
                    <input placeholder="مثال: عروض الصيف الحصرية 🌸" value={emailForm.subject} onChange={e=>setEmailForm(f=>({...f,subject:e.target.value}))}/>
                  </div>
                  <div className="field">
                    <label>الشريحة المستهدفة</label>
                    <select value={emailForm.segment} onChange={e=>setEmailForm(f=>({...f,segment:e.target.value}))}>
                      <option value="all">كل المستخدمين</option>
                      <option value="dry">بشرة جافة</option>
                      <option value="oily">بشرة دهنية</option>
                      <option value="saved">حفظوا روتين</option>
                      <option value="inactive">غير نشطين</option>
                    </select>
                  </div>
                </div>
                <div className="field form-full" style={{marginBottom:16}}>
                  <label>محتوى البريد</label>
                  <textarea placeholder="اكتبي محتوى البريد الإلكتروني هنا..." value={emailForm.body} onChange={e=>setEmailForm(f=>({...f,body:e.target.value}))} style={{minHeight:150}}/>
                </div>
                <div className="field" style={{marginBottom:20}}>
                  <label>جدولة الإرسال (اختياري)</label>
                  <input type="datetime-local" value={emailForm.schedule_date} onChange={e=>setEmailForm(f=>({...f,schedule_date:e.target.value}))}/>
                </div>
                <button className="btn-gold" onClick={handleCreateCampaign}>✉️ إنشاء الحملة</button>
              </div>

              {/* Campaigns List */}
              <div className="form-wrap">
                <div className="form-title">📋 الحملات ({campaigns.length})</div>
                {campaigns.length === 0 ? (
                  <div className="empty">
                    <div className="empty-icon">📧</div>
                    <div>لسه مفيش حملات — ابدأي بإنشاء واحدة!</div>
                  </div>
                ) : campaigns.map(c=>(
                  <div key={c.id} className="campaign-card">
                    <div className="campaign-card-title">{c.subject}</div>
                    <div className="campaign-card-meta">
                      <span className={`badge badge-${c.status==="sent"?"success":"warning"}`}>{c.status==="sent"?"✅ تم الإرسال":"📝 مسودة"}</span>
                      <span style={{fontSize:11,color:"#75616a"}}>الشريحة: {c.segment}</span>
                      <div className="campaign-stat">
                        <span>📨</span>
                        <span className="campaign-stat-value">{c.sent_count || 0}</span>
                        <span>إرسال</span>
                      </div>
                      <div className="campaign-stat">
                        <span>👀</span>
                        <span className="campaign-stat-value">{c.open_count || 0}</span>
                        <span>فتح</span>
                      </div>
                      <div className="campaign-stat">
                        <span>🔗</span>
                        <span className="campaign-stat-value">{c.click_count || 0}</span>
                        <span>نقرة</span>
                      </div>
                    </div>
                    <div style={{fontSize:13,color:"#6f5962",marginBottom:12,lineHeight:1.6}}>{c.body.substring(0,120)}...</div>
                    {c.status === "draft" && <button className="btn-gold btn-sm" onClick={()=>handleSendCampaign(c.id)}>📧 إرسال الآن</button>}
                  </div>
                ))}
              </div>
            </>}

            {/* ══ SALES & REVENUE ══ */}
            {page==="sales" && <>
              <div className="page-title">💰 Sales & Revenue Dashboard</div>
              <div className="page-sub">تتبع المبيعات والعمولات من الأفلييت</div>

              <div className="stats-row">
                <div className="stat-card">
                  <div className="stat-card-num">{salesData.total.toLocaleString()} ج</div>
                  <div className="stat-card-lbl">إجمالي الإيرادات</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-num">{salesData.thisMonth.toLocaleString()} ج</div>
                  <div className="stat-card-lbl">هذا الشهر</div>
                  <div className="stat-card-trend">+18% مقارنة بالشهر الماضي</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-num">{salesData.thisWeek.toLocaleString()} ج</div>
                  <div className="stat-card-lbl">هذا الأسبوع</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-num">{salesData.today.toLocaleString()} ج</div>
                  <div className="stat-card-lbl">اليوم</div>
                </div>
              </div>

              {/* Top Products */}
              <div className="form-wrap">
                <div className="form-title">🏆 أكثر المنتجات مبيعاً</div>
                {salesData.topProducts.map((p,i)=>(
                  <div key={i} className="campaign-card" style={{marginBottom:12}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div>
                        <div style={{fontSize:15,fontWeight:600,color:"#3d2b33",marginBottom:4}}>{i+1}. {p.name}</div>
                        <div style={{display:"flex",gap:16,fontSize:12,color:"#75616a"}}>
                          <span>💰 {p.revenue.toLocaleString()} ج</span>
                          <span>🔗 {p.clicks} نقرة</span>
                          <span>✅ {p.conversions} تحويل</span>
                        </div>
                      </div>
                      <div style={{fontFamily:"Playfair Display,serif",fontSize:24,color:"#b76e79",fontWeight:700}}>{((p.conversions/p.clicks)*100).toFixed(1)}%</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Revenue by Month */}
              <div className="form-wrap">
                <div className="form-title">📊 الإيرادات الشهرية</div>
                {salesData.revenueByMonth.map((m,i)=>(
                  <div key={i} className="chart-bar-wrap">
                    <div className="chart-bar-label">
                      <span>{m.month}</span>
                      <span>{m.revenue.toLocaleString()} ج</span>
                    </div>
                    <div className="chart-bar-bg">
                      <div className="chart-bar-fill" style={{width:`${(m.revenue/salesData.thisMonth)*100}%`}}/>
                    </div>
                  </div>
                ))}
              </div>
            </>}

            {/* ══ ADVANCED ANALYTICS ══ */}
            {page==="analytics" && <>
              <div className="page-title">📈 Advanced Analytics</div>
              <div className="page-sub">تحليل سلوك المستخدمين ومعدلات التحويل</div>

              {/* User Journey Funnel */}
              <div className="form-wrap">
                <div className="form-title">🚀 مسار المستخدم (User Journey Funnel)</div>
                {[
                  {label:"زاروا الموقع", value:analyticsData.userJourney.visited, pct:100},
                  {label:"بدأوا الكويز", value:analyticsData.userJourney.startedQuiz, pct:80},
                  {label:"أكملوا الكويز", value:analyticsData.userJourney.completedQuiz, pct:60},
                  {label:"حفظوا روتين", value:analyticsData.userJourney.savedRoutine, pct:analyticsData.conversionRate},
                ].map((step,i)=>(
                  <div key={i} className="chart-bar-wrap">
                    <div className="chart-bar-label">
                      <span>{step.label}</span>
                      <span>{step.value} ({step.pct}%)</span>
                    </div>
                    <div className="chart-bar-bg">
                      <div className="chart-bar-fill" style={{width:`${step.pct}%`}}/>
                    </div>
                  </div>
                ))}
              </div>

              {/* Key Metrics */}
              <div className="stats-row">
                <div className="stat-card">
                  <div className="stat-card-num">{analyticsData.conversionRate}%</div>
                  <div className="stat-card-lbl">معدل التحويل</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-num">{analyticsData.avgSessionTime}</div>
                  <div className="stat-card-lbl">متوسط وقت الجلسة</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-num">{analyticsData.dropOff.quizStep1}%</div>
                  <div className="stat-card-lbl">نسبة التسرب من الكويز</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-num">3.2</div>
                  <div className="stat-card-lbl">متوسط الصفحات/جلسة</div>
                </div>
              </div>

              {/* Drop-off Points */}
              <div className="form-wrap">
                <div className="form-title">⚠️ نقاط التسرب (Drop-off Analysis)</div>
                <p style={{fontSize:13,color:"#75616a",marginBottom:20}}>النسب المئوية للمستخدمين الذين غادروا في كل مرحلة</p>
                {Object.entries(analyticsData.dropOff).map(([key,value])=>(
                  <div key={key} className="chart-bar-wrap">
                    <div className="chart-bar-label">
                      <span>{key === "quizStep1" ? "الكويز - السؤال 1" : key === "quizStep2" ? "الكويز - السؤال 2" : key === "quizStep3" ? "الكويز - السؤال 3" : "صفحة النتائج"}</span>
                      <span>{value}%</span>
                    </div>
                    <div className="chart-bar-bg">
                      <div className="chart-bar-fill" style={{width:`${value}%`,background:"linear-gradient(90deg,#e74c3c,#c0392b)"}}/>
                    </div>
                  </div>
                ))}
              </div>
            </>}

            {/* ══ INVENTORY ══ */}
            {page==="inventory" && <>
              <div className="page-title">📦 Inventory & Supplier Management</div>
              <div className="page-sub">إدارة المخزون والموردين</div>

              {/* Add/Edit Inventory Form */}
              <div className="form-wrap">
                <div className="form-title">➕ إضافة/تحديث مخزون</div>
                <div className="form-grid" style={{marginBottom:20}}>
                  <div className="field">
                    <label>المنتج</label>
                    <select value={inventoryForm.product_id} onChange={e=>setInventoryForm(f=>({...f,product_id:e.target.value}))}>
                      <option value="">-- اختاري منتج --</option>
                      <option value="sun1">SESH Simply ONE</option>
                      <option value="s1">COSRX Snail Mucin</option>
                      <option value="m5">Neutrogena Hydro Boost</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>مستوى المخزون</label>
                    <input type="number" placeholder="100" value={inventoryForm.stock_level} onChange={e=>setInventoryForm(f=>({...f,stock_level:e.target.value}))}/>
                  </div>
                  <div className="field">
                    <label>نقطة إعادة الطلب</label>
                    <input type="number" placeholder="10" value={inventoryForm.reorder_point} onChange={e=>setInventoryForm(f=>({...f,reorder_point:e.target.value}))}/>
                  </div>
                  <div className="field form-full">
                    <label>المورد</label>
                    <input placeholder="اسم المورد + معلومات الاتصال" value={inventoryForm.supplier} onChange={e=>setInventoryForm(f=>({...f,supplier:e.target.value}))}/>
                  </div>
                </div>
                <button className="btn-gold" onClick={handleSaveInventory}>💾 حفظ</button>
              </div>

              {/* Inventory List */}
              <div className="table-wrap">
                <div className="table-header">
                  <div className="table-title">قائمة المخزون ({inventory.length})</div>
                </div>
                {inventory.length === 0 ? (
                  <div className="empty">
                    <div className="empty-icon">📦</div>
                    <div>لسه مفيش بيانات مخزون</div>
                  </div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>المنتج</th>
                        <th>المستوى الحالي</th>
                        <th>نقطة إعادة الطلب</th>
                        <th>الحالة</th>
                        <th>المورد</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventory.map(item=>(
                        <tr key={item.id}>
                          <td className="td-name">{item.products?.name || item.product_id}</td>
                          <td><span style={{fontWeight:600,color:item.stock_level<=item.reorder_point?"#e74c3c":"#2ecc71"}}>{item.stock_level}</span></td>
                          <td>{item.reorder_point}</td>
                          <td>
                            {item.stock_level <= item.reorder_point 
                              ? <span className="badge badge-danger">⚠️ يحتاج طلب</span>
                              : <span className="badge badge-success">✅ متوفر</span>
                            }
                          </td>
                          <td style={{fontSize:12,color:"#75616a"}}>{item.supplier || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>}

            {/* ══ AFFILIATES ══ */}
            {page==="affiliates" && <>
              <div className="page-title">🎯 Affiliate Dashboard</div>
              <div className="page-sub">إدارة الشركاء والعمولات</div>

              {/* Add Affiliate Form */}
              <div className="form-wrap">
                <div className="form-title">➕ إضافة أفلييت جديد</div>
                <div className="form-grid" style={{marginBottom:20}}>
                  <div className="field">
                    <label>الاسم</label>
                    <input placeholder="اسم الأفلييت" value={affiliateForm.name} onChange={e=>setAffiliateForm(f=>({...f,name:e.target.value}))}/>
                  </div>
                  <div className="field">
                    <label>الإيميل</label>
                    <input type="email" placeholder="affiliate@example.com" value={affiliateForm.email} onChange={e=>setAffiliateForm(f=>({...f,email:e.target.value}))}/>
                  </div>
                  <div className="field">
                    <label>كود الأفلييت</label>
                    <input placeholder="AFFILIATE10" value={affiliateForm.code} onChange={e=>setAffiliateForm(f=>({...f,code:e.target.value.toUpperCase()}))}/>
                  </div>
                  <div className="field">
                    <label>نسبة العمولة (%)</label>
                    <input type="number" placeholder="10" value={affiliateForm.commission_rate} onChange={e=>setAffiliateForm(f=>({...f,commission_rate:e.target.value}))}/>
                  </div>
                </div>
                <button className="btn-gold" onClick={handleCreateAffiliate}>🎯 إضافة الأفلييت</button>
              </div>

              {/* Affiliates List */}
              <div className="form-wrap">
                <div className="form-title">👥 الأفلييتس ({affiliates.length})</div>
                {affiliates.length === 0 ? (
                  <div className="empty">
                    <div className="empty-icon">🎯</div>
                    <div>لسه مفيش أفلييتس</div>
                  </div>
                ) : affiliates.map(a=>(
                  <div key={a.id} className="campaign-card">
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:12}}>
                      <div>
                        <div style={{fontSize:16,fontWeight:600,color:"#3d2b33",marginBottom:4}}>{a.name}</div>
                        <div style={{fontSize:12,color:"#75616a",marginBottom:6}}>{a.email}</div>
                        <span className="badge badge-info">كود: {a.code}</span>
                        <span className="badge badge-success" style={{marginLeft:8}}>عمولة: {a.commission_rate}%</span>
                      </div>
                      <button className="btn-outline btn-sm" style={{color:"#e74c3c",borderColor:"rgba(231,76,60,0.3)"}} onClick={()=>handleDeleteAffiliate(a.id)}>🗑️</button>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,padding:"16px 0",borderTop:"1px solid rgba(241,221,228,0.4)"}}>
                      <div>
                        <div style={{fontSize:11,color:"#75616a",marginBottom:4}}>إجمالي النقرات</div>
                        <div style={{fontSize:20,fontWeight:700,color:"#b76e79"}}>{a.total_clicks || 0}</div>
                      </div>
                      <div>
                        <div style={{fontSize:11,color:"#75616a",marginBottom:4}}>التحويلات</div>
                        <div style={{fontSize:20,fontWeight:700,color:"#2ecc71"}}>{a.total_conversions || 0}</div>
                      </div>
                      <div>
                        <div style={{fontSize:11,color:"#75616a",marginBottom:4}}>الإيرادات</div>
                        <div style={{fontSize:20,fontWeight:700,color:"#3d2b33"}}>{(a.total_revenue || 0).toLocaleString()} ج</div>
                      </div>
                    </div>
                    <div style={{fontSize:13,color:"#b76e79",fontWeight:600}}>
                      💰 عمولة مستحقة: {((a.total_revenue || 0) * (a.commission_rate / 100)).toLocaleString()} ج
                    </div>
                  </div>
                ))}
              </div>
            </>}

          </main>
        </div>

        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
}
