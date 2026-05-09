const translations = {
    zh: {
        title: '雨刮器查询系统',
        subtitle: '快速查找适配雨刮器',
        brand: '品牌',
        model: '车型',
        code: '代码',
        country: '国家',
        wikiCode: '维基显示代码',
        year: '年份',
        vehicleStructure: '车结构',
        required: '*',
        brandPlaceholder: '输入品牌名称或点击选择',
        selectBrandFirst: '请先选择品牌',
        selectModel: '请选择车型',
        selectCode: '请选择代码',
        selectCountry: '请选择国家',
        selectWikiCode: '请选择维基代码',
        selectYear: '请选择年份',
        selectStructure: '请选择车结构',
        searchBtn: '查询雨刮器',
        resetBtn: '重置',
        resultsTitle: '查询结果',
        loading: '查询中...',
        noResults: '未找到匹配的雨刮器信息',
        brandLoadError: '加载品牌列表失败: ',
        modelLoadError: '加载车型列表失败: ',
        codeLoadError: '加载代码列表失败: ',
        countryLoadError: '加载国家列表失败: ',
        wikiCodeLoadError: '加载维基代码列表失败: ',
        yearLoadError: '加载年份列表失败: ',
        structureLoadError: '加载车结构列表失败: ',
        searchError: '查询失败: ',
        selectBrandModel: '请至少选择品牌和车型',
        notSet: '未设置',
        unknown: '未知',
        wiperSpec: '适配雨刮器规格',
        size: '尺寸',
        connectorType: '接头类型',
        showAllBrands: '显示所有品牌',
    },
    en: {
        title: 'Wiper Query System',
        subtitle: 'Quickly find matching wipers',
        brand: 'Brand',
        model: 'Model',
        code: 'Code',
        country: 'Country',
        wikiCode: 'Wiki Code',
        year: 'Year',
        vehicleStructure: 'Body Type',
        required: '*',
        brandPlaceholder: 'Enter or select brand',
        selectBrandFirst: 'Select brand first',
        selectModel: 'Select model',
        selectCode: 'Select code',
        selectCountry: 'Select country',
        selectWikiCode: 'Select wiki code',
        selectYear: 'Select year',
        selectStructure: 'Select body type',
        searchBtn: 'Search Wipers',
        resetBtn: 'Reset',
        resultsTitle: 'Search Results',
        loading: 'Searching...',
        noResults: 'No matching wipers found',
        brandLoadError: 'Failed to load brands: ',
        modelLoadError: 'Failed to load models: ',
        codeLoadError: 'Failed to load codes: ',
        countryLoadError: 'Failed to load countries: ',
        wikiCodeLoadError: 'Failed to load wiki codes: ',
        yearLoadError: 'Failed to load years: ',
        structureLoadError: 'Failed to load body types: ',
        searchError: 'Search failed: ',
        selectBrandModel: 'Please select at least brand and model',
        notSet: 'Not set',
        unknown: 'Unknown',
        wiperSpec: 'Wiper Specifications',
        size: 'Size',
        connectorType: 'Connector',
    },
    ru: {
        title: 'Система подбора дворников',
        subtitle: 'Быстрый подбор подходящих дворников',
        brand: 'Марка',
        model: 'Модель',
        code: 'Код',
        country: 'Страна',
        wikiCode: 'Код Wiki',
        year: 'Год',
        vehicleStructure: 'Тип кузова',
        required: '*',
        brandPlaceholder: 'Введите или выберите марку',
        selectBrandFirst: 'Сначала выберите марку',
        selectModel: 'Выберите модель',
        selectCode: 'Выберите код',
        selectCountry: 'Выберите страну',
        selectWikiCode: 'Выберите код Wiki',
        selectYear: 'Выберите год',
        selectStructure: 'Выберите тип кузова',
        searchBtn: 'Подобрать дворники',
        resetBtn: 'Сброс',
        resultsTitle: 'Результаты поиска',
        loading: 'Поиск...',
        noResults: 'Подходящие дворники не найдены',
        brandLoadError: 'Ошибка загрузки марок: ',
        modelLoadError: 'Ошибка загрузки моделей: ',
        codeLoadError: 'Ошибка загрузки кодов: ',
        countryLoadError: 'Ошибка загрузки стран: ',
        wikiCodeLoadError: 'Ошибка загрузки кодов Wiki: ',
        yearLoadError: 'Ошибка загрузки годов: ',
        structureLoadError: 'Ошибка загрузки типов кузова: ',
        searchError: 'Ошибка поиска: ',
        selectBrandModel: 'Пожалуйста, выберите марку и модель',
        notSet: 'Не указано',
        unknown: 'Неизвестно',
        wiperSpec: 'Характеристики дворников',
        size: 'Размер',
        connectorType: 'Тип крепления',
    }
};

class I18n {
    constructor() {
        this.supportedLangs = ['zh', 'en', 'ru'];
        this.langLabels = {
            zh: '中文',
            en: 'EN',
            ru: 'РУС'
        };
        this.currentLang = this.detectLanguage();
    }

    detectLanguage() {
        const stored = localStorage.getItem('wiper-lang');
        if (stored && this.supportedLangs.includes(stored)) {
            return stored;
        }
        const browserLang = navigator.language || navigator.userLanguage || 'zh';
        const prefix = browserLang.toLowerCase().split('-')[0];
        if (this.supportedLangs.includes(prefix)) {
            return prefix;
        }
        return 'zh';
    }

    setLanguage(lang) {
        if (!this.supportedLangs.includes(lang)) return;
        this.currentLang = lang;
        localStorage.setItem('wiper-lang', lang);
    }

    t(key) {
        return translations[this.currentLang][key] || translations['zh'][key] || key;
    }
}