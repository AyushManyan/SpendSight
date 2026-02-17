const MONTHS = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
};

function getMonthRange(year, month) {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  return { start, end };
}

exports.getSmartDateRange = function (text) {
  const lower = text.toLowerCase();
  const year = new Date().getFullYear();

  //  ON / EXACT DATE
  let match = lower.match(/\bon\s*(\d{1,2})\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/);
  if (match) {
    const date = new Date(year, MONTHS[match[2]], Number(match[1]));
    return { start: date, end: date };
  }

  //  AROUND / NEAR
  match = lower.match(/(around|near|approx)\s*(\d{1,2})\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/);
  if (match) {
    const center = new Date(year, MONTHS[match[3]], Number(match[2]));
    const start = new Date(center);
    const end = new Date(center);
    start.setDate(center.getDate() - 3);
    end.setDate(center.getDate() + 3);
    return { start, end };
  }

  //  EARLY / MID / LATE MONTH
  match = lower.match(/\b(early|mid|late)\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/);
  if (match) {
    const month = MONTHS[match[2]];
    if (match[1] === "early") {
      return {
        start: new Date(year, month, 1),
        end: new Date(year, month, 10)
      };
    }
    if (match[1] === "mid") {
      return {
        start: new Date(year, month, 11),
        end: new Date(year, month, 20)
      };
    }
    if (match[1] === "late") {
      const { end } = getMonthRange(year, month);
      return {
        start: new Date(year, month, 21),
        end
      };
    }
  }

  return null;
};
