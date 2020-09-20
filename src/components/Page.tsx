import React from 'react';

import View from 'components/View';
import Flex from 'components/Flex';
import Text from 'components/Text';
import Icon from 'components/Icon';

type PageProps = {
    breadCrumb?: string;
    children?: React.ReactChild[] | React.ReactChild | Element | Element[];
};

class Page extends React.Component<PageProps> {
    PrintBreadCrumb() {
        const element = [];

        if (this.props.breadCrumb !== undefined) {
            if (
                this.props.breadCrumb !== '' &&
                this.props.breadCrumb.length > 2
            ) {
                const arrBC = this.props.breadCrumb.split('|');

                for (let i = 0; i < arrBC.length; i++) {
                    const string = arrBC[i];
                    element.push(
                        <Text
                            key={`bc-text-${i}`}
                            lineHeight="1"
                            className="m-1"
                        >
                            {string}
                        </Text>,
                    );

                    if (i !== arrBC.length - 1) {
                        element.push(
                            <Icon
                                key={`bc-divider-${i}`}
                                name="fas fa-chevron-right pt-1 ml-1"
                                fontSize="1rem"
                            ></Icon>,
                        );
                    }
                }
            }
        }

        return (
            <Flex
                id="Bread Crumb"
                className="mb-4"
                fontSize="1.5rem"
                alignItems="center"
            >
                {element}
            </Flex>
        );
    }

    render() {
        return (
            <React.Fragment>
                {this.PrintBreadCrumb()}
                <View flex={1}>{this.props.children}</View>
            </React.Fragment>
        );
    }
}

export default Page;
