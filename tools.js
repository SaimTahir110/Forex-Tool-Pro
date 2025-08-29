document.addEventListener('DOMContentLoaded', function() {
    initTicker();
    
    const categories = document.querySelectorAll('.category');
    categories.forEach(category => {
        category.addEventListener('click', function() {
            categories.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    const toolItems = document.querySelectorAll('.tool-item');
    const toolContents = document.querySelectorAll('.tool-content');
    
    toolItems.forEach(item => {
        item.addEventListener('click', function() {
            const toolId = this.getAttribute('data-tool');
            toolContents.forEach(content => content.classList.remove('active'));
            const selectedTool = document.getElementById(toolId);
            if (selectedTool) {
                selectedTool.classList.add('active');
                selectedTool.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    setupCalculators();
});

function initTicker() {
    const ticker = document.querySelector('.ticker');
    const currencyPairs = [
        { pair: 'EUR/USD', price: 1.0852, change: 0.0012 },
        { pair: 'GBP/USD', price: 1.2653, change: -0.0008 },
        { pair: 'USD/JPY', price: 147.65, change: 0.24 },
        { pair: 'USD/CHF', price: 0.8847, change: -0.0015 },
        { pair: 'AUD/USD', price: 0.6552, change: 0.0007 },
        { pair: 'USD/CAD', price: 1.3551, change: -0.0009 }
    ];
    
    ticker.innerHTML = '';
    currencyPairs.forEach(pair => {
        const tickerItem = document.createElement('div');
        tickerItem.className = 'ticker-item';
        tickerItem.innerHTML = `
            <span class="ticker-pair">${pair.pair}</span>
            <span class="ticker-price">${pair.price.toFixed(4)}</span>
            <span class="${pair.change >= 0 ? 'positive' : 'negative'}">
                ${pair.change >= 0 ? '+' : ''}${pair.change.toFixed(4)}
            </span>
        `;
        ticker.appendChild(tickerItem);
    });
    ticker.innerHTML += ticker.innerHTML; // Clone for seamless animation
}

function setupCalculators() {
    document.getElementById('calculate-pip').addEventListener('click', calculatePipValue);
    document.getElementById('calculate-position').addEventListener('click', calculatePositionSize);
    document.getElementById('calculate-margin').addEventListener('click', calculateMargin);
    document.getElementById('calculate-profit').addEventListener('click', calculateProfit);
    document.getElementById('convert-currency').addEventListener('click', convertCurrency);
    document.getElementById('convert-lot').addEventListener('click', convertLotSize);
    document.getElementById('convert-profit').addEventListener('click', convertProfit);
    document.getElementById('convert-margin').addEventListener('click', convertMargin);
    document.getElementById('calculate-pivot').addEventListener('click', calculatePivotPoints);
    document.getElementById('calculate-fibonacci').addEventListener('click', calculateFibonacci);
    document.getElementById('calculate-correlation').addEventListener('click', calculateCorrelation);
    document.getElementById('calculate-volatility').addEventListener('click', calculateVolatility);
    document.getElementById('convert-risk').addEventListener('click', convertRisk);
    document.getElementById('calculate-risk-reward').addEventListener('click', calculateRiskReward);
    document.getElementById('calculate-drawdown').addEventListener('click', calculateDrawdown);
    document.getElementById('calculate-position-ratio').addEventListener('click', calculatePositionRatio);
    document.getElementById('calculate-backtest').addEventListener('click', calculateBacktest);
    document.getElementById('plan-trade').addEventListener('click', planTrade);
    document.getElementById('analyze-breakout').addEventListener('click', analyzeBreakout);
    document.getElementById('save-journal').addEventListener('click', saveJournalEntry);
    document.getElementById('analyze-economic').addEventListener('click', analyzeEconomicImpact);
    document.getElementById('analyze-news').addEventListener('click', analyzeNewsSentiment);
    document.getElementById('calculate-interest').addEventListener('click', calculateInterest);
    document.getElementById('fetch-calendar').addEventListener('click', fetchCalendar);
}

const exchangeRates = {
    USD: { EUR: 0.93, GBP: 0.79, JPY: 147.65, USD: 1 },
    EUR: { USD: 1.08, GBP: 0.85, JPY: 160.12, EUR: 1 },
    GBP: { USD: 1.27, EUR: 1.18, JPY: 186.75, GBP: 1 },
    JPY: { USD: 0.0068, EUR: 0.0062, GBP: 0.0054, JPY: 1 }
};

function validateInputs(inputs, errorElementId, errorMessage) {
    const errorElement = document.getElementById(errorElementId);
    for (let input of inputs) {
        if (isNaN(input) || input <= 0) {
            errorElement.textContent = errorMessage;
            errorElement.style.display = 'block';
            return false;
        }
    }
    errorElement.style.display = 'none';
    return true;
}

function calculatePipValue() {
    const pair = document.getElementById('currency-pair').value;
    const tradeSize = parseFloat(document.getElementById('trade-size').value);
    const accountCurrency = document.getElementById('account-currency').value;
    
    if (!validateInputs([tradeSize], 'pip-error', 'Please enter a valid trade size (> 0).')) return;
    
    const pipSize = pair.includes('JPY') ? 0.01 : 0.0001;
    const [base, quote] = pair.split('/');
    const contractSize = 100000;
    let pipValue;
    if (quote === accountCurrency) {
        pipValue = pipSize * contractSize * tradeSize;
    } else if (base === accountCurrency) {
        pipValue = (pipSize * contractSize * tradeSize) / parseFloat(pair.split('/')[1]);
    } else {
        const rate = exchangeRates[quote][accountCurrency] || 1;
        pipValue = pipSize * contractSize * tradeSize * rate;
    }
    
    document.getElementById('pip-value-result').textContent = `${accountCurrency} ${pipValue.toFixed(2)}`;
}

function calculatePositionSize() {
    const balance = parseFloat(document.getElementById('account-balance').value);
    const riskPercentage = parseFloat(document.getElementById('risk-percentage').value);
    const stopLoss = parseFloat(document.getElementById('stop-loss').value);
    const pair = document.getElementById('position-currency-pair').value;
    
    if (!validateInputs([balance, riskPercentage, stopLoss], 'position-error', 'Please enter valid balance, risk percentage, and stop loss (> 0).')) return;
    if (riskPercentage > 100) {
        document.getElementById('position-error').textContent = 'Risk percentage must be between 0.1 and 100.';
        document.getElementById('position-error').style.display = 'block';
        return;
    }
    
    const riskAmount = balance * (riskPercentage / 100);
    const pipSize = pair.includes('JPY') ? 0.01 : 0.0001;
    const pipValue = pipSize * 100000;
    const positionSize = (riskAmount / (stopLoss * pipValue)).toFixed(2);
    
    document.getElementById('position-size-result').textContent = `${positionSize} Lots`;
    document.getElementById('risk-amount-result').textContent = `$${riskAmount.toFixed(2)}`;
}

function calculateMargin() {
    const pair = document.getElementById('margin-currency-pair').value;
    const tradeSize = parseFloat(document.getElementById('margin-trade-size').value);
    const leverage = parseFloat(document.getElementById('margin-leverage').value);
    
    if (!validateInputs([tradeSize, leverage], 'margin-error', 'Please enter valid trade size and leverage (> 0).')) return;
    
    const contractSize = 100000;
    const [base] = pair.split('/');
    const rate = exchangeRates[base]['USD'] || 1;
    const margin = (tradeSize * contractSize * rate) / leverage;
    
    document.getElementById('margin-required-result').textContent = `$${margin.toFixed(2)}`;
}

function calculateProfit() {
    const pair = document.getElementById('profit-currency-pair').value;
    const tradeSize = parseFloat(document.getElementById('profit-trade-size').value);
    const entryPrice = parseFloat(document.getElementById('profit-entry-price').value);
    const exitPrice = parseFloat(document.getElementById('profit-exit-price').value);
    
    if (!validateInputs([tradeSize, entryPrice, exitPrice], 'profit-error', 'Please enter valid trade size, entry, and exit prices (> 0).')) return;
    
    const pipSize = pair.includes('JPY') ? 0.01 : 0.0001;
    const pips = Math.abs(exitPrice - entryPrice) / pipSize;
    const direction = exitPrice > entryPrice ? 1 : -1;
    const pipValue = pipSize * 100000;
    const profit = direction * pips * pipValue * tradeSize;
    
    document.getElementById('profit-result').textContent = `$${profit.toFixed(2)}`;
    document.getElementById('pips-result').textContent = `${pips.toFixed(2)} pips`;
}

function convertCurrency() {
    const fromCurrency = document.getElementById('from-currency').value;
    const toCurrency = document.getElementById('to-currency').value;
    const amount = parseFloat(document.getElementById('amount').value);
    
    if (!validateInputs([amount], 'currency-error', 'Please enter a valid amount (> 0).')) return;
    
    const rate = exchangeRates[fromCurrency][toCurrency];
    const convertedAmount = amount * rate;
    
    document.getElementById('conversion-result').textContent = `${toCurrency} ${convertedAmount.toFixed(2)}`;
    document.getElementById('exchange-rate').textContent = `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;
}

function convertLotSize() {
    const lotSize = parseFloat(document.getElementById('lot-size').value);
    const fromType = document.getElementById('lot-type-from').value;
    const toType = document.getElementById('lot-type-to').value;
    
    if (!validateInputs([lotSize], 'lot-error', 'Please enter a valid lot size (> 0).')) return;
    
    const lotSizes = {
        standard: 100000,
        mini: 10000,
        micro: 1000
    };
    
    const units = lotSize * lotSizes[fromType];
    const convertedLot = units / lotSizes[toType];
    
    document.getElementById('lot-conversion-result').textContent = `${convertedLot.toFixed(2)} ${toType} lots`;
}

function convertProfit() {
    const amount = parseFloat(document.getElementById('profit-amount').value);
    const fromCurrency = document.getElementById('profit-from-currency').value;
    const toCurrency = document.getElementById('profit-to-currency').value;
    
    if (!validateInputs([amount], 'profit-conversion-error', 'Please enter a valid profit amount.')) return;
    
    const rate = exchangeRates[fromCurrency][toCurrency];
    const convertedAmount = amount * rate;
    
    document.getElementById('profit-conversion-result').textContent = `${toCurrency} ${convertedAmount.toFixed(2)}`;
}

function convertMargin() {
    const amount = parseFloat(document.getElementById('margin-amount').value);
    const fromCurrency = document.getElementById('margin-from-currency').value;
    const toCurrency = document.getElementById('margin-to-currency').value;
    
    if (!validateInputs([amount], 'margin-conversion-error', 'Please enter a valid margin amount.')) return;
    
    const rate = exchangeRates[fromCurrency][toCurrency];
    const convertedAmount = amount * rate;
    
    document.getElementById('margin-conversion-result').textContent = `${toCurrency} ${convertedAmount.toFixed(2)}`;
}

function calculatePivotPoints() {
    const high = parseFloat(document.getElementById('pivot-high').value);
    const low = parseFloat(document.getElementById('pivot-low').value);
    const close = parseFloat(document.getElementById('pivot-close').value);
    
    if (!validateInputs([high, low, close], 'pivot-error', 'Please enter valid high, low, and close prices (> 0).')) return;
    if (high <= low) {
        document.getElementById('pivot-error').textContent = 'High price must be greater than low price.';
        document.getElementById('pivot-error').style.display = 'block';
        return;
    }
    
    const pivot = (high + low + close) / 3;
    const r1 = (2 * pivot) - low;
    const s1 = (2 * pivot) - high;
    const r2 = pivot + (high - low);
    const s2 = pivot - (high - low);
    
    document.getElementById('pivot-point').textContent = pivot.toFixed(4);
    document.getElementById('pivot-r1').textContent = r1.toFixed(4);
    document.getElementById('pivot-s1').textContent = s1.toFixed(4);
    document.getElementById('pivot-r2').textContent = r2.toFixed(4);
    document.getElementById('pivot-s2').textContent = s2.toFixed(4);
}

function calculateFibonacci() {
    const high = parseFloat(document.getElementById('fib-high').value);
    const low = parseFloat(document.getElementById('fib-low').value);
    const trend = document.getElementById('fib-trend').value;
    
    if (!validateInputs([high, low], 'fib-error', 'Please enter valid high and low prices (> 0).')) return;
    if (trend === 'uptrend' && high <= low || trend === 'downtrend' && high >= low) {
        document.getElementById('fib-error').textContent = 'High price must be greater than low price for uptrend, and vice versa for downtrend.';
        document.getElementById('fib-error').style.display = 'block';
        return;
    }
    
    const diff = Math.abs(high - low);
    const levels = {
        23.6: trend === 'uptrend' ? high - (diff * 0.236) : low + (diff * 0.236),
        38.2: trend === 'uptrend' ? high - (diff * 0.382) : low + (diff * 0.382),
        50.0: trend === 'uptrend' ? high - (diff * 0.5) : low + (diff * 0.5),
        61.8: trend === 'uptrend' ? high - (diff * 0.618) : low + (diff * 0.618),
        100.0: trend === 'uptrend' ? low : high
    };
    
    document.getElementById('fib-23').textContent = levels[23.6].toFixed(4);
    document.getElementById('fib-38').textContent = levels[38.2].toFixed(4);
    document.getElementById('fib-50').textContent = levels[50.0].toFixed(4);
    document.getElementById('fib-61').textContent = levels[61.8].toFixed(4);
    document.getElementById('fib-100').textContent = levels[100.0].toFixed(4);
}

function calculateCorrelation() {
    const pairs = Array.from(document.getElementById('correlation-pairs').selectedOptions).map(option => option.value);
    const period = parseFloat(document.getElementById('correlation-period').value);
    
    if (pairs.length < 2) {
        document.getElementById('correlation-error').textContent = 'Please select at least two currency pairs.';
        document.getElementById('correlation-error').style.display = 'block';
        return;
    }
    if (!validateInputs([period], 'correlation-error', 'Please enter a valid period (> 0).')) return;
    
    // Mock correlation data (simplified for static environment)
    const mockCorrelations = {
        'EUR/USD-GBP/USD': 0.85,
        'EUR/USD-USD/JPY': -0.65,
        'EUR/USD-AUD/USD': 0.75,
        'GBP/USD-USD/JPY': -0.55,
        'GBP/USD-AUD/USD': 0.70,
        'USD/JPY-AUD/USD': -0.60
    };
    
    const resultBox = document.getElementById('correlation-result');
    resultBox.innerHTML = '<h3>Correlation Matrix</h3>';
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginTop = '10px';
    
    // Header row
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = '<th style="padding: 8px; border: 1px solid rgba(255,255,255,0.1);">Pair</th>' + 
                          pairs.map(pair => `<th style="padding: 8px; border: 1px solid rgba(255,255,255,0.1);">${pair}</th>`).join('');
    table.appendChild(headerRow);
    
    // Data rows
    pairs.forEach((rowPair, i) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td style="padding: 8px; border: 1px solid rgba(255,255,255,0.1);">${rowPair}</td>`;
        pairs.forEach((colPair, j) => {
            let correlation = 1.00;
            if (i !== j) {
                const key = [rowPair, colPair].sort().join('-');
                correlation = mockCorrelations[key] || 0.00;
            }
            row.innerHTML += `<td style="padding: 8px; border: 1px solid rgba(255,255,255,0.1); text-align: center;">${correlation.toFixed(2)}</td>`;
        });
        table.appendChild(row);
    });
    
    resultBox.appendChild(table);
}

function calculateVolatility() {
    const pair = document.getElementById('volatility-pair').value;
    const period = parseFloat(document.getElementById('volatility-period').value);
    
    if (!validateInputs([period], 'volatility-error', 'Please enter a valid period (> 0).')) return;
    
    // Mock volatility data (pips per day)
    const mockVolatility = {
        'EUR/USD': 80,
        'GBP/USD': 100,
        'USD/JPY': 120
    };
    
    const volatility = mockVolatility[pair] || 50;
    document.getElementById('volatility-result').textContent = `${volatility.toFixed(2)} pips`;
}

function convertRisk() {
    const amount = parseFloat(document.getElementById('risk-amount').value);
    const fromCurrency = document.getElementById('risk-from-currency').value;
    const toCurrency = document.getElementById('risk-to-currency').value;
    
    if (!validateInputs([amount], 'risk-conversion-error', 'Please enter a valid risk amount.')) return;
    
    const rate = exchangeRates[fromCurrency][toCurrency];
    const convertedAmount = amount * rate;
    
    document.getElementById('risk-conversion-result').textContent = `${toCurrency} ${convertedAmount.toFixed(2)}`;
}

function calculateRiskReward() {
    const entry = parseFloat(document.getElementById('risk-reward-entry').value);
    const stop = parseFloat(document.getElementById('risk-reward-stop').value);
    const target = parseFloat(document.getElementById('risk-reward-target').value);
    
    if (!validateInputs([entry, stop, target], 'risk-reward-error', 'Please enter valid entry, stop, and target prices (> 0).')) return;
    if (stop === entry || target === entry) {
        document.getElementById('risk-reward-error').textContent = 'Stop and target prices must differ from entry price.';
        document.getElementById('risk-reward-error').style.display = 'block';
        return;
    }
    
    const risk = Math.abs(entry - stop);
    const reward = Math.abs(target - entry);
    const ratio = (reward / risk).toFixed(2);
    
    document.getElementById('risk-reward-result').textContent = `1:${ratio}`;
}

function calculateDrawdown() {
    const initial = parseFloat(document.getElementById('initial-balance').value);
    const current = parseFloat(document.getElementById('current-balance').value);
    
    if (!validateInputs([initial, current], 'drawdown-error', 'Please enter valid initial and current balances (> 0).')) return;
    if (current > initial) {
        document.getElementById('drawdown-error').textContent = 'Current balance cannot be greater than initial balance.';
        document.getElementById('drawdown-error').style.display = 'block';
        return;
    }
    
    const drawdown = ((initial - current) / initial * 100).toFixed(2);
    document.getElementById('drawdown-result').textContent = `${drawdown}%`;
}

function calculatePositionRatio() {
    const total = parseFloat(document.getElementById('total-capital').value);
    const position = parseFloat(document.getElementById('position-amount').value);
    
    if (!validateInputs([total, position], 'position-ratio-error', 'Please enter valid total capital and position amount (> 0).')) return;
    if (position > total) {
        document.getElementById('position-ratio-error').textContent = 'Position amount cannot exceed total capital.';
        document.getElementById('position-ratio-error').style.display = 'block';
        return;
    }
    
    const ratio = (position / total * 100).toFixed(2);
    document.getElementById('position-ratio-result').textContent = `${ratio}%`;
}

function calculateBacktest() {
    const trades = parseFloat(document.getElementById('backtest-trades').value);
    const winRate = parseFloat(document.getElementById('win-rate').value);
    const avgWin = parseFloat(document.getElementById('avg-win').value);
    const avgLoss = parseFloat(document.getElementById('avg-loss').value);
    
    if (!validateInputs([trades, winRate, avgWin, avgLoss], 'backtest-error', 'Please enter valid inputs (> 0).')) return;
    if (winRate > 100) {
        document.getElementById('backtest-error').textContent = 'Win rate must be between 0 and 100.';
        document.getElementById('backtest-error').style.display = 'block';
        return;
    }
    
    const wins = trades * (winRate / 100);
    const losses = trades - wins;
    const profit = (wins * avgWin) - (losses * avgLoss);
    const winLossRatio = (wins / losses).toFixed(2);
    
    document.getElementById('backtest-profit').textContent = `$${profit.toFixed(2)}`;
    document.getElementById('backtest-ratio').textContent = `${winLossRatio}:1`;
}

function planTrade() {
    const entry = parseFloat(document.getElementById('entry-price').value);
    const stop = parseFloat(document.getElementById('stop-loss-price').value);
    const target = parseFloat(document.getElementById('target-price').value);
    const tradeSize = parseFloat(document.getElementById('trade-size-plan').value);
    
    if (!validateInputs([entry, stop, target, tradeSize], 'trade-plan-error', 'Please enter valid inputs (> 0).')) return;
    if (stop === entry || target === entry) {
        document.getElementById('trade-plan-error').textContent = 'Stop and target prices must differ from entry price.';
        document.getElementById('trade-plan-error').style.display = 'block';
        return;
    }
    
    const pipSize = 0.0001; // Assuming non-JPY pair for simplicity
    const pipValue = pipSize * 100000;
    const profitPips = Math.abs(target - entry) / pipSize;
    const lossPips = Math.abs(entry - stop) / pipSize;
    const profit = profitPips * pipValue * tradeSize;
    const loss = lossPips * pipValue * tradeSize;
    
    document.getElementById('trade-profit').textContent = `$${profit.toFixed(2)}`;
    document.getElementById('trade-loss').textContent = `$${loss.toFixed(2)}`;
}

function analyzeBreakout() {
    const high = parseFloat(document.getElementById('breakout-high').value);
    const low = parseFloat(document.getElementById('breakout-low').value);
    const period = parseFloat(document.getElementById('breakout-period').value);
    
    if (!validateInputs([high, low, period], 'breakout-error', 'Please enter valid high, low, and period (> 0).')) return;
    if (high <= low) {
        document.getElementById('breakout-error').textContent = 'High price must be greater than low price.';
        document.getElementById('breakout-error').style.display = 'block';
        return;
    }
    
    const range = Math.abs(high - low) / 0.0001; // Convert to pips
    document.getElementById('breakout-range').textContent = `${range.toFixed(2)} pips`;
}

function saveJournalEntry() {
    const date = document.getElementById('journal-date').value;
    const pair = document.getElementById('journal-pair').value;
    const profit = parseFloat(document.getElementById('journal-profit').value);
    const notes = document.getElementById('journal-notes').value;
    
    if (!date || !pair) {
        document.getElementById('journal-error').textContent = 'Please enter a valid date and currency pair.';
        document.getElementById('journal-error').style.display = 'block';
        return;
    }
    
    const entry = { date, pair, profit, notes };
    let journal = JSON.parse(localStorage.getItem('tradeJournal') || '[]');
    journal.push(entry);
    localStorage.setItem('tradeJournal', JSON.stringify(journal));
    
    displayJournalEntries();
}

function displayJournalEntries() {
    const journal = JSON.parse(localStorage.getItem('tradeJournal') || '[]');
    const resultBox = document.getElementById('journal-entries');
    resultBox.innerHTML = '<h3>Trade Journal</h3>';
    
    journal.forEach((entry, index) => {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'result-item';
        entryDiv.innerHTML = `
            <span class="result-label">Trade ${index + 1}:</span>
            <span class="result-value">${entry.date} | ${entry.pair} | Profit: $${entry.profit.toFixed(2)} | ${entry.notes}</span>
        `;
        resultBox.appendChild(entryDiv);
    });
}

function analyzeEconomicImpact() {
    const event = document.getElementById('economic-event').value;
    const pair = document.getElementById('economic-pair').value;
    
    // Mock impact levels
    const impactLevels = {
        gdp: 'High',
        'interest-rate': 'High',
        nfp: 'High'
    };
    
    document.getElementById('economic-impact-result').textContent = impactLevels[event] || 'Medium';
}

function analyzeNewsSentiment() {
    const pair = document.getElementById('news-pair').value;
    const period = parseFloat(document.getElementById('news-period').value);
    
    if (!validateInputs([period], 'news-error', 'Please enter a valid period (> 0).')) return;
    
    // Mock sentiment data
    const mockSentiment = {
        'EUR/USD': 'Positive',
        'GBP/USD': 'Neutral',
        'USD/JPY': 'Negative'
    };
    
    document.getElementById('news-sentiment-result').textContent = mockSentiment[pair] || 'Neutral';
}

function calculateInterest() {
    const baseCurrency = document.getElementById('base-currency').value;
    const quoteCurrency = document.getElementById('quote-currency').value;
    const duration = parseFloat(document.getElementById('trade-duration').value);
    
    if (!validateInputs([duration], 'interest-error', 'Please enter a valid trade duration (> 0).')) return;
    
    // Mock interest rates
    const interestRates = {
        USD: 5.0,
        EUR: 4.0,
        GBP: 5.5,
        JPY: 0.1
    };
    
    const baseRate = interestRates[baseCurrency] || 1.0;
    const quoteRate = interestRates[quoteCurrency] || 1.0;
    const swap = ((baseRate - quoteRate) / 365) * duration;
    
    document.getElementById('interest-result').textContent = `${swap.toFixed(2)}%`;
}

function fetchCalendar() {
    const date = document.getElementById('calendar-date').value;
    const currency = document.getElementById('calendar-currency').value;
    
    if (!date || !currency) {
        document.getElementById('calendar-error').textContent = 'Please enter a valid date and currency.';
        document.getElementById('calendar-error').style.display = 'block';
        return;
    }
    
    // Mock calendar data
    const mockEvents = {
        USD: ['FOMC Meeting', 'Non-Farm Payrolls'],
        EUR: ['ECB Rate Decision', 'Eurozone PMI'],
        GBP: ['BOE Rate Decision', 'UK GDP'],
        JPY: ['BOJ Policy Meeting']
    };
    
    const resultBox = document.getElementById('calendar-result');
    resultBox.innerHTML = '<h3>Economic Calendar</h3>';
    const events = mockEvents[currency] || ['No events scheduled'];
    
    events.forEach(event => {
        const eventDiv = document.createElement('div');
        eventDiv.className = 'result-item';
        eventDiv.innerHTML = `
            <span class="result-label">${date}:</span>
            <span class="result-value">${event}</span>
        `;
        resultBox.appendChild(eventDiv);
    });
}
