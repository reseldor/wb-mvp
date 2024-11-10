import { google } from 'googleapis';

export class GoogleSheetsService {
  private sheets;

  constructor() {
    const auth = new google.auth.GoogleAuth({
      credentials: { /* ваши учетные данные */ },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    this.sheets = google.sheets({ version: 'v4', auth });
  }

  async updateSheet(spreadsheetId: string, data: any[]) {
    await this.sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'stocks_coefs',
      valueInputOption: 'RAW',
      requestBody: { values: data },
    });
  }
}
