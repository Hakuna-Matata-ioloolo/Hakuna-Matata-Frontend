import { useEffect } from 'react';
// material
import { Card, Container, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@material-ui/core';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getUserList } from '../../redux/slices/user';
// routes
import { PATH_APP } from '../../routes/paths';
// components
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { UserListHead } from '../../components/app/admin/userList';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: '이름', alignRight: false },
  { id: 'phone', label: '전화번호', alignRight: false },
  { id: 'school', label: '학교', alignRight: false },
  { id: 'grade', label: '학년', alignRight: false },
  { id: 'clazz', label: '반', alignRight: false },
  { id: 'stdId', label: '번호', alignRight: false }
];

// ----------------------------------------------------------------------

export default function UserList() {
  const dispatch = useDispatch();
  const { userList } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getUserList());
  }, [dispatch]);

  return (
    <Page title="하쿠나 마타타 | 유저 목록">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading="유저 목록"
          links={[{ name: '하쿠나 마타타', href: PATH_APP.root }, { name: '유저 목록' }]}
        />

        <Card>
          <Scrollbar>
            <TableContainer>
              <Table>
                <UserListHead headLabel={TABLE_HEAD} />
                <TableBody>
                  {userList.map((user, idx) => {
                    const { name, phoneNumber, school, grade, clazz, stdId } = user;

                    return (
                      <TableRow hover key={idx} tabIndex={-1} role="checkbox">
                        <TableCell component="th" scope="row" padding="none">
                          <Typography variant="subtitle2" noWrap>
                            {name}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">{phoneNumber}</TableCell>
                        <TableCell align="left">{school}</TableCell>
                        <TableCell align="left">{grade}</TableCell>
                        <TableCell align="left">{clazz}</TableCell>
                        <TableCell align="left">{stdId}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
      </Container>
    </Page>
  );
}
