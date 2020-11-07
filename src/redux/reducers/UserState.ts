import { LOGIN, UserActions } from '../actions/UserAction';

export type UserStateType = {
    loggedIn: boolean;
    username: string;
    email: string;
    full_name: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    gender: number;
    identification_no: string;
    taxfile_no: string;
    birth_date: string;
    birth_place: string;
    phone: string;
    mobile_phone: string;
    address: string;
    company_name: string;
    department_name: string;
    position_name: string;
    profile_picture: string | null;
    jwt?: string;
};

const DefaultState: UserStateType = {
    loggedIn: false,
    username: 'famil.restu',
    email: 'famil.restu@gmail.com',
    full_name: 'Famil Restu Pambudi',
    first_name: 'Famil',
    middle_name: 'Restu',
    last_name: 'Pambudi',
    gender: 0,
    identification_no: '3176070906920005',
    taxfile_no: '763747912064000',
    birth_date: '1992-06-09',
    birth_place: 'Jakarta',
    phone: '+6221 22736521',
    mobile_phone: '+6221 81291202975',
    address: `Jl. Rempoa Raya Gang Mangga No.22, 
Rempoa, Ciputat Timur, 
Tangerang Selatan, Banten. 
15412`,
    company_name: 'PT. Indodev Niaga Internet',
    department_name: 'Implementation AT',
    position_name: 'Sr Implmentation Consultant - AT',
    profile_picture: 'https://lh3.googleusercontent.com/ogw/ADGmqu8Xth9CuZj0MrKx-cdFhmJXKFCCr9eEwgIy4qci1A=s83-c-mo',
};

const UserState = (state: UserStateType = DefaultState, action: UserActions) => {
    switch (action.type) {
        case LOGIN:
            return { ...state };
        default:
            return state;
    }
};

export default UserState;
