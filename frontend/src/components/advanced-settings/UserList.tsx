import React, {useEffect, useState} from 'react';
import {DataGrid, GridColDef, GridRenderCellParams} from "@mui/x-data-grid";
import ActionsBlock from "./ActionsBlock";
import {advancedSettingsTheme} from "../../themes/advancedSettings.theme";
import {Box, ThemeProvider} from "@mui/material";
import {fetchUsers} from "../../api/telegramUsersAPI";

const columns: GridColDef[] = [
    {
        field: 'id',
        headerName: 'ID пользователя в Telegram',
        flex: 0.25
    },
    {
        field: 'amoCRMName',
        headerName: 'Имя пользователя в amoCRM',
        flex: 0.25
    },
    {
        field: 'telegramName',
        headerName: 'Имя пользователя в Telegram',
        flex: 0.25
    }
];

type UserRow = {
    id: number;
    telegramName: string;
    amoCRMId?: number | null
    amoCRMName?: string | null;
}

function UserList() {
    const [users, setUsers] = useState<UserRow[]>([]);
    const [tableUsers, setTableUsers] = useState<UserRow[]>([]);
    const tableHeader: GridColDef[] = [
        ...columns,
        {
            field: 'actions',
            headerName: 'Действия',
            flex: 0.25,
            renderCell: (params: GridRenderCellParams): JSX.Element | undefined => {
                const currentUser = users.find(({id}) => params.row.id === id);

                if (currentUser) {
                    return (
                        <ActionsBlock users={users} setUsers={setUsers} user={currentUser}/>
                    )
                }
            },
        }
    ]

    async function getUsers () {
        const fetchedUsers = await fetchUsers();
        const preparedUsers = fetchedUsers.map(({telegramId, telegramUserName, amoUserId, amoUserName}) => ({
            id: telegramId,
            telegramName: telegramUserName,
            amoCRMId: amoUserId || null,
            amoCRMName: amoUserName || null
        }))
        setUsers([...preparedUsers]);
        setTableUsers(preparedUsers.map(({id, amoCRMName, telegramName}) => ({
            id,
            amoCRMName,
            telegramName
        })))
    }

    useEffect(() => {
        getUsers()
    }, [users]);

    return (
        <ThemeProvider theme={advancedSettingsTheme}>
            <div>
                <Box sx={{ height: 600, width: '100%', marginTop: 4 }}>
                    <DataGrid
                        rows={tableUsers}
                        columns={tableHeader}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 10,
                                },
                            },
                        }}
                        pageSizeOptions={[10]}
                        autoHeight
                        rowSelection={false}
                        sx={{"& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within, & .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus-within": { outline: 'none'}}}
                    />
                </Box>
            </div>
        </ThemeProvider>
    );
}

export default UserList;
