import React from 'react';
import UserList from "../../components/advanced-settings/UserList";
import {Box, Tab, Tabs, Typography} from "@mui/material";
import ConnectTelegram from "../../components/advanced-settings/ConnectTelegram";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <>{children}</>
            )}
        </div>
    );
}

function allyProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function AdvancedSettings() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Подключение к Telegram боту" {...allyProps(0)} />
                    <Tab label="Подключенные пользователи" {...allyProps(1)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <ConnectTelegram />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <UserList />
            </CustomTabPanel>
        </Box>
    );
}

export default AdvancedSettings;
