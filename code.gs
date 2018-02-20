/*
 * Helper function to get selected range in current active sheet
 */
function getSelectedRange() {
  try {
    var sheet = SpreadsheetApp.getActiveSheet();
    return sheet.getActiveRange().getA1Notation();
  } catch (e) {
    throw "No range selected.";
  }
}

/*
 * Helper function to get range via A1 Notation in current active sheet
 */
function getRange(A1Notation) {
  try {
    var sheet = SpreadsheetApp.getActiveSheet();
    return sheet.getRange(A1Notation);
  } catch (e) {
    throw "Invalid A1 Notation [" + A1Notation + "] for range.";
  }
}

/*
 * Helper function to determine if given range contains only 1 column
 */
function isSingleColumn(range) {
  var rangeColumn = range.getNumColumns();
  return rangeColumn === 1;
}

/*
 * Helper function to determine if given range contains only 1 row
 */
function isSingleRow(range) {
  var rangeRow = range.getNumRows();
  return rangeRow === 1;
}

/*
 * Helper function to get the default configurations
 */
function geDefaultConfig() {
  return {
    is_initialized: false,
    lookup: {
      sheet_name: 'Sheet1',
      range: {
        person_name: 'A:A',
        timeslot: 'B:B',
        timestamp: 'C:C'
      }
    },
    fillup: {
      sheet_name: 'Sheet2',
      range: {
        person_name: 'A:A',
        timetable_weekly: 'B:H',
        timestamp: 'I:I'
      },
      schedule_weekly: [1, 2, 3, 4, 5, 6, 7]
    },
    data_retention: {
      expiry_days: -1
    }
  }
};

/*
 * Helper function to read the configurations from Document properties service
 */
function readConfigFromDocumentProperties() {
  var config = geDefaultConfig();
  var props = PropertiesService.getDocumentProperties();
  try {
    config.is_initialized = props.getProperty('IS_INITIALIZED');

    config.lookup.sheet_name = props.getProperty('LOOKUP_SHEET_NAME');
    config.lookup.range.person_name = props.getProperty('LOOKUP_RANGE_PERSON_NAME');
    config.lookup.range.timeslot = props.getProperty('LOOKUP_RANGE_TIMESLOT');
    config.lookup.range.timestamp = props.getProperty('LOOKUP_RANGE_TIMESTAMP');

    config.fillup.sheet_name = props.getProperty('FILLUP_SHEET_NAME');
    config.fillup.range.person_name = props.getProperty('FILLUP_RANGE_PERSON_NAME');
    config.fillup.range.timetable_weekly = props.getProperty('FILLUP_RANGE_TIMETABLE_WEEKLY');
    config.fillup.range.timestamp = props.getProperty('FILLUP_RANGE_TIMESTAMP');

    config.data_retention.expiry_days = props.getProperty('DATE_RETENTION_EXPIRY_DAYS');

  } catch (e) {
    throw "Unable to read config for the sheet."
  }
}

/*
 * Helper function to save the configurations to Document properties service
 */
function saveConfigToDocumentProperties(config) {
  var props = PropertiesService.getDocumentProperties();
  try {
    if (!props.getProperty('IS_INITIALIZED')) {
      // only update 'IS_INITIALIZED' if it is not initialized
      props.setProperty('IS_INITIALIZED', config.is_initialized);
    }
    props.setProperties({
      // 'IS_INITIALIZED' : config.is_initialized,

      'LOOKUP_SHEET_NAME': config.lookup.sheet_name,
      'LOOKUP_RANGE_PERSON_NAME': config.lookup.range.person_name,
      'LOOKUP_RANGE_TIMESLOT': config.lookup.range.timeslot,
      'LOOKUP_RANGE_TIMESTAMP': config.lookup.range.timestamp,

      'FILLUP_SHEET_NAME': config.fillup.sheet_name,
      'FILLUP_RANGE_PERSON_NAME': config.fillup.range.person_name,
      'FILLUP_RANGE_TIMETABLE_WEEKLY': config.fillup.range.timetable_weekly,
      'FILLUP_RANGE_TIMESTAMP': config.fillup.range.timestamp,

      'DATE_RETENTION_EXPIRY_DAYS': config.data_retention.expiry_days,
    });

  } catch (e) {
    throw "Unable to save config for the sheet."
  }
}
