import React, { Component } from 'react';
import { connect } from 'react-redux';
import { InputGroup, Button } from 'react-bootstrap';
import Navlink from 'components/Navlink';
import Avatar from 'components/Avatar';
import { AppState } from 'redux/store';
import Notification from 'components/Notification';
import { MenuAuthStateType } from 'redux/reducers/MenuAuthState';
import { get } from 'libs/fetch';

const GetCurrentTheme = () => {
    const localStorageTheme = localStorage.getItem('themes');
    return localStorageTheme === null ? 'light' : localStorageTheme;
};

const changeTheme = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    if (target.checked) {
        document.body.setAttribute('themes', target.value);
        localStorage.setItem('themes', target.value);
    } else {
        document.body.setAttribute('themes', 'light');
        localStorage.setItem('themes', 'light');
    }
};

export const ThemeMode = () => {
    return (
        <div className="toggle-theme-container">
            <input
                type="checkbox"
                id="toggle-theme"
                className="toggle-theme"
                value="dark"
                defaultChecked={GetCurrentTheme() === 'dark'}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => changeTheme(e)}
            />
            <label htmlFor="toggle-theme" className="toggle-theme">
                <i className="fas fa-moon"></i>
                <i className="fas fa-sun"></i>
                <i className="ball"></i>
            </label>
        </div>
    );
};

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

type SearchDetails = {
    link: string;
    navlink?: string;
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

type PropsHeaderSearch = MapStateToPropsType;

class HeaderSearchConnect extends Component<PropsHeaderSearch, HandleSearchStateType> {
    state = {
        showSearch: false,
        loadSearch: true,
        arrSearch: [],
        showedArrSearch: [],
        selectedList: -1,
    };

    keyupTimeout: number | undefined;

    FocusHandler(e?: React.FocusEvent<HTMLInputElement>) {
        if (e !== undefined) {
            const target = e.currentTarget;
            const parentElement = target.parentElement;
            if (parentElement) {
                parentElement.classList.add('focussearch');
            }
        }

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

    BlurHandler(e?: React.FocusEvent<HTMLInputElement>) {
        const dropdownMenuSearchContainer = document.getElementById('header-search-container');
        if (dropdownMenuSearchContainer && !dropdownMenuSearchContainer.getAttribute('keep-focus')) {
            this.CloseSearch();
        }

        if (e !== undefined) {
            const target = e.currentTarget;
            const parentElement = target.parentElement;
            if (parentElement) {
                parentElement.classList.remove('focussearch');
            }
        }
    }

    KeyUpHandler(e: React.KeyboardEvent<HTMLInputElement>) {
        const selectedDropdown = document.querySelector('.header-search-item.focus[is-selected=yes]');
        let listNum = 0;

        if (e.key === 'ArrowUp') {
            if (this.state.selectedList >= 0 && this.state.selectedList <= this.state.showedArrSearch.length - 1) {
                listNum = this.state.selectedList - 1 < 0 ? this.state.showedArrSearch.length - 1 : this.state.selectedList - 1;
            } else if (this.state.selectedList === -1) {
                listNum = this.state.showedArrSearch.length - 1;
            }

            if (selectedDropdown && selectedDropdown.previousElementSibling && selectedDropdown.previousElementSibling.scrollHeight) {
                this.SetHeaderSearchInput(selectedDropdown.previousElementSibling.children[1].innerHTML);
            }

            this.setState((prevState) => {
                return { ...prevState, selectedList: listNum };
            });
        } else if (e.key === 'ArrowDown') {
            if (this.state.selectedList >= 0 && this.state.selectedList <= this.state.showedArrSearch.length - 1) {
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
            if (value.length >= 1) {
                if (!this.state.loadSearch) {
                    this.setState((prevState) => {
                        return { ...prevState, loadSearch: true };
                    });
                }
                window.clearTimeout(this.keyupTimeout);
                this.keyupTimeout = window.setTimeout(() => {
                    const tempArrSearch: HandleSearchStateType['arrSearch'] = this.state.arrSearch;
                    const regex = new RegExp(`${value.replace(/[^\w\s]/gi, '').toUpperCase()}.*`);
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
                this.FocusHandler();
            }
        }
    }

    SetHeaderSearchInput(title?: string) {
        const headerSearchInput = document.getElementById('header-search-input');
        if (headerSearchInput && (title || title === '')) {
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

    DropdownMouseEnterHandler(selectedList: number) {
        // this.SetHeaderSearchInput(title);
        this.setState((prevState) => {
            return { ...prevState, selectedList: selectedList };
        });
    }

    DropdownMouseLeaveHandler() {
        // this.SetHeaderSearchInput('');
        this.setState((prevState) => {
            return { ...prevState, selectedList: -1 };
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
                        onFocus={(e: React.FocusEvent<HTMLInputElement>) => this.FocusHandler(e)}
                        onBlur={(e: React.FocusEvent<HTMLInputElement>) => this.BlurHandler(e)}
                        onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => this.KeyUpHandler(e)}
                    />
                    <div
                        className="form-icon"
                        onClick={() => {
                            const searchInput = document.getElementById('header-search-input');
                            if (searchInput) {
                                searchInput.focus();
                            }
                        }}
                    >
                        <i className="fas fa-search" />
                    </div>
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
                                        <Navlink
                                            key={index}
                                            to={item.link}
                                            navlink={item.navlink}
                                            className={`dropdown-item header-search-item ${this.state.selectedList === index ? 'focus' : ''}`.trim()}
                                            is-selected={`${this.state.selectedList === index ? 'yes' : 'no'}`}
                                            index-number={index}
                                            role="button"
                                            onClick={() => this.CloseSearch(item.title)}
                                            title={item.type.substr(0, 1).toUpperCase() + item.type.substr(1, item.type.length - 1)}
                                            onMouseEnter={() => this.DropdownMouseEnterHandler(index)}
                                            onMouseLeave={() => this.DropdownMouseLeaveHandler()}
                                        >
                                            {icon !== '' && <i className={icon}></i>}
                                            <span>{item.title}</span>
                                        </Navlink>
                                    );
                                })
                            ) : (
                                <div className="dropdown-item header-search-item">No record</div>
                            )}
                        </div>
                    )}
                </InputGroup>
            </React.Fragment>
        );
    }
}

type MapStateToPropsType = {
    UserState: AppState['UserState'];
    MenuAuthState: AppState['MenuAuthState'];
};

const MapStateToProps = (state: MapStateToPropsType) => ({
    UserState: state.UserState,
    MenuAuthState: state.MenuAuthState,
});

const HeaderSearch = connect(MapStateToProps)(HeaderSearchConnect);

type HeaderPropsType = {
    ToggleNavbarHandler: () => void;
    SignOutHandler: () => void;
    isMobile: boolean;
};

type PropsHeader = HeaderPropsType & MapStateToPropsType;

class Header extends Component<PropsHeader> {
    OpenDropDownHandler(e: Event, element: Element) {
        const target = e.currentTarget as HTMLDivElement;
        console.log(target);
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
        console.log(arrBtnDropDown);
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
        if (window.location.pathname === '/printpreview') return <React.Fragment />;

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
                        <ThemeMode />
                        <Notification isMobile={this.props.isMobile} />
                        <Avatar SignOutHandler={() => this.props.SignOutHandler()} />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default connect(MapStateToProps)(Header);
