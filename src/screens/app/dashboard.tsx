import React from 'react';
import Page from 'components/Page';
import RecordTime from 'widget/recordtime';
import Announcement from 'widget/announcement';
import TodoList from 'widget/todolist';

const Home = () => (
    <Page breadCrumb="Dashboard">
        <div className="row">
            <RecordTime />
            <Announcement />
        </div>
        <div className="row">
            <TodoList />
        </div>
    </Page>
);

export default Home;
