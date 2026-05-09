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
    }

    attachEventListeners() {
        this.elements.brand.addEventListener('input', (e) => this.handleBrandInput(e));
        this.elements.brand.addEventListener('change', (e) => this.handleBrandChange(e));
        this.elements.brand.addEventListener('focus', (e) => this.handleBrandFocus(e));
        this.elements.brandDropdownBtn.addEventListener('click', (e) => this.showAllBrands(e));
        this.elements.model.addEventListener('change', (e) => this.handleModelChange(e));
        this.elements.code.addEventListener('change', (e) => this.handleCodeChange(e));
        this.elements.country.addEventListener('change', (e) => this.handleCountryChange(e));
        this.elements.wiki_code.addEventListener('change', (e) => this.handleWikiCodeChange(e));
        this.elements.year.addEventListener('change', (e) => this.handleYearChange(e));
        this.elements.vehicle_structure.addEventListener('change', (e) => this.handleVehicleStructureChange(e));
        this.elements.searchBtn.addEventListener('click', () => this.search());
        this.elements.resetBtn.addEventListener('click', () => this.reset());
    }

    async loadBrands() {
        try {
            const response = await this.fetchAPI('/api/brands');
            const brands = await response.json();
            this.brands = brands;
            this.populateDatalist(this.elements.brandList, brands);
            this.elements.brand.disabled = false;
        } catch (error) {
            this.showError('加载品牌列表失败: ' + error.message);
        }
    }

    handleBrandFocus(event) {
        if (!this.elements.brand.value) {
            this.showAllBrands();
        }
    }

    showAllBrands(event) {
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
        datalistElement.innerHTML = '';
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            datalistElement.appendChild(optionElement);
        });
    }

    async handleBrandChange(event) {
        const brand = event.target.value;
        this.currentSelection.brand = brand;
        
        if (!brand) {
            this.resetSubsequentSelects('brand');
            this.updateSearchButtonState();
            return;
        }

        try {
            this.showLoading(true);
            const response = await this.fetchAPI(`/api/models?brand=${encodeURIComponent(brand)}`);
            const models = await response.json();
            this.populateSelect(this.elements.model, models, '请选择车型');
            this.elements.model.disabled = false;
            this.resetSubsequentSelects('model');
            this.updateSearchButtonState();
            this.showLoading(false);
        } catch (error) {
            this.showError('加载车型列表失败: ' + error.message);
            this.showLoading(false);
        }
    }

    async handleModelChange(event) {
        const model = event.target.value;
        this.currentSelection.model = model;
        
        if (!model) {
            this.resetSubsequentSelects('model');
            return;
        }

        try {
            this.showLoading(true);
            const response = await this.fetchAPI(`/api/codes?brand=${encodeURIComponent(this.currentSelection.brand)}&model=${encodeURIComponent(model)}`);
            const codes = await response.json();
            this.populateSelect(this.elements.code, codes, '请选择代码');
            this.elements.code.disabled = false;
            this.resetSubsequentSelects('code');
            this.showLoading(false);
        } catch (error) {
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
            this.populateSelect(this.elements.country, countries, '请选择国家');
            this.elements.country.disabled = false;
            this.resetSubsequentSelects('country');
            this.showLoading(false);
        } catch (error) {
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
            this.populateSelect(this.elements.wiki_code, wikiCodes, '请选择维基显示代码');
            this.elements.wiki_code.disabled = false;
            this.resetSubsequentSelects('wiki_code');
            this.showLoading(false);
        } catch (error) {
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
            this.populateSelect(this.elements.year, years, '请选择年份');
            this.elements.year.disabled = false;
            this.resetSubsequentSelects('year');
            this.showLoading(false);
        } catch (error) {
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
            this.populateSelect(this.elements.vehicle_structure, structures, '请选择车结构');
            this.elements.vehicle_structure.disabled = false;
            this.showLoading(false);
        } catch (error) {
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
            select.innerHTML = '';
            select.disabled = true;
            this.currentSelection[selectOrder[i]] = '';
        }
        
        this.updateSearchButtonState();
        this.elements.resultsSection.classList.add('hidden');
        this.elements.resultsContainer.innerHTML = '';
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

            const response = await this.fetchAPI(`/api/search?${params.toString()}`);
            const results = await response.json();
            
            this.displayResults(results);
            this.showLoading(false);
        } catch (error) {
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
        Object.keys(this.currentSelection).forEach(key => {
            this.currentSelection[key] = '';
        });

        Object.values(this.elements).forEach(element => {
            if (element && element.tagName === 'SELECT') {
                element.innerHTML = '';
                element.disabled = true;
            }
        });

        this.elements.brand.value = '';
        this.elements.brand.disabled = false;
        this.elements.searchBtn.disabled = true;
        this.elements.resultsSection.classList.add('hidden');
        this.elements.resultsContainer.innerHTML = '';
        this.elements.errorMessage.classList.add('hidden');
        
        this.loadBrands();
    }

    showLoading(show) {
        this.elements.loading.classList.toggle('hidden', !show);
    }

    showError(message) {
        this.elements.errorMessage.textContent = message;
        this.elements.errorMessage.classList.remove('hidden');
    }

    async fetchAPI(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WiperQueryApp();
});