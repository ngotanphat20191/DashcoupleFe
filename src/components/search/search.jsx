import React from 'react';
import SearchFilters from './components/search-filters.jsx';
import ProfilesGrid from '../shared/profiles-grid.jsx';
import Title from '../shared/title.jsx';
import Divider from '@mui/material/Divider';
import './search.css';
import {searchOptions, interestNames, likedProfile, currentUser} from '../../datas/template.jsx';
const Search = () => {
    return (
        <>
            <Title textTitle="Search" />
            <SearchFilters
                searchOptions={searchOptions}
                interestNames={interestNames}
            />
            <Divider light />
            <ProfilesGrid
                profiles={likedProfile}
                currentUserProfile={currentUser}
                type="search"
            />
        </>
    );
};

export default Search;
