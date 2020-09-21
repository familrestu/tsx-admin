import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { InputGroup, FormControl, Button } from 'react-bootstrap';

import Flex from 'components/Flex';
import View from 'components/View';
import Absolute from 'components/Absolute';
import Avatar from 'components/Avatar';
import Icon from 'components/Icon';
import { DividerVertical } from 'components/Divider';
import { NavbarLeft } from 'components/Navbar';

import HomeScreen from 'screens/HomeScreen';

type HeaderProps = {
    ToggleNavbar: () => void;
};

class Header extends React.Component<HeaderProps> {
    render() {
        return (
            <Flex
                id="header"
                className="header mb-4"
                height="4.375rem"
                alignItems="center"
                zIndex={5}
                shadow
            >
                <Flex
                    flex={0.7}
                    height="100%"
                    justifyContent="flex-start"
                    alignItems="center"
                >
                    <Button className="mr-4" onClick={this.props.ToggleNavbar}>
                        <Icon name="fas fa-bars" />
                    </Button>
                    <InputGroup>
                        <FormControl placeholder="Search..." />
                        <InputGroup.Append>
                            <Button>
                                <Icon name="fas fa-search" />
                            </Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Flex>
                <Flex
                    flex={1}
                    height="100%"
                    justifyContent="flex-end"
                    alignItems="center"
                >
                    <View className="icon-groups mx-4">
                        <Absolute className="badge badge-danger badge-counter">
                            99+
                        </Absolute>
                        <Icon name="fas fa-envelope" />
                    </View>

                    <View className="icon-groups mx-4">
                        <Absolute className="badge badge-danger badge-counter">
                            99+
                        </Absolute>
                        <Icon name="fas fa-bell" />
                    </View>
                    <DividerVertical marginLeft marginRight />
                    <Avatar
                        name="Famil Restu Pambudi"
                        image="https://lh3.googleusercontent.com/ogw/ADGmqu8MsxxaLIBWUh90CoQRUHGJEpDp7NGxS9r1zu2C=s83-c-mo"
                    />
                </Flex>
            </Flex>
        );
    }
}

const AbsoluteScreen = () => {
    return <View>Absolute</View>;
};

class Body extends React.Component {
    render() {
        return (
            <View
                id="body-container"
                className="body-container"
                height="100%"
                zIndex={4}
            >
                <Switch>
                    <Route exact path="/" component={HomeScreen} />
                    <Route
                        path="/components/absolute"
                        component={AbsoluteScreen}
                    />
                </Switch>
            </View>
        );
    }
}

type EntryPointState = {
    NavbarOpened: boolean;
};

// eslint-disable-next-line @typescript-eslint/ban-types
class EntryPoint extends React.Component<{}, EntryPointState> {
    state = {
        NavbarOpened: false,
    };

    ToggleNavbar() {
        this.setState((prevState) => {
            return { NavbarOpened: !prevState.NavbarOpened };
        });
    }

    render() {
        return (
            <BrowserRouter>
                <Flex flex={1} flexDirection="column">
                    <Flex flex={1} flexDirection="row">
                        <NavbarLeft NavbarOpened={this.state.NavbarOpened} />
                        <Flex flex={1} flexDirection="column" zIndex={5}>
                            <Header ToggleNavbar={() => this.ToggleNavbar()} />
                            <Body />
                        </Flex>
                    </Flex>
                </Flex>
            </BrowserRouter>
        );
    }
}

export default EntryPoint;
