import { google } from 'googleapis';
import * as fs from 'fs';

export class GoogleSheetService {
  private sheets: any;
  private drive: any;
  private auth: any;
  private keyFilePath = './secrets.json'

  constructor() {
    this.auth = new google.auth.GoogleAuth({
      keyFile: this.keyFilePath,
      scopes: ['https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive',
      ],
    });
    this.sheets = google.sheets({ version: 'v4', auth: this.auth });
    this.drive = google.drive({ version: 'v3', auth: this.auth });
  }

  private async shareSpreadsheetWithUser(spreadsheetId: string, email: string): Promise<void> {
    try {
      await this.drive.permissions.create({
        fileId: spreadsheetId,
        requestBody: {
          role: 'writer',
          type: 'user',
          emailAddress: email,
        },
      });
      console.log(`Spreadsheet shared with ${email}`);
    } catch (error) {
      console.error('Error sharing spreadsheet:', error);
    }
  }

  private async renameFirstSheet(spreadsheetId: string, newName: string): Promise<void> {
    try {
      const spreadsheet = await this.sheets.spreadsheets.get({
        spreadsheetId,
      });

      const sheet = spreadsheet.data.sheets?.[0];
      if (!sheet) {
        throw new Error('No sheets found in the spreadsheet.');
      }

      const sheetId = sheet.properties?.sheetId;
      if (sheetId === undefined) {
        throw new Error('Sheet ID not found.');
      }

      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              updateSheetProperties: {
                properties: {
                  sheetId,
                  title: newName,
                },
                fields: 'title',
              },
            },
          ],
        },
      });
    } catch (error) {
      console.error('Error renaming sheet:', error);
    }
  }

  async createNewSpreadsheet(title: string): Promise<{ id: any; url: any; } | undefined> {
    const resource = {
      properties: {
        title,
      },
    };

    try {
      const spreadsheet = await this.sheets.spreadsheets.create({
        requestBody: resource,
      });
      if (spreadsheet.data.spreadsheetId) {
        await this.renameFirstSheet(spreadsheet.data.spreadsheetId, 'stocks_coefs');
      }
      await this.shareSpreadsheetWithUser(spreadsheet.data.spreadsheetId, process.env.OWNER_EMAIL || '')
      return {
        id: spreadsheet.data.spreadsheetId,
        url: spreadsheet.data.spreadsheetUrl,
      };
    } catch (error) {
      console.error('Error creating new spreadsheet:', error);
    }
  }

  async writeDataToSpreadsheet(spreadsheetId: string, data: string[][], range: string = 'stocks_coefs!A1'): Promise<void> {
    const resource = {
      values: data,
    };

    try {
      await this.sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        requestBody: resource,
      });

      console.log('Data written to the spreadsheet');
    } catch (error) {
      console.error('Error writing data:', error);
    }
  }

  async getDataFromSpreadsheet(spreadsheetId: string, range: string): Promise<string[][] | undefined> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });

      return response.data.values;
    } catch (error) {
      console.error('Error getting data from spreadsheet:', error);
    }
  }

  async updateDataInSpreadsheet(spreadsheetId: string, range: string, data: string[][]): Promise<void> {
    const resource = {
      values: data,
    };

    try {
      await this.sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        requestBody: resource,
      });

      console.log('Data updated in the spreadsheet');
    } catch (error) {
      console.error('Error updating data:', error);
    }
  }
}

