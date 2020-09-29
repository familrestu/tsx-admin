import React from 'react';
import Page from 'components/Page';

import {
    Card,
    Row,
    Col,
    Badge,
    OverlayTrigger,
    Tooltip,
} from 'react-bootstrap';
import Chart from 'chart.js';
import SimpleBar from 'simplebar-react';
import moment from 'moment';

import { DividerVertical } from 'components/Divider';
import { AvatarImage, AvatarProps } from 'components/Avatar';

import CompanyInfoUpToDate from 'assets/images/undraw_up_to_date_rmbm.png';

class Piechart extends React.Component {
    componentDidMount() {
        new Chart(document.getElementById('piechart') as HTMLCanvasElement, {
            type: 'pie',
            data: {
                labels: ['PRS', 'LTI', 'ABS', 'EAO', 'UNPR'],
                datasets: [
                    {
                        label: 'Sept, 2020',
                        data: [25, 2, 1, 5, 4],
                        backgroundColor: [
                            'rgba(75, 192, 192, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 99, 132, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                        ],
                    },
                ],
            },
            options: {
                maintainAspectRatio: false,
                cutoutPercentage: 65,
                legend: {
                    display: true,
                    position: 'right',
                },

                tooltips: {
                    backgroundColor: 'rgb(255,255,255)',
                    bodyFontColor: '#858796',
                    borderColor: '#dddfeb',
                    xPadding: 15,
                    yPadding: 15,
                    displayColors: true,
                },
            },
        });
    }

    render() {
        return <canvas id="piechart" height="200"></canvas>;
    }
}

class Barchart extends React.Component {
    componentDidMount() {
        new Chart(document.getElementById('barchart') as HTMLCanvasElement, {
            type: 'horizontalBar',
            data: {
                labels: ['Sep', 'Oct'],
                datasets: [
                    {
                        label: 'Productive Hours',
                        backgroundColor: '#ff6384',
                        data: [150, 150],
                    },
                    {
                        label: 'Work Hours',
                        backgroundColor: '#4bc0c0',
                        data: [153, 159],
                    },
                ],
            },
            options: {
                maintainAspectRatio: false,
                legend: {
                    display: true,
                    position: 'bottom',
                },
                scales: {
                    xAxes: [
                        {
                            ticks: {
                                beginAtZero: true,
                                max: 200,
                            },
                        },
                    ],
                },
            },
        });
    }

    render() {
        return <canvas id="barchart" height="200"></canvas>;
    }
}

const AttendanceCard = () => (
    <Card className="shadow card-border-left-success">
        <Card.Body className="d-flex">
            <div className="d-flex flex-rows justify-content-center align-items-center flex-1">
                <span className="d-flex justify-content-center text-center align-items-center text-primary flex-column flex-1">
                    <span className="flex-1" style={{ fontSize: 'x-large' }}>
                        07:02
                    </span>
                    <span
                        className="flex-1 text-gray bold text-uppercase"
                        style={{ fontSize: 'x-small' }}
                    >
                        in
                    </span>
                </span>
                <DividerVertical />
                <span className="d-flex justify-content-center text-center align-items-center text-danger flex-column flex-1">
                    <span className="flex-1" style={{ fontSize: 'x-large' }}>
                        18:02
                    </span>
                    <span
                        className="flex-1 text-gray bold text-uppercase"
                        style={{ fontSize: 'x-small' }}
                    >
                        out
                    </span>
                </span>
            </div>
        </Card.Body>
    </Card>
);

type ArrCompanyInfoType = {
    title: string;
    date: string;
    content: string;
    attachment: Array<AttachmentPropsType> | null;
    opened: boolean;
}[];

const arrCompanyInfo: ArrCompanyInfoType = [
    {
        title: 'Work From Home and Work From Office',
        date: moment('2020-11-20').format('DD MMMM, YYYY').toString(),
        content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut malesuada molestie eros, et maximus arcu imperdiet et. Nunc semper ex sed tellus placerat, id cursus velit tincidunt. Morbi nec velit in nisl elementum laoreet. Nullam quis risus egestas, pharetra ligula eu, laoreet quam. Sed dapibus porttitor erat, vel pretium nulla convallis ac. Vestibulum tellus nibh, pellentesque vitae est ac, mattis porta augue. Donec elementum augue ex, a sodales arcu porta quis. Fusce vel rutrum turpis. Maecenas elementum libero metus, sit amet feugiat ligula pharetra vitae. Curabitur id libero sit amet justo pretium molestie ac id metus. Sed facilisis metus viverra leo faucibus auctor. Aenean vitae cursus eros.

Donec et facilisis lorem. Vestibulum vehicula ornare aliquet. Nunc in ipsum at ante vulputate feugiat id ut leo. Ut ultricies placerat magna ac posuere. Sed tortor lectus, eleifend non neque pulvinar, sollicitudin maximus justo. Ut finibus condimentum malesuada. Etiam tortor dui, feugiat id imperdiet et, accumsan eu est. Nunc consectetur metus dolor, at pretium turpis vehicula sit amet. Aliquam efficitur fermentum pharetra. Cras venenatis vulputate sapien id sagittis. Maecenas ornare justo ut massa vulputate rutrum. Nam lobortis ipsum vitae eros euismod sagittis. Sed iaculis in ante nec condimentum. Mauris ultricies, justo a auctor facilisis, ipsum enim tincidunt felis, non vulputate diam enim ac nulla.`,
        attachment: [
            {
                name: 'KEPRES XX-XX-XX.pdf',
                type: 'pdf',
                link: 'downlink',
            },
        ],
        opened: false,
    },
    {
        title: 'Larangan Penggunaan Masker Scuba',
        date: moment('2020-10-01').format('DD MMMM, YYYY').toString(),
        content: `Dear All,

Sehubungan dengan tidak efektifnya penggunan masker scuba, masker kain 1 lapis maupun masker buff dalam pencegahan penyebaran virus korona maka kami himbau per Senin, 21 September 2020 seluruh karyawan diwajibkan mengenakan masker medis dan masker kain minimal 3 lapis.
Penggunaan masker dengan kualitas yang tidak sesuai dengan rekomendasi secara medis termasuk pelanggaran protokol kesehatan.

Demikian yang dapat kami sampaikan, mohon dapat menjadi perhatian bagi seluruh karyawan.

Terima kasih
HR`,
        attachment: null,
        opened: false,
    },
];

type AttachmentPropsType = {
    name: string;
    type: string;
    link: string;
};

const Attachment = (props: AttachmentPropsType) => {
    let returnElement = null;

    if (props.type === 'image') {
        returnElement = (
            <div
                className="d-flex flex-column justify-content-center align-items-center pointer"
                style={{ height: '100px', minWidth: '100px' }}
            >
                <img />
                <span className="small">{props.name}</span>
            </div>
        );
    } else {
        returnElement = (
            <div
                className="d-flex flex-column justify-content-center align-items-center pointer"
                style={{ height: '100px', minWidth: '100px' }}
            >
                <i
                    className={`fas fa-file-${props.type} mb-1 text-${
                        props.type === 'excel' || props.type === 'csv'
                            ? 'primary'
                            : props.type === 'pdf'
                            ? 'danger'
                            : props.type === 'word'
                            ? 'info'
                            : props.type === 'powerpoint'
                            ? 'warning'
                            : 'default'
                    }`}
                    style={{ fontSize: 'xx-large' }}
                ></i>
                <span className="small">{props.name}</span>
            </div>
        );
    }

    return returnElement;
};

class CompanyInfo extends React.Component {
    details: HTMLDivElement | null | undefined;

    ExpandCompanyRowHandler(e: React.MouseEvent) {
        const target = e.currentTarget as HTMLDivElement;
        const parentTarget = target.parentElement as HTMLDivElement;
        const targetNextSibling = target.nextElementSibling as HTMLDivElement;

        parentTarget.classList.toggle('show');
        if (targetNextSibling !== null) {
            const expandedHeight = targetNextSibling.getAttribute(
                'expanded-height',
            );

            if (parentTarget.classList.value.indexOf('show') > 0) {
                targetNextSibling.style.height = `${expandedHeight}px`;
            } else {
                targetNextSibling.style.height = '0px';
            }
        }

        /* other code to remove "New" */
    }

    HideShowedCompanyInfoHandler() {
        const arrShowed = document.querySelectorAll('.companyinfo-row.show');

        for (let i = 0; i < arrShowed.length; i++) {
            const element = arrShowed[i];
            (element as HTMLDivElement).classList.remove('show');
        }

        const arrDetails = document.querySelectorAll(
            '.companyinfo-row .details',
        );

        for (let i = 0; i < arrDetails.length; i++) {
            const element = arrDetails[i];
            (element as HTMLDivElement).style.height = '0px';
        }
    }

    componentDidMount() {
        this.HideShowedCompanyInfoHandler();
    }

    render() {
        return (
            <Card className="shadow companyinfo-container">
                <Card.Header>Company Info</Card.Header>
                <Card.Body>
                    <SimpleBar style={{ maxHeight: '500px' }}>
                        {arrCompanyInfo.length ? (
                            arrCompanyInfo.map((key, index) => {
                                return (
                                    <div
                                        key={`${key.title}-${index}`}
                                        className="companyinfo-row show"
                                    >
                                        <div
                                            className="preview d-flex align-items-center pointer"
                                            onClick={(e: React.MouseEvent) =>
                                                this.ExpandCompanyRowHandler(e)
                                            }
                                        >
                                            <div className="flex-1">
                                                <h6 className="d-flex m-0 align-items-center">
                                                    <span className="mr-1">
                                                        {key.title}
                                                    </span>
                                                    {!key.opened && (
                                                        <Badge variant="danger">
                                                            New
                                                        </Badge>
                                                    )}
                                                </h6>
                                                <span className="small">
                                                    {key.date}
                                                </span>
                                            </div>
                                            <div
                                                className="p-2 d-flex align-items-center justify-content-center"
                                                style={{
                                                    width: 30,
                                                    height: 30,
                                                }}
                                            >
                                                <i className="fas fa-chevron-left"></i>
                                            </div>
                                        </div>
                                        <div
                                            className="details"
                                            ref={(ref) => {
                                                if (ref !== null) {
                                                    ref.setAttribute(
                                                        'expanded-height',
                                                        ref.offsetHeight.toString(),
                                                    );
                                                }
                                            }}
                                        >
                                            <p>{key.content}</p>
                                            {key.attachment !== null && (
                                                <Row>
                                                    {key.attachment.map(
                                                        (
                                                            keyAttachment,
                                                            indexAttachment,
                                                        ) => {
                                                            return (
                                                                <Attachment
                                                                    key={`${keyAttachment}-${indexAttachment}`}
                                                                    name={
                                                                        keyAttachment.name
                                                                    }
                                                                    type={
                                                                        keyAttachment.type
                                                                    }
                                                                    link={
                                                                        keyAttachment.link
                                                                    }
                                                                />
                                                            );
                                                        },
                                                    )}
                                                </Row>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="position-relative d-flex align-items-center justify-content-center p-4">
                                <img
                                    src={CompanyInfoUpToDate}
                                    style={{ height: '400px' }}
                                    alt="Everything's catched up"
                                />
                                <h5>Everything&apos;s catched up</h5>
                            </div>
                        )}
                    </SimpleBar>
                </Card.Body>
            </Card>
        );
    }
}

const arrTeams = [
    {
        name: 'Mark Zuckerberg',
        image:
            'https://upload.wikimedia.org/wikipedia/commons/c/c4/Mark_Zuckerberg_F8_2018_Keynote_%28cropped%29.jpg',
        position: 'Facebook CEO',
        isPresent: false,
        startTime: null,
        endTime: null,
    },
    {
        name: 'Elon Musk',
        image:
            'https://image.cnbcfm.com/api/v1/image/105773439-1551717349171rtx6p9uc.jpg?v=1551717410',
        position: 'CEO of Tesla, SpaceX, etc..',
        isPresent: true,
        startTime: '06:54',
        endTime: null,
    },
    {
        name: 'Emil',
        image:
            'https://instagram.fcgk18-1.fna.fbcdn.net/v/t51.2885-19/s150x150/119965518_712593792802031_924955956384857550_n.jpg?_nc_ht=instagram.fcgk18-1.fna.fbcdn.net&_nc_cat=111&_nc_ohc=jFcPzhtfaHkAX-7Vvyh&oh=53259d8d87ad73e7b20bee7e03c4e219&oe=5F9E61AC',
        position: '',
        isPresent: true,
        startTime: '07:54',
        endTime: null,
    },
];

type TeamsProps = {
    isPresent: boolean;
    startTime: string | null;
    endTime: string | null;
};

const Teams = (props: TeamsProps & AvatarProps) => {
    return (
        <OverlayTrigger
            placement="top"
            overlay={
                <Tooltip id={props.name.replaceAll(' ', '')}>
                    <div
                        className="d-flex flex-column justify-content-center p-1"
                        style={{ width: '60px' }}
                    >
                        <div>
                            {props.startTime !== null
                                ? props.startTime
                                : '--:--'}
                        </div>
                        <div>
                            {props.endTime !== null ? props.endTime : '--:--'}
                        </div>
                    </div>
                </Tooltip>
            }
        >
            <div className="teamcontainer d-flex flex-column justify-content-center align-items-center m-2">
                <AvatarImage
                    name={props.name}
                    position={props.position}
                    image={props.image}
                    style={{
                        width: '50px',
                        height: '50px',
                    }}
                    className="position-relative mb-2 mt-2"
                >
                    <div
                        className={`position-absolute indicator ${
                            props.isPresent ? 'prs' : ''
                        }`}
                    ></div>
                </AvatarImage>
                <span>{props.name}</span>
            </div>
        </OverlayTrigger>
    );
};

class HomeScreen extends React.Component {
    render() {
        return (
            <Page breadCrumb="Dashboard">
                <Row>
                    <Col sm={2}>
                        <AttendanceCard />
                    </Col>
                </Row>
                <Row>
                    <Col sm={8}>
                        <Row>
                            <Col sm={6}>
                                <Card className="shadow">
                                    <Card.Header>Attendance List</Card.Header>
                                    <Card.Body>
                                        <Piechart />
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col sm={6}>
                                <Card className="shadow">
                                    <Card.Header>Productive Hours</Card.Header>
                                    <Card.Body>
                                        <Barchart />
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Card className="shadow">
                                    <Card.Body>
                                        <Card.Title>Team</Card.Title>
                                        <div className="d-flex align-items-baseline">
                                            {arrTeams.map((key, index) => {
                                                return (
                                                    <Teams
                                                        key={`${key.name.replaceAll(
                                                            ' ',
                                                            '',
                                                        )}-${index}`}
                                                        name={key.name}
                                                        image={key.image}
                                                        position={key.position}
                                                        isPresent={
                                                            key.isPresent
                                                        }
                                                        startTime={
                                                            key.startTime
                                                        }
                                                        endTime={key.endTime}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Col>

                    <Col sm={4}>
                        <CompanyInfo />
                    </Col>
                </Row>
            </Page>
        );
    }
}

export default HomeScreen;
