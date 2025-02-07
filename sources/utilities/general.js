import moment from 'moment';
export const generalApi = {
    prepareDataForDataTable: (idColumn, rows) => {
        var _rows2 = [];
        rows.forEach(function (e) {
            e.id = e[idColumn];
            _rows2.push(e);
        });
        return _rows2;
    },
    prepareDataForDataTableWidthDates: (idColumn, datesColumns, rows) => {
        var _rows2 = [];
        rows.forEach(function (e) {
            e.id = e[idColumn];
            datesColumns.forEach(function (dc) {
                if (e[dc]) {
                    // e[dc+"F"] = moment(new Date(e[dc])).format('YYYY-MM-DD'),
                    e[dc] = new Date(e[dc]);
                }
            });
            _rows2.push(e);
        });
        return _rows2;
    },
    prepareDataForCombo: (idColumn, valueComun, rows) => {
        var _rows2 = [];
        rows.forEach(function (e) {
            _rows2.push({
                id: e[idColumn],
                value: e[valueComun]
            });
        });
        return _rows2;
    }
}

