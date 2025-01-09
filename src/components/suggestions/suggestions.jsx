import React from 'react';
import SuggestionsFilters from './components/suggestions-filters.jsx';
import ProfilesGrid from '../shared/profiles-grid.jsx';
import Title from '../shared/title.jsx';
import Divider from '@mui/material/Divider';
import './suggestions.css';
import {searchOptions, interestNames, likedProfile, currentUser} from '../../datas/template.jsx';

const Suggestions = () => {
    return (
        <>
            <Title textTitle="Suggestions" />
            <SuggestionsFilters
                suggestionsOptions={searchOptions}
                interestNames={interestNames}
            />
            <Divider light />
            <ProfilesGrid
                profiles={likedProfile}
                currentUserProfile={currentUser}
                type="suggestion"
            />
        </>
    );
};

export default Suggestions;
