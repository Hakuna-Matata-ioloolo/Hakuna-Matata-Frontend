import numeral from 'numeral';

// ----------------------------------------------------------------------

export function fCurrency(number) {
  return `${numeral(number).format('0,0')}원`;
}

export function fStock(number) {
  return `${numeral(number).format('0,0')}개`;
}

export function fPercent(number) {
  return numeral(number / 100).format('0.0%');
}

export function fData(number) {
  return numeral(number).format('0.0 b');
}
