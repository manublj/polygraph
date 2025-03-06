// Remove the axios import and replace with native fetch implementation

export async function writeToSheet(values) {
  try {
      const response = await fetch('YOUR_API_ENDPOINT', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ values })
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error writing to sheet:', error);
      throw error;
  }
}

export async function readFromSheet() {
  try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.REACT_APP_GOOGLE_SPREADSHEET_ID,
        range: 'YOUR_API_ENDPOINT',
      });
      
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error reading from sheet:', error);
      throw error;
  }
}

const SPREADSHEET_ID = process.env.REACT_APP_GOOGLE_SPREADSHEET_ID;
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets';

// Mock data for development and testing
const MOCK_DATA = {
  ENTITIES: [],
  THEORY: [],
  REPORTING: [],
  EVENTTYPETAGS: [],
};

// Define the expected headers for each table in the database schema
export const getTableHeaders = (tableName) => {
  switch (tableName.toUpperCase()) {
    case 'ENTITIES':
      return [
        'entity_id',
        'name',
        'entity_type',
        'description',
        'created_at'
      ];
    case 'THEORY':
      return [
        'theory_id',
        'title',
        'description',
        'author',
        'publication_date',
        'src_type',
        'platform',
        'domain',
        'keyword_tags',
        'spectrum',
        'category',
        'entity_id',
        'references'
      ];
    case 'REPORTING':
      return [
        'report_id',
        'title',
        'description',
        'event_date',
        'reporting_date',
        'src_type',
        'platform',
        'spectrum',
        'category',
        'entity_id',
        'event_type_tag',
        'location',
        'source_link'
      ];
    case 'EVENTTYPETAGS':
      return [
        'tag_id',
        'tag_name',
        'tag_category',
        'entity_type',
        'parent_tag',
        'description'
      ];
    case 'REPORTINGEVENTTYPE':
      return [
        'report_id',
        'tag_id'
      ];
    default:
      return [];
  }
};

// Map database field names to UI field names
const mapDbFieldsToUiFields = (tableName, dbData) => {
  if (tableName.toUpperCase() === 'THEORY') {
    return {
      id: dbData.theory_id || '',
      HEADLINE: dbData.title || '',
      ABSTRACT: dbData.description || '',
      AUTHOR: dbData.author || '',
      DATE_PUBLISHED: dbData.publication_date || '',
      SOURCE_TYPE: dbData.src_type || '',
      PLATFORM: dbData.platform || '',
      DOMAIN: dbData.domain || '',
      KEYWORDS: dbData.keyword_tags || '',
      SPECTRUM: dbData.spectrum || '',
      CATEGORY: dbData.category || 'theory',
      WHO: dbData.entity_id || '',
      URL: dbData.references || ''
    };
  } else if (tableName.toUpperCase() === 'REPORTING') {
    return {
      id: dbData.report_id || '',
      HEADLINE: dbData.title || '',
      POST_CONTENT: dbData.description || '',
      DATE_PUBLISHED: dbData.event_date || '',
      SOURCE_TYPE: dbData.src_type || '',
      PLATFORM: dbData.platform || '',
      SPECTRUM: dbData.spectrum || '',
      CATEGORY: dbData.category || 'reporting',
      WHO: dbData.entity_id || '',
      REGION: dbData.location || '',
      URL: dbData.source_link || ''
    };
  } else if (tableName.toUpperCase() === 'ENTITIES') {
    return {
      id: dbData.card_id || '',
      HEADLINE: dbData.title || '',
      POST_CONTENT: dbData.description || '',
      INSTANCE_TYPE: dbData.instance_type || '',
      DATE_REPORTED: dbData.date_reported || '',
      LOCATION: dbData.LOCATION || '',
      URL: dbData.source_link || '',
      WHO: dbData.WHO || '',
      CATEGORY: 'entities'
    };
  } else {
    // For entities and other tables, return as is
    return dbData;
  }
};

// Function to get data from a specific table
export const getTableData = async (tableName) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.REACT_APP_GOOGLE_SPREADSHEET_ID,
      range: tableName,
    });
    return response.data.values; // Adjust this based on your data structure
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// Function to add a row to a table
export const addRowToTable = async (tableName, rowData) => {
  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.REACT_APP_GOOGLE_SPREADSHEET_ID,
      range: tableName,
      valueInputOption: 'RAW',
      resource: {
        values: [rowData],
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding row to table:', error);
    throw error;
  }
};

// Function to add a row to the ENTITIES table
export const addRowToEntitiesTable = async (data) => {
  const { WHO, LOCATION, ...rest } = data;
  // Process WHO and LOCATION as needed
  // For example, convert WHO and LOCATION to arrays if they are not already
  const processedWho = Array.isArray(WHO) ? WHO : [WHO];
  const processedLocation = Array.isArray(LOCATION) ? LOCATION : [LOCATION];
  
  // Add row to the ENTITIES table
  const response = await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.REACT_APP_GOOGLE_SPREADSHEET_ID,
    range: 'ENTITIES',
    valueInputOption: 'RAW',
    resource: {
      values: [Object.values({ ...rest, WHO: processedWho.join(','), LOCATION: processedLocation.join(',') })]
    },
  });
  if (!response.ok) {
    throw new Error('Failed to add row to ENTITIES table');
  }
};

// Add a function to save data to the theory table
export const addRowToTheoryTable = async (data) => {
  const row = {
    theory_id: data.theory_id,
    title: data.title,
    description: data.description,
    keywords: data.keywords.join(','),
    authors: data.authors.join(','),
    domains: data.domains.join(',')
  };
  await addRowToTable('THEORY', row);
};

// Add a function to save data to the reporting table
export const addRowToReportingTable = async (data) => {
  const row = {
    report_id: data.report_id,
    headline: data.headline,
    description: data.description,
    entities: data.entities.join(','),
    regions: data.regions.join(',')
  };
  await addRowToTable('REPORTING', row);
};

// For backward compatibility
export const getSheetHeaders = getTableHeaders;
export const getSheetData = getTableData;
export const addRowToSheet = addRowToTable;