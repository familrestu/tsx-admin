import React from 'react';
// import moment from 'moment';

const arrTodo: { title: string; status: number; tags: { label: string; variant: string }[] }[] | [] = [
    {
        title: 'Add Double Box With Filter',
        status: 0,
        tags: [
            {
                label: 'Enhancement',
                variant: 'info',
            },
        ],
    },
    {
        title: 'Check when submit form, but failed or invalidated and showing alert, always close the modal, should be not',
        status: 2,
        tags: [
            {
                label: 'Bugs',
                variant: 'danger',
            },
        ],
    },
    {
        title: 'Create Employee Information Balance Widget Such As Annual Leave, Reimbursement',
        status: 0,
        tags: [
            {
                label: 'Enhancement',
                variant: 'info',
            },
            {
                label: 'Widget',
                variant: 'info',
            },
        ],
    },
    {
        title: 'Add logic to "Record Attendance"',
        status: 0,
        tags: [
            {
                label: 'Enhancement',
                variant: 'info',
            },
            {
                label: 'Widget',
                variant: 'info',
            },
        ],
    },
    {
        title: 'Add "Fake" notification using bootstrap TOAST',
        status: 0,
        tags: [
            {
                label: 'Enhancement',
                variant: 'info',
            },
        ],
    },
    {
        title: 'Create New Carousel, instead of using bootstrap',
        status: 0,
        tags: [
            {
                label: 'Enhancement',
                variant: 'info',
            },
            {
                label: 'Widget',
                variant: 'info',
            },
        ],
    },
];

const status = ['Open', 'In Progress', 'Completed', 'Closed', 'Cancelled'];

const TodoList = () => {
    return (
        <div className="col-12 col-sm-8 col-md-6 col-lg-6 col-xl-6 col-auto" style={{ height: '100%' }}>
            <div className="card mb-2 overflow-hidden">
                <div className="card-header" style={{ backgroundColor: 'var(--primary)', color: '#fff', fontWeight: 'bold' }}>
                    To-Do List
                </div>
                <div className="card-body" style={{ backgroundColor: '#dfdfdf', height: '480px', maxHeight: '480px', overflow: 'auto' }}>
                    {arrTodo.length ? (
                        arrTodo.map((a, index) => {
                            return (
                                <div className="card" key={`list-${index}`} style={{ height: 'unset' }}>
                                    <div className="card-body">
                                        {/* <p className="m-0 mb-2"> */}
                                        <span style={{ float: 'right' }}>
                                            <div className={`badge bg-${a.status === 2 ? 'primary' : 'light'} me-1 text-dark`}>{status[a.status]}</div>
                                        </span>
                                        {a.title}
                                        {/* </p> */}

                                        <div>
                                            {a.tags.map((b, bindex) => {
                                                return (
                                                    <div key={`listitem-${index}-${bindex}`} className={`badge bg-${b.variant} me-1`}>
                                                        {b.label}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-dark bold">Nothing to-do</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TodoList;
