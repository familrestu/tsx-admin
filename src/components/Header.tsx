import React, { Component } from 'react';
import { InputGroup, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

import Avatar from 'components/Avatar';
import { DividerVertical } from 'components/Divider';

import { connect } from 'react-redux';
import { AppState } from 'redux/store';

import Notification from 'components/Notification';
import SimpleBar from 'simplebar-react';
import { MenuAuthStateType } from 'redux/reducers/MenuAuthState';

import { get } from 'libs/fetch';

const GetMenu = (menuAuthDetail: MenuAuthStateType) => {
    let arrMenuReturn: HandleSearchStateType['arrSearch'] = [];

    if (menuAuthDetail.length > 1) {
        for (let x = 0; x < menuAuthDetail.length; x++) {
            const element = menuAuthDetail[x];

            if (element.children) {
                /* when have children, call RouterChildren function */
                const tempArray = GetMenu(element.children);
                arrMenuReturn = [...arrMenuReturn, ...tempArray];
            } else {
                /* if not have children, push to ArrayRouter */
                if (element.link.indexOf(':') < 0) {
                    arrMenuReturn.push({
                        link: element.link,
                        title: element.name,
                        type: 'menu',
                    });
                }
            }
        }
    }

    return arrMenuReturn;
};

const MapStateToProps = (state: AppState) => ({
    UserState: state.UserState,
    MenuAuthState: state.MenuAuthState,
});

type SearchDetails = {
    link: string;
    title: string;
    type: string;
    params?: { [key: string]: string };
};

type HandleSearchStateType = {
    showSearch: boolean;
    loadSearch: boolean;
    arrSearch: SearchDetails[];
    showedArrSearch: SearchDetails[];
    selectedList: number;
};

class HeaderSearchConnect extends Component<AppState, HandleSearchStateType> {
    state = {
        showSearch: false,
        loadSearch: true,
        arrSearch: [],
        showedArrSearch: [],
        selectedList: -1,
    };

    keyupTimeout: number | undefined;

    FocusHandler() {
        this.setState((prevState) => {
            return { ...prevState, showSearch: true };
        });
        let tempArr: HandleSearchStateType['arrSearch'] = [];
        let arrMenu: HandleSearchStateType['arrSearch'] = [];

        if (this.props.MenuAuthState) {
            arrMenu = GetMenu(this.props.MenuAuthState);

            get('system/application/GetSearch', { withCredentials: true }, (res) => {
                tempArr = [...arrMenu, ...res.data.data];

                tempArr.sort((a, b) => {
                    return a.title < b.title ? -1 : 1;
                });

                const finalArrSearch = tempArr;
                finalArrSearch.length = 7;

                this.setState((prevState) => {
                    return {
                        ...prevState,
                        showSearch: true,
                        loadSearch: false,
                        arrSearch: [...arrMenu, ...res.data.data].sort((a, b) => {
                            return a.title < b.title ? -1 : 1;
                        }),
                        showedArrSearch: finalArrSearch,
                    };
                });
            });
        }
    }

    BlurHandler() {
        const dropdownMenuSearchContainer = document.getElementById('header-search-container');
        if (dropdownMenuSearchContainer && !dropdownMenuSearchContainer.getAttribute('keep-focus')) {
            this.CloseSearch();
        }
    }

    KeyUpHandler(e: React.KeyboardEvent<HTMLInputElement>) {
        // const headerContainer = document.querySelector('#header-search-container .simplebar-content-wrapper');
        const selectedDropdown = document.querySelector('.header-search-item.focus[is-selected=yes]');
        let listNum = 0;

        if (e.key === 'ArrowUp') {
            if (this.state.selectedList >= 0 && this.state.selectedList <= this.state.arrSearch.length - 1) {
                listNum = this.state.selectedList - 1 < 0 ? this.state.arrSearch.length - 1 : this.state.selectedList - 1;
            } else if (this.state.selectedList === -1) {
                listNum = this.state.arrSearch.length - 1;
            }

            if (selectedDropdown && selectedDropdown.previousElementSibling && selectedDropdown.previousElementSibling.scrollHeight /*  && headerContainer */) {
                // headerContainer.scrollTo(0, selectedDropdown.previousElementSibling.scrollHeight * listNum);
                this.SetHeaderSearchInput(selectedDropdown.previousElementSibling.children[1].innerHTML);
            }

            this.setState((prevState) => {
                return { ...prevState, selectedList: listNum };
            });
        } else if (e.key === 'ArrowDown') {
            if (this.state.selectedList >= 0 && this.state.selectedList <= this.state.arrSearch.length - 1) {
                listNum = this.state.selectedList + 1 > this.state.showedArrSearch.length - 1 ? 0 : this.state.selectedList + 1;
            } else if (this.state.selectedList === -1) {
                listNum = 0;
            }

            if (selectedDropdown && selectedDropdown.nextElementSibling && selectedDropdown.nextElementSibling.scrollHeight /*  && headerContainer */) {
                // headerContainer.scrollTo(0, selectedDropdown.nextElementSibling.scrollHeight * listNum);
                this.SetHeaderSearchInput(selectedDropdown.nextElementSibling.children[1].innerHTML);
            }

            this.setState((prevState) => {
                return { ...prevState, selectedList: listNum };
            });
        } else if (e.key === 'Enter') {
            if (selectedDropdown) {
                (selectedDropdown as HTMLAnchorElement).click();
                e.currentTarget.blur();
            }
        } else {
            const { value } = e.currentTarget;
            if (value.length >= 3) {
                if (!this.state.loadSearch) {
                    this.setState((prevState) => {
                        return { ...prevState, loadSearch: true };
                    });
                }
                window.clearTimeout(this.keyupTimeout);
                this.keyupTimeout = window.setTimeout(() => {
                    const tempArrSearch: HandleSearchStateType['arrSearch'] = this.state.arrSearch;
                    const regex = new RegExp(`${value.toUpperCase()}.*`);
                    const finalArrSearch: HandleSearchStateType['arrSearch'] = tempArrSearch.filter((a) => {
                        return regex.test(a.title.toUpperCase());
                    });

                    window.clearTimeout(this.keyupTimeout);
                    this.setState((prevState) => {
                        return { ...prevState, showSearch: true, loadSearch: false, showedArrSearch: finalArrSearch };
                    });
                }, 400);
            } else if (value === '') {
                window.clearTimeout(this.keyupTimeout);
                this.setState((prevState) => {
                    return { ...prevState, showSearch: true, loadSearch: false, showedArrSearch: this.state.arrSearch };
                });
            }
        }
    }

    SetHeaderSearchInput(title?: string) {
        const headerSearchInput = document.getElementById('header-search-input');
        if (headerSearchInput && title) {
            (headerSearchInput as HTMLInputElement).value = title;
        }
    }

    CloseSearch(title?: string) {
        this.SetHeaderSearchInput(title);
        this.setState({
            showSearch: false,
            loadSearch: true,
            arrSearch: [],
            showedArrSearch: [],
            selectedList: 0,
        });
    }

    DropdownMouseEnterHandler(selectedList: number, title: string) {
        this.SetHeaderSearchInput(title);
        this.setState((prevState) => {
            return { ...prevState, selectedList: selectedList };
        });
    }

    render() {
        return (
            <React.Fragment>
                <InputGroup>
                    <input
                        type="text"
                        id="header-search-input"
                        className="form-control"
                        placeholder="Search..."
                        onFocus={() => this.FocusHandler()}
                        onBlur={() => this.BlurHandler()}
                        onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => this.KeyUpHandler(e)}
                    />
                    <InputGroup.Append>
                        <Button>
                            <i className="fas fa-search" />
                        </Button>
                    </InputGroup.Append>
                    {this.state.showSearch && (
                        <div
                            id="header-search-container"
                            className="dropdown-menu"
                            style={{ display: 'block' }}
                            onMouseEnter={(e: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
                                e.currentTarget.setAttribute('keep-focus', 'true');
                            }}
                            onMouseLeave={(e: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
                                e.currentTarget.removeAttribute('keep-focus');
                            }}
                        >
                            <SimpleBar className="simplebar-search">
                                {this.state.loadSearch && this.state.arrSearch ? (
                                    <div className="dropdown-item">
                                        <span>Loading...</span>
                                    </div>
                                ) : this.state.showedArrSearch.length > 0 ? (
                                    this.state.showedArrSearch.map((item: SearchDetails, index) => {
                                        let icon = '';
                                        if (item.type === 'menu') {
                                            icon = 'far fa-file-alt';
                                        } else if (item.type === 'employee') {
                                            icon = 'far fa-user';
                                        }

                                        return (
                                            <NavLink
                                                key={index}
                                                to={item.link}
                                                className={`dropdown-item header-search-item ${this.state.selectedList === index ? 'focus' : ''}`.trim()}
                                                is-selected={`${this.state.selectedList === index ? 'yes' : 'no'}`}
                                                index-number={index}
                                                role="button"
                                                onClick={() => this.CloseSearch(item.title)}
                                                title={item.type.substr(0, 1).toUpperCase() + item.type.substr(1, item.type.length - 1)}
                                                onMouseEnter={() => this.DropdownMouseEnterHandler(index, item.title)}
                                            >
                                                {icon !== '' && <i className={icon}></i>}
                                                <span>{item.title}</span>
                                            </NavLink>
                                        );
                                    })
                                ) : (
                                    <div className="dropdown-item header-search-item">No record</div>
                                )}
                            </SimpleBar>
                        </div>
                    )}
                </InputGroup>
            </React.Fragment>
        );
    }
}

const HeaderSearch = connect(MapStateToProps)(HeaderSearchConnect);

type HeaderPropsType = {
    ToggleNavbarHandler: () => void;
    SignOutHandler: () => void;
    isMobile: boolean;
};

class Header extends Component<HeaderPropsType & AppState> {
    OpenDropDownHandler(e: Event, element: Element) {
        const target = e.target as HTMLDivElement;
        if (target.classList.value.indexOf('btn-open-dropdown') > 0) {
            (element.lastChild as HTMLDivElement).classList.toggle('show');
            (element as HTMLDivElement).focus();
        }
    }

    DropDownOnBlurHandler(element: Element) {
        const keepFocus = element.getAttribute('keep-focus');

        if (keepFocus === null) {
            (element.lastChild as HTMLDivElement).classList.remove('show');
        }
    }

    /* adding btn dropdown listener for header, so any existing btn-open-dropdown will show it's hidden last chidlren */
    AddOpenDrowndownListener() {
        const arrBtnDropDown = document.querySelectorAll('.header-container .btn-open-dropdown');

        if (arrBtnDropDown !== null) {
            for (let i = 0; i < arrBtnDropDown.length; i++) {
                const element = arrBtnDropDown[i];
                element.addEventListener('click', (e: Event) => this.OpenDropDownHandler(e, element));
                element.addEventListener('blur', () => this.DropDownOnBlurHandler(element));
            }
        }
    }

    componentDidMount() {
        this.AddOpenDrowndownListener();
    }

    render() {
        const { UserState } = this.props;
        const AvatarProps = {
            name: UserState !== undefined ? UserState.full_name : '',
            position: UserState !== undefined ? UserState.position_name : '',
            image: UserState !== undefined ? UserState.profile_picture : '',
            company: UserState !== undefined ? UserState.company_name : '',
        };

        return (
            <React.Fragment>
                <div id="header-container" className="header-container shadow-sm">
                    <div className="header-left">
                        <Button className="mr-4" onClick={this.props.ToggleNavbarHandler}>
                            <i className="fas fa-bars" />
                        </Button>
                        <HeaderSearch />
                    </div>
                    <div className="header-right">
                        <Notification isMobile={this.props.isMobile} />
                        <DividerVertical marginLeft marginRight />
                        <Avatar {...AvatarProps} DropDownOnBlurHandler={this.DropDownOnBlurHandler} SignOutHandler={() => this.props.SignOutHandler()} />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default connect(MapStateToProps)(Header);
