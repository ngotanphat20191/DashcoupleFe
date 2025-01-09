import React, { useContext, useEffect } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';
import UpperBoxProfile from './components/upperBoxProfile.jsx';
import TabPanelProfileAbout from './components/tabPanelProfileAbout.jsx';
import TabPanelProfileParameters from './components/tabPanelProfileParameters.jsx';
import Divider from '@mui/material/Divider';
import { Tabs, Tab } from '@mui/material';
import './profile.css';
import {usermatch, interestNames} from '../../datas/template.jsx';

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}
const Profile = params => {
    const {
        interests,
        notificationMail,
        notificationPush,
    } = usermatch;
    const [valueTab, setValueTab] = React.useState(0);
    const handleChange = (event, newValueTab) => {
        setValueTab(newValueTab);
    };
    return (
        <>
            <UpperBoxProfile
                profile={usermatch}
                type="public"
            />
            <Divider className="dividerprofile" />
            <div className="wrapperProfile">
                <form>
                    <Tabs
                        width="100%"
                        value={valueTab}
                        onChange={handleChange}
                        aria-label="simple tabs example"
                        className="tabsprofile"
                    >
                        <Tab
                            icon={
                                valueTab === 0 ? (
                                    <InfoIcon color="secondary" />
                                ) : (
                                    <InfoIcon color="primary" />
                                )
                            }
                            className={valueTab === 0 ? "activeTabprofile" : "tabprofile"}
                            label="About me"
                            {...a11yProps(0)}
                        />
                        <Tab
                            icon={
                                valueTab === 1 ? (
                                    <SettingsIcon color="secondary" />
                                ) : (
                                    <SettingsIcon color="primary" />
                                )
                            }
                            className={valueTab === 1 ? "activeTabprofile" : "tabprofile"}
                            label="Parameters"
                            {...a11yProps(1)}
                        />
                    </Tabs>
                    <TabPanelProfileAbout
                        value={valueTab}
                        index={0}
                        profile={usermatch}
                    />
                    <TabPanelProfileParameters
                        value={valueTab}
                        index={1}
                        profile={usermatch}
                        interests={interests}
                        interestNames={interestNames}
                        notificationMail={notificationMail}
                        notificationPush={notificationPush}
                    />
                </form>
            </div>
        </>
    );
};

export default Profile;
