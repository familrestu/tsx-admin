import React from 'react';
import { Carousel } from 'react-bootstrap';

const announcementData = [
    {
        backgroundColor: null,
        backgroundImage: 'https://d3hctp6gkh4e3f.cloudfront.net/prod/qv7ix3j3zwfdu8gneyn9',
        fontColor: null,
        title: 'Batik day, 2 Oct 2021',
        caption: 'Please use Batik for Men, and Kebaya for Women',
        link: null,
    },
    {
        backgroundColor: null,
        backgroundImage: 'https://www.jobstreet.co.id/id/cms/employer/wp-content/uploads/sites/21/2020/09/artikel-pict.jpg',
        // fontColor: 'var(--primary)',
        title: 'Work From Home Schedule 27 Sept - 1 Oct',
        caption: 'Click to read more',
        link: null,
    },
];

/*  */

const Announcement = () => {
    return (
        <div className="col-12 col-sm-8 col-md-8 col-lg-8 col-xl-8 col-auto" style={{ height: '100%' }}>
            <Carousel className="carousel-hr-info" controls={announcementData.length > 1 ? true : false}>
                {announcementData.map((a, index) => {
                    return (
                        <Carousel.Item key={`announcement-${index}`} style={{ backgroundColor: 'var(--primary)' || a.backgroundColor, backgroundImage: `url(${a.backgroundImage})` }}>
                            <Carousel.Caption>
                                <h3 style={{ color: a.fontColor || 'white' }}>{a.title}</h3>
                                <p style={{ color: a.fontColor || 'white' }}>{a.caption}</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                    );
                })}
            </Carousel>
        </div>
    );
};

export default Announcement;
