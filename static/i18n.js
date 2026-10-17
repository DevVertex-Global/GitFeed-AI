(function () {
    const KEYS = ['welcome','search','foryou','following','trending','starred','settings','privacy','light','language','home','ghToken','geminiKey','save','profile','profileEmpty','loading','noRepos','star','starredBtn','aiBtn','open','stars','saved','needKey'];
    const D = {
        en: ["Welcome, Developer!","Search global GitHub repositories & tools...","For You","Following","Trending this week","Your starred repos","Settings","Privacy & Security","Light Theme Mode","Language","Back to Home","GitHub Access Token","Google Gemini API Key","Save Securely","GitHub Profile","Connect your GitHub Access Token in Settings to view your profile details and live stats.","Loading...","No repositories found.","Star","Starred","AI Analysis","Open","Stars","Credentials saved!","Please add the required key in Settings → Privacy & Security."],
        bn: ["স্বাগতম, ডেভেলপার!","গিটহাব রিপোজিটরি ও টুল খুঁজুন...","আপনার জন্য","ফলোইং","এই সপ্তাহের ট্রেন্ডিং","আপনার স্টার করা রিপো","সেটিংস","প্রাইভেসি ও সিকিউরিটি","লাইট থিম মোড","ভাষা","হোমে ফিরুন","গিটহাব অ্যাক্সেস টোকেন","গুগল জেমিনি এপিআই কী","নিরাপদে সেভ করুন","গিটহাব প্রোফাইল","প্রোফাইল ও লাইভ স্ট্যাটস দেখতে সেটিংসে আপনার গিটহাব অ্যাক্সেস টোকেন যুক্ত করুন।","লোড হচ্ছে...","কোনো রিপোজিটরি পাওয়া যায়নি।","স্টার","স্টার করা হয়েছে","এআই বিশ্লেষণ","খুলুন","স্টার","ক্রেডেনশিয়াল সেভ হয়েছে!","অনুগ্রহ করে সেটিংস → প্রাইভেসি ও সিকিউরিটিতে প্রয়োজনীয় কী যুক্ত করুন।"],
        es: ["¡Bienvenido, desarrollador!","Busca repositorios y herramientas de GitHub...","Para ti","Siguiendo","Tendencias de la semana","Tus repos destacados","Ajustes","Privacidad y seguridad","Modo de tema claro","Idioma","Volver al inicio","Token de acceso de GitHub","Clave API de Google Gemini","Guardar de forma segura","Perfil de GitHub","Conecta tu token de GitHub en Ajustes para ver tu perfil y estadísticas en vivo.","Cargando...","No se encontraron repositorios.","Destacar","Destacado","Análisis IA","Abrir","Estrellas","¡Credenciales guardadas!","Añade la clave necesaria en Ajustes → Privacidad y seguridad."],
        fr: ["Bienvenue, développeur !","Rechercher des dépôts et outils GitHub...","Pour vous","Abonnements","Tendances de la semaine","Vos dépôts favoris","Paramètres","Confidentialité et sécurité","Thème clair","Langue","Retour à l'accueil","Jeton d'accès GitHub","Clé API Google Gemini","Enregistrer en sécurité","Profil GitHub","Ajoutez votre jeton GitHub dans les paramètres pour voir votre profil et vos statistiques.","Chargement...","Aucun dépôt trouvé.","Étoile","Ajouté","Analyse IA","Ouvrir","Étoiles","Identifiants enregistrés !","Ajoutez la clé requise dans Paramètres → Confidentialité et sécurité."],
        de: ["Willkommen, Entwickler!","GitHub-Repositories und Tools suchen...","Für dich","Folge ich","Trends dieser Woche","Deine markierten Repos","Einstellungen","Datenschutz & Sicherheit","Helles Design","Sprache","Zurück zur Startseite","GitHub-Zugriffstoken","Google-Gemini-API-Schlüssel","Sicher speichern","GitHub-Profil","Verbinde dein GitHub-Token in den Einstellungen, um dein Profil und Live-Statistiken zu sehen.","Wird geladen...","Keine Repositories gefunden.","Markieren","Markiert","KI-Analyse","Öffnen","Sterne","Zugangsdaten gespeichert!","Bitte den nötigen Schlüssel unter Einstellungen → Datenschutz & Sicherheit hinzufügen."],
        zh: ["欢迎，开发者！","搜索 GitHub 仓库和工具...","为你推荐","关注","本周热门","你收藏的仓库","设置","隐私与安全","浅色主题","语言","返回首页","GitHub 访问令牌","Google Gemini API 密钥","安全保存","GitHub 个人资料","请在设置中连接 GitHub 访问令牌，以查看个人资料和实时数据。","加载中...","未找到仓库。","收藏","已收藏","AI 分析","打开","星标","凭据已保存！","请在 设置 → 隐私与安全 中添加所需密钥。"],
        ja: ["ようこそ、開発者さん！","GitHub のリポジトリやツールを検索...","おすすめ","フォロー中","今週のトレンド","スター付きリポジトリ","設定","プライバシーとセキュリティ","ライトテーマ","言語","ホームに戻る","GitHub アクセストークン","Google Gemini API キー","安全に保存","GitHub プロフィール","設定で GitHub アクセストークンを接続すると、プロフィールとライブ統計を表示できます。","読み込み中...","リポジトリが見つかりません。","スター","スター済み","AI 分析","開く","スター数","認証情報を保存しました！","設定 → プライバシーとセキュリティで必要なキーを追加してください。"],
        ru: ["Добро пожаловать, разработчик!","Поиск репозиториев и инструментов GitHub...","Для вас","Подписки","Тренды недели","Ваши избранные репозитории","Настройки","Конфиденциальность и безопасность","Светлая тема","Язык","На главную","Токен доступа GitHub","API-ключ Google Gemini","Сохранить безопасно","Профиль GitHub","Подключите токен GitHub в настройках, чтобы увидеть профиль и статистику.","Загрузка...","Репозитории не найдены.","В избранное","В избранном","ИИ-анализ","Открыть","Звёзд","Данные сохранены!","Добавьте нужный ключ в Настройки → Конфиденциальность и безопасность."],
        ar: ["مرحبًا أيها المطوّر!","ابحث في مستودعات وأدوات GitHub...","لك","المتابَعون","الأكثر رواجًا هذا الأسبوع","مستودعاتك المميزة بنجمة","الإعدادات","الخصوصية والأمان","الوضع الفاتح","اللغة","العودة إلى الرئيسية","رمز وصول GitHub","مفتاح Google Gemini API","حفظ آمن","ملف GitHub الشخصي","اربط رمز GitHub في الإعدادات لعرض ملفك الشخصي وإحصاءاتك المباشرة.","جارٍ التحميل...","لم يتم العثور على مستودعات.","نجمة","تم التمييز","تحليل بالذكاء الاصطناعي","فتح","نجوم","تم حفظ بيانات الاعتماد!","يرجى إضافة المفتاح المطلوب في الإعدادات ← الخصوصية والأمان."],
        hi: ["स्वागत है, डेवलपर!","GitHub रिपॉजिटरी और टूल खोजें...","आपके लिए","फ़ॉलोइंग","इस सप्ताह ट्रेंडिंग","आपके स्टार किए रेपो","सेटिंग्स","गोपनीयता और सुरक्षा","लाइट थीम मोड","भाषा","होम पर वापस जाएँ","GitHub एक्सेस टोकन","Google Gemini API कुंजी","सुरक्षित सहेजें","GitHub प्रोफ़ाइल","प्रोफ़ाइल और लाइव आँकड़े देखने के लिए सेटिंग्स में अपना GitHub टोकन जोड़ें।","लोड हो रहा है...","कोई रिपॉजिटरी नहीं मिली।","स्टार","स्टार किया","AI विश्लेषण","खोलें","स्टार","क्रेडेंशियल सहेजे गए!","कृपया सेटिंग्स → गोपनीयता और सुरक्षा में आवश्यक कुंजी जोड़ें।"],
        pt: ["Bem-vindo, desenvolvedor!","Pesquise repositórios e ferramentas do GitHub...","Para você","Seguindo","Em alta esta semana","Seus repositórios favoritos","Configurações","Privacidade e segurança","Tema claro","Idioma","Voltar ao início","Token de acesso do GitHub","Chave de API do Google Gemini","Salvar com segurança","Perfil do GitHub","Conecte seu token do GitHub nas Configurações para ver seu perfil e estatísticas ao vivo.","Carregando...","Nenhum repositório encontrado.","Favoritar","Favoritado","Análise de IA","Abrir","Estrelas","Credenciais salvas!","Adicione a chave necessária em Configurações → Privacidade e segurança."],
        ko: ["환영합니다, 개발자님!","GitHub 저장소와 도구 검색...","추천","팔로잉","이번 주 인기","내가 스타한 저장소","설정","개인정보 및 보안","라이트 테마","언어","홈으로 돌아가기","GitHub 액세스 토큰","Google Gemini API 키","안전하게 저장","GitHub 프로필","설정에서 GitHub 토큰을 연결하면 프로필과 실시간 통계를 볼 수 있습니다.","불러오는 중...","저장소를 찾을 수 없습니다.","스타","스타함","AI 분석","열기","스타","자격 증명이 저장되었습니다!","설정 → 개인정보 및 보안에서 필요한 키를 추가하세요."]
    };
    // settingsSub, privacySub, back, followers, repos
    const X = {
        en: ["Manage app preferences and secure credentials.","Your credentials are saved only in your browser and are never stored on any server.","Back to Settings","Followers","Repos"],
        bn: ["অ্যাপের পছন্দ ও নিরাপদ ক্রেডেনশিয়াল পরিচালনা করুন।","আপনার ক্রেডেনশিয়াল শুধু আপনার ব্রাউজারে সেভ থাকে, কোনো সার্ভারে নয়।","সেটিংসে ফিরুন","ফলোয়ার","রিপো"],
        es: ["Gestiona las preferencias de la app y tus credenciales.","Tus credenciales se guardan solo en tu navegador y nunca en ningún servidor.","Volver a Ajustes","Seguidores","Repos"],
        fr: ["Gérez les préférences de l'application et vos identifiants.","Vos identifiants sont enregistrés uniquement dans votre navigateur, jamais sur un serveur.","Retour aux paramètres","Abonnés","Dépôts"],
        de: ["App-Einstellungen und Zugangsdaten verwalten.","Deine Zugangsdaten werden nur in deinem Browser gespeichert, nie auf einem Server.","Zurück zu den Einstellungen","Follower","Repos"],
        zh: ["管理应用偏好和安全凭据。","你的凭据仅保存在浏览器中，绝不会存储在任何服务器上。","返回设置","关注者","仓库"],
        ja: ["アプリの設定と認証情報を管理します。","認証情報はブラウザ内にのみ保存され、サーバーには保存されません。","設定に戻る","フォロワー","リポジトリ"],
        ru: ["Управляйте настройками приложения и учётными данными.","Ваши данные хранятся только в браузере и никогда не попадают на сервер.","Назад в настройки","Подписчики","Репозитории"],
        ar: ["إدارة تفضيلات التطبيق وبيانات الاعتماد.","تُحفظ بيانات اعتمادك في متصفحك فقط ولا تُخزَّن على أي خادم.","العودة إلى الإعدادات","المتابِعون","المستودعات"],
        hi: ["ऐप की प्राथमिकताएँ और क्रेडेंशियल प्रबंधित करें।","आपके क्रेडेंशियल केवल आपके ब्राउज़र में सहेजे जाते हैं, किसी सर्वर पर नहीं।","सेटिंग्स पर वापस जाएँ","फ़ॉलोअर्स","रेपो"],
        pt: ["Gerencie as preferências do app e suas credenciais.","Suas credenciais ficam salvas apenas no seu navegador e nunca em um servidor.","Voltar às configurações","Seguidores","Repositórios"],
        ko: ["앱 환경설정과 자격 증명을 관리합니다.","자격 증명은 브라우저에만 저장되며 서버에는 저장되지 않습니다.","설정으로 돌아가기","팔로워","저장소"]
    };
    const XK = ['settingsSub','privacySub','back','followers','repos'];
    // names used by templates/app.js -> dictionary keys
    const ALIAS = { privacyT:'privacy', privacyLink:'privacy', ghLabel:'ghToken', gemLabel:'geminiKey', profileT:'profile', connectP:'profileEmpty', starredT:'starred', starred:'starredBtn', ai:'aiBtn', none:'noRepos', needFollow:'needKey', needGem:'needKey', needStar:'needKey', needStarred:'needKey', goSettings:'settings', analyzing:'loading', followingN:'following' };
    const getLang = () => { try { return localStorage.getItem('lang') || 'en'; } catch (_) { return 'en'; } };
    function t(key) {
        if (key === 'nodesc') return '—';
        const l = D[getLang()] ? getLang() : 'en';
        const xi = XK.indexOf(key);
        if (xi > -1) return (X[l] || X.en)[xi];
        const k = ALIAS[key] || key;
        const i = KEYS.indexOf(k);
        return i < 0 ? key : ((D[l] || D.en)[i] || D.en[i]);
    }
    function apply() {
        const l = D[getLang()] ? getLang() : 'en';
        document.documentElement.lang = l;
        document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
        document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
        document.querySelectorAll('[data-i18n-ph]').forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
    }
    window.I18N = { t, apply };
})();
