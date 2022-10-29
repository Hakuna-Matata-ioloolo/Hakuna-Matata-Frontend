import PropTypes from 'prop-types';
import { TableCell, TableHead, TableRow } from '@material-ui/core';

UserListHead.propTypes = {
  headLabel: PropTypes.array
};

export default function UserListHead({ headLabel }) {
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
