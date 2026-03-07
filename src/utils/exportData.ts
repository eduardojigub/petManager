import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { getUserDocuments } from '../firebase/FirestoreService';
import { DogProfile } from '../types/dogProfile';
import { HealthRecord, Expense } from '../types/navigation';

function formatDate(dateStr: string): string {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

function generateHTML(
  dogs: DogProfile[],
  healthRecords: HealthRecord[],
  expenses: Expense[]
): string {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const dogSections = dogs
    .map((dog) => {
      const dogHealth = healthRecords.filter((r) => r.dogId === dog.id);
      const dogExpenses = expenses.filter((e) => e.dogId === dog.id);
      const totalExpenses = dogExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);

      const healthRows = dogHealth.length
        ? dogHealth
            .map(
              (r) => `
            <tr>
              <td>${formatDate(r.date)}</td>
              <td><span class="badge badge-health">${r.type}</span></td>
              <td>${r.description || '-'}</td>
              <td>${r.extraInfo || '-'}</td>
            </tr>`
            )
            .join('')
        : '<tr><td colspan="4" class="empty">No health records</td></tr>';

      const expenseRows = dogExpenses.length
        ? dogExpenses
            .map(
              (e) => `
            <tr>
              <td>${formatDate(e.date)}</td>
              <td><span class="badge badge-expense">${e.type}</span></td>
              <td>${e.title || '-'}</td>
              <td class="amount">${formatCurrency(e.amount)}</td>
            </tr>`
            )
            .join('')
        : '<tr><td colspan="4" class="empty">No expenses</td></tr>';

      return `
        <div class="pet-section">
          <div class="pet-header">
            <h2>${dog.name}</h2>
            <div class="pet-details">
              <span>Breed: ${dog.breed || '-'}</span>
              <span>Age: ${dog.age || '-'}</span>
              <span>Weight: ${dog.weight ? dog.weight + ' kg' : '-'}</span>
            </div>
          </div>

          <h3>Health Records</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Description</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>${healthRows}</tbody>
          </table>

          <h3>Expenses</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Title</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${expenseRows}
              ${
                dogExpenses.length
                  ? `<tr class="total-row">
                      <td colspan="3"><strong>Total</strong></td>
                      <td class="amount"><strong>${formatCurrency(totalExpenses)}</strong></td>
                    </tr>`
                  : ''
              }
            </tbody>
          </table>
        </div>
      `;
    })
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, Helvetica, Arial, sans-serif;
          color: #333;
          padding: 40px;
          background: #fff;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 3px solid #41245C;
        }
        .header h1 {
          font-size: 28px;
          color: #41245C;
          margin-bottom: 4px;
        }
        .header p {
          font-size: 13px;
          color: #999;
        }
        .pet-section {
          margin-bottom: 40px;
          page-break-inside: avoid;
        }
        .pet-header {
          background: linear-gradient(135deg, #41245C, #7289DA);
          color: #fff;
          padding: 20px 24px;
          border-radius: 12px;
          margin-bottom: 20px;
        }
        .pet-header h2 {
          font-size: 22px;
          margin-bottom: 6px;
        }
        .pet-details span {
          font-size: 13px;
          opacity: 0.9;
          margin-right: 16px;
        }
        h3 {
          font-size: 16px;
          color: #41245C;
          margin: 20px 0 10px 0;
          padding-bottom: 6px;
          border-bottom: 1px solid #eee;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 12px;
          font-size: 13px;
        }
        th {
          background: #f8f7fa;
          color: #41245C;
          font-weight: 600;
          text-align: left;
          padding: 10px 12px;
          border-bottom: 2px solid #e0dce6;
        }
        td {
          padding: 10px 12px;
          border-bottom: 1px solid #f0f0f0;
          vertical-align: top;
        }
        tr:last-child td { border-bottom: none; }
        .total-row td {
          border-top: 2px solid #41245C;
          padding-top: 12px;
        }
        .amount { text-align: right; }
        .empty {
          text-align: center;
          color: #ccc;
          font-style: italic;
          padding: 16px;
        }
        .badge {
          display: inline-block;
          padding: 2px 10px;
          border-radius: 10px;
          font-size: 11px;
          font-weight: 600;
          text-transform: capitalize;
        }
        .badge-health { background: #ede8f5; color: #41245C; }
        .badge-expense { background: #fdf0e0; color: #e67e22; }
        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 16px;
          border-top: 1px solid #eee;
          font-size: 12px;
          color: #bbb;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Pet Life Report</h1>
        <p>Generated on ${today}</p>
      </div>
      ${dogs.length ? dogSections : '<p style="text-align:center;color:#999;">No pets found.</p>'}
      <div class="footer">
        Pet Life App — Data Export
      </div>
    </body>
    </html>
  `;
}

export async function exportUserData(): Promise<void> {
  const dogs = (await getUserDocuments('dogProfiles')) as DogProfile[];
  const healthRecords = (await getUserDocuments('healthRecords')) as HealthRecord[];
  const expenses = (await getUserDocuments('expenses')) as Expense[];

  const html = generateHTML(dogs, healthRecords, expenses);

  const { uri } = await Print.printToFileAsync({ html });
  await Sharing.shareAsync(uri, {
    mimeType: 'application/pdf',
    dialogTitle: 'Export Pet Life Data',
    UTI: 'com.adobe.pdf',
  });
}
