import PropTypes from 'prop-types';
import { TableCell, TableHead, TableRow } from '@material-ui/core';

ProductListHead.propTypes = {
  headLabel: PropTypes.array
};

export default function ProductListHead({ headLabel }) {
  return (
    <TableHead>
      <TableRow>
        {headLabel.map(({ id, label }) => (
          <TableCell key={id}>{label}</TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
