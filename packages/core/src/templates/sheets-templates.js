/**
 * Zoffice ZSheets Templates
 * Original spreadsheet templates with formulas and structured tabular financial models.
 * @module sheets-templates
 */

/**
 * Builds a workbook object from a 2D matrix of values and formulas.
 * @param {string} sheetName
 * @param {Array<Array<any>>} grid
 * @returns {Object}
 */
function buildWorkbook(sheetName, grid) {
  const data = {}
  grid.forEach((rowCells, r) => {
    rowCells.forEach((val, c) => {
      if (val !== null && val !== undefined && val !== '') {
        if (!data[r]) data[r] = {}
        const isFormula = typeof val === 'string' && val.startsWith('=')
        data[r][c] = {
          raw: String(val),
          value: isFormula ? 0 : val,
          formula: isFormula ? val : undefined,
        }
      }
    })
  })
  return {
    activeSheetId: 'sheet1',
    sheets: [{ id: 'sheet1', name: sheetName, data, colWidths: {}, rowHeights: {}, merges: [] }],
  }
}

export const SHEETS_TEMPLATES = [
  {
    id: 'budget-family-annual',
    title: 'Annual Family Household Budget',
    description: 'Comprehensive annual budget model tracking monthly income, fixed costs, and net savings.',
    appId: 'sheets',
    category: 'finance',
    icon: 'DollarSign',
    content: JSON.stringify(
      buildWorkbook('Annual Budget', [
        ['Annual Household Budget', '', '', ''],
        ['Category', 'Monthly Planned', 'Annual Projected', 'Notes'],
        ['Primary Salary Income', 6500, '=B3*12', 'Net after tax'],
        ['Secondary Income / Freelance', 1200, '=B4*12', 'Average monthly'],
        ['Total Income', '=SUM(B3:B4)', '=SUM(C3:C4)', 'Combined'],
        ['', '', '', ''],
        ['Housing (Mortgage/Rent)', 2200, '=B7*12', 'Fixed monthly'],
        ['Utilities & Internet', 350, '=B8*12', 'Power, gas, fiber'],
        ['Groceries & Household', 750, '=B9*12', 'Weekly budget ~180'],
        ['Transportation & Fuel', 400, '=B10*12', 'Insurance + fuel'],
        ['Health & Insurance', 300, '=B11*12', 'Premiums + HSA'],
        ['Total Fixed Expenses', '=SUM(B7:B11)', '=SUM(C7:C11)', 'Baseline cost'],
        ['', '', '', ''],
        ['Net Monthly Savings', '=B5-B12', '=C5-C12', 'Target > 25%'],
      ]),
    ),
  },
  {
    id: 'expense-tracker',
    title: 'Business Expense Tracker',
    description: 'Reimbursement log categorizing business meals, travel, lodging, and tax deductions.',
    appId: 'sheets',
    category: 'finance',
    icon: 'CreditCard',
    content: JSON.stringify(
      buildWorkbook('Expenses', [
        ['Business Travel & Expense Log', '', '', '', ''],
        ['Date', 'Expense Category', 'Client / Purpose', 'Amount (USD)', 'Tax Reclaimable'],
        ['2026-10-12', 'Airfare & Travel', 'Client Onsite Review', 420.5, 33.64],
        ['2026-10-13', 'Lodging', 'Hotel Grand Central', 285.0, 22.8],
        ['2026-10-13', 'Meals & Dining', 'Executive Strategy Dinner', 145.2, 0.0],
        ['2026-10-14', 'Ground Transit', 'Airport Express Taxi', 55.0, 4.4],
        ['Total Reimbursable', '', '', '=SUM(D3:D6)', '=SUM(E3:E6)'],
      ]),
    ),
  },
  {
    id: 'project-milestone-tracker',
    title: 'Project Milestone & Gantt Tracker',
    description: 'Track phases, task owners, start dates, completion percentage, and status.',
    appId: 'sheets',
    category: 'productivity',
    icon: 'Calendar',
    content: JSON.stringify(
      buildWorkbook('Project Plan', [
        ['Project Alpha Delivery Roadmap', '', '', '', ''],
        ['Phase / Milestone', 'Lead Owner', 'Target Days', 'Progress (%)', 'Status'],
        ['Architecture & Threat Model', 'Marcus V.', 15, 100, 'Completed'],
        ['Local SQLite Schema Design', 'Elena R.', 10, 100, 'Completed'],
        ['Plugin Sandbox Implementation', 'Tariq A.', 20, 85, 'Active'],
        ['Accessibility Remediation', 'Sarah J.', 12, 70, 'Active'],
        ['Performance Profiling & Caching', 'Elena R.', 14, 40, 'Active'],
        ['Total Planned Days', '', '=SUM(C3:C7)', '', ''],
      ]),
    ),
  },
  {
    id: 'invoice-sales-calculator',
    title: 'Sales Invoice & Tax Calculator',
    description: 'Automated sales order calculator with line totals, volume discounts, and sales tax.',
    appId: 'sheets',
    category: 'finance',
    icon: 'FileSpreadsheet',
    content: JSON.stringify(
      buildWorkbook('Sales Invoice', [
        ['Itemized Product Sales Order', '', '', ''],
        ['Catalog SKU', 'Quantity', 'Unit Price', 'Line Total'],
        ['Hardware Key Model X', 10, 45.0, '=B3*C3'],
        ['Offline Backup Appliance 2TB', 2, 280.0, '=B4*C4'],
        ['Perpetual Suite License', 5, 150.0, '=B5*C5'],
        ['Subtotal', '', '', '=SUM(D3:D5)'],
        ['Applicable Sales Tax (8.5%)', '', '', '=D6*0.085'],
        ['Grand Total Due', '', '', '=D6+D7'],
      ]),
    ),
  },
  {
    id: 'loan-amortization',
    title: 'Loan Amortization Schedule',
    description: 'Standard term loan schedule calculating monthly principal, interest, and balance.',
    appId: 'sheets',
    category: 'finance',
    icon: 'TrendingUp',
    content: JSON.stringify(
      buildWorkbook('Amortization', [
        ['Commercial Term Loan Schedule', '', '', '', ''],
        ['Month Period', 'Beginning Balance', 'Principal Paid', 'Interest Paid', 'Ending Balance'],
        [1, 10000.0, 805.2, 41.67, '=B3-C3'],
        [2, '=E3', 808.5, 38.31, '=B4-C4'],
        [3, '=E4', 811.9, 34.94, '=B5-C5'],
        [4, '=E5', 815.3, 31.56, '=B6-C6'],
        [5, '=E6', 818.7, 28.16, '=B7-C7'],
        ['Total Paid', '', '=SUM(C3:C7)', '=SUM(D3:D7)', ''],
      ]),
    ),
  },
]
