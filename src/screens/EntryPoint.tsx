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

import { White, Primary, OpacityHex } from 'themes/styles';

import HomeScreen from 'screens/HomeScreen';

class Header extends React.Component {
    render() {
        return (
            <Flex
                id="header"
                className="header mb-4"
                height="4.375rem"
                alignItems="center"
                backgroundColor={White}
                zIndex={5}
                shadow
            >
                <Flex
                    flex={0.5}
                    height="100%"
                    justifyContent="flex-start"
                    alignItems="center"
                >
                    <InputGroup>
                        <FormControl
                            placeholder="Search..."
                            style={{
                                backgroundColor: `${Primary}${OpacityHex[1]}`,
                                borderColor: `${Primary}${OpacityHex[1]}`,
                            }}
                        />
                        <InputGroup.Append>
                            <Button
                                style={{
                                    backgroundColor: `${Primary}`,
                                    borderColor: `${Primary}`,
                                }}
                            >
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
                </Switch>
            </View>
        );
    }
}

class EntryPoint extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Flex flex={1} flexDirection="column">
                    <Flex flex={1} flexDirection="row">
                        <NavbarLeft />
                        <Flex flex={1} flexDirection="column">
                            <Header />
                            <Body />
                        </Flex>
                    </Flex>
                </Flex>
            </BrowserRouter>
        );
    }
}

export default EntryPoint;
