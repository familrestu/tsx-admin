import React from 'react';
import Page from 'components/Page';

import { Card, Row, Col /* Badge */ } from 'react-bootstrap';
// import Simplebar from 'simplebar-react';
// import moment from 'moment';

import { DividerVertical } from 'components/Divider';
// import CompanyInfoUpToDate from 'assets/images/undraw_up_to_date_rmbm.png';

const AttendanceRecordTime = () => (
    <Card className="shadow-sm card-border-left-success">
        <Card.Body className="d-flex flex-column">
            <div className="d-flex flex-rows justify-content-center align-items-center flex-1" style={{ height: '50px' }}>
                <span className="d-flex justify-content-center text-center align-items-center text-primary flex-column flex-1">
                    <span className="flex-1" style={{ fontSize: 'x-large' }}>
                        07:02
                    </span>
                    <span className="flex-1 text-black bold text-uppercase" style={{ fontSize: 'x-small' }}>
                        in
                    </span>
                </span>
                <DividerVertical />
                <span className="d-flex justify-content-center text-center align-items-center text-danger flex-column flex-1">
                    <span className="flex-1" style={{ fontSize: 'x-large' }}>
                        18:02
                    </span>
                    <span className="flex-1 text-black bold text-uppercase" style={{ fontSize: 'x-small' }}>
                        out
                    </span>
                </span>
            </div>
        </Card.Body>
    </Card>
);

// type ArrCompanyInfoType = {
//     title: string;
//     date: string;
//     content: string;
//     attachment: Array<AttachmentPropsType> | null;
//     opened: boolean;
// }[];

// const arrCompanyInfo: ArrCompanyInfoType = [
//     {
//         title: 'Lorem ipsum dolor sit amet',
//         date: moment('2020-11-20').format('DD MMMM, YYYY').toString(),
//         content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut malesuada molestie eros, et maximus arcu imperdiet et. Nunc semper ex sed tellus placerat, id cursus velit tincidunt. Morbi nec velit in nisl elementum laoreet. Nullam quis risus egestas, pharetra ligula eu, laoreet quam. Sed dapibus porttitor erat, vel pretium nulla convallis ac. Vestibulum tellus nibh, pellentesque vitae est ac, mattis porta augue. Donec elementum augue ex, a sodales arcu porta quis. Fusce vel rutrum turpis. Maecenas elementum libero metus, sit amet feugiat ligula pharetra vitae. Curabitur id libero sit amet justo pretium molestie ac id metus. Sed facilisis metus viverra leo faucibus auctor. Aenean vitae cursus eros.

// Donec et facilisis lorem. Vestibulum vehicula ornare aliquet. Nunc in ipsum at ante vulputate feugiat id ut leo. Ut ultricies placerat magna ac posuere. Sed tortor lectus, eleifend non neque pulvinar, sollicitudin maximus justo. Ut finibus condimentum malesuada. Etiam tortor dui, feugiat id imperdiet et, accumsan eu est. Nunc consectetur metus dolor, at pretium turpis vehicula sit amet. Aliquam efficitur fermentum pharetra. Cras venenatis vulputate sapien id sagittis. Maecenas ornare justo ut massa vulputate rutrum. Nam lobortis ipsum vitae eros euismod sagittis. Sed iaculis in ante nec condimentum. Mauris ultricies, justo a auctor facilisis, ipsum enim tincidunt felis, non vulputate diam enim ac nulla.

// Donec et facilisis lorem. Vestibulum vehicula ornare aliquet. Nunc in ipsum at ante vulputate feugiat id ut leo. Ut ultricies placerat magna ac posuere. Sed tortor lectus, eleifend non neque pulvinar, sollicitudin maximus justo. Ut finibus condimentum malesuada. Etiam tortor dui, feugiat id imperdiet et, accumsan eu est. Nunc consectetur metus dolor, at pretium turpis vehicula sit amet. Aliquam efficitur fermentum pharetra. Cras venenatis vulputate sapien id sagittis. Maecenas ornare justo ut massa vulputate rutrum. Nam lobortis ipsum vitae eros euismod sagittis. Sed iaculis in ante nec condimentum. Mauris ultricies, justo a auctor facilisis, ipsum enim tincidunt felis, non vulputate diam enim ac nulla.

// Donec et facilisis lorem. Vestibulum vehicula ornare aliquet. Nunc in ipsum at ante vulputate feugiat id ut leo. Ut ultricies placerat magna ac posuere. Sed tortor lectus, eleifend non neque pulvinar, sollicitudin maximus justo. Ut finibus condimentum malesuada. Etiam tortor dui, feugiat id imperdiet et, accumsan eu est. Nunc consectetur metus dolor, at pretium turpis vehicula sit amet. Aliquam efficitur fermentum pharetra. Cras venenatis vulputate sapien id sagittis. Maecenas ornare justo ut massa vulputate rutrum. Nam lobortis ipsum vitae eros euismod sagittis. Sed iaculis in ante nec condimentum. Mauris ultricies, justo a auctor facilisis, ipsum enim tincidunt felis, non vulputate diam enim ac nulla.`,
//         attachment: [
//             {
//                 name: 'KEPRES XX-XX-XX.pdf',
//                 type: 'pdf',
//                 link: 'downlink',
//             },
//         ],
//         opened: false,
//     },
//     {
//         title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
//         date: moment('2020-10-01').format('DD MMMM, YYYY').toString(),
//         content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut malesuada molestie eros, et maximus arcu imperdiet et. Nunc semper ex sed tellus placerat, id cursus velit tincidunt. Morbi nec velit in nisl elementum laoreet. Nullam quis risus egestas, pharetra ligula eu, laoreet quam. Sed dapibus porttitor erat, vel pretium nulla convallis ac. Vestibulum tellus nibh, pellentesque vitae est ac, mattis porta augue. Donec elementum augue ex, a sodales arcu porta quis. Fusce vel rutrum turpis. Maecenas elementum libero metus, sit amet feugiat ligula pharetra vitae. Curabitur id libero sit amet justo pretium molestie ac id metus. Sed facilisis metus viverra leo faucibus auctor. Aenean vitae cursus eros.

// Donec et facilisis lorem. Vestibulum vehicula ornare aliquet. Nunc in ipsum at ante vulputate feugiat id ut leo. Ut ultricies placerat magna ac posuere. Sed tortor lectus, eleifend non neque pulvinar, sollicitudin maximus justo. Ut finibus condimentum malesuada. Etiam tortor dui, feugiat id imperdiet et, accumsan eu est. Nunc consectetur metus dolor, at pretium turpis vehicula sit amet. Aliquam efficitur fermentum pharetra. Cras venenatis vulputate sapien id sagittis. Maecenas ornare justo ut massa vulputate rutrum. Nam lobortis ipsum vitae eros euismod sagittis. Sed iaculis in ante nec condimentum. Mauris ultricies, justo a auctor facilisis, ipsum enim tincidunt felis, non vulputate diam enim ac nulla.

// Donec et facilisis lorem. Vestibulum vehicula ornare aliquet. Nunc in ipsum at ante vulputate feugiat id ut leo. Ut ultricies placerat magna ac posuere. Sed tortor lectus, eleifend non neque pulvinar, sollicitudin maximus justo. Ut finibus condimentum malesuada. Etiam tortor dui, feugiat id imperdiet et, accumsan eu est. Nunc consectetur metus dolor, at pretium turpis vehicula sit amet. Aliquam efficitur fermentum pharetra. Cras venenatis vulputate sapien id sagittis. Maecenas ornare justo ut massa vulputate rutrum. Nam lobortis ipsum vitae eros euismod sagittis. Sed iaculis in ante nec condimentum. Mauris ultricies, justo a auctor facilisis, ipsum enim tincidunt felis, non vulputate diam enim ac nulla.

// Donec et facilisis lorem. Vestibulum vehicula ornare aliquet. Nunc in ipsum at ante vulputate feugiat id ut leo. Ut ultricies placerat magna ac posuere. Sed tortor lectus, eleifend non neque pulvinar, sollicitudin maximus justo. Ut finibus condimentum malesuada. Etiam tortor dui, feugiat id imperdiet et, accumsan eu est. Nunc consectetur metus dolor, at pretium turpis vehicula sit amet. Aliquam efficitur fermentum pharetra. Cras venenatis vulputate sapien id sagittis. Maecenas ornare justo ut massa vulputate rutrum. Nam lobortis ipsum vitae eros euismod sagittis. Sed iaculis in ante nec condimentum. Mauris ultricies, justo a auctor facilisis, ipsum enim tincidunt felis, non vulputate diam enim ac nulla.`,
//         attachment: null,
//         opened: false,
//     },
// ];

// type AttachmentPropsType = {
//     name: string;
//     type: string;
//     link: string;
// };

// const Attachment = (props: AttachmentPropsType) => {
//     let returnElement = null;

//     if (props.type === 'image') {
//         returnElement = (
//             <div className="d-flex flex-column justify-content-center align-items-center pointer" style={{ height: '100px', minWidth: '100px' }}>
//                 <div>img preview</div>
//                 <span className="small">{props.name}</span>
//             </div>
//         );
//     } else {
//         returnElement = (
//             <div className="d-flex flex-column justify-content-center align-items-center pointer" style={{ height: '100px', minWidth: '100px' }}>
//                 <i
//                     className={`fas fa-file-${props.type} mb-1 text-${
//                         props.type === 'excel' || props.type === 'csv'
//                             ? 'primary'
//                             : props.type === 'pdf'
//                             ? 'danger'
//                             : props.type === 'word'
//                             ? 'info'
//                             : props.type === 'powerpoint'
//                             ? 'warning'
//                             : 'default'
//                     }`}
//                     style={{ fontSize: 'xx-large' }}
//                 ></i>
//                 <span className="small">{props.name}</span>
//             </div>
//         );
//     }

//     return returnElement;
// };

// class CompanyInfo extends React.Component {
//     details: HTMLDivElement | null | undefined;

//     ExpandCompanyRowHandler(e: React.MouseEvent) {
//         const target = e.currentTarget as HTMLDivElement;
//         const parentTarget = target.parentElement as HTMLDivElement;
//         const targetNextSibling = target.nextElementSibling as HTMLDivElement;

//         parentTarget.classList.toggle('show');
//         if (targetNextSibling !== null) {
//             const expandedHeight = targetNextSibling.getAttribute('expanded-height');

//             if (parentTarget.classList.value.indexOf('show') > 0) {
//                 targetNextSibling.style.height = `${expandedHeight}px`;
//             } else {
//                 targetNextSibling.style.height = '0px';
//             }
//         }

//         /* other code to remove "New" */
//     }

//     HideShowedCompanyInfoHandler() {
//         const arrShowed = document.querySelectorAll('.companyinfo-row.show');

//         for (let i = 0; i < arrShowed.length; i++) {
//             const element = arrShowed[i];
//             (element as HTMLDivElement).classList.remove('show');
//         }

//         const arrDetails = document.querySelectorAll('.companyinfo-row .details');

//         for (let i = 0; i < arrDetails.length; i++) {
//             const element = arrDetails[i];
//             (element as HTMLDivElement).style.height = '0px';
//         }
//     }

//     componentDidMount() {
//         this.HideShowedCompanyInfoHandler();
//     }

//     render() {
//         return (
//             <Card className="shadow-sm companyinfo-container">
//                 <Card.Header>Announcement</Card.Header>
//                 <Card.Body style={{ height: '439px' }}>
//                     <Simplebar style={{ maxHeight: '375px' }}>
//                         {arrCompanyInfo.length ? (
//                             arrCompanyInfo.map((key, index) => {
//                                 return (
//                                     <div key={`${key.title}-${index}`} className="companyinfo-row show">
//                                         <div className="preview d-flex align-items-center pointer" onClick={(e: React.MouseEvent) => this.ExpandCompanyRowHandler(e)}>
//                                             <div className="flex-1">
//                                                 <h6 className="d-flex m-0 align-items-center">
//                                                     <span className="mr-1">{key.title}</span>
//                                                     {!key.opened && <Badge variant="danger">New</Badge>}
//                                                 </h6>
//                                                 <span className="small">{key.date}</span>
//                                             </div>
//                                             <div
//                                                 className="d-flex align-items-center justify-content-end"
//                                                 style={{
//                                                     width: 30,
//                                                     height: 30,
//                                                     padding: '.5rem',
//                                                     paddingRight: '0px',
//                                                 }}
//                                             >
//                                                 <i className="fas fa-chevron-left"></i>
//                                             </div>
//                                         </div>
//                                         <div
//                                             className="details"
//                                             ref={(ref) => {
//                                                 if (ref !== null) {
//                                                     ref.setAttribute('expanded-height', ref.offsetHeight.toString());
//                                                 }
//                                             }}
//                                         >
//                                             <p>{key.content}</p>
//                                             {key.attachment !== null && (
//                                                 <Row>
//                                                     {key.attachment.map((keyAttachment, indexAttachment) => {
//                                                         return <Attachment key={`${keyAttachment}-${indexAttachment}`} name={keyAttachment.name} type={keyAttachment.type} link={keyAttachment.link} />;
//                                                     })}
//                                                 </Row>
//                                             )}
//                                         </div>
//                                     </div>
//                                 );
//                             })
//                         ) : (
//                             <div className="position-relative d-flex align-items-center justify-content-center p-4">
//                                 <img src={CompanyInfoUpToDate} style={{ height: '400px' }} alt="Everything's catched up" />
//                                 <h5>Everything&apos;s catched up</h5>
//                             </div>
//                         )}
//                     </Simplebar>
//                 </Card.Body>
//             </Card>
//         );
//     }
// }

class HomeScreen extends React.Component {
    render() {
        return (
            <Page breadCrumb="Dashboard">
                <Row>
                    <Col xs={12} sm={6} md={3}>
                        <AttendanceRecordTime />
                    </Col>
                </Row>
                {/* <Row>
                    <Col sm={6} className="mb-4">
                        <CompanyInfo />
                    </Col>
                </Row> */}
            </Page>
        );
    }
}

export default HomeScreen;
