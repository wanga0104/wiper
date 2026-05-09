// 调试版本的脚本，用于排查问题
class WiperQueryApp {
    constructor() {
        this.currentSelection = {
            brand: '',
            model: '',
            code: '',
            country: '',
            wiki_code: '',
            year: '',
            vehicle_structure: ''
        };
        
        this.initElements();
        this.attachEventListeners();
        this.loadBrands();
        
        // 添加调试信息
        console.log('🚀 雨刮器查询系统初始化');
        console.log('📋 元素状态:', this.elements);
    }

    initElements() {
        this.elements = {
            brand: document.getElementById('brand'),
            brandDropdownBtn: document.getElementById('brand-dropdown-btn'),
            brandList: document.getElementById('brand-list'),
            model: document.getElementById('model'),
            code: document.getElementById('code'),
            country: document.getElementById('country'),
            wiki_code: document.getElementById('wiki_code'),
            year: document.getElementById('year'),
            vehicle_structure: document.getElementById('vehicle_structure'),
            searchBtn: document.getElementById('search-btn'),
            resetBtn: document.getElementById('reset-btn'),
            resultsSection: document.getElementById('results-section'),
            resultsContainer: document.getElementById('results-container'),
            loading: document.getElementById('loading'),
            errorMessage: document.getElementById('error-message')
        };
        
        this.debounceTimer = null;
        this.brands = [];
        
        // 检查关键元素是否存在
        if (!this.elements.brand) {
            console.error('❌ 品牌输入框未找到');
        }
        if (!this.elements.brandList) {
            console.error('❌ 品牌列表未找到');
        }
    }

    attachEventListeners() {
        console.log('🔗 绑定事件监听器');
        
        if (this.elements.brand) {
            this.elements.brand.addEventListener('input', (e) => this.handleBrandInput(e));
            this.elements.brand.addEventListener('change', (e) => this.handleBrandChange(e));
            this.elements.brand.addEventListener('focus', (e) => this.handleBrandFocus(e));
            console.log('✓ 品牌输入框事件已绑定');
        }
        
        if (this.elements.brandDropdownBtn) {
            this.elements.brandDropdownBtn.addEventListener('click', (e) => this.showAllBrands(e));
            console.log('✓ 品牌下拉按钮事件已绑定');
        }
        
        if (this.elements.model) {
            this.elements.model.addEventListener('change', (e) => this.handleModelChange(e));
        }
        
        if (this.elements.code) {
            this.elements.code.addEventListener('change', (e) => this.handleCodeChange(e));
        }
        
        if (this.elements.country) {
            this.elements.country.addEventListener('change', (e) => this.handleCountryChange(e));
        }
        
        if (this.elements.wiki_code) {
            this.elements.wiki_code.addEventListener('change', (e) => this.handleWikiCodeChange(e));
        }
        
        if (this.elements.year) {
            this.elements.year.addEventListener('change', (e) => this.handleYearChange(e));
        }
        
        if (this.elements.vehicle_structure) {
            this.elements.vehicle_structure.addEventListener('change', (e) => this.handleVehicleStructureChange(e));
        }
        
        if (this.elements.searchBtn) {
            this.elements.searchBtn.addEventListener('click', () => this.search());
        }
        
        if (this.elements.resetBtn) {
            this.elements.resetBtn.addEventListener('click', () => this.reset());
        }
    }

    async loadBrands() {
        console.log('📥 开始加载品牌列表');
        
        try {
            const response = await this.fetchAPI('/api/brands');
            console.log('📡 API响应状态:', response.status);
            
            const brands = await response.json();
            this.brands = brands;
            console.log('📊 加载到的品牌数量:', brands.length);
            console.log('📋 品牌列表示例:', brands.slice(0, 5));
            
            this.populateDatalist(this.elements.brandList, brands);
            
            if (this.elements.brand) {
                this.elements.brand.disabled = false;
                console.log('✅ 品牌输入框已启用');
            }
        } catch (error) {
            console.error('❌ 加载品牌列表失败:', error);
            this.showError('加载品牌列表失败: ' + error.message);
        }
    }

    handleBrandFocus(event) {
        console.log('🎯 品牌输入框获得焦点');
        if (!this.elements.brand.value) {
            this.showAllBrands();
        }
    }

    showAllBrands(event) {
        console.log('📋 显示所有品牌');
        
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        this.elements.brand.focus();
        this.populateDatalist(this.elements.brandList, this.brands);
        
        if (!this.elements.brand.value) {
            this.elements.brand.value = ' ';
            this.elements.brand.value = '';
        }
    }

    handleBrandInput(event) {
        const value = event.target.value.trim();
        console.log('⌨️ 品牌输入:', value);
        
        clearTimeout(this.debounceTimer);
        
        if (!value) {
            this.resetSubsequentSelects('brand');
            this.updateSearchButtonState();
            return;
        }
        
        this.debounceTimer = setTimeout(() => {
            this.filterDatalistOptions(value);
        }, 300);
    }

    filterDatalistOptions(searchTerm) {
        const options = this.elements.brandList.querySelectorAll('option');
        const lowerSearchTerm = searchTerm.toLowerCase();
        
        console.log('🔍 过滤品牌，搜索词:', searchTerm);
        
        options.forEach(option => {
            const value = option.value.toLowerCase();
            if (value.includes(lowerSearchTerm)) {
                option.style.display = '';
            } else {
                option.style.display = 'none';
            }
        });
    }

    populateDatalist(datalistElement, options) {
        console.log('📝 填充数据列表，选项数量:', options.length);
        
        datalistElement.innerHTML = '';
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            datalistElement.appendChild(optionElement);
        });
        
        console.log('✅ 数据列表填充完成');
    }

    async handleBrandChange(event) {
        const brand = event.target.value;
        this.currentSelection.brand = brand;
        
        console.log('🔄 品牌变更:', brand);
        
        if (!brand) {
            this.resetSubsequentSelects('brand');
            this.updateSearchButtonState();
            return;
        }

        try {
            this.showLoading(true);
            console.log('📡 请求车型列表，品牌:', brand);
            
            const response = await this.fetchAPI(`/api/models?brand=${encodeURIComponent(brand)}`);
            const models = await response.json();
            
            console.log('📊 车型数量:', models.length);
            
            this.populateSelect(this.elements.model, models, '请选择车型');
            this.elements.model.disabled = false;
            this.resetSubsequentSelects('model');
            this.updateSearchButtonState();
            
            this.showLoading(false);
        } catch (error) {
            console.error('❌ 加载车型列表失败:', error);
            this.showError('加载车型列表失败: ' + error.message);
            this.showLoading(false);
        }
    }

    async handleModelChange(event) {
        const model = event.target.value;
        this.currentSelection.model = model;
        
        console.log('🔄 车型变更:', model);
        
        if (!model) {
            this.resetSubsequentSelects('model');
            return;
        }

        try {
            this.showLoading(true);
            const response = await this.fetchAPI(`/api/codes?brand=${encodeURIComponent(this.currentSelection.brand)}&model=${encodeURIComponent(model)}`);
            const codes = await response.json();
            console.log('📊 代码数量:', codes.length);
            
            if (codes && codes.length > 0) {
                this.populateSelect(this.elements.code, codes, '请选择代码');
                this.elements.code.disabled = false;
                this.showField('code');
                this.resetSubsequentSelects('code');
                console.log('✅ 显示代码字段');
            } else {
                this.hideSubsequentFields('code');
                console.log('🚫 隐藏代码字段（无数据）');
            }
            
            this.showLoading(false);
        } catch (error) {
            console.error('❌ 加载代码列表失败:', error);
            this.showError('加载代码列表失败: ' + error.message);
            this.showLoading(false);
        }
    }

    async handleCodeChange(event) {
        const code = event.target.value;
        this.currentSelection.code = code;
        
        if (!code) {
            this.resetSubsequentSelects('code');
            return;
        }

        try {
            this.showLoading(true);
            const response = await this.fetchAPI(`/api/countries?brand=${encodeURIComponent(this.currentSelection.brand)}&model=${encodeURIComponent(this.currentSelection.model)}&code=${encodeURIComponent(code)}`);
            const countries = await response.json();
            console.log('📊 国家数量:', countries.length);
            
            if (countries && countries.length > 0) {
                this.populateSelect(this.elements.country, countries, '请选择国家');
                this.elements.country.disabled = false;
                this.showField('country');
                this.resetSubsequentSelects('country');
                console.log('✅ 显示国家字段');
            } else {
                this.hideSubsequentFields('country');
                console.log('🚫 隐藏国家字段（无数据）');
            }
            
            this.showLoading(false);
        } catch (error) {
            console.error('❌ 加载国家列表失败:', error);
            this.showError('加载国家列表失败: ' + error.message);
            this.showLoading(false);
        }
    }

    async handleCountryChange(event) {
        const country = event.target.value;
        this.currentSelection.country = country;
        
        if (!country) {
            this.resetSubsequentSelects('country');
            return;
        }

        try {
            this.showLoading(true);
            const response = await this.fetchAPI(`/api/wiki-codes?brand=${encodeURIComponent(this.currentSelection.brand)}&model=${encodeURIComponent(this.currentSelection.model)}&code=${encodeURIComponent(this.currentSelection.code)}&country=${encodeURIComponent(country)}`);
            const wikiCodes = await response.json();
            console.log('📊 维基代码数量:', wikiCodes.length);
            
            if (wikiCodes && wikiCodes.length > 0) {
                this.populateSelect(this.elements.wiki_code, wikiCodes, '请选择维基显示代码');
                this.elements.wiki_code.disabled = false;
                this.showField('wiki_code');
                this.resetSubsequentSelects('wiki_code');
                console.log('✅ 显示维基代码字段');
            } else {
                this.hideSubsequentFields('wiki_code');
                console.log('🚫 隐藏维基代码字段（无数据）');
            }
            
            this.showLoading(false);
        } catch (error) {
            console.error('❌ 加载维基代码列表失败:', error);
            this.showError('加载维基代码列表失败: ' + error.message);
            this.showLoading(false);
        }
    }

    async handleWikiCodeChange(event) {
        const wikiCode = event.target.value;
        this.currentSelection.wiki_code = wikiCode;
        
        if (!wikiCode) {
            this.resetSubsequentSelects('wiki_code');
            return;
        }

        try {
            this.showLoading(true);
            const response = await this.fetchAPI(`/api/years?brand=${encodeURIComponent(this.currentSelection.brand)}&model=${encodeURIComponent(this.currentSelection.model)}&code=${encodeURIComponent(this.currentSelection.code)}&country=${encodeURIComponent(this.currentSelection.country)}&wiki_code=${encodeURIComponent(wikiCode)}`);
            const years = await response.json();
            console.log('📊 年份数量:', years.length);
            
            if (years && years.length > 0) {
                this.populateSelect(this.elements.year, years, '请选择年份');
                this.elements.year.disabled = false;
                this.showField('year');
                this.resetSubsequentSelects('year');
                console.log('✅ 显示年份字段');
            } else {
                this.hideSubsequentFields('year');
                console.log('🚫 隐藏年份字段（无数据）');
            }
            
            this.showLoading(false);
        } catch (error) {
            console.error('❌ 加载年份列表失败:', error);
            this.showError('加载年份列表失败: ' + error.message);
            this.showLoading(false);
        }
    }

    async handleYearChange(event) {
        const year = event.target.value;
        this.currentSelection.year = year;
        
        if (!year) {
            this.resetSubsequentSelects('year');
            return;
        }

        try {
            this.showLoading(true);
            const response = await this.fetchAPI(`/api/vehicle-structures?brand=${encodeURIComponent(this.currentSelection.brand)}&model=${encodeURIComponent(this.currentSelection.model)}&code=${encodeURIComponent(this.currentSelection.code)}&country=${encodeURIComponent(this.currentSelection.country)}&wiki_code=${encodeURIComponent(this.currentSelection.wiki_code)}&year=${encodeURIComponent(year)}`);
            const structures = await response.json();
            console.log('📊 车结构数量:', structures.length);
            
            if (structures && structures.length > 0) {
                this.populateSelect(this.elements.vehicle_structure, structures, '请选择车结构');
                this.elements.vehicle_structure.disabled = false;
                this.showField('vehicle_structure');
                console.log('✅ 显示车结构字段');
            } else {
                this.hideSubsequentFields('vehicle_structure');
                console.log('🚫 隐藏车结构字段（无数据）');
            }
            
            this.showLoading(false);
        } catch (error) {
            console.error('❌ 加载车结构列表失败:', error);
            this.showError('加载车结构列表失败: ' + error.message);
            this.showLoading(false);
        }
    }

    async handleVehicleStructureChange(event) {
        const structure = event.target.value;
        this.currentSelection.vehicle_structure = structure;
        this.updateSearchButtonState();
    }

    updateSearchButtonState() {
        const { brand, model } = this.currentSelection;
        this.elements.searchBtn.disabled = !brand || !model;
        console.log('🔍 搜索按钮状态:', !this.elements.searchBtn.disabled ? '启用' : '禁用');
    }

    populateSelect(selectElement, options, placeholder) {
        selectElement.innerHTML = `<option value="">${placeholder}</option>`;
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option || '未设置';
            selectElement.appendChild(optionElement);
        });
    }

    resetSubsequentSelects(lastSelect) {
        const selectOrder = ['brand', 'model', 'code', 'country', 'wiki_code', 'year', 'vehicle_structure'];
        const lastIndex = selectOrder.indexOf(lastSelect);
        
        for (let i = lastIndex + 1; i < selectOrder.length; i++) {
            const select = this.elements[selectOrder[i]];
            if (select) {
                select.innerHTML = '';
                select.disabled = true;
            }
            this.currentSelection[selectOrder[i]] = '';
        }
        
        this.updateSearchButtonState();
        this.elements.resultsSection.classList.add('hidden');
        this.elements.resultsContainer.innerHTML = '';
    }

    showField(fieldName) {
        const fieldGroup = document.getElementById(`${fieldName}-group`);
        if (fieldGroup) {
            fieldGroup.classList.remove('hidden');
            console.log(`👁️ 显示字段: ${fieldName}`);
        }
    }

    hideSubsequentFields(lastField) {
        const fieldOrder = ['code', 'country', 'wiki_code', 'year', 'vehicle_structure'];
        const lastIndex = fieldOrder.indexOf(lastField);
        
        console.log(`🙈 隐藏字段，从 ${lastField} 开始`);
        
        for (let i = lastIndex + 1; i < fieldOrder.length; i++) {
            const fieldGroup = document.getElementById(`${fieldOrder[i]}-group`);
            if (fieldGroup) {
                fieldGroup.classList.add('hidden');
                console.log(`🙈 隐藏字段: ${fieldOrder[i]}`);
            }
        }
    }

    async search() {
        if (!this.currentSelection.brand || !this.currentSelection.model) {
            this.showError('请至少选择品牌和车型');
            return;
        }

        try {
            this.showLoading(true);
            this.elements.errorMessage.classList.add('hidden');
            
            const params = new URLSearchParams();
            Object.keys(this.currentSelection).forEach(key => {
                if (this.currentSelection[key]) {
                    params.append(key, this.currentSelection[key]);
                }
            });

            console.log('🔍 执行搜索，参数:', params.toString());

            const response = await this.fetchAPI(`/api/search?${params.toString()}`);
            const results = await response.json();
            
            console.log('📊 搜索结果数量:', results.length);
            
            this.displayResults(results);
            this.showLoading(false);
        } catch (error) {
            console.error('❌ 查询失败:', error);
            this.showError('查询失败: ' + error.message);
            this.showLoading(false);
        }
    }

    displayResults(results) {
        this.elements.resultsContainer.innerHTML = '';
        
        if (!results || results.length === 0) {
            this.elements.resultsContainer.innerHTML = '<div class="no-results">未找到匹配的雨刮器信息</div>';
            this.elements.resultsSection.classList.remove('hidden');
            return;
        }

        results.forEach(result => {
            const card = document.createElement('div');
            card.className = 'result-card';
            
            card.innerHTML = `
                <h3>${result.brand} ${result.model}</h3>
                <div class="result-details">
                    <div class="result-item">
                        <strong>代码</strong>
                        <span>${result.code || '未设置'}</span>
                    </div>
                    <div class="result-item">
                        <strong>国家</strong>
                        <span>${result.country || '未设置'}</span>
                    </div>
                    <div class="result-item">
                        <strong>维基代码</strong>
                        <span>${result.wiki_code || '未设置'}</span>
                    </div>
                    <div class="result-item">
                        <strong>年份</strong>
                        <span>${result.year || '未设置'}</span>
                    </div>
                    <div class="result-item">
                        <strong>车结构</strong>
                        <span>${result.vehicle_structure || '未设置'}</span>
                    </div>
                </div>
                <div class="wiper-info">
                    <h4>适配雨刮器规格</h4>
                    <div class="wiper-specs">
                        <div class="wiper-spec">
                            <strong>${result.wiper_size || '未知'}</strong>
                            <span>尺寸</span>
                        </div>
                        <div class="wiper-spec">
                            <strong>${result.connector_type || '未知'}</strong>
                            <span>接头类型</span>
                        </div>
                    </div>
                </div>
            `;
            
            this.elements.resultsContainer.appendChild(card);
        });
        
        this.elements.resultsSection.classList.remove('hidden');
    }

    reset() {
        console.log('🔄 重置表单');
        
        Object.keys(this.currentSelection).forEach(key => {
            this.currentSelection[key] = '';
        });

        Object.values(this.elements).forEach(element => {
            if (element && element.tagName === 'SELECT') {
                element.innerHTML = '';
                element.disabled = true;
            }
        });

        if (this.elements.brand) {
            this.elements.brand.value = '';
            this.elements.brand.disabled = false;
        }
        
        if (this.elements.searchBtn) {
            this.elements.searchBtn.disabled = true;
        }
        
        if (this.elements.resultsSection) {
            this.elements.resultsSection.classList.add('hidden');
        }
        
        if (this.elements.resultsContainer) {
            this.elements.resultsContainer.innerHTML = '';
        }
        
        if (this.elements.errorMessage) {
            this.elements.errorMessage.classList.add('hidden');
        }
        
        this.hideAllOptionalFields();
    }

    hideAllOptionalFields() {
        const fieldOrder = ['code', 'country', 'wiki_code', 'year', 'vehicle_structure'];
        fieldOrder.forEach(fieldName => {
            const fieldGroup = document.getElementById(`${fieldName}-group`);
            if (fieldGroup) {
                fieldGroup.classList.add('hidden');
            }
        });
        console.log('🙈 隐藏所有可选字段');
    }

    showLoading(show) {
        if (this.elements.loading) {
            this.elements.loading.classList.toggle('hidden', !show);
        }
    }

    showError(message) {
        if (this.elements.errorMessage) {
            this.elements.errorMessage.textContent = message;
            this.elements.errorMessage.classList.remove('hidden');
        }
    }

    async fetchAPI(url) {
        console.log('📡 请求API:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ API请求失败:', response.status, errorText);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        
        console.log('✅ API请求成功');
        return response;
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM加载完成，初始化应用');
    try {
        new WiperQueryApp();
    } catch (error) {
        console.error('❌ 应用初始化失败:', error);
    }
});