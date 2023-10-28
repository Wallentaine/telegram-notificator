import {$server} from './index';
import {TelegramUser} from "../types/telegramUsersTypes";

export const fetchUsers = async (): Promise<TelegramUser[]> => {
    const {data} = await $server.get(`bot/users?accountId=${AMOCRM.constant('account').id}`);

    return data;
}

export const updateUser = async (user: TelegramUser): Promise<void> => {
    await $server.put(`bot/users`, {
        accountId: AMOCRM.constant('account').id,
        user
    })
}

export const deleteUser = async (user: TelegramUser): Promise<void> => {
    await $server.delete(`bot/users`, {
        data: {
            accountId: AMOCRM.constant('account').id,
            user
        }
    })
}
