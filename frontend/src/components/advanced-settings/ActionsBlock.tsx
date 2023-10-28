import React, {useState} from 'react';
import {Autocomplete, Box, Button, Modal, TextField, ThemeProvider, Typography} from "@mui/material";
import {advancedSettingsTheme} from "../../themes/advancedSettings.theme";
import {deleteUser, updateUser} from "../../api/telegramUsersAPI";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 400,
    bgcolor: 'background.paper',
    p: 4,
    display: 'flex'
};

type UserRow = {
    id: number;
    telegramName: string;
    amoCRMId?: number | null;
    amoCRMName?: string | null;
}

type ActionsBlockProp = {
    users: UserRow[];
    setUsers: React.Dispatch<React.SetStateAction<UserRow[]>>;
    user: UserRow | null;
}

const amoCRMUsers: {
    id: number,
    label: string
}[] = Object.keys(AMOCRM.constant("account").users).map((id) => ({
    id: Number(id),
    label: AMOCRM.constant("account").users[id]
}));

function ActionsBlock({users, setUsers, user}: ActionsBlockProp) {
    const [isChangeModalOpen, setIsChangeModalOpen] = useState<boolean>(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)
    const [telegramUserName, setTelegramUserName] = useState<string>(user?.telegramName || '');
    const [amoCRMUser, setAmoCRMUser] = useState<{
        id: number;
        label: string
    }>(amoCRMUsers.find(({id}) => id === user?.amoCRMId) || {id: 0, label: ''})


    function handleOpenChangeModal() {
        setIsChangeModalOpen(true);
    }

    function handleCloseChangeModal() {
        setIsChangeModalOpen(false);
    }

    function handleOpenDeleteModal() {
        setIsDeleteModalOpen(true);
    }

    function handleCloseDeleteModal() {
        setIsDeleteModalOpen(false);
    }

    async function handleDeleteUser() {
        if (user) {
            await deleteUser({
                telegramId: user.id,
                telegramUserName: user?.telegramName,
                amoUserId: user.amoCRMId || null,
                amoUserName: user.amoCRMName || null
            })
            setUsers(prevState => prevState.filter(({id}) => id !== user.id))
        }
    }

    async function handleAcceptChanges() {
        if (user) {
            await updateUser({
                telegramId: user.id,
                telegramUserName: telegramUserName,
                amoUserId: amoCRMUser.id,
                amoUserName: amoCRMUser.label
            })
            setUsers([...users.map((userItem) => {
                if (userItem.id === user.id) {
                    return {
                        id: user.id,
                        telegramName: telegramUserName,
                        amoCRMId: amoCRMUser.id,
                        amoCRMName: amoCRMUser.label
                    }
                }
                return userItem;
            })])
        }
        handleCloseChangeModal();
    }

    return (
        <Box>
            <Button
                color={'info'}
                onClick={handleOpenChangeModal}
            >
                Изменить
            </Button>
            <Button
                color={'warning'}
                onClick={handleOpenDeleteModal}
            >
                Удалить
            </Button>
            <Modal
                open={isChangeModalOpen}
                onClose={handleCloseChangeModal}
                aria-labelledby="modal-modal-title-change"
                aria-describedby="modal-modal-description-change"
            >
                <Box sx={{...style, justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                    <ThemeProvider theme={advancedSettingsTheme}>
                        <Typography sx={{marginBottom: 6}} variant="h6" gutterBottom>
                            Редактирование пользователя
                        </Typography>
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={amoCRMUsers}
                            sx={{width: '100%'}}
                            renderInput={(params) => <TextField {...params} label="Имя пользователя в amoCRM"/>}
                            value={amoCRMUser}
                            onInputChange={(event, newInputValue) => {
                                const amoUser = amoCRMUsers.find(({label}) => label === newInputValue);

                                if (amoUser) {
                                    setAmoCRMUser({id: amoUser.id, label: newInputValue});
                                }
                            }}
                        />
                        <TextField
                            id="outlined-basic"
                            label="Имя пользователя в Telegram"
                            variant="outlined"
                            value={telegramUserName}
                            sx={{marginTop: 4, width: '100%'}}
                            onChange={(e) => setTelegramUserName(e.target.value)}
                        />
                        <Button sx={{marginTop: 5, padding: '15px 45px'}} color={'success'} variant={'outlined'}
                                onClick={handleAcceptChanges}>Подтвердить</Button>
                    </ThemeProvider>
                </Box>
            </Modal>
            <Modal
                open={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                aria-labelledby="modal-modal-title-delete"
                aria-describedby="modal-modal-description-delete"
            >
                <Box sx={style}>
                    <Typography variant="button" display="flex" sx={{alignItems: 'center'}}>Вы действительно хотите
                        удалить пользователя Алексей Колесниченко?</Typography>
                    <Button sx={{marginLeft: 2}} color={'success'} variant={'outlined'}
                            onClick={handleDeleteUser}>Подтвердить</Button>
                </Box>
            </Modal>
        </Box>
    );
}

export default ActionsBlock;
