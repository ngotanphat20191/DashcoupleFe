import React from 'react';
import Title from '../shared/title.jsx';
import ProfilesGrid from '../shared/profiles-grid.jsx';
import {likedProfile, currentUser} from '../../datas/template.jsx'

const Like = () => {
    return (
        <>
            <Title textTitle="History of likes" />
            <ProfilesGrid
                profiles={likedProfile}
                currentUserProfile={currentUser}
                type="like"
            />
        </>
    );
};

export default Like;