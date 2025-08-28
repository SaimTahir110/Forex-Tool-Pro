const currencyPairs = [
    { pair: 'EUR/USD', price: 1.0852, change: 0.0012 },
    { pair: 'GBP/USD', price: 1.2653, change: -0.0008 },
    { pair: 'USD/JPY', price: 147.65, change: 0.24 },
    { pair: 'USD/CHF', price: 0.8847, change: -0.0015 },
    { pair: 'AUD/USD', price: 0.6552, change: 0.0007 },
    { pair: 'USD/CAD', price: 1.3551, change: -0.0009 },
    { pair: 'NZD/USD', price: 0.6053, change: 0.0005 },
    { pair: 'EUR/GBP', price: 0.8572, change: 0.0006 },
    { pair: 'EUR/JPY', price: 160.12, change: 0.35 },
    { pair: 'GBP/JPY', price: 186.75, change: 0.28 },
    { pair: 'EUR/CHF', price: 0.9605, change: -0.0008 },
    { pair: 'AUD/JPY', price: 96.58, change: 0.21 },
    { pair: 'GBP/CAD', price: 1.7152, change: -0.0012 },
    { pair: 'EUR/CAD', price: 1.4703, change: 0.0007 },
    { pair: 'USD/SGD', price: 1.3452, change: -0.0005 }
];

let selectedPairs = JSON.parse(localStorage.getItem('selectedPairs')) || [];

const rates = {
    USD: { EUR: 0.9217, GBP: 0.7902, JPY: 147.65, CHF: 0.8847, AUD: 1.5267, CAD: 1.3551, NZD: 1.6517, SGD: 1.3452, USD: 1 },
    EUR: { USD: 1.0852, GBP: 0.8572, JPY: 160.12, CHF: 0.9605, AUD: 1.6569, CAD: 1.4703, NZD: 1.7918, SGD: 1.4596, EUR: 1 },
    GBP: { USD: 1.2653, EUR: 1.1665, JPY: 186.75, CHF: 1.1197, AUD: 1.9320, CAD: 1.7152, NZD: 2.0902, SGD: 1.7020, GBP: 1 },
    JPY: { USD: 0.0068, EUR: 0.0062, GBP: 0.0054, CHF: 0.0060, AUD: 0.0103, CAD: 0.0092, NZD: 0.0112, SGD: 0.0091, JPY: 1 },
    CHF: { USD: 1.1303, EUR: 1.0412, GBP: 0.8930, JPY: 166.89, AUD: 1.7268, CAD: 1.5316, NZD: 1.8668, SGD: 1.5201, CHF: 1 },
    AUD: { USD: 0.6552, EUR: 0.6036, GBP: 0.5177, JPY: 96.58, CHF: 0.5789, CAD: 0.8876, NZD: 1.0817, SGD: 0.8807, AUD: 1 },
    CAD: { USD: 0.7379, EUR: 0.6799, GBP: 0.5830, JPY: 108.86, CHF: 0.6526, AUD: 1.1266, NZD: 1.3730, SGD: 1.1180, CAD: 1 },
    NZD: { USD: 0.6053, EUR: 0.5579, GBP: 0.4784, JPY: 89.36, CHF: 0.5356, AUD: 0.9245, CAD: 0.7283, SGD: 0.5932, NZD: 1 },
    SGD: { USD: 0.7433, EUR: 0.6852, GBP: 0.5875, JPY: 109.73, CHF: 0.6578, AUD: 1.1353, CAD: 0.8945, NZD: 1.6854, SGD: 1 }
};

function validateInputs(...inputs) {
    return inputs.every(input => input !== null && !isNaN(input) && input >= 0);
}

function initTicker() {
    const ticker = document.querySelector('.ticker');
    ticker.innerHTML = '';
    for (let i = 0; i < 2; i++) {
        currencyPairs.forEach(item => {
            const tickerItem = document.createElement('div');
            tickerItem.className = 'ticker-item';
            tickerItem.innerHTML = `
                <span class="ticker-pair">${item.pair}</span>
                <span class="ticker-price">${item.price.toFixed(4)}</span>
                <span class="${item.change >= 0 ? 'positive' : 'negative'}">
                    ${item.change >= 0 ? '+' : ''}${item.change.toFixed(4)}
                </span>
            `;
            ticker.appendChild(tickerItem);
        });
    }
}

function updateTicker() {
    const tickerItems = document.querySelectorAll('.ticker-item');
    currencyPairs.forEach((item, index) => {
        const change = (Math.random() - 0.5) * 0.01;
        item.price += change;
        item.change = change;
        [index, index + currencyPairs.length].forEach(i => {
            if (tickerItems[i]) {
                const changeElement = tickerItems[i].querySelector('span:last-child');
                tickerItems[i].querySelector('.ticker-price').textContent = item.price.toFixed(4);
                changeElement.textContent = `${change >= 0 ? '+' : ''}${change.toFixed(4)}`;
                changeElement.className = change >= 0 ? 'positive' : 'negative';
            }
        });
    });
}

function initLiveRatesTable() {
    const ratesTable = document.getElementById('live-rates-table');
    if (ratesTable) {
        ratesTable.innerHTML = `
            <tr>
                <th>Pair</th>
                <th>Price</th>
                <th>Change</th>
            </tr>
        `;
        currencyPairs.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.pair}</td>
                <td>${item.price.toFixed(4)}</td>
                <td class="${item.change >= 0 ? 'positive' : 'negative'}">
                    ${item.change >= 0 ? '+' : ''}${item.change.toFixed(4)}
                </td>
            `;
            ratesTable.appendChild(row);
        });
    }
}

function updateLiveRatesTable() {
    const rows = document.querySelectorAll('#live-rates-table tr:not(:first-child)');
    currencyPairs.forEach((item, index) => {
        if (rows[index]) {
            rows[index].children[1].textContent = item.price.toFixed(4);
            rows[index].children[2].textContent = `${item.change >= 0 ? '+' : ''}${item.change.toFixed(4)}`;
            rows[index].children[2].className = item.change >= 0 ? 'positive' : 'negative';
        }
    });
}

function initChartingTool() {
    const canvas = document.getElementById('price-chart');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const pair = document.getElementById('chart-currency-pair')?.value || 'EUR/USD';
        const timeframe = document.getElementById('chart-timeframe')?.value || '1h';
        const prices = Array.from({ length: 20 }, () => ({
            x: new Date(Date.now() - Math.random() * 3600000).toISOString(),
            y: currencyPairs.find(p => p.pair === pair).price + (Math.random() - 0.5) * 0.01
        }));
        new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: `${pair} Price`,
                    data: prices,
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                scales: {
                    x: { type: 'time', title: { display: true, text: 'Time' } },
                    y: { title: { display: true, text: 'Price' } }
                },
                plugins: { legend: { display: true } }
            }
        });
        document.getElementById('update-chart')?.addEventListener('click', () => {
            const newPair = document.getElementById('chart-currency-pair').value;
            const newPrices = Array.from({ length: 20 }, () => ({
                x: new Date(Date.now() - Math.random() * 3600000).toISOString(),
                y: currencyPairs.find(p => p.pair === newPair).price + (Math.random() - 0.5) * 0.01
            }));
            chart.data.datasets[0].label = `${newPair} Price`;
            chart.data.datasets[0].data = newPrices;
            chart.update();
        });
    }
}

function addSocialShareButtons() {
    const tools = [
        'pip-calculator', 'position-calculator', 'margin-calculator', 'profit-calculator',
        'currency-converter', 'lot-converter', 'profit-converter', 'margin-converter',
        'pivot-calculator', 'fibonacci-calculator', 'correlation-matrix', 'volatility-calculator',
        'risk-converter', 'risk-reward-calculator', 'drawdown-calculator', 'position-ratio-calculator',
        'strategy-backtest', 'trade-entry-planner', 'breakout-analyzer', 'trade-journal',
        'economic-impact', 'news-sentiment', 'interest-rate', 'economic-calendar'
    ];
    tools.forEach(tool => {
        const resultContainer = document.getElementById(`${tool}-result-container`);
        if (resultContainer) {
            const shareBtn = document.createElement('button');
            shareBtn.className = 'share-btn';
            shareBtn.textContent = 'Share Result';
            shareBtn.addEventListener('click', () => {
                const resultText = resultContainer.innerText;
                const shareUrl = `https://twitter.com/intent/tweet?text=Check%20out%20my%20${tool.replace('-', '%20')}%20result:%20${encodeURIComponent(resultText)}%20on%20ForexMasterPro!`;
                window.open(shareUrl, '_blank');
            });
            resultContainer.appendChild(shareBtn);
        }
    });
}

function populateCurrencyOptions() {
    const selectors = [
        { id: 'currency-pair', type: 'pair', tool: 'pip-calculator' },
        { id: 'margin-currency-pair', type: 'pair', tool: 'margin-calculator' },
        { id: 'profit-currency-pair', type: 'pair', tool: 'profit-calculator' },
        { id: 'correlation-pair1', type: 'pair', tool: 'correlation-matrix' },
        { id: 'correlation-pair2', type: 'pair', tool: 'correlation-matrix' },
        { id: 'from-currency', type: 'currency', tool: 'currency-converter' },
        { id: 'to-currency', type: 'currency', tool: 'currency-converter' },
        { id: 'profit-base-currency', type: 'currency', tool: 'profit-converter' },
        { id: 'profit-target-currency', type: 'currency', tool: 'profit-converter' },
        { id: 'margin-original-currency', type: 'currency', tool: 'margin-converter' },
        { id: 'margin-target-currency', type: 'currency', tool: 'margin-converter' },
        { id: 'risk-currency', type: 'currency', tool: 'risk-converter' },
        { id: 'account-currency', type: 'currency', tool: 'strategy-backtest' },
        { id: 'entry-currency-pair', type: 'pair', tool: 'trade-entry-planner' },
        { id: 'breakout-currency-pair', type: 'pair', tool: 'breakout-analyzer' },
        { id: 'journal-currency-pair', type: 'pair', tool: 'trade-journal' },
        { id: 'economic-pair', type: 'pair', tool: 'economic-impact' },
        { id: 'news-currency-pair', type: 'pair', tool: 'news-sentiment' },
        { id: 'interest-currency-pair', type: 'pair', tool: 'interest-rate' },
        { id: 'calendar-currency', type: 'currency', tool: 'economic-calendar' },
        { id: 'chart-currency-pair', type: 'pair', tool: 'charting-tool' }
    ];

    selectors.forEach(selector => {
        const select = document.getElementById(selector.id);
        if (select) {
            select.innerHTML = '';
            const options = selector.type === 'pair' ? 
                (selectedPairs.length > 0 ? selectedPairs : currencyPairs.map(p => p.pair)) : 
                [...new Set(currencyPairs.flatMap(p => p.pair.split('/')))];
            options.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option;
                opt.textContent = option;
                select.appendChild(opt);
            });
            if (options.length > 0) {
                select.value = options[0];
            }
        }
    });

    const toolsWithSelection = [
        'pip-calculator', 'margin-calculator', 'profit-calculator', 'currency-converter',
        'profit-converter', 'margin-converter', 'risk-converter', 'correlation-matrix',
        'strategy-backtest', 'trade-entry-planner', 'breakout-analyzer', 'trade-journal',
        'economic-impact', 'news-sentiment', 'interest-rate', 'economic-calendar', 'charting-tool'
    ];

    toolsWithSelection.forEach(tool => {
        const select = document.getElementById(`preferred-pairs-${tool.split('-')[0]}`);
        if (select) {
            select.innerHTML = '';
            const options = tool === 'currency-converter' || 
                           tool === 'profit-converter' || 
                           tool === 'margin-converter' || 
                           tool === 'risk-converter' || 
                           tool === 'strategy-backtest' || 
                           tool === 'economic-calendar' ? 
                [...new Set(currencyPairs.flatMap(p => p.pair.split('/')))] : 
                currencyPairs.map(p => p.pair);
            options.forEach(item => {
                const option = document.createElement('option');
                option.value = item;
                option.textContent = item;
                if (selectedPairs.includes(item)) {
                    option.selected = true;
                }
                select.appendChild(option);
            });
        }
    });
}

function initCurrencySelectionBoxes() {
    const toolsWithSelection = [
        { id: 'pip', tool: 'pip-calculator' },
        { id: 'margin', tool: 'margin-calculator' },
        { id: 'profit', tool: 'profit-calculator' },
        { id: 'converter', tool: 'currency-converter' },
        { id: 'profit-converter', tool: 'profit-converter' },
        { id: 'margin-converter', tool: 'margin-converter' },
        { id: 'risk-converter', tool: 'risk-converter' },
        { id: 'correlation', tool: 'correlation-matrix' },
        { id: 'strategy-backtest', tool: 'strategy-backtest' },
        { id: 'trade-entry', tool: 'trade-entry-planner' },
        { id: 'breakout', tool: 'breakout-analyzer' },
        { id: 'trade-journal', tool: 'trade-journal' },
        { id: 'economic-impact', tool: 'economic-impact' },
        { id: 'news-sentiment', tool: 'news-sentiment' },
        { id: 'interest-rate', tool: 'interest-rate' },
        { id: 'economic-calendar', tool: 'economic-calendar' },
        { id: 'charting', tool: 'charting-tool' }
    ];

    toolsWithSelection.forEach(({ id, tool }) => {
        const saveBtn = document.getElementById(`save-preferences-${id}`);
        const addBtn = document.getElementById(`add-currency-from-${id}`);
        const modal = document.getElementById('add-currency-modal');

        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const select = document.getElementById(`preferred-pairs-${id}`);
                selectedPairs = Array.from(select.selectedOptions).map(option => option.value);
                localStorage.setItem('selectedPairs', JSON.stringify(selectedPairs));
                populateCurrencyOptions();
                alert('Currency preferences saved successfully!');
            });
        }

        if (addBtn && modal) {
            addBtn.addEventListener('click', () => {
                modal.style.display = 'flex';
            });
        }
    });
}

function initAddCurrency() {
    const addCurrencyBtn = document.getElementById('add-currency');
    const modal = document.getElementById('add-currency-modal');
    const closeBtn = document.querySelector('.modal-close');
    const saveCurrencyBtn = document.getElementById('save-currency');

    if (addCurrencyBtn && modal && closeBtn && saveCurrencyBtn) {
        addCurrencyBtn.addEventListener('click', () => {
            modal.style.display = 'flex';
        });

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            document.getElementById('new-currency-pair').value = '';
            document.getElementById('new-exchange-rate').value = '';
        });

        saveCurrencyBtn.addEventListener('click', () => {
            const newPair = document.getElementById('new-currency-pair').value.trim().toUpperCase();
            const newRate = parseFloat(document.getElementById('new-exchange-rate').value);
            if (newPair && newPair.match(/^[A-Z]{3}\/[A-Z]{3}$/) && !isNaN(newRate) && newRate > 0) {
                currencyPairs.push({ pair: newPair, price: newRate, change: 0 });
                const [base, quote] = newPair.split('/');
                updateRatesMatrix(base, quote, newRate);
                populateCurrencyOptions();
                initTicker();
                initLiveRatesTable();
                modal.style.display = 'none';
                document.getElementById('new-currency-pair').value = '';
                document.getElementById('new-exchange-rate').value = '';
                alert(`Currency pair ${newPair} added successfully!`);
            } else {
                alert('Please enter a valid currency pair (e.g., USD/INR) and exchange rate.');
            }
        });
    }
}

function updateRatesMatrix(base, quote, rate) {
    rates[base] = rates[base] || {};
    rates[base][quote] = rate;
    rates[quote] = rates[quote] || {};
    rates[quote][base] = 1 / rate;

    Object.keys(rates).forEach(currency => {
        if (currency !== base && currency !== quote) {
            if (rates[currency][base]) {
                rates[currency][quote] = rates[currency][base] * rate;
                rates[quote][currency] = 1 / rates[currency][quote];
            }
            if (rates[quote][currency]) {
                rates[base][currency] = rates[quote][currency] * rate;
                rates[currency][base] = 1 / rates[base][currency];
            }
        }
    });
}

function initCategoriesAndTools() {
    const categories = document.querySelectorAll('.category');
    const tools = document.querySelectorAll('.tool-content');
    const toolItems = document.querySelectorAll('.tool-item');

    categories.forEach(category => {
        category.addEventListener('click', () => {
            categories.forEach(c => c.classList.remove('active'));
            category.classList.add('active');
            tools.forEach(t => t.classList.remove('active'));
            const activeTool = category.querySelector('.tool-item');
            if (activeTool) {
                const toolId = activeTool.dataset.tool;
                const toolContent = document.getElementById(toolId);
                toolContent.classList.add('active');
                toolContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    toolItems.forEach(item => {
        item.addEventListener('click', () => {
            tools.forEach(t => t.classList.remove('active'));
            const toolContent = document.getElementById(item.dataset.tool);
            toolContent.classList.add('active');
            toolContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

function initCalculators() {
    // Pip Value Calculator
    document.getElementById('calculate-pip').addEventListener('click', () => {
        const pair = document.getElementById('currency-pair').value;
        const tradeSize = parseFloat(document.getElementById('trade-size').value);
        const [base, quote] = pair.split('/');
        if (!validateInputs(tradeSize)) {
            alert('Please enter a valid trade size.');
            return;
        }
        const pipSize = pair.includes('JPY') ? 0.01 : 0.0001;
        const pipValue = tradeSize * pipSize * rates[quote]['USD'];
        document.getElementById('pip-value-result').textContent = `$ ${pipValue.toFixed(2)}`;
    });

    // Position Size Calculator
    document.getElementById('calculate-position').addEventListener('click', () => {
        const balance = parseFloat(document.getElementById('account-balance').value);
        const riskPercentage = parseFloat(document.getElementById('risk-percentage').value);
        const stopLoss = parseInt(document.getElementById('stop-loss').value);
        if (!validateInputs(balance, riskPercentage, stopLoss)) {
            alert('Please enter valid inputs for account balance, risk percentage, and stop loss.');
            return;
        }
        const riskAmount = balance * (riskPercentage / 100);
        const positionSize = (riskAmount / stopLoss / 10000).toFixed(2);
        document.getElementById('position-size-result').textContent = `${positionSize} Lots`;
        document.getElementById('risk-amount-result').textContent = `$ ${riskAmount.toFixed(2)}`;
    });

    // Margin Calculator
    document.getElementById('calculate-margin').addEventListener('click', () => {
        const pair = document.getElementById('margin-currency-pair').value;
        const tradeSize = parseFloat(document.getElementById('margin-trade-size').value);
        const leverage = parseInt(document.getElementById('margin-leverage').value);
        if (!validateInputs(tradeSize, leverage)) {
            alert('Please enter valid inputs for trade size and leverage.');
            return;
        }
        const [base, quote] = pair.split('/');
        const margin = (tradeSize * 100000 / leverage) * rates[base]['USD'];
        document.getElementById('margin-required-result').textContent = `$ ${margin.toFixed(2)}`;
    });

    // Profit Calculator
    document.getElementById('calculate-profit').addEventListener('click', () => {
        const pair = document.getElementById('profit-currency-pair').value;
        const tradeSize = parseFloat(document.getElementById('profit-trade-size').value);
        const entryPrice = parseFloat(document.getElementById('profit-entry-price').value);
        const exitPrice = parseFloat(document.getElementById('profit-exit-price').value);
        if (!validateInputs(tradeSize, entryPrice, exitPrice)) {
            alert('Please enter valid inputs for trade size, entry price, and exit price.');
            return;
        }
        const [base, quote] = pair.split('/');
        const pipSize = pair.includes('JPY') ? 0.01 : 0.0001;
        const pips = (exitPrice - entryPrice) * (1 / pipSize) * (exitPrice > entryPrice ? 1 : -1);
        const profit = pips * tradeSize * pipSize * rates[quote]['USD'];
        document.getElementById('profit-result').textContent = `$ ${profit.toFixed(2)}`;
        document.getElementById('pips-result').textContent = `${pips.toFixed(2)} pips`;
    });

    // Currency Converter
    document.getElementById('convert-currency').addEventListener('click', () => {
        const fromCurrency = document.getElementById('from-currency').value;
        const toCurrency = document.getElementById('to-currency').value;
        const amount = parseFloat(document.getElementById('amount').value);
        if (!validateInputs(amount)) {
            alert('Please enter a valid amount.');
            return;
        }
        const rate = rates[fromCurrency][toCurrency] || 1;
        const converted = amount * rate;
        document.getElementById('conversion-result').textContent = `${toCurrency} ${converted.toFixed(2)}`;
        document.getElementById('exchange-rate').textContent = `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;
    });

    // Lot Size Converter
    document.getElementById('convert-lot').addEventListener('click', () => {
        const amount = parseFloat(document.getElementById('lot-amount').value);
        const fromType = document.getElementById('from-lot-type').value;
        const toType = document.getElementById('to-lot-type').value;
        if (!validateInputs(amount)) {
            alert('Please enter a valid lot amount.');
            return;
        }
        const lotSizes = { standard: 100000, mini: 10000, micro: 1000 };
        const converted = (amount * lotSizes[fromType]) / lotSizes[toType];
        document.getElementById('lot-conversion-result').textContent = `${converted.toFixed(2)} ${toType} lots`;
        document.getElementById('units-result').textContent = `${(converted * lotSizes[toType]).toFixed(0)} units`;
    });

    // Profit Converter
    document.getElementById('convert-profit').addEventListener('click', () => {
        const amount = parseFloat(document.getElementById('profit-amount').value);
        const baseCurrency = document.getElementById('profit-base-currency').value;
        const targetCurrency = document.getElementById('profit-target-currency').value;
        if (!validateInputs(amount)) {
            alert('Please enter a valid profit amount.');
            return;
        }
        const rate = rates[baseCurrency][targetCurrency] || 1;
        const converted = amount * rate;
        document.getElementById('profit-conversion-result').textContent = `${targetCurrency} ${converted.toFixed(2)}`;
        document.getElementById('profit-exchange-rate').textContent = `1 ${baseCurrency} = ${rate.toFixed(4)} ${targetCurrency}`;
    });

    // Margin Converter
    document.getElementById('convert-margin').addEventListener('click', () => {
        const amount = parseFloat(document.getElementById('margin-amount').value);
        const originalCurrency = document.getElementById('margin-original-currency').value;
        const targetCurrency = document.getElementById('margin-target-currency').value;
        if (!validateInputs(amount)) {
            alert('Please enter a valid margin amount.');
            return;
        }
        const rate = rates[originalCurrency][targetCurrency] || 1;
        const converted = amount * rate;
        document.getElementById('margin-conversion-result').textContent = `${targetCurrency} ${converted.toFixed(2)}`;
        document.getElementById('margin-exchange-rate').textContent = `1 ${originalCurrency} = ${rate.toFixed(4)} ${targetCurrency}`;
    });

    // Pivot Point Calculator
    document.getElementById('calculate-pivot').addEventListener('click', () => {
        const high = parseFloat(document.getElementById('pivot-high').value);
        const low = parseFloat(document.getElementById('pivot-low').value);
        const close = parseFloat(document.getElementById('pivot-close').value);
        if (!validateInputs(high, low, close)) {
            alert('Please enter valid high, low, and close prices.');
            return;
        }
        const pivot = (high + low + close) / 3;
        const r1 = 2 * pivot - low;
        const s1 = 2 * pivot - high;
        document.getElementById('pivot-point-result').textContent = pivot.toFixed(4);
        document.getElementById('pivot-r1-result').textContent = r1.toFixed(4);
        document.getElementById('pivot-s1-result').textContent = s1.toFixed(4);
    });

    // Fibonacci Calculator
    document.getElementById('calculate-fibonacci').addEventListener('click', () => {
        const high = parseFloat(document.getElementById('fib-high').value);
        const low = parseFloat(document.getElementById('fib-low').value);
        if (!validateInputs(high, low)) {
            alert('Please enter valid high and low prices.');
            return;
        }
        const range = high - low;
        document.getElementById('fib-23-result').textContent = (high - range * 0.236).toFixed(4);
        document.getElementById('fib-38-result').textContent = (high - range * 0.382).toFixed(4);
        document.getElementById('fib-50-result').textContent = (high - range * 0.5).toFixed(4);
        document.getElementById('fib-61-result').textContent = (high - range * 0.618).toFixed(4);
    });

    // Currency Correlation Matrix
    document.getElementById('calculate-correlation').addEventListener('click', () => {
        const pair1 = document.getElementById('correlation-pair1').value;
        const pair2 = document.getElementById('correlation-pair2').value;
        const period = document.getElementById('correlation-period').value;
        const correlation = Math.random() * 2 - 1; // Simulated for demo purposes
        const strength = Math.abs(correlation) > 0.8 ? 'Strong' : Math.abs(correlation) > 0.5 ? 'Moderate' : 'Weak';
        document.getElementById('correlation-result').textContent = correlation.toFixed(2);
        document.getElementById('correlation-strength-result').textContent = `${strength} (${correlation > 0 ? 'Positive' : 'Negative'}) (Simulated)`;
    });

    // Volatility Calculator
    document.getElementById('calculate-volatility').addEventListener('click', () => {
        const pair = document.getElementById('volatility-currency-pair').value;
        const high = parseFloat(document.getElementById('high-price').value);
        const low = parseFloat(document.getElementById('low-price').value);
        const period = parseInt(document.getElementById('period').value);
        if (!validateInputs(high, low, period)) {
            alert('Please enter valid high price, low price, and period.');
            return;
        }
        const range = high - low;
        const pipSize = pair.includes('JPY') ? 0.01 : 0.0001;
        const volatilityPips = (range / pipSize).toFixed(2);
        const volatilityPercentage = ((range / low) * 100).toFixed(2);
        document.getElementById('price-range').textContent = range.toFixed(4);
        document.getElementById('volatility-pips').textContent = `${volatilityPips} pips`;
        document.getElementById('volatility-percentage').textContent = `${volatilityPercentage}%`;
    });

    // Risk Converter
    document.getElementById('convert-risk').addEventListener('click', () => {
        const amount = parseFloat(document.getElementById('risk-amount').value);
        const riskPercentage = parseFloat(document.getElementById('risk-percentage-converter').value);
        const currency = document.getElementById('risk-currency').value;
        if (!validateInputs(amount, riskPercentage)) {
            alert('Please enter valid risk amount and percentage.');
            return;
        }
        const accountSize = (amount / (riskPercentage / 100)).toFixed(2);
        document.getElementById('account-size-result').textContent = `${currency} ${accountSize}`;
        document.getElementById('risk-percentage-result').textContent = `${riskPercentage.toFixed(2)}%`;
    });

    // Risk Reward Calculator
    document.getElementById('calculate-risk-reward').addEventListener('click', () => {
        const risk = parseFloat(document.getElementById('risk-amount-ratio').value);
        const reward = parseFloat(document.getElementById('reward-amount').value);
        if (!validateInputs(risk, reward)) {
            alert('Please enter valid risk and reward amounts.');
            return;
        }
        const ratio = (reward / risk).toFixed(2);
        document.getElementById('risk-reward-result').textContent = `1:${ratio}`;
    });

    // Drawdown Calculator
    document.getElementById('calculate-drawdown').addEventListener('click', () => {
        const initial = parseFloat(document.getElementById('initial-balance').value);
        const current = parseFloat(document.getElementById('current-balance').value);
        if (!validateInputs(initial, current)) {
            alert('Please enter valid initial and current balances.');
            return;
        }
        const drawdown = initial - current;
        const percentage = (drawdown / initial * 100).toFixed(2);
        document.getElementById('drawdown-amount-result').textContent = `$ ${drawdown.toFixed(2)}`;
        document.getElementById('drawdown-percentage-result').textContent = `${percentage}%`;
    });

    // Position Ratio Calculator
    document.getElementById('calculate-position-ratio').addEventListener('click', () => {
        const total = parseFloat(document.getElementById('total-account').value);
        const position = parseFloat(document.getElementById('position-size').value);
        if (!validateInputs(total, position)) {
            alert('Please enter valid total account and position size.');
            return;
        }
        const ratio = (position / total * 100).toFixed(2);
        document.getElementById('position-ratio-result').textContent = `${ratio}%`;
    });

    // Strategy Backtest Calculator
    document.getElementById('calculate-strategy-backtest').addEventListener('click', () => {
        const winRate = parseFloat(document.getElementById('win-rate').value);
        const avgProfit = parseFloat(document.getElementById('avg-profit').value);
        const avgLoss = parseFloat(document.getElementById('avg-loss').value);
        const numTrades = parseInt(document.getElementById('num-trades').value);
        const initialCapital = parseFloat(document.getElementById('initial-capital').value);
        const currency = document.getElementById('account-currency').value;
        if (!validateInputs(winRate, avgProfit, avgLoss, numTrades, initialCapital)) {
            alert('Please enter valid inputs for all fields.');
            return;
        }
        const wins = numTrades * (winRate / 100);
        const losses = numTrades * (1 - winRate / 100);
        const expectedProfit = (wins * avgProfit - losses * avgLoss).toFixed(2);
        const winLossRatio = wins > 0 && losses > 0 ? (wins / losses).toFixed(2) : 'N/A';
        const totalReturn = ((expectedProfit / initialCapital) * 100).toFixed(2);
        document.getElementById('backtest-profit-result').textContent = `${currency} ${expectedProfit}`;
        document.getElementById('backtest-ratio-result').textContent = winLossRatio;
        document.getElementById('backtest-return-result').textContent = `${totalReturn}%`;
    });

    // Trade Entry Planner
    document.getElementById('calculate-trade-entry').addEventListener('click', () => {
        const pair = document.getElementById('entry-currency-pair').value;
        const entryPrice = parseFloat(document.getElementById('entry-price').value);
        const stopLossPrice = parseFloat(document.getElementById('stop-loss-price').value);
        const riskRewardRatio = parseFloat(document.getElementById('risk-reward-ratio').value);
        const tradeSize = parseFloat(document.getElementById('entry-trade-size').value);
        const [base, quote] = pair.split('/');
        if (!validateInputs(entryPrice, stopLossPrice, riskRewardRatio, tradeSize)) {
            alert('Please enter valid inputs for all fields.');
            return;
        }
        const pipSize = pair.includes('JPY') ? 0.01 : 0.0001;
        const riskPips = Math.abs(entryPrice - stopLossPrice) / pipSize;
        const rewardPips = riskPips * riskRewardRatio;
        const targetPrice = entryPrice + (entryPrice > stopLossPrice ? rewardPips * pipSize : -rewardPips * pipSize);
        const riskAmount = riskPips * tradeSize * pipSize * rates[quote]['USD'];
        const potentialProfit = rewardPips * tradeSize * pipSize * rates[quote]['USD'];
        const positionSize = tradeSize.toFixed(2);
        document.getElementById('target-price-result').textContent = targetPrice.toFixed(4);
        document.getElementById('potential-profit-result').textContent = `$ ${potentialProfit.toFixed(2)}`;
        document.getElementById('entry-risk-result').textContent = `$ ${riskAmount.toFixed(2)}`;
        document.getElementById('entry-position-result').textContent = `${positionSize} Lots`;
    });

    // Breakout Strength Analyzer
    document.getElementById('calculate-breakout').addEventListener('click', () => {
        const pair = document.getElementById('breakout-currency-pair').value;
        const breakoutPrice = parseFloat(document.getElementById('breakout-price').value);
        const historicalHigh = parseFloat(document.getElementById('historical-high').value);
        const historicalLow = parseFloat(document.getElementById('historical-low').value);
        const period = parseInt(document.getElementById('breakout-period').value);
        if (!validateInputs(breakoutPrice, historicalHigh, historicalLow, period)) {
            alert('Please enter valid inputs for all fields.');
            return;
        }
        const range = historicalHigh - historicalLow;
        const breakoutStrength = Math.min(100, Math.abs((breakoutPrice - historicalHigh) / range) * 100).toFixed(2);
        const continuationProbability = Math.min(100, breakoutStrength * 0.8).toFixed(2);
        const pipSize = pair.includes('JPY') ? 0.01 : 0.0001;
        const stopLossPips = (range / pipSize * 0.5).toFixed(2);
        document.getElementById('breakout-strength-result').textContent = breakoutStrength;
        document.getElementById('continuation-probability-result').textContent = `${continuationProbability}%`;
        document.getElementById('breakout-stop-loss-result').textContent = `${stopLossPips} pips`;
    });

    // Trade Journal Analyzer
    document.getElementById('calculate-journal').addEventListener('click', () => {
        const totalTrades = parseInt(document.getElementById('total-trades').value);
        const profitableTrades = parseInt(document.getElementById('profitable-trades').value);
        const avgProfit = parseFloat(document.getElementById('journal-avg-profit').value);
        const avgLoss = parseFloat(document.getElementById('journal-avg-loss').value);
        if (!validateInputs(totalTrades, profitableTrades, avgProfit, avgLoss) || profitableTrades > totalTrades) {
            alert('Please enter valid inputs. Profitable trades cannot exceed total trades.');
            return;
        }
        const successRate = (profitableTrades / totalTrades * 100).toFixed(2);
        const netProfit = (profitableTrades * avgProfit - (totalTrades - profitableTrades) * avgLoss).toFixed(2);
        const recommendation = successRate > 60 ? 'Strong performance, consider scaling up.' : 
                             successRate > 40 ? 'Moderate performance, refine strategy.' : 
                             'Weak performance, review strategy thoroughly.';
        document.getElementById('journal-success-result').textContent = `${successRate}%`;
        document.getElementById('journal-profit-result').textContent = `$ ${netProfit}`;
        document.getElementById('journal-recommendation-result').textContent = recommendation;
    });

    // Economic Event Impact Calculator
    document.getElementById('calculate-economic-impact').addEventListener('click', () => {
        const pair = document.getElementById('economic-pair').value;
        const eventType = document.getElementById('event-type').value;
        const expectedData = parseFloat(document.getElementById('expected-data').value);
        const actualData = parseFloat(document.getElementById('actual-data').value);
        const volatilityFactor = parseInt(document.getElementById('volatility-factor').value);
        if (!validateInputs(expectedData, actualData, volatilityFactor)) {
            alert('Please enter valid inputs for expected data, actual data, and volatility factor.');
            return;
        }
        const eventImpact = { 'nfp': 1.5, 'interest-rate': 1.2, 'gdp': 1.0, 'cpi': 0.8, 'other': 0.5 };
        const adjustedVolatility = volatilityFactor * (eventType in eventImpact ? eventImpact[eventType] : 1.0);
        const pipSize = pair.includes('JPY') ? 0.01 : 0.0001;
        const pipMovement = Math.abs(actualData - expectedData) * adjustedVolatility * (1 / pipSize);
        const riskLevel = pipMovement > 100 ? 'High' : pipMovement > 50 ? 'Moderate' : 'Low';
        const impactScore = Math.min(100, pipMovement / 10).toFixed(2);
        document.getElementById('impact-pips-result').textContent = `${pipMovement.toFixed(2)} pips`;
        document.getElementById('impact-risk-result').textContent = riskLevel;
        document.getElementById('impact-score-result').textContent = impactScore;
    });

    // News Sentiment Analyzer
    document.getElementById('calculate-news-sentiment').addEventListener('click', () => {
        const headline = document.getElementById('news-headline').value.toLowerCase();
        const sentimentWeight = document.getElementById('sentiment-weight').value;
        const timeframe = document.getElementById('news-timeframe').value;
        if (!headline) {
            alert('Please enter a valid news headline.');
            return;
        }
        const positiveWords = ['strong', 'growth', 'increase', 'bullish', 'positive', 'optimistic', 'surge', 'rise'];
        const negativeWords = ['weak', 'decline', 'decrease', 'bearish', 'negative', 'pessimistic', 'drop', 'fall'];
        let score = 0;
        positiveWords.forEach(word => { if (headline.includes(word)) score += 20; });
        negativeWords.forEach(word => { if (headline.includes(word)) score -= 20; });
        score = Math.max(-100, Math.min(100, score));
        if (sentimentWeight === 'positive') score += 20;
        if (sentimentWeight === 'negative') score -= 20;
        const direction = score > 0 ? 'Bullish' : score < 0 ? 'Bearish' : 'Neutral';
        const timeframeFactors = { '1h': 0.8, '1d': 1.0, '1w': 1.2 };
        const confidence = Math.min(100, Math.abs(score) * timeframeFactors[timeframe]).toFixed(2);
        document.getElementById('sentiment-score-result').textContent = score;
        document.getElementById('sentiment-direction-result').textContent = direction;
        document.getElementById('sentiment-confidence-result').textContent = `${confidence}%`;
    });

    // Interest Rate Differential Calculator
    document.getElementById('calculate-interest-rate').addEventListener('click', () => {
        const pair = document.getElementById('interest-currency-pair').value;
        const baseRate = parseFloat(document.getElementById('base-interest-rate').value);
        const quoteRate = parseFloat(document.getElementById('quote-interest-rate').value);
        const tradeSize = parseFloat(document.getElementById('interest-trade-size').value);
        const holdingPeriod = parseInt(document.getElementById('holding-period').value);
        if (!validateInputs(baseRate, quoteRate, tradeSize, holdingPeriod)) {
            alert('Please enter valid inputs for all fields.');
            return;
        }
        const [base, quote] = pair.split('/');
        const dailyInterest = ((baseRate - quoteRate) / 100 / 365) * tradeSize * 100000 * rates[base]['USD'];
        const weeklyInterest = dailyInterest * 7;
        const periodInterest = dailyInterest * holdingPeriod;
        document.getElementById('daily-interest-result').textContent = `$ ${dailyInterest.toFixed(2)}`;
        document.getElementById('weekly-interest-result').textContent = `$ ${weeklyInterest.toFixed(2)}`;
        document.getElementById('period-interest-result').textContent = `$ ${periodInterest.toFixed(2)}`;
    });

    // Economic Calendar Filter
    document.getElementById('filter-calendar').addEventListener('click', () => {
        const currency = document.getElementById('calendar-currency').value;
        const impactLevel = document.getElementById('impact-level').value;
        const dateRange = document.getElementById('date-range').value;
        const mockEvents = [
            { currency: 'USD', event: 'Non-Farm Payroll', impact: 'high', date: '2025-09-05', window: '09:00-12:00' },
            { currency: 'EUR', event: 'ECB Interest Rate', impact: 'high', date: '2025-09-10', window: '13:00-15:00' },
            { currency: 'GBP', event: 'GDP Release', impact: 'medium', date: '2025-09-12', window: '08:00-10:00' },
            { currency: 'JPY', event: 'CPI Data', impact: 'medium', date: '2025-09-15', window: '07:00-09:00' },
            { currency: 'AUD', event: 'RBA Meeting', impact: 'high', date: '2025-09-20', window: '14:00-16:00' },
            { currency: 'CAD', event: 'Bank of Canada Rate Decision', impact: 'high', date: '2025-09-08', window: '10:00-12:00' },
            { currency: 'CHF', event: 'Swiss CPI', impact: 'medium', date: '2025-09-14', window: '08:30-10:30' },
            { currency: 'NZD', event: 'RBNZ Statement', impact: 'high', date: '2025-09-18', window: '14:00-16:00' },
            { currency: 'SGD', event: 'MAS Policy Statement', impact: 'medium', date: '2025-09-22', window: '09:00-11:00' }
        ];
        const filteredEvents = mockEvents.filter(e => 
            e.currency === currency && 
            e.impact === impactLevel && 
            (dateRange === 'today' ? e.date === '2025-09-05' : 
             dateRange === 'this-week' ? e.date.startsWith('2025-09') && parseInt(e.date.split('-')[2]) <= 7 : 
             dateRange === 'this-month' ? e.date.startsWith('2025-09') : true)
        );
        const eventList = filteredEvents.length > 0 ? 
            filteredEvents.map(e => `${e.event} (${e.date})`).join(', ') : 'No events found';
        const impact = filteredEvents.length > 0 ? impactLevel.charAt(0).toUpperCase() + impactLevel.slice(1) : 'N/A';
        const window = filteredEvents.length > 0 ? filteredEvents[0].window : 'N/A';
        document.getElementById('calendar-events-result').textContent = eventList;
        document.getElementById('calendar-impact-result').textContent = impact;
        document.getElementById('calendar-window-result').textContent = window;
    });
}

function init() {
    initTicker();
    setInterval(updateTicker, 5000);
    initLiveRatesTable();
    setInterval(updateLiveRatesTable, 5000);
    initChartingTool();
    addSocialShareButtons();
    populateCurrencyOptions();
    initCurrencySelectionBoxes();
    initAddCurrency();
    initCategoriesAndTools();
    initCalculators();
}

document.addEventListener('DOMContentLoaded', init);