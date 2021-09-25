import React from 'react';
// import moment from 'moment';

const arrTodo: { title: string; status: number; tags: { label: string; variant: string }[] }[] | [] = [
    {
        title: 'Client ABC - Payroll Optimization',
        status: 1,
        tags: [
            {
                label: 'Project',
                variant: 'primary',
            },
            {
                label: 'Bugs',
                variant: 'danger',
            },
        ],
    },
    {
        title: 'Client ABC - Wrong Tax Payroll Sep 2021',
        status: 0,
        tags: [
            {
                label: 'Project',
                variant: 'primary',
            },
            {
                label: 'Support',
                variant: 'info',
            },
            {
                label: 'Urgent',
                variant: 'danger',
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
                                        <p className="m-0 mb-2">
                                            {a.title}
                                            <span style={{ position: 'absolute', right: '1rem', top: '1rem' }}>
                                                <div className={`badge bg-${a.status === 2 ? 'primary' : 'light'} me-1 text-dark`}>{status[a.status]}</div>
                                            </span>
                                        </p>

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
