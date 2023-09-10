import numeral from 'numeral';

export function fCurrency(number) {
  return `${numeral(number).format('0,0')}원`;
}

export function fData(number) {
  return numeral(number).format('0.0 b');
}
